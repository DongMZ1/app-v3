import { useState, useRef } from 'react'
import './CropImage.scss'
import type { TDesignItem } from '@fulhaus/react.ui.design-canvas';
import ReactCrop from "react-image-crop";
import type { Crop } from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";
import { Button } from '@fulhaus/react.ui.button'
type TCropImage = {
    cropImageID: string | undefined
    cropImageDesignItems: TDesignItem[]
    onClose: () => void
}
const CropImage = ({ cropImageID, cropImageDesignItems, onClose }: TCropImage) => {
    const [crop, setCrop] = useState<Crop>()
    const [image, setimage] = useState<any>(null)
    const [croppedImageUrl, setCroppedImageUrl] = useState("");
    const getCroppedImg = async (crop: Crop) => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        console.log(scaleX)
        console.log(scaleY)
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");
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
        const base64Image = canvas.toDataURL("image/jpeg", 1)
        console.log(base64Image)

    };
    return <div className='p-4 crop-image'>
        <ReactCrop
            onComplete={(crop) => getCroppedImg(crop)}
            crop={crop}
            onChange={(c => setCrop(c))}
        >
            <img onLoad={(img) => setimage(img)} className='height-70vh' alt='croped-img' src={cropImageDesignItems.filter(each => each.id === cropImageID)?.[0]?.value} />
        </ReactCrop>
        <div className='flex w-full'>
            <div className='w-1/2 my-auto text-sm font-semibold text-red font-ssp'>Warning: Once the image is cropped, you are not able to restore it or remove its background.</div>
            <Button variant='secondary' onClick={onClose} className='w-24 ml-auto mr-8'>Cancel</Button>
            <Button className='w-24'>Crop</Button>
        </div>
    </div>
}

export default CropImage