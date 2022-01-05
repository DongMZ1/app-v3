import React, { useState } from 'react'
import './AppSideBar.scss'
import SelectAll from './AppSideBarComponents/SelectAll';
import { AiOutlineUnorderedList, AiOutlineLeft } from 'react-icons/ai';
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
const AppSideBar = () => {
    const [showEntendSideBar, setshowEntendSideBar] = useState(false);
    return (showEntendSideBar ? <div className={`w-80 h-full app-side-bar p-4 border-black border-r border-solid border-t`}>
        <div className='flex'>
            <div className='my-auto mr-4 text-sm font-ssp'>add:</div>
            <div className='w-16 text-sm-important dropdown-list-input-box-display-none'>
                <DropdownListInput prefixIcon={<div className='flex'><div className='m-auto'>Unit</div></div>} wrapperClassName='cursor-pointer' listWrapperClassName='width-52-important' options={['Custom Unit', 'Studio', '1BR', '2BR', '3BR', '1BR-HOTEL']} />
            </div>
            <div className='w-20 ml-4 text-sm-important dropdown-list-input-box-display-none'>
                <DropdownListInput prefixIcon={<div className='flex'><div className='m-auto'>Group</div></div>} wrapperClassName='cursor-pointer' listWrapperClassName='width-52-important' options={['Custom Unit', 'Studio', '1BR', '2BR', '3BR', '1BR-HOTEL']} />
            </div>
            <div className='my-auto ml-4 cursor-pointer' onClick={()=>setshowEntendSideBar(false)}>
                <AiOutlineLeft size={22} />
            </div>
        </div>
        <SelectAll />
        <div className='mt-2 text-sm font-ssp'>Total Units: 1</div>
    </div> : <div className='w-auto px-4 py-4 border-r border-black border-solid'>
        <AiOutlineUnorderedList className='cursor-pointer' onClick={() => setshowEntendSideBar(true)} />
    </div>)
}

export default AppSideBar;