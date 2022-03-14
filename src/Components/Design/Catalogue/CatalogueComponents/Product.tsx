import { AppV3FurnitureCard } from '@fulhaus/react.ui.product-card-app'
import './Product.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import { Tappstate } from '../../../../redux/reducers'
import { ReactComponent as ExitIcon } from '../../../../styles/images/exit.svg'
type ProductProp = {
    eachProduct: any;
    draggableWidth?: number
    isExpand?: boolean;
}
const Product = ({ eachProduct, isExpand, draggableWidth }: ProductProp) => {
    const dispatch = useDispatch();
    const productRef = useRef(null);
    const dragGhost = (productRef.current as any)?.cloneNode(true);
    const [selectedRoom, setselectedRoom] = useState<any>(undefined);
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    useEffect(()=>{
        setselectedRoom(undefined);
    }, [selectedQuoteUnit])
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

    const addCatagory = async (eachCategory: any, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          e.currentTarget.innerHTML = e.currentTarget.innerHTML + ' (added!) '
          e.currentTarget.style.fontWeight = '700';
    }
    return <div className={`${isExpand ? 'w-1/6' : 'w-1/3'} ${draggableWidth ? draggableWidth > 1100 ? 'w-1/5' : (draggableWidth > 900 ? 'w-1/4' : '') : ''} px-4`}>
        <div ref={productRef} draggable onDragStart={(e) => {
            dispatch({
                type: 'draggedProduct',
                payload: eachProduct
            });
            if (dragGhost) {
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
            >
                <div>
                    {
                        selectedRoom ? <>
                            {
                                <div className='w-44'>
                                    <div className='flex px-4 py-2 text-sm font-semibold font-ssp'>
                                        <div className='my-auto'>
                                            {selectedRoom?.name}
                                        </div>
                                        <ExitIcon className='my-auto ml-auto cursor-pointer' onClick={() => setselectedRoom(undefined)} />
                                    </div>
                                    {
                                        selectedRoom?.categories?.map((eachCategory: any) => <div className='w-full px-4 py-2 text-xs cursor-pointer hover:bg-gray-200' onClick={(e) => addCatagory(eachCategory, e)}>
                                            {
                                                eachCategory?.name
                                            }
                                        </div>
                                        )
                                    }
                                </div>
                            }
                        </> : <>
                            {
                                selectedQuoteUnit? 
                                selectedQuoteUnit?.rooms?.map((eachRoom: any) => <div className='px-4 py-2 text-xs cursor-pointer hover:bg-gray-200 w-44' onClick={() => setselectedRoom(eachRoom)}>
                                    {
                                        eachRoom?.name
                                    }
                                </div>) : <div className='px-4 py-2 text-xs font-semibold w-36 font-ssp'>
                                      Please Select A Unit
                                </div>
                            }
                        </>
                    }
                </div>
            </AppV3FurnitureCard>
        </div>
        <div className='ml-1.5 text-xs font-ssp font-semibold'>${eachProduct?.retailPrice}</div>
        <div className='ml-1.5 text-xs font-ssp font-semibold'>{eachProduct?.dimension}</div>
    </div>
}

export default Product;