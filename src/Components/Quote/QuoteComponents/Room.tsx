import { useState } from 'react'
import { FurnitureInRoomRowCard } from '@fulhaus/react.ui.furniture-in-room-row-card'
import produce from 'immer'
import { FurnitureInRoomHeader } from '@fulhaus/react.ui.furniture-in-room-header'
import { useSelector, useDispatch } from 'react-redux'
import { Tappstate } from '../../../redux/reducers'
import apiRequest from '../../../Service/apiRequest'
type RoomType = {
    eachRoom: any,
    roomItemOptions: string[] | undefined
}
const Room = ({ eachRoom, roomItemOptions }: RoomType) => {
    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole;
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail)
    const quoteID = useSelector((state: Tappstate) => state?.quoteDetail)?.quoteID;
    const unitID = useSelector((state: Tappstate) => state.selectedQuoteUnit)?.unitID;
    const dispatch = useDispatch();
    
    const updateCatelogries = async (catelogries: any) => {
        const res = await apiRequest({
            url:`/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${unitID}/${eachRoom.roomID}`,
            body: {
                catelogries
            },
            method:'PATCH'
        })
        if(!res?.success){
           console.log(res.message)
        }
    }
    //need to update this every time, because selectedQuoteUnit info will not update with updateQuoteDetail
    const updateQuoteDetail = (newselectedQuoteUnit: any) => {
        //update quoteDetail
        const newquoteDetail = produce(quoteDetail, (draft: any) => {
            const index = draft.data.findIndex((each: any) => each?.unitID === unitID)
            draft.data[index] = newselectedQuoteUnit;
        });
        dispatch({
            type: 'quoteDetail',
            payload: newquoteDetail
        });
    }
    const updateRoomCount = async (count: number) => {
        const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
            const index = draft.rooms.findIndex((each: any) => each?.roomID === eachRoom.roomID)
            draft.rooms[index].count = count;
        });
        dispatch({
            type: 'selectedQuoteUnit',
            payload: newselectedQuoteUnit
        })
        updateQuoteDetail(newselectedQuoteUnit);
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${unitID}/${eachRoom.roomID}`,
                body: { count },
                method: 'PATCH'
            }
        )
        if (!res?.success) {
            console.log(res.error)
        }
    }

    const addItemToRoom = async (v: string) => {
        //update the data, the pass entire catelogries of this room to backend
        if (!eachRoom.categories?.map((each: any) => each?.name)?.includes(v)) {
            const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
                const index = draft.rooms.findIndex((each: any) => each?.roomID === eachRoom.roomID)
                draft.rooms[index].categories = draft.rooms[index].categories.concat({
                    name: v,
                    rentable: false,
                    count: 1,
                    buyPrice: 0,
                    rentPrice: 0
                })
                //we do not have to wait this action
                updateCatelogries(draft.rooms[index].categories)
            })
            dispatch({
                type: 'selectedQuoteUnit',
                payload: newselectedQuoteUnit
            });
            updateQuoteDetail(newselectedQuoteUnit);
        }
    }
    const deleteRoom = async () => {
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${unitID}/${eachRoom.roomID}`,
                method: 'DELETE'
            }
        )
        if (res?.success) {
            const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
                draft.rooms = draft.rooms.filter((each: any) => each.roomID !== eachRoom.roomID)
            })
            dispatch({
                type: 'selectedQuoteUnit',
                payload: newselectedQuoteUnit
            });
            updateQuoteDetail(newselectedQuoteUnit);
        }
    }
    return <div className='w-full mt-6'>
        <FurnitureInRoomHeader
            totalPrice={0}
            deleteRoom={() => deleteRoom()}
            //filter out room item that already added to this room
            addItemList={roomItemOptions}
            addItemOnSelect={(v) => addItemToRoom(v)}
            roomNumber={eachRoom?.count}
            onRoomNumberChange={(v) => updateRoomCount(v)}
            roomName={eachRoom?.roomType}
            editable={userRole !== 'viewer'}
        >
            <>
                {
                    eachRoom.categories?.map((eachCategory: any) => <Category eachCategory={eachCategory} />)
                }
                <div className='h-1 '></div>
            </>
        </FurnitureInRoomHeader>
    </div >
}
export default Room;

type CategoryType = {
    eachCategory: any
}
const Category = ({ eachCategory }: CategoryType) => {
    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole;
    return <FurnitureInRoomRowCard
        furnitureName={eachCategory.name ? eachCategory.name : ''}
        number={eachCategory.count ? eachCategory.count : 0}
        buy={!eachCategory.rentable}
        rentMSRP={eachCategory.rentPrice ? eachCategory.rentPrice : 0}
        buyMSRP={eachCategory.buyPrice ? eachCategory.buyPrice : 0}
        editable={userRole !== 'viewer'}
    />
}