import produce from 'immer'
import { showMessageAction } from '.'
import apiRequest from '../../Service/apiRequest'
const renameSpecificProjectAction = (renameProjectTitle: string, currentOrgID: string | undefined, projectID: string, projects: any[] | undefined, projectType: 'design' | 'project' | 'quote') => async (dispatch: any) => {
    //rename project based on project name
    const res = await apiRequest(
        {
        url: `/api/fhapp-service/${projectType}/${currentOrgID}/${projectID}`,
        method:'PATCH',
        body: {
            title: renameProjectTitle
        }
        }
    )
    if(res.success){
       const newProjects = produce(projects, draftState =>{ 
       draftState?.map(each => {
           if(each._id === projectID){
              each.title = renameProjectTitle;
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

export default renameSpecificProjectAction;