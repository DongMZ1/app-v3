import { useState } from 'react'
import { FurnitureInRoomRowCard } from '@fulhaus/react.ui.furniture-in-room-row-card'
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler';
import produce from 'immer'
import { FurnitureInRoomHeader } from '@fulhaus/react.ui.furniture-in-room-header'
import { useSelector, useDispatch } from 'react-redux'
import { Tappstate } from '../../../redux/reducers'
import apiRequest from '../../../Service/apiRequest'

type RoomType = {
    eachRoom: any,
    roomItemOptions: string[] | undefined
    updateQuoteDetail:  (newselectedQuoteUnit: any) => void
}
const Room = ({ eachRoom, roomItemOptions, updateQuoteDetail }: RoomType) => {
    const [showAddUnitDropdown, setshowAddUnitDropdown] = useState(false);
    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole;
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail)
    const quoteID = useSelector((state: Tappstate) => state?.quoteDetail)?.quoteID;
    const unitID = useSelector((state: Tappstate) => state.selectedQuoteUnit)?.unitID;
    const totalPriceOfEachRoom = eachRoom?.categories?.map((each:any) => each?.qty * each?.budget)?.reduce((a : number, b:number) => a+b, 0)* eachRoom?.count;
    const dispatch = useDispatch();
    
    const updateCategories = async (categories: any) => {
        const res = await apiRequest({
            url:`/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${unitID}/${eachRoom.roomID}`,
            body: {
                categories
            },
            method:'PATCH'
        })
        if(!res?.success){
           console.log('updateCategories failed at line 33 Room.tsx')
        }
    }

    const duplicateRoom = async () => {
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${unitID}/${eachRoom.roomID}/duplicate`,
                body: {
                    ...eachRoom,
                    roomID: undefined
                },
                method:'POST'
            }
        )
        if(res?.success){
            const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
                const roomIndex = draft.rooms.findIndex((each: any) => each?.roomID === eachRoom.roomID) + 1;
                (draft.rooms as any[])?.splice(roomIndex, 0, res?.duplicatedRoom)
            });
            dispatch({
                type: 'selectedQuoteUnit',
                payload: newselectedQuoteUnit
            })
            updateQuoteDetail(newselectedQuoteUnit);
        }else{
            console.log('duplicateRoom failed at Room.tsx')
        }
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
            console.log('updateRoomCount failed at line 55 Room.tsx')
        }
    }

    const addItemToRoom = async (v: string) => {
        //update the data, the pass entire categories of this room to backend
        if (!eachRoom.categories?.map((each: any) => each?.name)?.includes(v)) {
            const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
                const index = draft.rooms.findIndex((each: any) => each?.roomID === eachRoom.roomID)
                draft.rooms[index].categories = draft.rooms[index].categories.concat({
                    name: v,
                    rentable: false,
                    qty: 1,
                    budget: 0,
                })
                //we do not have to wait this action
                updateCategories(draft.rooms[index].categories)
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
        }else{
            console.log('deleteRoom failed at Room.tsx')
        }
    }
    return <div className='w-full mt-6'>
        <FurnitureInRoomHeader
            totalPrice={totalPriceOfEachRoom? totalPriceOfEachRoom : 0}
            duplicateRoom={() => duplicateRoom()}
            deleteRoom={() => deleteRoom()}
            //filter out room item that already added to this room
            roomNumber={eachRoom?.count}
            onRoomNumberChange={(v) => updateRoomCount(v)}
            roomName={eachRoom?.roomType}
            editable={userRole !== 'viewer'}
        >
            <>
                {
                    eachRoom.categories?.map((eachCategory: any) => 
                    <Category
                     eachRoom={eachRoom}
                     eachCategory={eachCategory}
                     updateQuoteDetail={updateQuoteDetail}
                     updateCategories={updateCategories}
                      />)
                }
                <div className='h-1 '></div>
            </>
        </FurnitureInRoomHeader>
        <div className='relative w-24 text-sm-important'>
                    <div onClick={() => setshowAddUnitDropdown(true)} className='flex w-full h-8 bg-white border border-black border-solid cursor-pointer'><div className='m-auto'>Add Room</div></div>
                    {showAddUnitDropdown && <ClickOutsideAnElementHandler onClickedOutside={() => setshowAddUnitDropdown(false)}>
                        <div className='absolute z-50 bg-white border border-black border-solid w-96 h-96'>
                        </div>
                    </ClickOutsideAnElementHandler>}
                </div>
    </div >
}
export default Room;

type CategoryType = {
    eachCategory: any,
    eachRoom: any,
    updateQuoteDetail: (newselectedQuoteUnit: any) => void,
    updateCategories: (categories: any) => Promise<void>,
}
const Category = ({ eachCategory, eachRoom, updateQuoteDetail, updateCategories}: CategoryType) => {
    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole;
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail)
    const quoteID = useSelector((state: Tappstate) => state?.quoteDetail)?.quoteID;
    const unitID = useSelector((state: Tappstate) => state.selectedQuoteUnit)?.unitID;
    const dispatch = useDispatch();

    const categoryPriceChange = (MSRP: number) =>{
        const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
            const roomIndex = draft.rooms.findIndex((each: any) => each?.roomID === eachRoom.roomID)
            const categoriesIndex = draft.rooms[roomIndex]?.categories?.findIndex((each: any) => each?.name === eachCategory.name);
            draft.rooms[roomIndex].categories[categoriesIndex].budget = MSRP
            //we do not have to wait this action
            updateCategories(draft.rooms[roomIndex].categories)
        });
        dispatch({
            type: 'selectedQuoteUnit',
            payload: newselectedQuoteUnit
        });
        updateQuoteDetail(newselectedQuoteUnit);
    }
    
    const deleteCatogory = () => {
        const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
            const roomIndex = draft.rooms.findIndex((each: any) => each?.roomID === eachRoom.roomID)
            draft.rooms[roomIndex].categories = draft.rooms[roomIndex]?.categories?.filter((each: any) => each?.name !== eachCategory.name);
            //we do not have to wait this action
            updateCategories(draft.rooms[roomIndex].categories)
        });
        dispatch({
            type: 'selectedQuoteUnit',
            payload: newselectedQuoteUnit
        });
        updateQuoteDetail(newselectedQuoteUnit);
    }

    const updateCount = (count:number) => {
            const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
                const roomIndex = draft.rooms.findIndex((each: any) => each?.roomID === eachRoom.roomID)
                const categoriesIndex = draft.rooms[roomIndex]?.categories?.findIndex((each: any) => each?.name === eachCategory.name);
                draft.rooms[roomIndex].categories[categoriesIndex].qty = count
                //we do not have to wait this action
                updateCategories(draft.rooms[roomIndex].categories)
            });
            dispatch({
                type: 'selectedQuoteUnit',
                payload: newselectedQuoteUnit
            });
            updateQuoteDetail(newselectedQuoteUnit);
    }

    const updateRentable = (rentable: boolean) => {
        const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
            const roomIndex = draft.rooms.findIndex((each: any) => each?.roomID === eachRoom.roomID)
            const categoriesIndex = draft.rooms[roomIndex]?.categories?.findIndex((each: any) => each?.name === eachCategory.name);
            draft.rooms[roomIndex].categories[categoriesIndex].rentable = rentable
            //we do not have to wait this action
            updateCategories(draft.rooms[roomIndex].categories)
        });
        dispatch({
            type: 'selectedQuoteUnit',
            payload: newselectedQuoteUnit
        });
        updateQuoteDetail(newselectedQuoteUnit);
    }
    return <FurnitureInRoomRowCard
        furnitureName={eachCategory.name ? eachCategory.name : ''}
        number={eachCategory.qty ? eachCategory.qty : 0}
        onNumberChange={(v)=>updateCount(v)}
        buy={!eachCategory.rentable}
        rentMSRP={eachCategory.budget}
        buyMSRP={eachCategory.budget}
        onMSRPChange={(MSRP) => categoryPriceChange(MSRP)}
        onRentableChange={(rentable) => updateRentable(rentable)}
        editable={userRole !== 'viewer'}
        DeleteFurniture={() => deleteCatogory()}
    />
}