//for scss, please refer Home.scss
import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import { ActionModal } from "@fulhaus/react.ui.action-modal";
import { useGetProjectRole } from '../../../Hooks/useGetProjectRole'
import {deleteSpecificProject, showMessageAction} from '../../../redux/Actions'
import { Tappstate } from '../../../redux/reducers';
import apiRequest from '../../../Service/apiRequest';
import produce from 'immer';
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
    setSelectedProjectToInvite?: (object: { name: string, id: string, userRole: string | undefined }) => void
}
const EachProjectQuoteDesignRow = ({ name, projectID, type, lastUpdated, lastEditby, createdOn, createdBy, totalUnits, showInvitePeople, setSelectedProjectToInvite }: EachProjectQuoteDesignRowProps) => {
    const [showRenameProject, setshowRenameProject] = useState(false);
    const [showConfirmDeleteModal, setshowConfirmDeleteModal] = useState(false);
    const [renameProjectName, setrenameProjectName] = useState(name);
    const history = useHistory();
    const projectRole = useGetProjectRole(projectID);
    const dispatch = useDispatch();
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const projects = useSelector((state: Tappstate) => state.projects);
    let optionList = [''];
    let linkURL = '';
    if (type === 'design') {
        if (projectRole === 'admin') {
            optionList = ['Duplicate Design', 'Rename Design', 'Share Design'];
        }
        if (projectRole === 'owner') {
            optionList = ['Duplicate Design', 'Rename Design', 'Share Design', 'Delete Design'];
        }
        linkURL = `/design-only?id=${projectID}`
    }
    if (type === 'quote') {
        if (projectRole === 'admin') {
        optionList = ['Duplicate Quote', 'Rename Quote', 'Share Quote'];
        }
        if(projectRole === 'owner'){
            optionList = ['Duplicate Quote', 'Rename Quote', 'Share Quote', 'Delete Quote'];
        }
        linkURL = `/quote-only?id=${projectID}`
    }
    if (type === 'project') {
        if(projectRole === 'admin'){
        optionList = ['Duplicate Project', 'Rename Project', 'Share Project'];
        }
        if(projectRole === 'owner'){
            optionList = ['Duplicate Project', 'Rename Project', 'Share Project', 'Delete Project'];
        }
        linkURL = `/project/quote?id=${projectID}`
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
                        id: projectID,
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
        setshowRenameProject(false);
        const res = await apiRequest(
            {
            url: `/api/fhapp-service/project/${currentOrgID}/${projectID}`,
            method:'PATCH',
            body: {
                title: renameProjectName
            }
            }
        )
        if(res.success){
           const newProjects = produce(projects, draftState =>{ 
           draftState?.map(each => {
               if(each._id === projectID){
                  each.title = renameProjectName;
               }
               return each
           })
           }
           )
           dispatch({
               type : "projects",
               payload: newProjects
           })
        }
        if(!res.success){
            dispatch(showMessageAction(
                true,
                res?.message
            ))
        }
    }

    return <> <div className='flex h-10 text-sm border border-black border-solid font-ssp'>
        <div onClick={() => history.push(linkURL)} className='flex pl-4 cursor-pointer width-30-percent'>
            {showRenameProject ?
                <input value={renameProjectName} onChange={e => setrenameProjectName(e.target.value)} onKeyDown={e => {
                    if (e.code === 'Enter') {
                        renameThisProject();
                    }
                }} className='px-2 my-auto' type='text' onClick={e => e.stopPropagation()} onBlur={() => renameThisProject()} />
                :
                <div className='my-auto'>{name}</div>
            }
        </div>
        <div onClick={() => history.push(linkURL)} className='my-auto cursor-pointer width-10-percent'>
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
        <Link to={linkURL} className='flex width-13-percent'><div className='my-auto'>{lastUpdated}</div></Link>
        <Link to={linkURL} className='flex width-13-percent'><div className='my-auto'>{lastEditby}</div></Link>
        <Link to={linkURL} className='flex width-13-percent'><div className='my-auto'>{createdOn}</div></Link>
        <Link to={linkURL} className='flex width-13-percent'><div className='my-auto'>{createdBy}</div></Link>
        <div className='flex width-8-percent'>
            <div className='my-auto'>{totalUnits}</div>
            {projectRole !== ('viewer' || 'editor') && projectRole &&
                <div className='my-auto ml-auto mr-4 hide-dropdown-list'>
                    <DropdownListInput
                        listWrapperClassName={projectRole === 'admin' ? '':'last-child-red'}
                        onSelect={v => handleDropDown(v)}
                        wrapperClassName='border-none cursor-pointer w-40 last:text-error' labelClassName='hidden'
                        suffixIcon={<div>···</div>}
                        listWrapperFloatDirection='left' disabled={true}
                        options={optionList} />
                </div>
            }
        </div>
    </div>
        <ActionModal modalClassName='font-moret' showModal={showConfirmDeleteModal} message={`Delete ${type}`} subText={`Are you sure you want to permanently delete ${name} ?`} onCancel={() => setshowConfirmDeleteModal(false)} submitButtonLabel={'Delete'} cancelButtonLabel={'Cancel'} onSubmit={() => {if(currentOrgID){
            dispatch(deleteSpecificProject(currentOrgID, projectID, projects));
            setshowConfirmDeleteModal(false);
            }}} />
    </>

}

export default EachProjectQuoteDesignRow;