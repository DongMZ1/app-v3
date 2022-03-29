import { useEffect, useState } from 'react'
import { Popup } from "@fulhaus/react.ui.popup"
import './SelectedProductDetail.scss'
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from 'react-icons/ai'
import { Tappstate } from "../../../../redux/reducers";

const SelectedProductDetail = () => {
    const dispatch = useDispatch();
    const selectedProductDetail = useSelector((state: Tappstate) => state.selectedProductDetail);
    const showselectedProductDetail = useSelector((state: Tappstate) => state.showselectedProductDetail);
    const [selectedImage, setselectedImage] = useState('')
    useEffect(() => {
        setselectedImage(selectedProductDetail?.imageURLs[0])
    }, [JSON.stringify(selectedProductDetail)])
    return <Popup show={showselectedProductDetail} horizontalAlignment='center' verticalAlignment="center" onClose={() => {
        dispatch({
            type: 'showselectedProductDetail',
            payload: false
        })
    }} >
        <div className="relative px-4 py-6 border border-black border-solid w-30rem bg-cream">
            <AiOutlineClose className="absolute top-0 right-0 mt-4 mr-4 cursor-pointer" onClick={() => {
                dispatch({
                    type: 'showselectedProductDetail',
                    payload: false
                })
            }} />
            <div className="flex py-2 text-xl font-moret"><div className="m-auto">{selectedProductDetail?.fulhausProductName}</div></div>
            <div className="flex text-sm font-semibold font-ssp">
                <div className="w-1/3 ">Trade Price : ${selectedProductDetail?.tradePrice}</div>
                <div className="w-1/4 ">Stock: {selectedProductDetail?.stockQty}</div>
                <div className="w-1/3 ">Last Updated: {selectedProductDetail?.stockDate?.slice(0, 10)}</div>
            </div>
            <div className="mt-1 text-sm font-ssp">Dimensions: {selectedProductDetail?.dimension} <b>{selectedProductDetail?.dimensionUnit}</b></div>
            <div className="mt-1 text-sm font-ssp">Material: {selectedProductDetail?.material}</div>
            <div className="mt-1 text-sm font-ssp">Colour: {selectedProductDetail?.colorName}</div>
            <div className="flex w-full mt-1 bg-white h-60">
                <img loading='lazy' alt='selected-product-detail-img' src={selectedImage} className='h-full m-auto' />
            </div>
            <div className='flex flex-wrap'>
                {selectedProductDetail?.imageURLs?.map((eachURL: string) => <div className='h-full py-1 pr-1'>
                    <img loading='lazy' onClick={() => setselectedImage(eachURL)} alt='small-img-selected-product-detail' src={eachURL} className='h-16 cursor-pointer' />
                </div>)}
            </div>
            <div className='text-sm font-ssp'>
                {selectedProductDetail?.description}
            </div>
        </div>
    </Popup>
}

export default SelectedProductDetail;