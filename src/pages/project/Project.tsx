import React, { useState, useEffect, useRef } from 'react';
import "./Project.scss";
import { Link, useHistory } from 'react-router-dom'
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import { ActionModal } from "@fulhaus/react.ui.action-modal";
import { useSelector, useDispatch } from 'react-redux'
import { Tappstate } from '../../redux/reducers';
import {deleteSpecificProject} from '../../redux/Actions'
import { useGetProjectRole } from '../../Hooks/useGetProjectRole';
import apiRequest from '../../Service/apiRequest'
import produce from 'immer'
import { ReactComponent as RightArrowWhiteIcon } from "../../styles/images/right-arrow-white.svg";
import { ReactComponent as ShareAlt } from "../../styles/images/share-alt.svg";
import { ReactComponent as SaveIcon } from "../../styles/images/save.svg";
import { ReactComponent as InformationIcon } from "../../styles/images/information.svg";
import { ReactComponent as HistoryIcon } from "../../styles/images/history.svg";
import Quote from '../../Components/Quote/Quote';
import Design from '../../Components/Design/Design';
import NoteModal from '../../Components/NoteModal/NoteModal';
import ProjectInformation from './ProjectComponents/ProjectInformation';
import VersionHistory from './ProjectComponents/VersionHistory';
import AppSideBar from '../../Components/AppSideBar/AppSideBar';
const Project = () => {
    const [showHistory, setshowHistory] = useState(false);
    const [showProjectInfor, setshowProjectInfor] = useState(false);
    const [showRenameProject, setshowRenameProject] = useState(false);
    const [showConfirmDeleteProjectModal, setshowConfirmDeleteProjectModal] = useState(false);
    const [showNote, setshowNote] = useState(false);
    const selectedProject = useSelector((state: Tappstate) => state.selectedProject);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const [projectTitle, setprojectTitle] = useState(selectedProject?.title)
    const projectRole = selectedProject?.userRoleInThisProject;
    const projects = useSelector((state: Tappstate) => state.projects);
    const history = useHistory();
    const dispatch = useDispatch();
      useEffect(() => {
          //add warning for user when leave page
        const handleUnload = (event:any) => {
            event.preventDefault();
            return event.returnValue = `Are you sure you want to leave?`;
          };
        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
      }, []);
    useEffect(
        () =>{
            if(!selectedProject){
                const selectedProject = localStorage.getItem('selectedProject');
                const currentOrgID = localStorage.getItem('currentOrgID');
                if(selectedProject && currentOrgID){
                    dispatch({
                        type: 'selectedProject',
                        payload: {...JSON.parse(selectedProject)}
                    });
                    dispatch({
                        type: 'currentOrgID',
                        payload: currentOrgID 
                    });
                }else{
                    history.push('/')
                }
            }
        },[]
    )
    const projectMenuOnSelect = async (v: string) => {
        switch (v) {
            case 'Rename Project':
                setshowRenameProject(true);
                break;
            case 'Delete Project':
                setshowConfirmDeleteProjectModal(true);
                break;
        }
    }
    const deleteProject = async () => {
        if(currentOrgID){
        dispatch(deleteSpecificProject(currentOrgID, selectedProject._id, projects));
        }
        history.push('/')
    }

    const renameProject = async () => {
        const res = await apiRequest(
            {
            url: `/api/fhapp-service/${selectedProject?.type}/${currentOrgID}/${selectedProject.type === 'quote'? selectedProject.quoteID : selectedProject?._id}`,
            method:'PATCH',
            body: {
                title: projectTitle
            }
            }
        )
        if(res?.success){
            const newSelectedProject = produce(selectedProject, (draftState: any) =>{ 
                draftState.title = projectTitle;
                })
            dispatch({
                type: 'selectedProject',
                payload: newSelectedProject
            })
        }else{
            console.log(res?.message);
        }
        setshowRenameProject(false);
    }
    return (<>
        {/**Project delete confirm modal */}
        <ActionModal modalClassName='font-moret' showModal={showConfirmDeleteProjectModal} message={`Delete Project`} subText={`Are you sure you want to permanently delete ${'project'} ?`} onCancel={() => setshowConfirmDeleteProjectModal(false)} submitButtonLabel={'Delete'} cancelButtonLabel={'Cancel'} onSubmit={() => deleteProject()} />

        <NoteModal show={showNote} close={() => setshowNote(false)} save={() => { }} unitName={'Unit A'} />
        <div className="project bg-cream">
            <div className="flex bg-white h-14">
                <div className='flex px-4 py-3 text-white bg-black font-moret'>
                    <Link className='my-auto mr-4 cursor-pointer' to={'/'}><RightArrowWhiteIcon /></Link>
                    {showRenameProject ? <input onKeyDown={e => {
                        if (e.code === 'Enter') {
                            renameProject();
                        }
                    }} value={projectTitle} onChange={e => setprojectTitle(e.target.value)} className='w-40 px-2 my-auto mr-4 text-black' type='text' onClick={e => e.stopPropagation()} onBlur={() => renameProject()} /> :
                        <div className='my-auto mr-4 text-lg'>{selectedProject?.title}</div>}
                    {(projectRole === 'admin' || projectRole === 'owner') && 
                        <div className='hide-dropdown-list'>
                            <DropdownListInput
                                listWrapperClassName={projectRole === 'owner' ? 'last-child-red' :''}
                                onSelect={v => projectMenuOnSelect(v)}
                                wrapperClassName='border-none cursor-pointer my-auto last:text-error' labelClassName='hidden'
                                suffixIcon={<div className='text-white'>···</div>}
                                listWrapperFloatDirection='right' disabled={true}
                                options={projectRole === 'owner' ? ['Rename Project', 'Delete Project'] : ['Rename Project']} />
                        </div>
                    }
                </div>
                {(window.location.href.includes('/project/quote') || window.location.href.includes('/project/design')) &&
                    <div className='flex ml-auto'>
                        <Link to='/project/quote' className={`my-auto ml-auto mr-8 cursor-pointer ${window.location.href.includes('project/quote') ? 'border-solid border-black border-b-2' : 'border-b-2 border-solid border-transparent'}`}>Quote</Link>
                        <Link to='/project/design' role='button' className={`my-auto cursor-pointer ${window.location.href.includes('project/design') ? 'border-b-2 border-solid border-black' : 'border-b-2 border-solid border-transparent'}`}>Design</Link>
                    </div>
                }
                <div className={`${(window.location.href.includes('/quote-only') || window.location.href.includes('/design-only')) && 'ml-auto'} flex w-3/6`}>
                    <div className='my-auto ml-auto mr-6 text-sm font-ssp'>v0</div>
                    <div className='my-auto mr-8 text-sm font-ssp'>Never saved</div>
                    <ShareAlt className='my-auto mr-8 cursor-pointer' />
                    <InformationIcon onClick={() => setshowProjectInfor(true)} className='my-auto mr-8 cursor-pointer' />
                    <HistoryIcon onClick={() => setshowHistory(true)} className='my-auto mr-8 cursor-pointer' />
                    <SaveIcon className='my-auto mr-8 cursor-pointer' />
                </div>
            </div>
            {showHistory && <VersionHistory close={() => setshowHistory(false)} />}
            {
                showProjectInfor && <ProjectInformation close={() => setshowProjectInfor(false)} />
            }
            <div className='flex main-content-wrapper'>
                <AppSideBar />
                {(window.location.href.includes('project/quote') || window.location.href.includes('/quote-only')) && <Quote />}
                {(window.location.href.includes('project/design') || window.location.href.includes('/design-only')) && <Design />}
            </div>
            <div className='flex w-full px-6 text-white font-ssp bg-linkSelected h-14'>
                <div className='my-auto mr-4 text-lg font-semibold'>1BD</div>
                <div className='my-auto mr-4 text-3xl font-semibold'>·</div>
                <div className='my-auto text-lg font-semibold'>1 Unit</div>
                <div className='my-auto ml-auto mr-6 text-sm'>Unit Total <b>$0.00</b></div>
                <div className='my-auto mr-6 text-sm'>Project Total <b>$0.00</b></div>
                <div className='px-4 py-1 my-auto mr-6 text-sm font-semibold bg-black cursor-pointer'>View Overall Budget</div>
            </div>
        </div>
    </>
    );
};

export default Project;
