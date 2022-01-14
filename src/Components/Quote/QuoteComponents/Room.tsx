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
    const updateRoomCount = async (count: number) => {
        const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
            const index = draft.rooms.findIndex((each: any) => each?.roomID === eachRoom.roomID)
            draft.rooms[index].count = count;
        });
        dispatch({
            type: 'selectedQuoteUnit',
            payload: newselectedQuoteUnit
        })
        //update quoteDetail
        const newquoteDetail = produce(quoteDetail, (draft: any) => {
            const index = draft.data.findIndex((each: any) => each?.unitID === unitID)
            draft.data[index] = newselectedQuoteUnit;
        });
        dispatch({
            type: 'quoteDetail',
            payload: newquoteDetail
        });
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
            //update quoteDetail
            const newquoteDetail = produce(quoteDetail, (draft: any) => {
                //find unit index at quote detail
                const index = draft.data.findIndex((each: any) => each?.unitID === unitID)
                draft.data[index] = newselectedQuoteUnit;
            });
            dispatch({
                type: 'quoteDetail',
                payload: newquoteDetail
            });
        }
    }
    return <div className='w-full mt-6'>
        <FurnitureInRoomHeader
            totalPrice={0}
            deleteRoom={() => deleteRoom()}
            addItemList={roomItemOptions}
            roomNumber={eachRoom?.count}
            onRoomNumberChange={(v) => updateRoomCount(v)}
            roomName={eachRoom?.roomType}
            editable={userRole !== 'viewer'}
        >
            <>
            </>
        </FurnitureInRoomHeader>
    </div>
}
export default Room;

const Category = () => {
    return <div>
    </div>
}