import { useState, useRef, useEffect } from 'react'
import './CropImage.scss'
import type { TDesignItem } from '@fulhaus/react.ui.design-canvas';
import ReactCrop from "react-image-crop";
import type { Crop } from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";
import { Button } from '@fulhaus/react.ui.button'
import { APP_API_URL } from '../../../../Constant/url.constant';
import { Loader } from '@fulhaus/react.ui.loader';
import apiRequest from '../../../../Service/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { getQuoteDetailAndUpdateSelectedUnit } from '../../../../redux/Actions'
import { Tappstate } from '../../../../redux/reducers'
import { v4 as uuidv4 } from 'uuid';
type TCropImage = {
    cropImageID: string | undefined
    cropImageDesignItems: TDesignItem[]
    onClose: () => void
    updatePopulatedDesignItemsRemote: (designItems: any) => Promise<void>
}
function getCroppedImg(image: HTMLImageElement, crop: any, fileName: any) {
    //image is HTMLImage element from react ref, we create a new canvas(image) to reproduce cropped image, then convert it to base64
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx?.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
    );
    const base64Canvas = canvas.toDataURL("image/png").split(';base64,')[1]
    return base64Canvas;

    // return new Promise((resolve, reject) => {
    //     canvas.toBlob((blob: any) => {
    //         if (!blob) {
    //             //reject(new Error('Canvas is empty'));
    //             console.error('Canvas is empty');
    //             return;
    //         }
    //         blob.name = fileName;
    //         blob.lastModifiedDate = new Date();
    //         // let fileUrl = URL.createObjectURL(blob);
    //         resolve(blob);
    //     }, 'image/jpeg');
    // });
}

const CropImage = ({ cropImageID, cropImageDesignItems, onClose, updatePopulatedDesignItemsRemote }: TCropImage) => {
    const [crop, setCrop] = useState<Crop>()
    const [copyedImageBolbURL, setcopyedImageBolbURL] = useState<undefined | any>()
    const [cropping, setcropping] = useState(false);
    const imgRef = useRef(null);
    const dispatch = useDispatch();
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const currentOrgID = useSelector((state: Tappstate) => state?.currentOrgID);
    const quoteID = useSelector((state: Tappstate) => state.quoteDetail)?._id;
    const projectID = useSelector((state: Tappstate) => state.selectedProject)?._id;
    const cropImageURL = cropImageDesignItems.filter(each => each.id === cropImageID)?.[0]?.value;

    useEffect(() => {
        getCopyImage()
    }, [cropImageURL])

    const cropImage = async () => {
        if (!cropping) {
            setcropping(true);
            const base64Canvas = getCroppedImg(imgRef.current as any, crop, 'cropped-image.jpeg');
            const uniqueUUID = uuidv4()
            const res = await apiRequest({
                url: `/upload-file/upload-file-to-s3`,
                method: 'POST',
                body: {
                    fileName: `${cropImageID}--copy--${uniqueUUID}`,
                    bucketName: `moodboard-cropped-images`,
                    base64: base64Canvas
                }
            })
            if (res?.success) {
                let newDesignItems = [...cropImageDesignItems]
                newDesignItems.filter(each => each.id === cropImageID)[0].value = res.imageURL;
                //once the image is croped, we no longer allow this image to remove its background
                newDesignItems.filter(each => each.id === cropImageID)[0].productID = undefined;
                await updatePopulatedDesignItemsRemote(newDesignItems);
                dispatch(getQuoteDetailAndUpdateSelectedUnit({
                    organizationID: currentOrgID ? currentOrgID : '',
                    projectID,
                    quoteID: quoteID,
                    selectedQuoteUnitID: selectedQuoteUnit?.unitID
                }))
                onClose();
            } else {
                dispatch({
                    type: 'modalMessage',
                    payload: res?.message
                })
                dispatch({
                    type: 'showModal',
                    payload: true
                })
            }
            setcropping(false);
        }
    }

    const getCopyImage = async () => {
        const res = await fetch(`${APP_API_URL}/download-image?imageURL=${cropImageURL}`)
        if (res?.ok) {
            const resInBolb = await res.blob()
            const imageURL = URL.createObjectURL(resInBolb)
            setcopyedImageBolbURL(imageURL);
        }
    }

    return <div className='flex flex-col p-4 crop-image'>
        {copyedImageBolbURL ?
            <div className='mx-auto'>
                {cropping ?
                    <div className='flex items-center justify-center height-70vh'>
                        <div className='text-xl font-moret'>Cropping...</div>
                    </div> :
                    <ReactCrop
                        crop={crop}
                        onChange={(c => {
                            setCrop(c)
                        })}
                    >
                        <img ref={imgRef} className='height-70vh' alt='croped-img' src={copyedImageBolbURL} />
                    </ReactCrop>
                }
            </div>
            : <div className='flex items-center justify-center height-70vh'>
                <Loader />
            </div>}
        <div className='flex w-full'>
            <div className='w-1/2 my-auto text-sm font-semibold text-red font-ssp'>Warning: Once the image is cropped, you are not able to restore it or remove its background.</div>
            <Button variant='secondary' onClick={onClose} className='w-24 ml-auto mr-8'>Cancel</Button>
            <Button className='w-24' disabled={cropping} onClick={() => cropImage()}>Crop</Button>
        </div>
    </div>
}

export default CropImage