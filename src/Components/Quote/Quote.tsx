import { useState, useEffect } from 'react'
import './Quote.scss'
import { ReactComponent as AddUnitIcon } from "../../styles/images/add-a-unit-to-get-start.svg";
import Room from './QuoteComponents/Room';
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import { TextInput } from '@fulhaus/react.ui.text-input';
import { Checkbox } from '@fulhaus/react.ui.checkbox'
import { Button } from '@fulhaus/react.ui.button'
import { AiOutlineDown } from 'react-icons/ai';
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler';
import produce from 'immer'
import { useSelector, useDispatch } from 'react-redux';
import { Tappstate } from '../../redux/reducers';
import apiRequest from '../../Service/apiRequest';

const Quote = () => {
    //add room and add room packages list share the same name and ID
    const [RoomOptionList, setRoomOptionList] = useState<{ name: string, id: string }[]>();

    const [roomItemOptionsList, setroomItemOptionsList] = useState<{ name: string, id: string }[]>();
    const [showAddRoomDropdown, setshowAddRoomDropdown] = useState(false);
    const [customRoomName, setcustomRoomName] = useState('');
    const [roomOptionCheckedList, setroomOptionCheckedList] = useState<{ name: string, id: string | null }[]>([]);
    const [roomPackageKeyword, setroomPackageKeyword] = useState('')

    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole;
    const quoteUnitLength = useSelector((state: Tappstate) => state.quoteDetail)?.data?.length;
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail)
    const quoteID = useSelector((state: Tappstate) => state?.quoteDetail)?.quoteID;
    const unitID = useSelector((state: Tappstate) => state.selectedQuoteUnit)?.unitID;
    const dispatch = useDispatch();
    const allRentable = !(selectedQuoteUnit?.rooms as any[])?.some(eachRoom => (eachRoom?.categories as any[])?.some(eachCategory => !eachCategory.rentable))

    useEffect(
        () => {
            //get the room option list on first render
            getRoomOptionList()
        }, [currentOrgID]
    )
    useEffect(
        () => {
            //if item options is not provided
            const getRoomItemOptionsList = async () => {
                const res = await apiRequest({
                    url: '/api/products-service/categories',
                    method: 'GET'
                })
                if (res?.success) {
                    setroomItemOptionsList(res.data.map((each: any) => { return { name: each.name, id: each._id } }))
                }
            }
            if (!roomItemOptionsList) {
                getRoomItemOptionsList();
            }
        }, []
    )

    const getRoomOptionList = async () => {
        if (currentOrgID) {
            const res = await apiRequest(
                {
                    url: `/api/fhapp-service/packages/room/${currentOrgID}`,
                    method: 'GET'
                }
            )
            if (res?.success) {
                setRoomOptionList(res?.roomPackages?.map((each: any) => {
                    return {
                        name: each.name,
                        id: each._id
                    }
                }))
            } else {
                console.log('getRoomOptionsList failed at Quote.tsx')
            }
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

    const markAll = () => {
        //if all of them are rentable, then we need to unmark them
        const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
            draft.rooms.forEach((eachRoom: any) => {
                eachRoom.categories.forEach((eachCategory: any) => eachCategory.rentable = !allRentable)
                const res = apiRequest({
                    url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${unitID}/${eachRoom.roomID}`,
                    body: {
                        categories: eachRoom.categories
                    },
                    method: 'PATCH'
                })
            })
        });
        dispatch({
            type: 'selectedQuoteUnit',
            payload: newselectedQuoteUnit
        });
        updateQuoteDetail(newselectedQuoteUnit);
    }
    const addRooms = async () => {
        let newRooms: any = [];
        let allRoomsNames = roomOptionCheckedList;
        if (customRoomName) {
            allRoomsNames = allRoomsNames.concat({ name: customRoomName, id: null });
        }
        for (let eachRoom of allRoomsNames) {
            const res = await apiRequest({
                url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${unitID}`,
                body: {
                    roomName: eachRoom.name,
                    packageID: eachRoom.id
                },
                method: 'POST'
            });
            if (res?.success) {
                newRooms = newRooms.concat(res.newRoom);
            } else {
                console.log('addRooms failed at Quote.tsx')
            }
        }
        const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
            draft.rooms = draft.rooms?.concat(newRooms);
        });
        //update selectedQuoteUnit
        dispatch({
            type: 'selectedQuoteUnit',
            payload: newselectedQuoteUnit
        });
        //update quoteDetail
        const newquoteDetail = produce(quoteDetail, (draft: any) => {
            const index = draft.data.findIndex((each: any) => each?.unitID === unitID)
            draft.data[index] = newselectedQuoteUnit;
        });
        dispatch({
            type: 'quoteDetail',
            payload: newquoteDetail
        });

        //set customRoomName to default
        setcustomRoomName('');
        setroomOptionCheckedList([]);
        setshowAddRoomDropdown(false);
    }
    return <div className='flex flex-col w-full h-full px-6 py-4 overflow-y-auto quote'>
        {(selectedQuoteUnit) ?
            <>
                {userRole !== 'viewer' &&
                    <div className='flex'>
                        <div className='relative w-32 mr-8 text-sm-important'>
                            <div onClick={() => setshowAddRoomDropdown(true)} className='flex w-full h-8 border border-black border-solid cursor-pointer'><div className='my-auto ml-auto mr-1'>Add Rooms</div><AiOutlineDown className='my-auto mr-auto' /></div>
                            {showAddRoomDropdown && <ClickOutsideAnElementHandler onClickedOutside={() => setshowAddRoomDropdown(false)}>
                                <div className='absolute z-50 p-4 overflow-y-auto bg-white border border-black border-solid w-96'>
                                    <div className='text-sm font-semibold font-ssp'>
                                        New Room
                                    </div>
                                    <TextInput placeholder='Enter Room Name' variant='box' className='mt-2' inputName='customRoomName' value={customRoomName} onChange={(e) => setcustomRoomName((e.target as any).value)} />
                                    <div className='mt-4 text-sm font-semibold font-ssp'>
                                        Choose an existing unit package
                                    </div>
                                    <TextInput placeholder='Search existing room packages' variant='box' className='mt-2' inputName='room package keywords' value={roomPackageKeyword} onChange={(e) => {
                                        setroomPackageKeyword((e.target as any).value);
                                        setroomOptionCheckedList([]);
                                    }}
                                    />
                                    <div className='w-full overflow-y-auto max-h-60'>
                                        {RoomOptionList?.filter(eachUnit => eachUnit?.name?.toLowerCase().includes(roomPackageKeyword.toLowerCase())).map(each =>
                                            <Checkbox className='my-2' label={each?.name} checked={roomOptionCheckedList.includes(each)} onChange={(v) => {
                                                if (v) {
                                                    setroomOptionCheckedList(state => [...state, each])
                                                } else {
                                                    setroomOptionCheckedList(state => state.filter(e => e !== each))
                                                }
                                            }} />)}
                                    </div>
                                    <div className='flex my-2'>
                                        <Button onClick={() => {
                                            setshowAddRoomDropdown(false)
                                        }} className='mr-4 w-36' variant='secondary'>Cancel</Button>
                                        <Button disabled={roomOptionCheckedList.length === 0 && customRoomName === ''} onClick={() => {
                                            addRooms();
                                        }} variant='primary' className='w-36'>Create Rooms</Button>
                                    </div>
                                </div>
                            </ClickOutsideAnElementHandler>}
                        </div>
                        {/*
                        <div className='w-60 text-sm-important'>
                            <DropdownListInput placeholder='Add Muti-Room Package' wrapperClassName='cursor-pointer' listWrapperClassName='' options={['Custom Unit', 'Studio', '1BR', '2BR', '3BR', '1BR-HOTEL']} />
                        </div>*/}
                        <div
                            onClick={() => markAll()}
                            className='my-auto ml-auto font-semibold border-b border-solid cursor-pointer text-link font-ssp border-link'>{allRentable ? 'Mark all as not rentable' : 'Mark all as rentable'}
                        </div>
                    </div>
                }
                {
                    selectedQuoteUnit?.rooms?.map((each: any) => 
                    <Room 
                    updateQuoteDetail={updateQuoteDetail} 
                    RoomOptionList={RoomOptionList} 
                    roomItemOptionsList={roomItemOptionsList} 
                    eachRoom={each}
                    getRoomOptionList={getRoomOptionList}
                     />)
                }
                {selectedQuoteUnit?.rooms?.length === 0 &&
                    <div className='m-auto'>
                        <AddUnitIcon />
                        <div className='flex text-4xl font-moret'><div className='mx-auto'>Add a Room to get started</div></div>
                    </div>
                }
            </>
            :
            <div className='m-auto'>
                <AddUnitIcon />
                <div className='flex text-4xl font-moret'><div className='mx-auto'>{quoteUnitLength === 0 ? 'Add' : 'Select'} a unit to get started</div></div>
            </div>
        }
    </div>
}

export default Quote;