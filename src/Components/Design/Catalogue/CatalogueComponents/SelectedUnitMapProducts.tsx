import React from 'react'
import { useSelector } from 'react-redux'
import { Tappstate } from '../../../../redux/reducers'
import { ReactComponent as AddUnitIcon } from "../../../../styles/images/add-a-unit-to-get-start.svg";
import { FurnitureInRoomHeader } from '@fulhaus/react.ui.furniture-in-room-header';
import { FurnitureInRoomRowCard } from '@fulhaus/react.ui.furniture-in-room-row-card';
const SelectedUnitMapProducts = () => {
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const draggedProduct = useSelector((state: Tappstate) => state.draggedProduct);
    if (!selectedQuoteUnit) {
        return <div className='m-auto'>
            <AddUnitIcon />
            <div className='flex text-4xl font-moret'><div className='mx-auto'>Select a unit to get started</div></div>
        </div>
    }
    const ondrop = (e: React.DragEvent<HTMLDivElement>, eachRoom: any, eachCategory:any) => {
        console.log('droped ' + eachRoom?.name + ' ' + eachCategory?.name);
        console.log(draggedProduct)
    }
    return <div className='flex-1 p-4 overflow-auto'>
        {
            selectedQuoteUnit?.rooms?.map((eachRoom: any) => <div className='mb-6'>
                <FurnitureInRoomHeader editable={false} roomNumber={eachRoom?.count} roomName={eachRoom?.name} totalPrice={eachRoom?.totalAmount} >
                    <>
                    {
                        eachRoom?.categories?.map(
                            (eachCategory: any) => <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => ondrop(e, eachRoom, eachCategory)} ><FurnitureInRoomRowCard isDesign currentFurnitureNumber={1} furnitureName={eachCategory?.name} number={eachCategory?.qty} editable buy={eachCategory?.rentable} buyMSRP={eachCategory?.budget} rentMSRP={eachCategory?.budget} /></div>
                        )
                    }
                    </>
                </FurnitureInRoomHeader>
            </div>)
        }
    </div>
}

export default SelectedUnitMapProducts