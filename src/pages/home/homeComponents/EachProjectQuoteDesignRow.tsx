//for scss, please refer Home.scss
import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import { ActionModal } from "@fulhaus/react.ui.action-modal";
import { useGetProjectRole } from '../../../Hooks/useGetProjectRole'
import { deleteSpecificProject, renameSpecificProjectAction } from '../../../redux/Actions'
import { Tappstate } from '../../../redux/reducers';
type EachProjectQuoteDesignRowProps = {
    thisProject: {
        title: string
        _id: string
        type: 'design' | 'project' | 'quote'
        lastUpdated: string | undefined;
        lastEditedBy: string | undefined;
        createdAt: string;
        createdBy: string;
        totalUnits?: number | string,
        projectAddress: null | {
            apt: string,
            street: string,
            city: string,
            state: string,
            postalCode: string,
            country: string,
        }
        budget: string;
        currency: string;
    },
    showInvitePeople?: () => void,
    setSelectedProjectToInvite?: (object: { name: string, id: string, userRole: string | undefined }) => void
    setStartNewProjectQuoteDesignType: React.Dispatch<React.SetStateAction<"design" | "project" | "quote">>
    setshowStartNewProjectQuotoDesign: React.Dispatch<React.SetStateAction<boolean>>
    setProjectQuoteDesignInfoNeedDuplicate: React.Dispatch<React.SetStateAction<any>>
}
const EachProjectQuoteDesignRow = ({ thisProject, showInvitePeople, setSelectedProjectToInvite, setStartNewProjectQuoteDesignType, setshowStartNewProjectQuotoDesign, setProjectQuoteDesignInfoNeedDuplicate }: EachProjectQuoteDesignRowProps) => {
    const [showRenameProject, setshowRenameProject] = useState(false);
    const [showConfirmDeleteModal, setshowConfirmDeleteModal] = useState(false);
    const [renameProjectTitle, setrenameProjectTitle] = useState(thisProject.title);
    const history = useHistory();
    const projectRole = useGetProjectRole(thisProject._id);
    const dispatch = useDispatch();
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const projects = useSelector((state: Tappstate) => state.projects);
    let optionList = [''];
    let linkURL = '';
    //if the type is not declared, then the default type is project
    //if (!thisProject.type) {
    //    thisProject.type = 'project'
   // }
    if (thisProject.type === 'design') {
        if (projectRole === 'admin') {
            optionList = ['Duplicate Design', 'Rename Design', 'Share Design'];
        }
        if (projectRole === 'owner') {
            optionList = ['Duplicate Design', 'Rename Design', 'Share Design', 'Delete Design'];
        }
        linkURL = `/design-only?id=${thisProject._id}`
    }
    if (thisProject.type === 'quote') {
        if (projectRole === 'admin') {
            optionList = ['Duplicate Quote', 'Rename Quote', 'Share Quote'];
        }
        if (projectRole === 'owner') {
            optionList = ['Duplicate Quote', 'Rename Quote', 'Share Quote', 'Delete Quote'];
        }
        linkURL = `/quote-only?id=${thisProject._id}`
    }
    if (thisProject.type === 'project' || !thisProject.type) {
        if (projectRole === 'admin') {
            optionList = ['Duplicate Project', 'Rename Project', 'Share Project'];
        }
        if (projectRole === 'owner') {
            optionList = ['Duplicate Project', 'Rename Project', 'Share Project', 'Delete Project'];
        }
        linkURL = `/project/quote?id=${thisProject._id}`
    }

    const handleDropDown = (v: string) => {
        switch (v) {
            case 'Duplicate Project':
            case 'Duplicate Quote':
            case 'Duplicate Design':
                setProjectQuoteDesignInfoNeedDuplicate(thisProject);
                setStartNewProjectQuoteDesignType(thisProject.type ? thisProject.type: 'project');
                setshowStartNewProjectQuotoDesign(true);
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
                        name: thisProject.title,
                        id: thisProject._id,
                        userRole: projectRole
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

    const renameThisProject = async () => {
        dispatch(renameSpecificProjectAction(
            renameProjectTitle, currentOrgID, thisProject._id, projects
        ))
        setshowRenameProject(false);
    }

    return <> <div className='flex h-10 text-sm border border-black border-solid font-ssp'>
        <div onClick={() => history.push(linkURL)} className='flex pl-4 cursor-pointer width-30-percent'>
            {showRenameProject ?
                <input value={renameProjectTitle} onChange={e => setrenameProjectTitle(e.target.value)} onKeyDown={e => {
                    if (e.code === 'Enter') {
                        renameThisProject();
                    }
                }} className='px-2 my-auto' type='text' onClick={e => e.stopPropagation()} onBlur={() => renameThisProject()} />
                :
                <div className='my-auto'>{thisProject.title}</div>
            }
        </div>
        <div onClick={() => history.push(linkURL)} className='my-auto cursor-pointer width-10-percent'>
            {
                thisProject.type === "design" && "Design Only"
            }
            {
                (thisProject.type === 'project' || !thisProject.type) && "Project"
            }
            {
                thisProject.type === "quote" && "Quote Only"
            }
        </div>
        <Link to={linkURL} className='flex width-13-percent'><div className='my-auto'>{thisProject.lastUpdated ? thisProject.lastUpdated : 'Unknown'}</div></Link>
        <Link to={linkURL} className='flex width-13-percent'><div className='my-auto'>{thisProject.lastEditedBy ? thisProject.lastEditedBy : 'Unknown'}</div></Link>
        <Link to={linkURL} className='flex width-13-percent'><div className='my-auto'>{thisProject.createdAt}</div></Link>
        <Link to={linkURL} className='flex width-13-percent'><div className='my-auto'>{thisProject.createdBy}</div></Link>
        <div className='flex width-8-percent'>
            <div className='my-auto'>{thisProject.totalUnits ? thisProject.totalUnits : 0}</div>
            {projectRole !== ('viewer' || 'editor') && projectRole &&
                <div className='my-auto ml-auto mr-4 hide-dropdown-list'>
                    <DropdownListInput
                        listWrapperClassName={projectRole === 'admin w-max-content' ? '' : 'last-child-red w-max-content'}
                        onSelect={v => handleDropDown(v)}
                        wrapperClassName='border-none cursor-pointer w-40 last:text-error' labelClassName='hidden'
                        suffixIcon={<div>···</div>}
                        listWrapperFloatDirection='left' disabled={true}
                        options={optionList} />
                </div>
            }
        </div>
    </div>
        <ActionModal modalClassName='font-moret' showModal={showConfirmDeleteModal} message={`Delete ${thisProject.type? thisProject.type : 'Project'}`} subText={`Are you sure you want to permanently delete ${thisProject.title} ?`} onCancel={() => setshowConfirmDeleteModal(false)} submitButtonLabel={'Delete'} cancelButtonLabel={'Cancel'} onSubmit={() => {
            if (currentOrgID) {
                dispatch(deleteSpecificProject(currentOrgID, thisProject._id, projects));
                setshowConfirmDeleteModal(false);
            }
        }} />
    </>

}

export default EachProjectQuoteDesignRow;