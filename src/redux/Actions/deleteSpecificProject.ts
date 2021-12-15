import apiRequest from '../../Service/apiRequest'
import produce from 'immer';
import { fetchProject, showMessageAction } from '.'
//projects is all of the projects under current organzition
const deleteSpecificProject = (organizationID: string, projectID:string, projects: any[] | undefined) => async (dispatch: any) => {
    const res = await apiRequest({
        url: `/api/fhapp-service/project/${organizationID}/${projectID}`,
        method:'DELETE'
    })
    if(res.success){
        if(projects){
            const newProjectsState = produce(projects, draftState => draftState.filter(
                each => each._id !== projectID
            ));
            dispatch({
                type:"projects",
                payload:newProjectsState
            })
        }
    }
    if(!res.success){
        dispatch(showMessageAction(true, res.message));
    }
}

export default deleteSpecificProject;