import './SelectAll.scss'
import apiRequest from '../../../Service/apiRequest';
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';
import { Button } from '@fulhaus/react.ui.button';
import { AiOutlineRight } from 'react-icons/ai';
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler';
import { Checkbox } from '@fulhaus/react.ui.checkbox'
import { Radio } from '@fulhaus/react.ui.radio'
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import { BsArrowLeft } from 'react-icons/bs'
import { getQuoteDetail } from '../../../redux/Actions'
import { Tappstate } from '../../../redux/reducers';

const SelectAll = () => {
    const [roomItemOptions, setroomItemOptions] = useState<{ name: string, id: string }[]>();
    const [selectedItem, setselectedItem] = useState<string | undefined>();

    const [roomTypeOptionList, setroomTypeOptionList] = useState<string[]>([]);
    const [roomTypeCheckedList, setroomTypeCheckList] = useState<string[]>([]);

    const [unitCheckedList, setunitCheckedList] = useState<string[]>([]);

    const [showDropDown, setshowDropDown] = useState(false);
    const [showGroupUnitRoomMenu, setshowGroupUnitRoomMenu] = useState(true);
    const [showselectPage, setshowselectPage] = useState(false);
    const [selectPageType, setselectPageType] = useState<'ofGroup' | 'ofUnit' | 'ofRoomType' | undefined>();
    const [showAddItemPage, setshowAddItemPage] = useState(false);
    const [addItemPageType, setaddItemPageType] = useState<'ofGroup' | 'ofUnit' | 'ofRoomType' | undefined>();
    const [AddOrRemoveItem, setAddOrRemoveItem] = useState<'addItem' | 'removeItem'>('addItem');
    const [groupCheckList, setgroupCheckList] = useState<string[]>([]);

    const dispatch = useDispatch();
    const unitList = useSelector((state: Tappstate) => state.quoteDetail)?.data;
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteID = useSelector((state: Tappstate) => state.quoteDetail)?.quoteID;
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail);
    const unitOptionList = quoteDetail?.data?.map((each: any) => each.name);
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit)
    const selectedProject = useSelector((state: Tappstate) => state.selectedProject);
    useEffect(
        () => {
            //if item options is not provided
            const getRoomItemOptions = async () => {
                const res = await apiRequest({
                    url: '/api/products-service/categories',
                    method: 'GET'
                })
                if (res?.success) {
                    setroomItemOptions(res.data.map((each: any) => {
                        return {
                            name: each.name,
                            id: each._id
                        }
                    }))
                }
            }

            const getRoomOptionList = async () => {
                if (currentOrgID) {
                    const res = await apiRequest(
                        {
                            url: `/api/fhapp-service/packages/room/${currentOrgID}`,
                            method: 'GET'
                        }
                    )
                    if (res?.success) {
                        setroomTypeOptionList(res?.roomPackages?.map((each: any) => each.name))
                    } else {
                        console.log('getRoomOptionList failed at SelectAll.tsx')
                    }
                }
            }
            if (!roomItemOptions) {
                getRoomItemOptions();
            }
            if (roomTypeOptionList.length === 0) {
                getRoomOptionList();
            }
        }, [currentOrgID]
    )

    const handleAddOrRemoveItem = async () => {
        if (addItemPageType === 'ofUnit') {
            if (AddOrRemoveItem === 'addItem') {
                await addItemToUnit()
            }
            if(AddOrRemoveItem === 'removeItem'){
                await removeItemFromUnit();
            }
        }
        setshowDropDown(false)
        setshowAddItemPage(false);
        setshowGroupUnitRoomMenu(true);
    }

    const addItemToUnit = async () => {
        const item = roomItemOptions?.filter(each => each.name === selectedItem)[0];
        let selectedUnitList = quoteDetail?.data.filter((eachUnit: any) => unitCheckedList.includes(eachUnit.name))
        for (let unit of selectedUnitList) {
            //loop rooms
            for (let room of unit.rooms) {
                //if categories does not have the item
                if (room?.categories?.filter((eachCategory: any) => eachCategory.name === item?.name)?.length === 0) {
                    let newCategories = [...room?.categories, {
                        qty: 1,
                        rentable: false,
                        name: item?.name,
                        budget: 0,
                        categoryID: item?.id
                    }]
                    await updateCategories({
                        currentOrgID,
                        quoteID,
                        unitID: unit.unitID,
                        roomID: room.roomID,
                        categories: newCategories
                    })
                }
            }
        }
        SyncRemoteQuoteAndSelectedQuoteUnit();
    }

    const removeItemFromUnit = async () => {
        const item = roomItemOptions?.filter(each => each.name === selectedItem)[0];
        let selectedUnitList = quoteDetail?.data.filter((eachUnit: any) => unitCheckedList.includes(eachUnit.name))
        for (let unit of selectedUnitList) {
            //loop rooms
            for (let room of unit.rooms) {
                let newCategories = room?.categories.filter((eachCategory: any) => eachCategory.name !== item?.name)
                await updateCategories({
                    currentOrgID,
                    quoteID,
                    unitID: unit.unitID,
                    roomID: room.roomID,
                    categories: newCategories
                })
            }
        }
        SyncRemoteQuoteAndSelectedQuoteUnit();
    }

    const SyncRemoteQuoteAndSelectedQuoteUnit = () => {
        //if it is a project, then get the quote based on projectID
        if (selectedProject?.type === 'project' && currentOrgID) {
            dispatch(getQuoteDetail({ organizationID: currentOrgID, projectOrQuoteID: selectedProject._id, idType: 'project' }))
        }
        //get quote detail when initail rendering
        if (selectedProject?.quoteID && currentOrgID && selectedProject?.type === 'quote') {
            dispatch(getQuoteDetail({ organizationID: currentOrgID, projectOrQuoteID: selectedProject.quoteID, idType: 'quoteID' }))
        }
        dispatch({
            type: 'selectedQuoteUnit',
            payload: undefined
        });
    }

    const updateCategories = async ({
        currentOrgID,
        quoteID,
        unitID,
        roomID,
        categories,
    }: {
        currentOrgID: string | undefined,
        quoteID: string,
        unitID: string,
        roomID: string,
        categories: any
    }) => {
        const res = await apiRequest({
            url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${unitID}/${roomID}`,
            body: {
                categories
            },
            method: 'PATCH'
        })
        if (!res?.success) {
            console.log('updateCategories failed at SelectAll.tsx')
        }
    }
    return <div className='mt-4 select-all'>
        <Button onClick={() => setshowDropDown(true)} className='select-none bg-cream-important' variant='secondary'>Select All...</Button>
        {showDropDown && <div className='fixed z-50 px-2 text-sm bg-white border border-black border-solid select-none font-ssp'>
            {/**----------------first Mene page ------------------------------------------------------------ */}
            {
                showGroupUnitRoomMenu && <ClickOutsideAnElementHandler onClickedOutside={() => setshowDropDown(false)}>
                    {/*
                    <div onClick={() => {
                        setshowGroupUnitRoomMenu(false);
                        setshowselectPage(true);
                        setselectPageType('ofGroup');
                    }} className='flex w-40 py-2 cursor-pointer'><div className='my-auto'>Of a group</div><AiOutlineRight className='my-auto ml-auto' /></div> 
                    */}
                    <div onClick={() => {
                        setshowGroupUnitRoomMenu(false);
                        setshowselectPage(true);
                        setselectPageType('ofUnit');
                    }} className='flex w-40 py-2 cursor-pointer'><div className='my-auto'>Of a Unit</div><AiOutlineRight className='my-auto ml-auto' /></div>
                    <div onClick={() => {
                        setshowGroupUnitRoomMenu(false);
                        setshowselectPage(true);
                        setselectPageType('ofRoomType');
                    }} className='flex w-40 py-2 text-sm cursor-pointer'><div className='my-auto'>Of a Room Type</div><AiOutlineRight className='my-auto ml-auto' /></div>
                </ClickOutsideAnElementHandler>
            }
            {/**----------------Second select specific page ------------------------------------------------------------ */}
            {
                showselectPage && selectPageType === 'ofGroup' && <>
                    <div className='flex my-2'><BsArrowLeft onClick={() => {
                        setshowselectPage(false);
                        setshowGroupUnitRoomMenu(true);
                        setselectPageType(undefined)
                    }} className='my-auto mr-4 cursor-pointer' /><div className='my-auto'>Of a group</div></div>
                    {
                        groupCheckList.length === 4 ?
                            <div onClick={() => setgroupCheckList([])} className='my-1 cursor-pointer text-link'>Deselect All</div>
                            :
                            <div onClick={() => setgroupCheckList(['Group-1BR', 'Group-2BR', 'Group-3BR', 'Group-Studio'])} className='my-1 cursor-pointer text-link'>Select All</div>
                    }
                    <Checkbox className='my-2' label='Group-1BR' checked={groupCheckList.includes('Group-1BR')} onChange={(v) => {
                        if (v) {
                            setgroupCheckList(state => [...state, 'Group-1BR'])
                        } else {
                            setgroupCheckList(state => state.filter(each => each !== 'Group-1BR'))
                        }
                    }} />
                    <Checkbox className='my-2' label='Group-2BR' checked={groupCheckList.includes('Group-2BR')} onChange={(v) => {
                        if (v) {
                            setgroupCheckList(state => [...state, 'Group-2BR'])
                        } else {
                            setgroupCheckList(state => state.filter(each => each !== 'Group-2BR'))
                        }
                    }} />
                    <Checkbox className='my-2' label='Group-3BR' checked={groupCheckList.includes('Group-3BR')} onChange={(v) => {
                        if (v) {
                            setgroupCheckList(state => [...state, 'Group-3BR'])
                        } else {
                            setgroupCheckList(state => state.filter(each => each !== 'Group-3BR'))
                        }
                    }} />
                    <Checkbox className='my-2' label='Group-Studio' checked={groupCheckList.includes('Group-Studio')} onChange={(v) => {
                        if (v) {
                            setgroupCheckList(state => [...state, 'Group-Studio'])
                        } else {
                            setgroupCheckList(state => state.filter(each => each !== 'Group-Studio'))
                        }
                    }} />
                    <div className='flex my-2'>
                        <Button onClick={() => {
                            setshowselectPage(false);
                            setshowGroupUnitRoomMenu(true);
                            setselectPageType(undefined);
                            setshowDropDown(false);
                        }} className='w-20 mr-4' variant='secondary'>Cancel</Button>
                        <Button disabled={groupCheckList.length === 0} onClick={() => {
                            setshowselectPage(false);
                            setaddItemPageType('ofGroup');
                            setshowAddItemPage(true);
                        }} variant='primary' className='w-20'>Next</Button>
                    </div>
                </>
            }
            {
                showselectPage && selectPageType === 'ofUnit' && <>
                    <div className='flex my-2'><BsArrowLeft onClick={() => {
                        setshowselectPage(false);
                        setshowGroupUnitRoomMenu(true);
                        setselectPageType(undefined)
                    }} className='my-auto mr-4 cursor-pointer' /><div className='my-auto'>Of a Unit</div></div>
                    {
                        unitCheckedList.length === unitOptionList.length ?
                            <div onClick={() => setunitCheckedList([])} className='my-1 cursor-pointer text-link'>Deselect All</div>
                            :
                            <div onClick={() => setunitCheckedList(unitOptionList)} className='my-1 cursor-pointer text-link'>Select All</div>
                    }
                    {unitOptionList.map((each: any) =>
                        <Checkbox className='my-2' label={each} checked={unitCheckedList.includes(each)} onChange={(v) => {
                            if (v) {
                                setunitCheckedList(state => [...state, each])
                            } else {
                                setunitCheckedList(state => state.filter(e => e !== each))
                            }
                        }} />)}
                    <div className='flex my-2'>
                        <Button onClick={() => {
                            setshowselectPage(false);
                            setshowGroupUnitRoomMenu(true);
                            setselectPageType(undefined);
                            setshowDropDown(false);
                        }} className='w-20 mr-4' variant='secondary'>Cancel</Button>
                        <Button disabled={unitCheckedList.length === 0} onClick={() => {
                            setshowselectPage(false);
                            setaddItemPageType('ofUnit');
                            setshowAddItemPage(true);
                        }} variant='primary' className='w-20'>Next</Button>
                    </div>
                </>
            }
            {
                showselectPage && selectPageType === 'ofRoomType' && <>
                    <div className='flex my-2'><BsArrowLeft onClick={() => {
                        setshowselectPage(false);
                        setshowGroupUnitRoomMenu(true);
                        setselectPageType(undefined)
                    }} className='my-auto mr-4 cursor-pointer' /><div className='my-auto'>Of a Room Type</div></div>
                    {
                        roomTypeCheckedList.length === roomTypeOptionList.length ?
                            <div onClick={() => setroomTypeCheckList([])} className='my-1 cursor-pointer text-link'>Deselect All</div>
                            :
                            <div onClick={() => setroomTypeCheckList(roomTypeOptionList)} className='my-1 cursor-pointer text-link'>Select All</div>
                    }
                    {roomTypeOptionList.map(each =>
                        <Checkbox className='my-2' label={each} checked={roomTypeCheckedList.includes(each)} onChange={(v) => {
                            if (v) {
                                setroomTypeCheckList(state => [...state, each])
                            } else {
                                setroomTypeCheckList(state => state.filter(e => e !== each))
                            }
                        }} />)
                    }
                    <div className='flex my-2'>
                        <Button onClick={() => {
                            setshowselectPage(false);
                            setshowGroupUnitRoomMenu(true);
                            setselectPageType(undefined);
                            setshowDropDown(false);
                        }} className='w-20 mr-4' variant='secondary'>Cancel</Button>
                        <Button disabled={roomTypeCheckedList.length === 0} onClick={() => {
                            setshowselectPage(false);
                            setaddItemPageType('ofRoomType');
                            setshowAddItemPage(true);
                        }} variant='primary' className='w-20'>Next</Button>
                    </div>
                </>
            }
            {/**----------------third page add item for unit or group or type ------------------------------------------------------ */}
            {
                showAddItemPage && <>
                    <div className='flex my-2'><BsArrowLeft onClick={() => {
                        setshowAddItemPage(false);
                        setshowselectPage(true);
                    }} className='my-auto mr-4 cursor-pointer' /><div className='my-auto'>
                            {addItemPageType === 'ofGroup' && `${groupCheckList.length} groups selected`}
                            {addItemPageType === 'ofUnit' && `${unitCheckedList.length} units selected`}
                            {addItemPageType === 'ofRoomType' && `${roomTypeCheckedList.length} rooms selected`}
                        </div></div>
                    <div className='flex my-4'>
                        {addItemPageType === 'ofGroup' && <>
                            <Radio className='mr-4' label='Add Item' checked={AddOrRemoveItem === 'addItem'} onChange={() => setAddOrRemoveItem('addItem')} />
                            <Radio label='Remove Item' checked={AddOrRemoveItem === 'removeItem'} onChange={() => setAddOrRemoveItem('removeItem')} />
                        </>}
                        {addItemPageType === 'ofUnit' && <>
                            <Radio className='mr-4' label='Add Item' checked={AddOrRemoveItem === 'addItem'} onChange={() => setAddOrRemoveItem('addItem')} />
                            <Radio label='Remove Item' checked={AddOrRemoveItem === 'removeItem'} onChange={() => setAddOrRemoveItem('removeItem')} />
                        </>}
                        {addItemPageType === 'ofRoomType' && <>
                            <Radio className='mr-4' label='Add Item' checked={AddOrRemoveItem === 'addItem'} onChange={() => setAddOrRemoveItem('addItem')} />
                            <Radio label='Remove Item' checked={AddOrRemoveItem === 'removeItem'} onChange={() => setAddOrRemoveItem('removeItem')} />
                        </>}
                    </div>
                    <div>item</div>
                    <DropdownListInput onSelect={(v) => setselectedItem(v)} placeholder='SELECT AN ITEM' options={roomItemOptions ? roomItemOptions.map(each => each.name) : []} />
                    <div className='flex mt-4 mb-2'>
                        <Button onClick={() => {
                            setshowDropDown(false)
                            setshowAddItemPage(false);
                            setshowGroupUnitRoomMenu(true);
                        }} className='w-24 mr-4' variant='secondary'>Cancel</Button>
                        <Button onClick={() => {
                            handleAddOrRemoveItem()
                        }} variant='primary' className='w-24'>
                            {
                                AddOrRemoveItem === 'addItem' ? 'Add' : 'Remove'
                            }
                        </Button>
                    </div>
                </>
            }
        </div>}
    </div>
}

export default SelectAll;