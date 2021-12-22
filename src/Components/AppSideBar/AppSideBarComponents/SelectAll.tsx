import './SelectAll.scss'
import { useState } from 'react'
import { Button } from '@fulhaus/react.ui.button';
import { AiOutlineRight } from 'react-icons/ai';
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler';
import {Checkbox} from '@fulhaus/react.ui.checkbox'
import { BsArrowLeft } from 'react-icons/bs'
const SelectAll = () => {
    const [showDropDown, setshowDropDown] = useState(false);
    const [showGroupUnitRoomMenu, setshowGroupUnitRoomMenu] = useState(true);
    const [showselectPage, setshowselectPage] = useState(false);
    const [selectPageType, setselectPageType] = useState<'ofGroup' | 'ofUnit' | 'ofRoomType' | undefined>()
    const [groupCheckList, setgroupCheckList] = useState<string[]>([])
    return <div className='mt-4 select-all'>
        <Button onClick={() => setshowDropDown(true)} className='select-none' variant='secondary'>Select All...</Button>
        {showDropDown && <div className='fixed px-2 text-sm bg-white border border-black border-solid select-none font-ssp'>
            {/**----------------first Mene page ------------------------------------------------------------ */}
            {
                showGroupUnitRoomMenu && <ClickOutsideAnElementHandler onClickedOutside={()=> setshowDropDown(false)}>
                    <div onClick={() =>{
                        setshowGroupUnitRoomMenu(false);
                        setshowselectPage(true);
                        setselectPageType('ofGroup');
                    }} className='flex w-40 py-1 cursor-pointer'><div className='my-auto'>Of a group</div><AiOutlineRight className='my-auto ml-auto' /></div>
                    <div onClick={() =>{
                        setshowGroupUnitRoomMenu(false);
                        setshowselectPage(true);
                        setselectPageType('ofUnit');
                    }} className='flex w-40 py-1 cursor-pointer'><div className='my-auto'>Of a Unit</div><AiOutlineRight className='my-auto ml-auto' /></div>
                    <div onClick={() =>{
                        setshowGroupUnitRoomMenu(false);
                        setshowselectPage(true);
                        setselectPageType('ofRoomType');
                    }} className='flex w-40 py-1 text-sm cursor-pointer'><div className='my-auto'>Of a Room Type</div><AiOutlineRight className='my-auto ml-auto' /></div>
                </ClickOutsideAnElementHandler>
            }
            {/**----------------Second select specific page ------------------------------------------------------------ */}
            {
                showselectPage && selectPageType === 'ofGroup' && <>
                    <div className='flex my-1'><BsArrowLeft onClick={() =>{
                        setshowselectPage(false);
                        setshowGroupUnitRoomMenu(true);
                        setselectPageType(undefined)
                    }} className='my-auto mr-4 cursor-pointer' /><div className='my-auto'>Of a group</div></div>
                    {
                        true? <div className='my-1 cursor-pointer text-link'>Select All</div> : <div className='my-1 cursor-pointer text-link'>Deselect All</div>
                    }
                    <Checkbox className='my-1' label='Group-1BR' checked={groupCheckList.includes('Group-1BR')} onChange={(v)=>{
                        if(v){
                            setgroupCheckList(state => [...state, 'Group-1BR'])
                        }else{
                            setgroupCheckList(state => state.filter(each => each!=='Group-1BR'))
                        }
                    }} />
                </>
            }
            {
                showselectPage && selectPageType === 'ofUnit' && <>
                    <div className='flex my-1'><BsArrowLeft onClick={() =>{
                        setshowselectPage(false);
                        setshowGroupUnitRoomMenu(true);
                        setselectPageType(undefined)
                    }} className='my-auto mr-4 cursor-pointer' /><div className='my-auto'>Of a Unit</div></div>
                    {
                        true? <div className='my-1 cursor-pointer text-link'>Select All</div> : <div className='my-1 cursor-pointer text-link'>Deselect All</div>
                    }
                </>
            }
            {
                showselectPage && selectPageType === 'ofRoomType' && <>
                    <div className='flex my-1'><BsArrowLeft onClick={() =>{
                        setshowselectPage(false);
                        setshowGroupUnitRoomMenu(true);
                        setselectPageType(undefined)
                    }} className='my-auto mr-4 cursor-pointer' /><div className='my-auto'>Of a Room Type</div></div>
                    {
                        true? <div className='my-1 cursor-pointer text-link'>Select All</div> : <div className='my-1 cursor-pointer text-link'>Deselect All</div>
                    }
                </>
            }
        </div>}
    </div>
}

export default SelectAll;