import { useCallback, useEffect, useState } from 'react'
import { FurnitureInRoomRowCard } from '@fulhaus/react.ui.furniture-in-room-row-card'
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler';
import produce from 'immer'
import { FurnitureInRoomHeader } from '@fulhaus/react.ui.furniture-in-room-header'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TextInput } from '@fulhaus/react.ui.text-input';
import { Checkbox } from '@fulhaus/react.ui.checkbox'
import { Button } from '@fulhaus/react.ui.button'
import { AiOutlineDown } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux'
import { Tappstate } from '../../../redux/reducers'
import apiRequest from '../../../Service/apiRequest'
import { Popup } from '@fulhaus/react.ui.popup';
import debounce from 'lodash.debounce';
import useDebounce from '../../../Hooks/useDebounce';
import useIsFirstRender from '../../../Hooks/useIsFirstRender';
import { RiDeleteBin5Line } from 'react-icons/ri'

type RoomType = {
    eachRoom: any,
    roomItemOptionsList: { name: string; id: string; }[] | undefined
    updateQuoteDetail: (newselectedQuoteUnit: any) => void,
    RoomOptionList: {
        name: string;
        id: string;
        categories: any[];
        createdBy: string;
    }[] | undefined,
    getRoomOptionList: () => Promise<void>,
    setselectedRoomOptionToDelete: React.Dispatch<any>,
    setshowSelectedRoomOptionToDelete: React.Dispatch<React.SetStateAction<boolean>>
}

const Room = ({ eachRoom, roomItemOptionsList, updateQuoteDetail, RoomOptionList, getRoomOptionList, setselectedRoomOptionToDelete, setshowSelectedRoomOptionToDelete }: RoomType) => {

    const [showAddItemDropdown, setshowAddItemDropdown] = useState(false);
    const [customItemName, setcustomItemName] = useState('');
    const [itemOptionCheckedList, setitemOptionCheckedList] = useState<{ name: string; id: string; }[]>([]);
    const [itemKeyword, setitemKeyword] = useState('');

    const [showAddPackageDropdown, setshowAddPackageDropdown] = useState(false);
    const [roomPackageOptionCheckedList, setroomPackageOptionCheckedList] = useState<{
        name: string;
        id: string | null;
        categories: any[];
    }[]>([]);
    const [roomPackageKeyword, setroomPackageKeyword] = useState('');

    const [saveAsRoomPackageName, setsaveAsRoomPackageName] = useState('');
    const [showSaveAsRoomPackage, setshowSaveAsRoomPackage] = useState(false);
    const [errorMessage, seterrorMessage] = useState<any>('');

    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole;
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail)
    const quoteID = useSelector((state: Tappstate) => state?.quoteDetail)?._id;
    const unitID = useSelector((state: Tappstate) => state.selectedQuoteUnit)?.unitID;
    const fullName = useSelector((state: Tappstate) => state?.userInfo?.fullName);
    const totalPriceOfEachRoom : any = eachRoom?.categories?.map((each: any) => each?.qty * each?.budget)?.reduce((a: number, b: number) => a + b, 0) * eachRoom?.count;
    const projectID = useSelector((state:Tappstate) => state.selectedProject)?._id;
    const dispatch = useDispatch();
    const isFirstRendering = useIsFirstRender();

    useEffect(() => {
        if (!isFirstRendering && eachRoom?.categories) {
            debounceUpdateCategories(eachRoom?.categories);
        }
    }, [JSON.stringify(eachRoom?.categories)]);

    const debounceUpdateRoomCountRemote = useCallback(debounce((count) => updateRoomCountRemote(count), 500), [currentOrgID, quoteID, projectID, unitID, eachRoom.roomID]);

    const updateRoomCountRemote = async (count: any) => {
        dispatch({
            type: 'appLoader',
            payload: true
        });
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/quote/${currentOrgID}/${projectID}/${quoteID}/${unitID}/${eachRoom.roomID}`,
                body: { count },
                method: 'PATCH'
            }
        )
        if (!res?.success) {
            console.log('updateRoomCount failed at line 55 Room.tsx')
        }
        dispatch({
            type: 'appLoader',
            payload: false
        });
    }

    const debounceUpdateCategories = useCallback(debounce((categories: any) => updateCategories(categories), 500), [currentOrgID, quoteID, unitID, projectID, eachRoom.roomID]);

    const updateCategories = async (categories: any) => {
        dispatch({
            type: 'appLoader',
            payload: true
        });
        const res = await apiRequest({
            url: `/api/fhapp-service/quote/${currentOrgID}/${projectID}/${quoteID}/${unitID}/${eachRoom.roomID}`,
            body: {
                categories
            },
            method: 'PATCH'
        })
        if (!res?.success) {
            console.log('updateCategories failed at line 33 Room.tsx')
        }
        dispatch({
            type: 'appLoader',
            payload: false
        });
    };

    const saveAsRoomPackage = async () => {
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/package/room/${currentOrgID}`,
                body: {
                    name: saveAsRoomPackageName,
                    categories: eachRoom.categories
                },
                method: 'POST'
            }
        )
        if (res?.success) {
            await getRoomOptionList();
            setsaveAsRoomPackageName('')
            setshowSaveAsRoomPackage(false);
        } else {
            seterrorMessage(res?.message)
        }
    }

    const duplicateRoom = async () => {
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/quote/${currentOrgID}/${projectID}/${quoteID}/${unitID}/${eachRoom.roomID}/duplicate`,
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

    const updateRoomCount = (count: number) => {
        if (count < 10000) {
            const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
                const index = draft.rooms.findIndex((each: any) => each?.roomID === eachRoom.roomID)
                draft.rooms[index].count = count;
            });
            dispatch({
                type: 'selectedQuoteUnit',
                payload: newselectedQuoteUnit
            })
            debounceUpdateRoomCountRemote(count);
            updateQuoteDetail(newselectedQuoteUnit);
        }
    }

    const addRoomPackagesToRoom = async () => {
        const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
            const index = draft.rooms.findIndex((each: any) => each?.roomID === eachRoom.roomID)
            for (let roomPackage of roomPackageOptionCheckedList) {
                for (let roomPackageCategory of roomPackage.categories) {
                    //if Rooms.categories does not have this category, then add it
                    if (draft.rooms[index]?.categories?.filter((each: any) => each.name === roomPackageCategory.name)?.length === 0) {
                        draft.rooms[index].categories = draft.rooms[index].categories.concat(roomPackageCategory);
                    }
                }
            }
        });
        dispatch({
            type: 'selectedQuoteUnit',
            payload: newselectedQuoteUnit
        });
        updateQuoteDetail(newselectedQuoteUnit);
    }

    const addItemToRoom = () => {
        const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
            const index = draft.rooms.findIndex((each: any) => each?.roomID === eachRoom.roomID)
            let itemlist = itemOptionCheckedList.filter(
                each => !draft.rooms[index].categories.map((each: any) => each.name).includes(each)
            ).map(eachItem => {
                return {
                    name: eachItem.name,
                    rentable: false,
                    qty: 1,
                    budget: 0,
                    categoryID: eachItem.id as (string | null | undefined)
                }
            })
            if (!draft.rooms[index].categories.map((each: any) => each.name).includes(customItemName) && customItemName !== '') {
                itemlist = itemlist.concat(
                    {
                        name: customItemName,
                        rentable: false,
                        qty: 1,
                        budget: 0,
                        categoryID: undefined,
                    }
                )
            }
            draft.rooms[index].categories = draft.rooms[index].categories.concat(itemlist);

        })
        dispatch({
            type: 'selectedQuoteUnit',
            payload: newselectedQuoteUnit
        });
        updateQuoteDetail(newselectedQuoteUnit);
        //reset default varibles
        setcustomItemName('');
        setitemOptionCheckedList([]);
        setshowAddItemDropdown(false);
    }
    const deleteRoom = async () => {
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/quote/${currentOrgID}/${projectID}/${quoteID}/${unitID}/${eachRoom.roomID}`,
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
                <div className='mt-2 text-xs font-ssp'>
                    Package Name
                </div>
                {errorMessage && <div className='my-1 text-xs font-semibold text-red'>{errorMessage}</div>}
                <TextInput className='mt-2' inputName='save as room package input' variant='box' value={saveAsRoomPackageName} onChange={(e) => setsaveAsRoomPackageName((e.target as any).value)} />
                <div className='flex my-2'>
                    <Button onClick={() => {
                        setshowSaveAsRoomPackage(false);
                    }} className='w-20 mr-4' variant='secondary'>Cancel</Button>
                    <Button disabled={!saveAsRoomPackageName} onClick={() => {
                        saveAsRoomPackage();
                    }} variant='primary' className='w-20'>Save</Button>
                </div>
            </div>
        </Popup>
        <div className='w-full mt-6'>
            <FurnitureInRoomHeader
                totalPrice={totalPriceOfEachRoom ? parseFloat(totalPriceOfEachRoom).toFixed(2) as any : 0}
                duplicateRoom={() => duplicateRoom()}
                saveAsRoomPackage={() => {
                    setshowSaveAsRoomPackage(true);
                    seterrorMessage('');
                }}
                deleteRoom={() => deleteRoom()}
                //filter out room item that already added to this room
                roomNumber={eachRoom?.count}
                onRoomNumberChange={(v) => updateRoomCount(v)}
                roomName={eachRoom?.name}
                editable={userRole !== 'viewer' && (!quoteDetail?.approved)}
            >
                <>
                    <TransitionGroup>
                        {
                            eachRoom.categories?.map((eachCategory: any) =>
                                <CSSTransition key={eachCategory.name} timeout={300} classNames='opacity-animation'>
                                    <Category
                                        eachRoom={eachRoom}
                                        eachCategory={eachCategory}
                                        updateQuoteDetail={updateQuoteDetail}
                                    /></CSSTransition>)
                        }
                    </TransitionGroup>
                    <div className='h-1 '></div>
                    {userRole !== 'viewer' && (!quoteDetail?.approved) &&
                        <div className='flex'>
                            <div className='relative w-32 mr-4 text-sm-important'>
                                <div onClick={() => setshowAddItemDropdown(state => !state)} className='flex w-full h-8 border border-black border-solid cursor-pointer hover:bg-black hover:border-transparent hover:text-white'><div className='my-auto ml-auto mr-1'>Add Items</div><AiOutlineDown className='my-auto mr-auto' /></div>
                                <CSSTransition in={showAddItemDropdown} timeout={300} unmountOnExit classNames='height-800px-animation' >
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
                                            setitemOptionCheckedList([]);
                                        }}
                                        />
                                        <div className='w-full overflow-y-auto max-h-60'>
                                            {roomItemOptionsList?.filter(each => !eachRoom?.categories.map((each: any) => each.name).includes(each)).filter(eachUnit => eachUnit.name.toLowerCase().includes(itemKeyword.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name)).map(each =>
                                                <Checkbox className='my-2' label={each.name} checked={itemOptionCheckedList.includes(each)} onChange={(v) => {
                                                    if (v) {
                                                        setitemOptionCheckedList(state => [...state, each])
                                                    } else {
                                                        setitemOptionCheckedList(state => state.filter(e => e !== each))
                                                    }
                                                }} />)}
                                        </div>
                                        <div className='flex my-2'>
                                            <Button onClick={() => {
                                                setshowAddItemDropdown(false)
                                            }} className='mr-4 w-36' variant='secondary'>Cancel</Button>
                                            <Button disabled={itemOptionCheckedList.length === 0 && customItemName === ''} onClick={() => {
                                                addItemToRoom();
                                            }} variant='primary' className='w-36'>Create Items</Button>
                                        </div>
                                    </div>
                                </CSSTransition>
                            </div>
                            <div className='relative w-40 mr-8 text-sm-important'>
                                <div onClick={() => setshowAddPackageDropdown(state => !state)} className='flex w-full h-8 border border-black border-solid cursor-pointer hover:bg-black hover:border-transparent hover:text-white'><div className='my-auto ml-auto mr-1'>Add Room Packages</div><AiOutlineDown className='my-auto mr-auto' /></div>
                                <CSSTransition in={showAddPackageDropdown} timeout={300} unmountOnExit classNames='height-800px-animation'>
                                    <div className='absolute z-50 p-4 overflow-y-auto bg-white border border-black border-solid w-96'>
                                        <TextInput placeholder='Search existing room packages' variant='box' className='mt-2' inputName='add package keywords' value={roomPackageKeyword} onChange={(e) => {
                                            setroomPackageKeyword((e.target as any).value);
                                            setroomPackageOptionCheckedList([]);
                                        }}
                                        />
                                        <div className='w-full overflow-y-auto max-h-60'>
                                            {RoomOptionList?.filter(eachPackage => eachPackage.name.toLowerCase().includes(roomPackageKeyword.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name)).map(each =>
                                                <div className='flex my-2'>
                                                    <Checkbox label={each.name} checked={roomPackageOptionCheckedList.includes(each)} onChange={(v) => {
                                                        if (v) {
                                                            setroomPackageOptionCheckedList(state => [...state, each])
                                                        } else {
                                                            setroomPackageOptionCheckedList(state => state.filter(e => e !== each))
                                                        }
                                                    }} />
                                                    {(userRole === 'admin' || userRole === 'owner') && (fullName === each.createdBy) && <RiDeleteBin5Line
                                                        onClick={() => {
                                                            setselectedRoomOptionToDelete(each);
                                                            setshowSelectedRoomOptionToDelete(true);
                                                        }}
                                                        className='my-auto ml-auto mr-4 cursor-pointer' color='red' />}
                                                </div>)}
                                        </div>
                                        <div className='flex my-2'>
                                            <Button onClick={() => {
                                                setshowAddPackageDropdown(false)
                                            }} className='mr-4 w-36' variant='secondary'>Cancel</Button>
                                            <Button disabled={roomPackageOptionCheckedList.length === 0 && customItemName === ''} onClick={() => {
                                                addRoomPackagesToRoom();
                                                setroomPackageOptionCheckedList([]);
                                                setshowAddPackageDropdown(false)
                                            }} variant='primary' className='w-36'>Add Room Package Items</Button>
                                        </div>
                                    </div>
                                </CSSTransition>
                            </div>
                        </div>}
                </>
            </FurnitureInRoomHeader>
        </div >
    </>
}
export default Room;

type CategoryType = {
    eachCategory: any,
    eachRoom: any,
    updateQuoteDetail: (newselectedQuoteUnit: any) => void,
}
const Category = ({ eachCategory, eachRoom, updateQuoteDetail }: CategoryType) => {
    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole;
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail)
    const quoteID = useSelector((state: Tappstate) => state?.quoteDetail)?._id;
    const unitID = useSelector((state: Tappstate) => state.selectedQuoteUnit)?.unitID;
    const dispatch = useDispatch();

    const categoryPriceChange = (MSRP: number) => {
        const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
            const roomIndex = draft.rooms.findIndex((each: any) => each?.roomID === eachRoom.roomID)
            const categoriesIndex = draft.rooms[roomIndex]?.categories?.findIndex((each: any) => each?.name === eachCategory.name);
            draft.rooms[roomIndex].categories[categoriesIndex].budget = MSRP
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
        editable={userRole !== 'viewer' && (!quoteDetail?.approved)}
        DeleteFurniture={() => deleteCatogory()}
    />
}