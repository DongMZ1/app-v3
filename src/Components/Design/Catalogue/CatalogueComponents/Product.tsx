import { AppV3FurnitureCard } from '@fulhaus/react.ui.product-card-app'
import { useDispatch } from 'react-redux'
type ProductProp = {
    eachProduct: any;
}
const Product = ({ eachProduct }: ProductProp) => {
    const dispatch = useDispatch();
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
    return <div className='w-1/3 px-2'>
        <div draggable onDragStart={()=>{
            dispatch({
                type:'draggedProduct',
                payload:eachProduct
            });
        }} onDragEnd={() => {dispatch({
            type:'draggedProduct',
            payload:undefined
        })}}>
            <AppV3FurnitureCard
                imageURLs={eachProduct?.imageURLs}
                inStock={eachProduct?.stockQty > 0}
                stocks={eachProduct?.stockQty}
                informationCallback={() => openProductDetail()}
                hoverTag='Currently Out Of Stock'
                lastChecked={eachProduct?.stockDate?.slice(0, 10)}
            />
        </div>
        <div className='ml-1.5 text-xs font-ssp font-semibold'>${eachProduct?.retailPrice}</div>
        <div className='ml-1.5 text-xs font-ssp font-semibold'>{eachProduct?.dimension}</div>
    </div>
}

export default Product;