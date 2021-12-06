//for scss, please refer Home.scss
import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import { ActionModal } from "@fulhaus/react.ui.action-modal";

type EachProjectQuoteDesignRowProps = {
    name: string,
    projectID: string,
    type: 'design' | 'project' | 'quote',
    lastUpdated: string,
    lastEditby: string,
    createdOn: string,
    createdBy: string,
    totalUnits?: number | string,
    showInvitePeople?: () => void,
    setSelectedProjectToInvite?: (object: { name: string, id: string }) => void
}
const EachProjectQuoteDesignRow = ({ name, projectID, type, lastUpdated, lastEditby, createdOn, createdBy, totalUnits, showInvitePeople, setSelectedProjectToInvite }: EachProjectQuoteDesignRowProps) => {
    const history = useHistory();
    const [showRenameProject, setshowRenameProject] = useState(false);
    const [showConfirmDeleteModal, setshowConfirmDeleteModal] = useState(false);
    let optionList = [''];
    let linkURL = '';
    if (type === 'design') {
        optionList = ['Duplicate Design', 'Rename Design', 'Share Design', 'Delete Design'];
        linkURL = `/design-only?id=${projectID}`
    }
    if (type === 'quote') {
        optionList = ['Duplicate Quote', 'Rename Quote', 'Share Quote', 'Delete Quote'];
        linkURL = `/quote-only?id=${projectID}`
    }
    if (type === 'project') {
        optionList = ['Duplicate Project', 'Rename Project', 'Share Project', 'Delete Project'];
        linkURL = `/project/quote`
    }

    const handleDropDown = (v: string) => {
        switch (v) {
            case 'Duplicate Project':
            case 'Duplicate Quote':
            case 'Duplicate Design':
                break;
            case 'Rename Project':
            case 'Rename Quote':
            case 'Rename Design':
                setshowRenameProject(true)
                break;
            case 'Share Design':
            case 'Share Quote':
            case 'Share Project':
                if (setSelectedProjectToInvite) {
                    setSelectedProjectToInvite({
                        name,
                        id: projectID
                    })
                }
                if (showInvitePeople) { showInvitePeople(); }
                break;
            case 'Delete Project':
            case 'Delete Quote':
            case 'Delete Design':
                setshowConfirmDeleteModal(true);
                break;
        }
    }
    
    return <> <div className='flex text-sm border border-black border-solid font-ssp'>
        <div onClick={() => history.push(linkURL)} className='flex w-3/12 pl-4 cursor-pointer'>
            {showRenameProject ?
                <input onKeyDown={e => {
                    if (e.code === 'Enter') {
                        setshowRenameProject(false);
                    }
                }} className='px-2 my-auto' type='text' onClick={e => e.stopPropagation()} onBlur={() => setshowRenameProject(false)} />
                :
                <div className='my-auto'>{name}</div>
            }
        </div>
        <div onClick={() => history.push(linkURL)} className='w-3/12 my-auto cursor-pointer'>
            {
                type === "design" && "Design Only"
            }
            {
                type === 'project' && "Project"
            }
            {
                type === "quote" && "Quote Only"
            }
        </div>
        <Link to={linkURL} className='flex width-10-percent'><div className='my-auto'>{lastUpdated}</div></Link>
        <Link to={linkURL} className='flex width-10-percent'><div className='my-auto'>{lastEditby}</div></Link>
        <Link to={linkURL} className='flex width-10-percent'><div className='my-auto'>{createdOn}</div></Link>
        <Link to={linkURL} className='flex width-10-percent'><div className='my-auto'>{createdBy}</div></Link>
        <div className='flex justify-between width-10-percent'>
            <div className='my-auto'>{totalUnits}</div>
            <DropdownListInput
                listWrapperClassName='last-child-red'
                onSelect={v => handleDropDown(v)}
                wrapperClassName='border-none cursor-pointer w-40 last:text-error mr-4' labelClassName='hidden'
                suffixIcon={<div>···</div>}
                listWrapperFloatDirection='left' disabled={true}
                options={optionList} />
        </div>
    </div>
    <ActionModal modalClassName='font-moret' showModal={showConfirmDeleteModal} message={`Delete ${name}`} subText={`Are you sure you want to permanently delete this ${type}`} onCancel={()=>setshowConfirmDeleteModal(false)} submitButtonLabel={'Delete'} submitButtonClassName='justify-center' cancelButtonLabel={'Cancel'} onSubmit={()=>{}} />
    </>
}

export default EachProjectQuoteDesignRow;