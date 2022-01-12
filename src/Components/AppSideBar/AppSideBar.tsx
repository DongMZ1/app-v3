import React, { useState } from 'react'
import './AppSideBar.scss'

import SelectAll from './AppSideBarComponents/SelectAll';
import EachUnit from './AppSideBarComponents/EachUnit';

import { useSelector, useDispatch } from 'react-redux';
import { Tappstate } from '../../redux/reducers';
import { getQuoteDetail } from '../../redux/Actions'
import apiRequest from '../../Service/apiRequest';
import { AiOutlineUnorderedList, AiOutlineLeft } from 'react-icons/ai';
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
const AppSideBar = () => {
    const userRole = useSelector((state: Tappstate) => state?.selectedProject)?.userRole;
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteDetail = useSelector((state: Tappstate) => state?.quoteDetail);
    const dispatch = useDispatch();
    const [showEntendSideBar, setshowEntendSideBar] = useState(false);

    const totalUnitCount = quoteDetail?.data?.map((each:any) => each.count).reduce((a :any , b:any) => a + b);
    const createUnit = async (v: string) => {
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/quote/${currentOrgID}/${quoteDetail?.quoteID}`,
                body: {
                    unitType: v
                },
                method: 'POST'
            }
        )
        if (res?.success) {
            if (quoteDetail?.quoteID && currentOrgID) {
                dispatch(getQuoteDetail({ organizationID: currentOrgID, quoteID: quoteDetail?.quoteID }))
            }
        } else {
            console.log(res?.message)
        }
    }
    return (showEntendSideBar ? <div className={`w-96 h-full flex flex-col app-side-bar py-4 border-black border-r border-solid border-t`}>
        {userRole !== 'viewer' && <>
            <div className='flex px-4'>
                <div className='my-auto mr-4 text-sm font-ssp'>add:</div>
                <div className='w-16 text-sm-important dropdown-list-input-box-display-none'>
                    <DropdownListInput prefixIcon={<div className='flex'><div className='m-auto'>Unit</div></div>} wrapperClassName='cursor-pointer' listWrapperClassName='width-52-important' onSelect={(v) => createUnit(v)} options={['custom unit', 'studio', '1BR', '2BR', '3BR', '1BR-HOTEL']} />
                </div>
                <div className='w-20 ml-4 text-sm-important dropdown-list-input-box-display-none'>
                    <DropdownListInput prefixIcon={<div className='flex'><div className='m-auto'>Group</div></div>} wrapperClassName='cursor-pointer' listWrapperClassName='width-52-important' options={['Custom Unit', 'Studio', '1BR', '2BR', '3BR', '1BR-HOTEL']} />
                </div>
                <div className='my-auto ml-4 cursor-pointer' onClick={() => setshowEntendSideBar(false)}>
                    <AiOutlineLeft size={22} />
                </div>
            </div>
            <div className='px-4'><SelectAll /></div>
            <div className='px-4 mt-2 text-sm font-ssp'>Total Units: {totalUnitCount}</div>
            <div className='w-full h-full px-4 overflow-y-auto'>
            {
              quoteDetail?.data?.map((each: any) => <EachUnit eachUnit={each} />)
            }
            </div>
        </>}
    </div> : <div className='w-auto px-4 py-4 border-r border-black border-solid'>
        <AiOutlineUnorderedList className='cursor-pointer' onClick={() => setshowEntendSideBar(true)} />
    </div>)
}

export default AppSideBar;