import './SelectAll.scss'
import { useState } from 'react'
import { Button } from '@fulhaus/react.ui.button';
import { AiOutlineRight } from 'react-icons/ai';
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler';
import { Checkbox } from '@fulhaus/react.ui.checkbox'
import { Radio } from '@fulhaus/react.ui.radio'
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import { BsArrowLeft } from 'react-icons/bs'
const SelectAll = () => {
    const [showDropDown, setshowDropDown] = useState(false);
    const [showGroupUnitRoomMenu, setshowGroupUnitRoomMenu] = useState(true);
    const [showselectPage, setshowselectPage] = useState(false);
    const [selectPageType, setselectPageType] = useState<'ofGroup' | 'ofUnit' | 'ofRoomType' | undefined>();
    const [showAddItemPage, setshowAddItemPage] = useState(false);
    const [addItemPageType, setaddItemPageType] = useState<'ofGroup' | 'ofUnit' | 'ofRoomType' | undefined>();
    const [AddOrRemoveItem, setAddOrRemoveItem] = useState<'addItem' | 'removeItem'>('addItem');
    const [groupCheckList, setgroupCheckList] = useState<string[]>([]);
    const [unitCheckList, setunitCheckList] = useState<string[]>([]);
    const [roomTypeCheckList, setroomTypeCheckList] = useState<string[]>([]);
    const [selectedItem, setselectedItem] = useState<string | undefined>();

    const handleAddOrRemoveItem = () => {
        setshowDropDown(false)
        setshowAddItemPage(false);
        setshowGroupUnitRoomMenu(true);
    }
    return <div className='mt-4 select-all'>
        <Button onClick={() => setshowDropDown(true)} className='select-none' variant='secondary'>Select All...</Button>
        {showDropDown && <div className='fixed px-2 text-sm bg-white border border-black border-solid select-none font-ssp'>
            {/**----------------first Mene page ------------------------------------------------------------ */}
            {
                showGroupUnitRoomMenu && <ClickOutsideAnElementHandler onClickedOutside={() => setshowDropDown(false)}>
                    <div onClick={() => {
                        setshowGroupUnitRoomMenu(false);
                        setshowselectPage(true);
                        setselectPageType('ofGroup');
                    }} className='flex w-40 py-2 cursor-pointer'><div className='my-auto'>Of a group</div><AiOutlineRight className='my-auto ml-auto' /></div>
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
                        unitCheckList.length === 8 ?
                            <div onClick={() => setunitCheckList([])} className='my-1 cursor-pointer text-link'>Deselect All</div>
                            :
                            <div onClick={() => setunitCheckList(['1BRv1', '1BRv2', '1BRv3', '1BRv4', '2BRv1', '2BRv2', '3BRv1', 'Studio'])} className='my-1 cursor-pointer text-link'>Select All</div>
                    }
                    <Checkbox className='my-2' label='1BRv1' checked={unitCheckList.includes('1BRv1')} onChange={(v) => {
                        if (v) {
                            setunitCheckList(state => [...state, '1BRv1'])
                        } else {
                            setunitCheckList(state => state.filter(each => each !== '1BRv1'))
                        }
                    }} />
                    <Checkbox className='my-2' label='1BRv2' checked={unitCheckList.includes('1BRv2')} onChange={(v) => {
                        if (v) {
                            setunitCheckList(state => [...state, '1BRv2'])
                        } else {
                            setunitCheckList(state => state.filter(each => each !== '1BRv2'))
                        }
                    }} />
                    <Checkbox className='my-2' label='1BRv3' checked={unitCheckList.includes('1BRv3')} onChange={(v) => {
                        if (v) {
                            setunitCheckList(state => [...state, '1BRv3'])
                        } else {
                            setunitCheckList(state => state.filter(each => each !== '1BRv3'))
                        }
                    }} />
                    <Checkbox className='my-2' label='2BRv1' checked={unitCheckList.includes('2BRv1')} onChange={(v) => {
                        if (v) {
                            setunitCheckList(state => [...state, '2BRv1'])
                        } else {
                            setunitCheckList(state => state.filter(each => each !== '2BRv1'))
                        }
                    }} />
                    <Checkbox className='my-2' label='2BRv2' checked={unitCheckList.includes('2BRv2')} onChange={(v) => {
                        if (v) {
                            setunitCheckList(state => [...state, '2BRv2'])
                        } else {
                            setunitCheckList(state => state.filter(each => each !== '2BRv2'))
                        }
                    }} />
                    <Checkbox className='my-2' label='3BRv1' checked={unitCheckList.includes('3BRv1')} onChange={(v) => {
                        if (v) {
                            setunitCheckList(state => [...state, '3BRv1'])
                        } else {
                            setunitCheckList(state => state.filter(each => each !== '3BRv1'))
                        }
                    }} />
                    <Checkbox className='my-2' label='Studio' checked={unitCheckList.includes('Studio')} onChange={(v) => {
                        if (v) {
                            setunitCheckList(state => [...state, 'Studio'])
                        } else {
                            setunitCheckList(state => state.filter(each => each !== 'Studio'))
                        }
                    }} />
                    <div className='flex my-2'>
                        <Button onClick={() => {
                            setshowselectPage(false);
                            setshowGroupUnitRoomMenu(true);
                            setselectPageType(undefined);
                            setshowDropDown(false);
                        }} className='w-20 mr-4' variant='secondary'>Cancel</Button>
                        <Button disabled={unitCheckList.length === 0} onClick={() => {
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
                        roomTypeCheckList.length === 4 ?
                            <div onClick={() => setroomTypeCheckList([])} className='my-1 cursor-pointer text-link'>Deselect All</div>
                            :
                            <div onClick={() => setroomTypeCheckList(['Dining Room', 'BedRoom', 'Living Room', 'BathRoom'])} className='my-1 cursor-pointer text-link'>Select All</div>
                    }
                    <Checkbox className='my-2' label='Dining Room' checked={roomTypeCheckList.includes('Dining Room')} onChange={(v) => {
                        if (v) {
                            setroomTypeCheckList(state => [...state, 'Dining Room'])
                        } else {
                            setroomTypeCheckList(state => state.filter(each => each !== 'Dining Room'))
                        }
                    }} />
                    <Checkbox className='my-2' label='BedRoom' checked={roomTypeCheckList.includes('BedRoom')} onChange={(v) => {
                        if (v) {
                            setroomTypeCheckList(state => [...state, 'BedRoom'])
                        } else {
                            setroomTypeCheckList(state => state.filter(each => each !== 'BedRoom'))
                        }
                    }} />
                    <Checkbox className='my-2' label='Living Room' checked={roomTypeCheckList.includes('Living Room')} onChange={(v) => {
                        if (v) {
                            setroomTypeCheckList(state => [...state, 'Living Room'])
                        } else {
                            setroomTypeCheckList(state => state.filter(each => each !== 'Living Room'))
                        }
                    }} />
                    <Checkbox className='my-2' label='Living Room' checked={roomTypeCheckList.includes('BathRoom')} onChange={(v) => {
                        if (v) {
                            setroomTypeCheckList(state => [...state, 'BathRoom'])
                        } else {
                            setroomTypeCheckList(state => state.filter(each => each !== 'BathRoom'))
                        }
                    }} />
                    <div className='flex my-2'>
                        <Button onClick={() => {
                            setshowselectPage(false);
                            setshowGroupUnitRoomMenu(true);
                            setselectPageType(undefined);
                            setshowDropDown(false);
                        }} className='w-20 mr-4' variant='secondary'>Cancel</Button>
                        <Button disabled={roomTypeCheckList.length === 0} onClick={() => {
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
                            {addItemPageType === 'ofUnit' && `${unitCheckList.length} units selected`}
                            {addItemPageType === 'ofRoomType' && `${roomTypeCheckList.length} rooms selected`}
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
                    <DropdownListInput onSelect={(v) => setselectedItem(v)} placeholder='SELECT AN ITEM' options={['Coffee Table', 'Tablet', 'Sofa']} />
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