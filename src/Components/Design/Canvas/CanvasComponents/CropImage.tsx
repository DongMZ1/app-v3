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
type TCropImage = {
    cropImageID: string | undefined
    cropImageDesignItems: TDesignItem[]
    onClose: () => void
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
    const base64Canvas = canvas.toDataURL("image/jpeg").split(';base64,')[1]
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

const CropImage = ({ cropImageID, cropImageDesignItems, onClose }: TCropImage) => {
    const [crop, setCrop] = useState<Crop>()
    const [copyedImageBolbURL, setcopyedImageBolbURL] = useState<undefined | any>()
    const imgRef = useRef(null);
    const cropImageURL = cropImageDesignItems.filter(each => each.id === cropImageID)?.[0]?.value;
    const cropImage = async () => {
        const base64Canvas = getCroppedImg(imgRef.current as any, crop, 'cropped-image.jpeg');
        console.log(base64Canvas)
        const res = await apiRequest({
            url: `/upload-file/upload-file-to-s3`,
            method: 'POST',
            body: {
                fileName: `${cropImageID}--copy`,
                bucketName: `moodboard-cropped-images`,
                base64: base64Canvas
            }
        })
        if (res?.success) {

        }
    }

    useEffect(() => {
        getCopyImage()
    }, [cropImageURL])

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
                <ReactCrop
                    crop={crop}
                    onChange={(c => {
                        setCrop(c)
                    })}
                >
                    <img ref={imgRef} className='height-70vh' alt='croped-img' src={copyedImageBolbURL} />
                </ReactCrop>
            </div>
            : <div className='flex items-center justify-center height-70vh'>
                <Loader />
            </div>}
        <div className='flex w-full'>
            <div className='w-1/2 my-auto text-sm font-semibold text-red font-ssp'>Warning: Once the image is cropped, you are not able to restore it or remove its background.</div>
            <Button variant='secondary' onClick={onClose} className='w-24 ml-auto mr-8'>Cancel</Button>
            <Button className='w-24' onClick={() => cropImage()}>Crop</Button>
        </div>
    </div>
}

export default CropImage