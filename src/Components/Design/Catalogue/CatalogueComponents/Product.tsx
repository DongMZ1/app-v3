import { AppV3FurnitureCard } from '@fulhaus/react.ui.product-card-app'
import './Product.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useRef, useMemo } from 'react'
import { Tappstate } from '../../../../redux/reducers'
type ProductProp = {
    eachProduct: any;
    draggableWidth?: number
    isExpand?: boolean;
}
const Product = ({ eachProduct, isExpand, draggableWidth }: ProductProp) => {
    const dispatch = useDispatch();
    const productRef = useRef(null);
    const dragGhost = (productRef.current as any)?.cloneNode(true);
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const openProductDetail = () => {
        dispatch({
            type: 'showselectedProductDetail',
            payload: true
        })
        dispatch({
            type: 'selectedProductDetail',
            payload: eachProduct
        })
    }
    return <div className={`${isExpand ? 'w-1/6' : 'w-1/3'} ${draggableWidth ? draggableWidth > 1100 ? 'w-1/5' : (draggableWidth > 900 ? 'w-1/4' : '') : ''} px-2`}>
        <div ref={productRef} draggable onDragStart={(e) => {
            dispatch({
                type: 'draggedProduct',
                payload: eachProduct
            });
            if(dragGhost){
            dragGhost?.classList?.add('scale-width-150px');
            // Place it into the DOM tree
            document.body.appendChild(dragGhost);
            // Set the new stylized "drag image" of the dragged element
            e.dataTransfer.setDragImage(dragGhost, 0, 0);
            }
        }} onDragEnd={(e) => {
            dispatch({
                type: 'draggedProduct',
                payload: undefined
            });
            dragGhost?.classList?.remove('scale-width-150px');
            dragGhost?.parentNode?.removeChild(dragGhost);
        }}>
            <AppV3FurnitureCard
                imageURLs={eachProduct?.imageURLs}
                inStock={eachProduct?.stockQty > 0}
                stocks={eachProduct?.stockQty}
                informationCallback={() => openProductDetail()}
                hoverTag='Currently Out Of Stock'
                lastChecked={eachProduct?.stockDate?.slice(0, 10)}
                addRoomOptions={
                    selectedQuoteUnit?.rooms?.map((eachRoom: any) => {
                        return {
                            name: eachRoom?.name,
                            id: eachRoom?.roomID
                        }
                    })
                }
            />
        </div>
        <div className='ml-1.5 text-xs font-ssp font-semibold'>${eachProduct?.retailPrice}</div>
        <div className='ml-1.5 text-xs font-ssp font-semibold'>{eachProduct?.dimension}</div>
    </div>
}

export default Product;