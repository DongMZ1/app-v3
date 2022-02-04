import React, { useState, useEffect, useRef } from 'react';
import "./Project.scss";
import { Link, useHistory } from 'react-router-dom'
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import { Popup } from '@fulhaus/react.ui.popup'
import { ActionModal } from "@fulhaus/react.ui.action-modal";
import { useSelector, useDispatch } from 'react-redux'
import { CSSTransition } from 'react-transition-group';
import { Tappstate } from '../../redux/reducers';
import { deleteSpecificProject, getQuoteDetail } from '../../redux/Actions'
import InvitePeople from '../../Components/InvitePeople/InvitePeople';
import apiRequest from '../../Service/apiRequest'
import produce from 'immer'
import { ReactComponent as RightArrowWhiteIcon } from "../../styles/images/right-arrow-white.svg";
import { ReactComponent as ShareAlt } from "../../styles/images/share-alt.svg";
import { ReactComponent as InformationIcon } from "../../styles/images/information.svg";
import { ReactComponent as HistoryIcon } from "../../styles/images/history.svg";
import Quote from '../../Components/Quote/Quote';
import Design from '../../Components/Design/Design';
import ProjectInformation from './ProjectComponents/ProjectInformation';
import ProjectFooter from './ProjectComponents/ProjectFooter';
import VersionHistory from './ProjectComponents/VersionHistory';
import AppSideBar from '../../Components/AppSideBar/AppSideBar';
import QuoteSummaryPurchase from '../../Components/QuoteSummaryPurchase/QuoteSummaryPurchase';
import QuoteSummaryRental from '../../Components/QuoteSummaryRental/QuoteSummaryRental';
import SaveProject from './ProjectComponents/SaveProject';
const Project = () => {
    const [showInvitePeople, setshowInvitePeople] = useState(false);
    const [showHistory, setshowHistory] = useState(false);
    const [showProjectInfor, setshowProjectInfor] = useState(false);
    const [showRenameProject, setshowRenameProject] = useState(false);
    const [showConfirmDeleteProjectModal, setshowConfirmDeleteProjectModal] = useState(false);
    const [hoverProjectTitle, sethoverProjectTitle] = useState(false);
    const selectedProject = useSelector((state: Tappstate) => state.selectedProject);
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const [projectTitle, setprojectTitle] = useState(selectedProject?.title)
    const projectRole = selectedProject?.userRole;
    const projects = useSelector((state: Tappstate) => state.projects);
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        //if it is a project, then get the quote based on projectID
        if (selectedProject?.type === 'project' && currentOrgID) {
            dispatch(getQuoteDetail({ organizationID: currentOrgID, projectOrQuoteID: selectedProject._id, idType: 'project' }))
        }
        //get quote detail when initail rendering
        if (selectedProject?.quoteID && currentOrgID && selectedProject?.type === 'quote') {
            dispatch(getQuoteDetail({ organizationID: currentOrgID, projectOrQuoteID: selectedProject.quoteID, idType: 'quoteID' }))
        }
    }, [selectedProject])

    useEffect(() => {
        //add warning for user when leave page
        const handleUnload = (event: any) => {
            event.preventDefault();
            return event.returnValue = `Are you sure you want to leave?`;
        };
        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, []);

    useEffect(
        //if there is no selected project, then get it from localstorage, see EachProjectQuoteDesign.tsx for logic
        () => {
            if (!selectedProject) {
                const selectedProject = localStorage.getItem('selectedProject');
                const currentOrgID = localStorage.getItem('currentOrgID');
                if (selectedProject && currentOrgID) {
                    dispatch({
                        type: 'selectedProject',
                        payload: { ...JSON.parse(selectedProject) }
                    });
                    dispatch({
                        type: 'currentOrgID',
                        payload: currentOrgID
                    });
                } else {
                    history.push('/')
                }
            }
        }, []
    )

    const exitPage = () => {
        //clear selected quote unit and quote detail when exit the page
        dispatch({
            type: 'selectedQuoteUnit',
            payload: undefined
        })
        dispatch(
            {
                type: 'quoteDetail',
                payload: undefined
            }
        )
    }
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
        if (currentOrgID) {
            dispatch(deleteSpecificProject(currentOrgID, selectedProject._id, projects));
        }
        history.push('/')
    }

    const renameProject = async () => {
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/${selectedProject?.type}/${currentOrgID}/${selectedProject.type === 'quote' ? selectedProject.quoteID : selectedProject?._id}`,
                method: 'PATCH',
                body: {
                    title: projectTitle
                }
            }
        )
        if (res?.success) {
            const newSelectedProject = produce(selectedProject, (draftState: any) => {
                draftState.title = projectTitle;
            })
            dispatch({
                type: 'selectedProject',
                payload: newSelectedProject
            })
        } else {
            console.log(res?.message);
        }
        setshowRenameProject(false);
    }
    return (<>
        <Popup show={showInvitePeople} allowCloseOnClickOutside={false} boxShadow={false} onClose={() => {
            setshowInvitePeople(false);
        }}>
            <InvitePeople userRole={selectedProject?.userRole} projectName={selectedProject?.title} projectID={selectedProject?._id} close={() => { setshowInvitePeople(false); }} />
        </Popup>
        {/**Project delete confirm modal */}
        <ActionModal modalClassName='font-moret' showModal={showConfirmDeleteProjectModal} message={`Delete Project`} subText={`Are you sure you want to permanently delete ${'project'} ?`} onCancel={() => setshowConfirmDeleteProjectModal(false)} submitButtonLabel={'Delete'} cancelButtonLabel={'Cancel'} onSubmit={() => deleteProject()} />
        <div className="project bg-cream">
            <div className="flex bg-white h-14">
                <div onMouseLeave={()=>sethoverProjectTitle(false)} className={`flex px-4 py-3 text-white bg-black font-moret ${hoverProjectTitle && selectedProject?.title?.length > 16 ? 'w-auto' : 'w-64'}`}>
                    <Link onClick={() => exitPage()} className='my-auto mr-4 cursor-pointer' to={'/'}><RightArrowWhiteIcon /></Link>
                    {showRenameProject ?
                        <input onKeyDown={e => {
                            if (e.code === 'Enter') {
                                renameProject();
                            }
                        }} value={projectTitle} onChange={e => setprojectTitle(e.target.value)} className='w-5/6 px-2 mx-auto my-auto text-black' type='text' onClick={e => e.stopPropagation()} onBlur={() => renameProject()} />
                        :
                        <div onMouseEnter={() => sethoverProjectTitle(true)} className='mx-auto my-auto text-lg'>
                            {hoverProjectTitle ? selectedProject?.title : (selectedProject?.title?.length > 16 ? (selectedProject?.title as string).slice(0, 16) + '...' : selectedProject?.title)}</div>
                    }
                    {(projectRole === 'admin' || projectRole === 'owner') &&
                        <div className='ml-4 hide-dropdown-list'>
                            <DropdownListInput
                                listWrapperClassName={'last-child-red'}
                                onSelect={v => projectMenuOnSelect(v)}
                                wrapperClassName='border-none cursor-pointer my-auto last:text-error' labelClassName='hidden'
                                suffixIcon={<div className='text-white'>···</div>}
                                listWrapperFloatDirection='right' disabled={true}
                                options={['Rename Project', 'Delete Project']} />
                        </div>
                    }
                </div>
                {(window.location.href.includes('/project/quote') || window.location.href.includes('/project/design')) &&
                    <div className='flex ml-auto'>
                        <Link to='/project/quote' className={`my-auto ml-auto mr-8 cursor-pointer ${window.location.href.includes('project/quote') ? 'border-solid border-black border-b-2' : 'border-b-2 border-solid border-transparent'}`}>Quote</Link>
                        <Link to='/project/design' role='button' className={`my-auto cursor-pointer ${window.location.href.includes('project/design') ? 'border-b-2 border-solid border-black' : 'border-b-2 border-solid border-transparent'}`}>Design</Link>
                    </div>
                }
                {(window.location.href.includes('/quote-summary-rental') || window.location.href.includes('/quote-summary-purchase')) &&
                    <div className='flex ml-auto'>
                        <Link to='/quote-summary-rental' className={`my-auto ml-auto mr-8 cursor-pointer ${window.location.href.includes('/quote-summary-rental') ? 'border-solid border-black border-b-2' : 'border-b-2 border-solid border-transparent'}`}>Rental</Link>
                        <Link to='/quote-summary-purchase' role='button' className={`my-auto cursor-pointer ${window.location.href.includes('/quote-summary-purchase') ? 'border-b-2 border-solid border-black' : 'border-b-2 border-solid border-transparent'}`}>Purchase</Link>
                    </div>
                }
                <div className={`${(window.location.href.includes('/quote-only') || window.location.href.includes('/design-only')) && 'ml-auto'} flex w-3/6`}>
                    <div className='my-auto ml-auto mr-6 text-sm font-ssp'>v0</div>
                    <div className='my-auto mr-8 text-sm font-ssp'>Never saved</div>
                    <ShareAlt onClick={() => setshowInvitePeople(true)} className='my-auto mr-8 cursor-pointer' />
                    <InformationIcon onClick={() => setshowProjectInfor(true)} className='my-auto mr-8 cursor-pointer' />
                    <HistoryIcon onClick={() => setshowHistory(true)} className='my-auto mr-8 cursor-pointer' />
                    <SaveProject />
                </div>
            </div>
            <CSSTransition in={showHistory} timeout={300} unmountOnExit classNames='opacity-animation'><VersionHistory close={() => setshowHistory(false)} /></CSSTransition>
            <CSSTransition in={showProjectInfor} timeout={300} unmountOnExit classNames='opacity-animation'><ProjectInformation close={() => setshowProjectInfor(false)} /></CSSTransition>
            <div className='flex main-content-wrapper'>
                <AppSideBar />
                {(window.location.href.includes('project/quote') || window.location.href.includes('/quote-only')) && <Quote />}
                {(window.location.href.includes('project/design') || window.location.href.includes('/design-only')) && <Design />}
                {(window.location.href.includes('/quote-summary-rental')) && <QuoteSummaryRental />}
                {(window.location.href.includes('/quote-summary-purchase')) && <QuoteSummaryPurchase />}
            </div>
            <ProjectFooter />
        </div>
    </>
    );
};

export default Project;
