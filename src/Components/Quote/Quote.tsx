import { useState, useEffect, useCallback } from 'react'
import './Quote.scss'
import { ReactComponent as AddUnitIcon } from "../../styles/images/add-a-unit-to-get-start.svg";
import Room from './QuoteComponents/Room';
import { TextInput } from '@fulhaus/react.ui.text-input';
import { Checkbox } from '@fulhaus/react.ui.checkbox'
import { Button } from '@fulhaus/react.ui.button'
import { AiOutlineDown } from 'react-icons/ai';
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler';
import { FiEdit2 } from 'react-icons/fi'
import { ImCross } from 'react-icons/im'
import produce from 'immer'
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { Tappstate } from '../../redux/reducers';
import { getQuoteDetailAndUpdateSelectedUnit } from '../../redux/Actions'
import { ActionModal } from '@fulhaus/react.ui.action-modal';
import { RiDeleteBin5Line } from 'react-icons/ri'
import { showMessageAction } from '../../redux/Actions'
import apiRequest from '../../Service/apiRequest';
import debounce from 'lodash.debounce';

const Quote = () => {
    //add room and add room packages list share the same name and ID
    const [RoomOptionList, setRoomOptionList] = useState<{ name: string, id: string, categories: any[], createdBy: string }[]>([]);
    const [selectedRoomOptionToDelete, setselectedRoomOptionToDelete] = useState<any>(undefined);
    const [showSelectedRoomOptionToDelete, setshowSelectedRoomOptionToDelete] = useState(false);

    const [roomItemOptionsList, setroomItemOptionsList] = useState<{ name: string, id: string }[]>();
    const [showAddRoomDropdown, setshowAddRoomDropdown] = useState(false);
    const [customRoomName, setcustomRoomName] = useState('');
    const [roomOptionCheckedList, setroomOptionCheckedList] = useState<{
        name: string;
        id: string;
        categories: any[];
        createdBy: string;
    }[]>([]);
    const [roomPackageKeyword, setroomPackageKeyword] = useState('')
    const [eachUnitSetUpFeeEditable, seteachUnitSetUpFeeEditable] = useState(false);

    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole;
    const selectedProject = useSelector((state: Tappstate) => state.selectedProject)
    const quoteUnitLength = useSelector((state: Tappstate) => state.quoteDetail)?.data?.length;
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail)
    const quoteID = useSelector((state: Tappstate) => state?.quoteDetail)?._id;
    const unitID = useSelector((state: Tappstate) => state.selectedQuoteUnit)?.unitID;
    const projectID = useSelector((state: Tappstate) => state.selectedProject)?._id;
    const fullName = useSelector((state: Tappstate) => state?.userInfo?.fullName);
    const dispatch = useDispatch();
    const allRentable = !(selectedQuoteUnit?.rooms as any[])?.some(eachRoom => (eachRoom?.categories as any[])?.some(eachCategory => !eachCategory.rentable))

    useEffect(
        () => {
            //get the room option list on first render
            getRoomOptionList();
        }, [currentOrgID]
    )
    useEffect(
        () => {
            if (!roomItemOptionsList) {
                getRoomItemOptionsList();
            }
        }, []
    )

    const getRoomItemOptionsList = async () => {
        const res = await apiRequest({
            url: '/api/products-service/categories',
            method: 'GET'
        })
        if (res?.success) {
            setroomItemOptionsList(res.data.map((each: any) => { return { name: each.name, id: each._id } }))
        }
    }

    //this is for room options and add room package
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
                        id: each._id,
                        createdBy: each.createdBy,
                        categories: each?.categories?.map((each: any) => {
                            return {
                                budget: each.budget,
                                categoryID: each.categoryID,
                                name: each.name,
                                qty: each.qty,
                                rentable: each.rentable
                            }
                        })
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
                    url: `/api/fhapp-service/quote/${currentOrgID}/${selectedProject?._id}/${quoteID}/${unitID}/${eachRoom.roomID}`,
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
        let allRoomsNames : any = roomOptionCheckedList;
        if (customRoomName) {
            allRoomsNames = allRoomsNames.concat({ name: customRoomName, id: null});
        }
        for (let eachRoom of allRoomsNames) {
            const res = await apiRequest({
                url: `/api/fhapp-service/quote/${currentOrgID}/${selectedProject?._id}/${quoteID}/${unitID}`,
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

    const changeSetUpFee = (v: number) => {
        if (Number(v) < 999999) {
            const newSelectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
                draft.setupFee = v;
            })
            debounceChangeSetFeeRemote(v);
            dispatch({
                type: 'selectedQuoteUnit',
                payload: newSelectedQuoteUnit
            })
        }
    }

    const changeSetFeeRemote = async (v: any) => {
        dispatch({
            type: 'appLoader',
            payload: true
        });
        const res = await apiRequest({
            url: `/api/fhapp-service/quote/${currentOrgID}/${selectedProject?._id}/${quoteID}/${unitID}`,
            method: 'PATCH',
            body: {
                setupFee: Number(v)
            }
        })
        if (res.success) {
            dispatch(getQuoteDetailAndUpdateSelectedUnit({
                organizationID: currentOrgID ? currentOrgID : '',
                projectID,
                quoteID: quoteID,
                selectedQuoteUnitID: selectedQuoteUnit?.unitID
            }))
        } else {
            dispatch({
                type: 'appLoader',
                payload: false
            });
        }
    }

    const debounceChangeSetFeeRemote = useCallback(debounce((v: any) => changeSetFeeRemote(v), 500), [currentOrgID, selectedProject?._id, quoteID, unitID]);

    const deleteRoomPackage = async () => {
        const res = await apiRequest({
            url: `/api/fhapp-service/package/room/${currentOrgID}/${selectedRoomOptionToDelete?.id}`,
            method: 'DELETE'
        });
        if (res?.success) {
            await getRoomOptionList();
            setshowSelectedRoomOptionToDelete(false);
        } else {
            dispatch(showMessageAction(true, res?.message));
        }
    }

    return <>
        <ActionModal modalClassName='font-moret' showModal={showSelectedRoomOptionToDelete} message={`Delete Unit Package => ${selectedRoomOptionToDelete?.name}`} subText={`Are you sure you want to permanently delete unit package ${selectedRoomOptionToDelete?.name} ?`} onCancel={() => setshowSelectedRoomOptionToDelete(false)} submitButtonLabel={'Delete'} cancelButtonLabel={'Cancel'} onSubmit={() => deleteRoomPackage()} />
        <div className='flex flex-col w-full h-full px-6 py-4 overflow-y-auto quote'>
            {(selectedQuoteUnit) ?
                <>
                    {userRole !== 'viewer' && (!quoteDetail?.approved) &&
                        <div className='flex'>
                            <div className='relative w-32 mr-8 text-sm-important'>
                                <div onClick={() => setshowAddRoomDropdown(true)} className='flex w-full h-8 border border-black border-solid cursor-pointer hover:bg-black hover:border-transparent hover:text-white'>
                                    <div className='my-auto ml-auto mr-1'>Add Rooms</div><AiOutlineDown className='my-auto mr-auto' />
                                </div>
                                <CSSTransition in={showAddRoomDropdown} noStyle timeout={300} unmountOnExit classNames='height-800px-animation'>
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
                                        }}
                                        />
                                        <div className='w-full overflow-y-auto max-h-60'>
                                            {[...roomOptionCheckedList, ...RoomOptionList?.filter(eachUnit => eachUnit?.name?.toLowerCase().includes(roomPackageKeyword.toLowerCase())).filter(each => !roomOptionCheckedList.includes(each))]
                                            .sort((a, b) => a.name.localeCompare(b.name)).map(each =>
                                                <div className='flex my-2'>
                                                    <Checkbox label={each?.name} checked={roomOptionCheckedList.includes(each)} onChange={(v) => {
                                                        if (v) {
                                                            setroomOptionCheckedList(state => [...state, each])
                                                        } else {
                                                            setroomOptionCheckedList(state => state.filter(e => e !== each))
                                                        }
                                                    }} />
                                                    {(userRole === 'admin' || userRole === 'owner') && (fullName === each.createdBy) && <RiDeleteBin5Line
                                                        onClick={() => {
                                                            setselectedRoomOptionToDelete(each);
                                                            setshowSelectedRoomOptionToDelete(true);
                                                        }}
                                                        className='my-auto ml-auto mr-4 cursor-pointer' color='red' />}
                                                </div>
                                            )}
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
                                </CSSTransition>
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
                    <div className='flex px-4 py-3 mt-4 bg-white border border-black border-solid'>
                        <div className='my-auto text-xl font-moret'>Set up Fee for <b>{selectedQuoteUnit?.name}</b></div>
                        {eachUnitSetUpFeeEditable ?
                            <>
                                <TextInput type='number' prefix={<small>$</small>} variant='box' inputName='setup fee for each unit' className='w-24 h-10 ml-auto mr-4' value={selectedQuoteUnit?.setupFee} onChange={(e) => {
                                    changeSetUpFee((e.target as any).value)
                                }} />
                                <ImCross size={12} className='my-auto cursor-pointer' onClick={() => seteachUnitSetUpFeeEditable(false)} />
                            </>
                            :
                            <>
                                <div className='my-auto ml-auto mr-4 font-ssp'>${Number(selectedQuoteUnit?.setupFee).toFixed(2)}</div>
                                {userRole !== 'viewer' && (!quoteDetail?.approved) &&
                                    <FiEdit2 size={15} onClick={() => seteachUnitSetUpFeeEditable(true)} className='my-auto cursor-pointer' />
                                }
                            </>
                        }
                    </div>
                    {
                        selectedQuoteUnit?.rooms?.map((each: any, key: number) =>
                            <div key={key}>
                                <Room
                                    setselectedRoomOptionToDelete={setselectedRoomOptionToDelete}
                                    setshowSelectedRoomOptionToDelete={setshowSelectedRoomOptionToDelete}
                                    updateQuoteDetail={updateQuoteDetail}
                                    RoomOptionList={RoomOptionList}
                                    roomItemOptionsList={roomItemOptionsList}
                                    eachRoom={each}
                                    getRoomOptionList={getRoomOptionList}
                                />
                            </div>)
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
        </div >
    </>
}

export default Quote;