import { AppV3FurnitureCard } from '@fulhaus/react.ui.product-card-app'
import './Product.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import { Tappstate } from '../../../../redux/reducers'
import { ReactComponent as ExitIcon } from '../../../../styles/images/exit.svg'
import apiRequest from '../../../../Service/apiRequest'
import { getQuoteDetailAndUpdateSelectedUnit } from '../../../../redux/Actions'
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
    const quoteID = useSelector((state: Tappstate) => state.quoteDetail)?._id;
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    useEffect(() => {
        //if any of draft id changed for any selected rooms, make sure set selectedRoom to undefined to avoid mistake
        setselectedRoom(undefined);
    }, [JSON.stringify(selectedQuoteUnit?.rooms?.map((eachRoom: any) => eachRoom?.selectedCanvas?._id))])
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
        if (!e.currentTarget.innerHTML.includes('(added!)')) {
            dispatch({
                type: 'appLoader',
                payload: true
            })
            e.currentTarget.innerHTML = e?.currentTarget?.innerHTML + ' (added!) '
            e.currentTarget.style.fontWeight = '700';
            let currentDraftItemsInRoom = selectedQuoteUnit?.rooms?.filter((room: any) => room?.roomID === selectedRoom?.roomID)?.[0]?.selectedCanvas?.items;
            const res = await apiRequest({
                url: `/api/fhapp-service/design/${currentOrgID}/canvases/${selectedRoom?.selectedCanvas?._id}`,
                method: 'PATCH',
                body: {
                    items: {
                        ...currentDraftItemsInRoom,
                        [eachCategory?.categoryID]: currentDraftItemsInRoom?.[`${eachCategory?.categoryID}`] ? currentDraftItemsInRoom?.[`${eachCategory?.categoryID}`]?.concat({
                            ...eachProduct,
                            qty: 1
                        }) : [
                            {
                                ...eachProduct,
                                qty: 1
                            },
                        ]
                    },
                    designItems: []
                }
            })
            if (res?.success) {
                dispatch(getQuoteDetailAndUpdateSelectedUnit({
                    organizationID: currentOrgID ? currentOrgID : '',
                    quoteID: quoteID,
                    selectedQuoteUnitID: selectedQuoteUnit?.unitID
                }))
            }
            if (!res?.success) {
                console.log('add catagory for design failed at Product.tsx');
                dispatch({
                    type: 'appLoader',
                    payload: false
                });
            }
        }
    }

    const productOnDragStart = (e: React.DragEvent<HTMLDivElement>) => {
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
    }

    const productOnDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        dispatch({
            type: 'draggedProduct',
            payload: undefined
        });
        dragGhost?.classList?.remove('scale-width-150px');
        dragGhost?.parentNode?.removeChild(dragGhost);
    }
    return <div className={`${isExpand ? 'w-1/6' : 'w-1/3'} ${draggableWidth ? draggableWidth > 1100 ? 'w-1/5' : (draggableWidth > 900 ? 'w-1/4' : '') : ''} px-4`}>
        <div ref={productRef} draggable onDragStart={(e) => productOnDragStart(e)} onDragEnd={(e) => productOnDragEnd(e)}>
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
                                selectedQuoteUnit ?
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
        <div className='ml-1.5 text-xs font-ssp font-semibold'>Trade Price : ${Number(eachProduct?.tradePrice)?.toFixed(2)}</div>
        <div className='ml-1.5 text-xs font-ssp font-semibold'>{eachProduct?.name}</div>
    </div>
}

export default Product;