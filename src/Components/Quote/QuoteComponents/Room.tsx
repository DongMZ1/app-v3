import { useState } from 'react'
import { FurnitureInRoomRowCard } from '@fulhaus/react.ui.furniture-in-room-row-card'
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler';
import produce from 'immer'
import { FurnitureInRoomHeader } from '@fulhaus/react.ui.furniture-in-room-header'
import { TextInput } from '@fulhaus/react.ui.text-input';
import { Checkbox } from '@fulhaus/react.ui.checkbox'
import { Button } from '@fulhaus/react.ui.button'
import { AiOutlineDown } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux'
import { Tappstate } from '../../../redux/reducers'
import apiRequest from '../../../Service/apiRequest'
import { Popup } from '@fulhaus/react.ui.popup';

type RoomType = {
    eachRoom: any,
    roomItemOptions: string[] | undefined
    updateQuoteDetail: (newselectedQuoteUnit: any) => void
}

//dummy packages
const roomPackagesOptions = ['room Package 1', 'room Package 2', 'room Package 3', 'room Package 4']
const Room = ({ eachRoom, roomItemOptions, updateQuoteDetail }: RoomType) => {

    const [showAddItemDropdown, setshowAddItemDropdown] = useState(false);
    const [customItemName, setcustomItemName] = useState('');
    const [itemOptionCheckList, setitemOptionCheckList] = useState<string[]>([]);
    const [itemKeyword, setitemKeyword] = useState('');

    const [showAddPackageDropdown, setshowAddPackageDropdown] = useState(false);
    const [roomPackageOptionCheckList, setroomPackageOptionCheckList] = useState<string[]>([]);
    const [roomPackageKeyword, setroomPackageKeyword] = useState('');

    const [saveAsRoomPackageName, setsaveAsRoomPackageName] = useState('');
    const [showSaveAsRoomPackage, setshowSaveAsRoomPackage] = useState(false);

    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole;
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail)
    const quoteID = useSelector((state: Tappstate) => state?.quoteDetail)?.quoteID;
    const unitID = useSelector((state: Tappstate) => state.selectedQuoteUnit)?.unitID;
    const totalPriceOfEachRoom = eachRoom?.categories?.map((each: any) => each?.qty * each?.budget)?.reduce((a: number, b: number) => a + b, 0) * eachRoom?.count;
    const dispatch = useDispatch();

    const updateCategories = async (categories: any) => {
        const res = await apiRequest({
            url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${unitID}/${eachRoom.roomID}`,
            body: {
                categories
            },
            method: 'PATCH'
        })
        if (!res?.success) {
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
                method: 'POST'
            }
        )
        if (res?.success) {
            const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
                const roomIndex = draft.rooms.findIndex((each: any) => each?.roomID === eachRoom.roomID) + 1;
                (draft.rooms as any[])?.splice(roomIndex, 0, res?.duplicatedRoom)
            });
            dispatch({
                type: 'selectedQuoteUnit',
                payload: newselectedQuoteUnit
            })
            updateQuoteDetail(newselectedQuoteUnit);
        } else {
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

    const addItemToRoom = () => {
        const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
            const index = draft.rooms.findIndex((each: any) => each?.roomID === eachRoom.roomID)
            let itemlist = itemOptionCheckList.filter(
                each => !draft.rooms[index].categories.map((each: any) => each.name).includes(each)
            ).map(eachItemName => {
                return {
                    name: eachItemName,
                    rentable: false,
                    qty: 1,
                    budget: 0,
                }
            })
            if (!draft.rooms[index].categories.map((each: any) => each.name).includes(customItemName) && customItemName !== '') {
                itemlist = itemlist.concat(
                    {
                        name: customItemName,
                        rentable: false,
                        qty: 1,
                        budget: 0,
                    }
                )
            }
            draft.rooms[index].categories = draft.rooms[index].categories.concat(itemlist);
            updateCategories(draft.rooms[index].categories);
        })
        dispatch({
            type: 'selectedQuoteUnit',
            payload: newselectedQuoteUnit
        });
        updateQuoteDetail(newselectedQuoteUnit);
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
        } else {
            console.log('deleteRoom failed at Room.tsx')
        }
    }
    return <>
        <Popup horizontalAlignment='center' verticalAlignment='center' onClose={() => setshowSaveAsRoomPackage(false)} show={showSaveAsRoomPackage}>
            <div className='px-8 py-4 border border-black border-solid w-96 bg-cream'>
                <div className='mx-2 text-2xl text-center font-moret'>
                    What will you name your room package?
                </div>
                <div className='mt-4 text-xs font-ssp'>
                    Package Name
                </div>
                <TextInput className='mt-4' inputName='save as room package input' variant='box' value={saveAsRoomPackageName} onChange={(e) => setsaveAsRoomPackageName((e.target as any).value)} />
                <div className='flex my-2'>
                        <Button onClick={() => {
                            setshowSaveAsRoomPackage(false);
                        }} className='w-20 mr-4' variant='secondary'>Cancel</Button>
                        <Button disabled={!saveAsRoomPackageName} onClick={() => {
                            setsaveAsRoomPackageName('')
                            setshowSaveAsRoomPackage(false);
                        }} variant='primary' className='w-20'>Save</Button>
                    </div>
            </div>
        </Popup>
        <div className='w-full mt-6'>
            <FurnitureInRoomHeader
                totalPrice={totalPriceOfEachRoom ? totalPriceOfEachRoom : 0}
                duplicateRoom={() => duplicateRoom()}
                saveAsRoomPackage={() => setshowSaveAsRoomPackage(true)}
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
            <div className='flex'>
                <div className='relative w-32 mr-4 text-sm-important'>
                    <div onClick={() => setshowAddItemDropdown(true)} className='flex w-full h-8 border border-black border-solid cursor-pointer'><div className='my-auto ml-auto mr-1'>Add Items</div><AiOutlineDown className='my-auto mr-auto' /></div>
                    {showAddItemDropdown && <ClickOutsideAnElementHandler onClickedOutside={() => setshowAddItemDropdown(false)}>
                        <div className='absolute z-50 p-4 overflow-y-auto bg-white border border-black border-solid w-96'>
                            <div className='text-sm font-semibold font-ssp'>
                                Custom item
                            </div>
                            <TextInput placeholder='Enter Custom Item' variant='box' className='mt-2' inputName='customItemName' value={customItemName} onChange={(e) => setcustomItemName((e.target as any).value)} />
                            <div className='mt-4 text-sm font-semibold font-ssp'>
                                Choose from existing Categories
                            </div>
                            <TextInput placeholder='Search categories' variant='box' className='mt-2' inputName='Categories keywords' value={itemKeyword} onChange={(e) => {
                                setitemKeyword((e.target as any).value);
                                setitemOptionCheckList([]);
                            }}
                            />
                            <div className='w-full overflow-y-auto max-h-60'>
                                {roomItemOptions?.filter(each => !eachRoom?.categories.map((each: any) => each.name).includes(each)).filter(eachUnit => eachUnit.toLowerCase().includes(itemKeyword.toLowerCase())).map(each =>
                                    <Checkbox className='my-2' label={each} checked={itemOptionCheckList.includes(each)} onChange={(v) => {
                                        if (v) {
                                            setitemOptionCheckList(state => [...state, each])
                                        } else {
                                            setitemOptionCheckList(state => state.filter(e => e !== each))
                                        }
                                    }} />)}
                            </div>
                            <div className='flex my-2'>
                                <Button onClick={() => {
                                    setshowAddItemDropdown(false)
                                }} className='mr-4 w-36' variant='secondary'>Cancel</Button>
                                <Button disabled={itemOptionCheckList.length === 0 && customItemName === ''} onClick={() => {
                                    addItemToRoom();
                                    setitemOptionCheckList([]);
                                    setshowAddItemDropdown(false);
                                }} variant='primary' className='w-36'>Create Items</Button>
                            </div>
                        </div>
                    </ClickOutsideAnElementHandler>}
                </div>
                <div className='relative w-40 mr-8 text-sm-important'>
                    <div onClick={() => setshowAddPackageDropdown(true)} className='flex w-full h-8 border border-black border-solid cursor-pointer'><div className='my-auto ml-auto mr-1'>Add Room Packages</div><AiOutlineDown className='my-auto mr-auto' /></div>
                    {
                        showAddPackageDropdown && <ClickOutsideAnElementHandler onClickedOutside={() => setshowAddPackageDropdown(false)}>
                            <div className='absolute z-50 p-4 overflow-y-auto bg-white border border-black border-solid w-96'>
                                <TextInput placeholder='Search Existing UnitPackages' variant='box' className='mt-2' inputName='add package keywords' value={roomPackageKeyword} onChange={(e) => {
                                    setroomPackageKeyword((e.target as any).value);
                                    setroomPackageOptionCheckList([]);
                                }}
                                />
                                <div className='w-full overflow-y-auto max-h-60'>
                                    {roomPackagesOptions.filter(eachPackage => eachPackage.toLowerCase().includes(roomPackageKeyword.toLowerCase())).map(each =>
                                        <Checkbox className='my-2' label={each} checked={roomPackageOptionCheckList.includes(each)} onChange={(v) => {
                                            if (v) {
                                                setroomPackageOptionCheckList(state => [...state, each])
                                            } else {
                                                setroomPackageOptionCheckList(state => state.filter(e => e !== each))
                                            }
                                        }} />)}
                                </div>
                                <div className='flex my-2'>
                                    <Button onClick={() => {
                                        setshowAddPackageDropdown(false)
                                    }} className='mr-4 w-36' variant='secondary'>Cancel</Button>
                                    <Button disabled={itemOptionCheckList.length === 0 && customItemName === ''} onClick={() => {
                                        setroomPackageOptionCheckList([]);
                                        setshowAddPackageDropdown(false)
                                    }} variant='primary' className='w-36'>Create Items</Button>
                                </div>
                            </div>
                        </ClickOutsideAnElementHandler>
                    }
                </div>
            </div>
        </div >
    </>
}
export default Room;

type CategoryType = {
    eachCategory: any,
    eachRoom: any,
    updateQuoteDetail: (newselectedQuoteUnit: any) => void,
    updateCategories: (categories: any) => Promise<void>,
}
const Category = ({ eachCategory, eachRoom, updateQuoteDetail, updateCategories }: CategoryType) => {
    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole;
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail)
    const quoteID = useSelector((state: Tappstate) => state?.quoteDetail)?.quoteID;
    const unitID = useSelector((state: Tappstate) => state.selectedQuoteUnit)?.unitID;
    const dispatch = useDispatch();

    const categoryPriceChange = (MSRP: number) => {
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

    const updateCount = (count: number) => {
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
        onNumberChange={(v) => updateCount(v)}
        buy={!eachCategory.rentable}
        rentMSRP={eachCategory.budget}
        buyMSRP={eachCategory.budget}
        onMSRPChange={(MSRP) => categoryPriceChange(MSRP)}
        onRentableChange={(rentable) => updateRentable(rentable)}
        editable={userRole !== 'viewer'}
        DeleteFurniture={() => deleteCatogory()}
    />
}