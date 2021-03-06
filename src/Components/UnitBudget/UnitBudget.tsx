import { useState } from 'react'
import './UnitBudget.scss'
import { useDispatch, useSelector } from 'react-redux'
import { Tappstate } from '../../redux/reducers'
import { ImCross } from 'react-icons/im'
import { Toggle } from '@fulhaus/react.ui.toggle'
import { FurnitureInRoomHeader } from '@fulhaus/react.ui.furniture-in-room-header'
import { FurnitureInRoomRowCard } from '@fulhaus/react.ui.furniture-in-room-row-card'
import { CSSTransition } from 'react-transition-group'
const UnitBudget = () => {
    const [showImage, setshowImage] = useState(false);
    const [showPerItemCost, setshowPerItemCost] = useState(false);
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const dispatch = useDispatch();
    const totalItems = selectedQuoteUnit?.count * selectedQuoteUnit?.rooms?.map(
        (eachRoom: any) => eachRoom?.count * eachRoom?.categories?.map((category: any) => category?.qty).reduce((a: any, b: any) => a + b, 0)
    ).reduce((a: any, b: any) => a + b, 0);
    return <div className='flex flex-col flex-1 h-full px-6 py-4 overflow-y-auto unit-budget'>
        <div className='flex'>
            <div className='text-2xl font-moret'>{selectedQuoteUnit?.name}</div>
            <div className='my-auto ml-auto mr-8 text-sm font-semibold font-ssp'>Total {totalItems} items</div>
            <ImCross onClick={() => dispatch({
                type: 'selectedQuoteUnit',
                payload: undefined
            })} className='my-auto cursor-pointer' />
        </div>
        <div className='flex mt-6'>
            <Toggle initialValue={showImage} size={3} onToggle={(v) => setshowImage(v)} />
            <div className='ml-4 mr-8 text-sm font-ssp'>Display Images</div>
            <Toggle initialValue={showPerItemCost} size={3} onToggle={(v) => setshowPerItemCost(v)} />
            <div className='ml-4 text-sm font-ssp'>Display Item Per Cost</div>
        </div>
        {
            selectedQuoteUnit?.rooms?.map(
                (eachRoom: any) => {
                    const roomItemCount = eachRoom?.categories?.map((category: any) => category?.qty).reduce((a: any, b: any) => a + b, 0)
                    const roomTotalPrice = eachRoom?.categories?.map((category: any) => category?.qty * category?.budget).reduce((a: any, b: any) => a + b, 0)
                    return <div className='mt-4'>
                        <FurnitureInRoomHeader totalPrice={parseFloat(roomTotalPrice).toFixed(2) as any} editable={false} roomName={eachRoom.name} totalItems={roomItemCount} roomNumber={eachRoom.count ? eachRoom.count : 0} />
                        <CSSTransition in={showPerItemCost} timeout={300} unmountOnExit classNames='opacity-animation'>
                            <div>
                                {
                                    eachRoom?.categories?.map(
                                        (eachCategory: any) => <EachCategory
                                            eachRoom={eachRoom}
                                            eachCategory={eachCategory}
                                            showImage={showImage}
                                        />
                                    )}
                            </div>
                        </CSSTransition>
                    </div>
                }
            )
        }
    </div>
}

const EachCategory = ({ eachCategory, showImage, eachRoom }: {
    eachRoom: any,
    eachCategory: any,
    showImage: boolean
}) => {
    const [currentIndex, setcurrentIndex] = useState(0);
    return <FurnitureInRoomRowCard
        furnitureName={eachCategory.name}
        currentFurnitureIndex={(v) => setcurrentIndex(v)}
        furnitureBrandName={eachRoom?.selectedCanvas?.items?.[`${eachCategory?.categoryID}`]?.[currentIndex]?.name}
        imageUrl={eachRoom?.selectedCanvas?.items?.[`${eachCategory?.categoryID}`]?.map((eachProduct: any) => eachProduct?.imageURLs?.[0])}
        editable={false}
        buyMSRP={parseFloat(eachCategory.budget).toFixed(2) as any}
        rentMSRP={parseFloat(eachCategory.budget).toFixed(2) as any}
        number={eachCategory.qty ? eachCategory.qty : 0}
        buy={!eachCategory.rentable}
        showImages={showImage}
    />
}

export default UnitBudget;