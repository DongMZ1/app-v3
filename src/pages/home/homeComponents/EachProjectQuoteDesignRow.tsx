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
        updatedAt: string | undefined;
        lastEditedBy: string | undefined;
        createdAt: string;
        createdBy: string;
        unitCount?: number | string,
        projectAddress: null | {
            apt: string,
            street: string,
            city: string,
            state: string,
            postalCode: string,
            country: string,
        }
        quote?: any;
        budget: string;
        currency: string;
        quoteID: string;
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
    if (thisProject.type === 'design') {
        optionList = ['Duplicate Design', 'Rename Design', 'Share Design', 'Delete Design'];
        linkURL = `/design-only`
    }
    if (thisProject.type === 'quote') {
        optionList = ['Duplicate Quote', 'Rename Quote', 'Share Quote', 'Delete Quote'];
        linkURL = `/quote-only`
    }
    if (thisProject.type === 'project') {
        optionList = ['Duplicate Project', 'Rename Project', 'Share Project', 'Delete Project'];
        linkURL = `/project/quote`
    }

    const handleDropDown = (v: string) => {
        switch (v) {
            case 'Duplicate Project':
            case 'Duplicate Quote':
            case 'Duplicate Design':
                setProjectQuoteDesignInfoNeedDuplicate(thisProject);
                setStartNewProjectQuoteDesignType(thisProject.type ? thisProject.type : 'project');
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

    const selectThisProject = () => {
        //put selectedProject, projectRole, currentOrgID into localstorage avoid user refresh page on project page
        localStorage.setItem('selectedProject', JSON.stringify({ ...thisProject, userRole: projectRole }));
        localStorage.setItem('currentOrgID', currentOrgID ? currentOrgID : '');
        dispatch({
            type: 'selectedProject',
            payload: { ...thisProject, userRole: projectRole }
        })
        history.push(linkURL)
    }

    return <> <div className='flex h-10 text-sm border border-black border-solid font-ssp'>
        <div onClick={() => selectThisProject()} className='flex pl-4 cursor-pointer width-30-percent'>
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
        <div onClick={() => selectThisProject()} className='my-auto cursor-pointer width-10-percent'>
            {
                thisProject.type === "design" && "Design Only"
            }
            {
                (thisProject.type === 'project') && "Project"
            }
            {
                thisProject.type === "quote" && "Quote Only"
            }
        </div>
        <div onClick={() => selectThisProject()} className='flex width-13-percent'><div className='my-auto'>{thisProject.updatedAt ? thisProject.updatedAt?.slice(0, 10) : 'Unknown'}</div></div>
        <div onClick={() => selectThisProject()} className='flex width-13-percent'><div className='my-auto'>{thisProject.lastEditedBy ? thisProject.lastEditedBy : 'Unknown'}</div></div>
        <div onClick={() => selectThisProject()} className='flex width-13-percent'><div className='my-auto'>{thisProject.createdAt?.slice(0, 10)}</div></div>
        <div onClick={() => selectThisProject()} className='flex width-13-percent'><div className='my-auto'>{thisProject.createdBy}</div></div>
        <div className='flex width-8-percent'>
            <div className='my-auto'>{thisProject.unitCount ? thisProject.unitCount : 0}</div>
            {(projectRole === ('owner') || (projectRole === 'admin')) && projectRole &&
                <div className='my-auto ml-auto mr-4 hide-dropdown-list'>
                    <DropdownListInput
                        listWrapperClassName={'last-child-red w-max-content'}
                        onSelect={v => handleDropDown(v)}
                        wrapperClassName='border-none cursor-pointer w-40 last:text-error' labelClassName='hidden'
                        suffixIcon={<div>···</div>}
                        listWrapperFloatDirection='left' disabled={true}
                        options={optionList} />
                </div>
            }
        </div>
    </div>
        <ActionModal modalClassName='font-moret' showModal={showConfirmDeleteModal} message={`Delete ${thisProject.type ? thisProject.type : 'Project'}`} subText={`Are you sure you want to permanently delete ${thisProject.title} ?`} onCancel={() => setshowConfirmDeleteModal(false)} submitButtonLabel={'Delete'} cancelButtonLabel={'Cancel'} onSubmit={() => {
            if (currentOrgID) {
                dispatch(deleteSpecificProject(currentOrgID, thisProject._id, projects));
                setshowConfirmDeleteModal(false);
            }
        }} />
    </>

}

export default EachProjectQuoteDesignRow;