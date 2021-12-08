import React, {useState} from 'react'
import './AppSideBar.scss'
import { AiOutlineLeft, AiOutlineUnorderedList } from 'react-icons/ai'
const AppSideBar = () =>{
    const [showEntendSideBar, setshowEntendSideBar] = useState(false);
    return (showEntendSideBar?  <div className={`w-96 h-full bg-error`}>

    </div> : <div className='w-auto px-4 py-4 border-r border-black border-solid'>
         <AiOutlineUnorderedList className='cursor-pointer' onClick={()=>setshowEntendSideBar(true)} />
    </div>)
}

export default AppSideBar;