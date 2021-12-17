import apiRequest from '../../Service/apiRequest'
import produce from 'immer';
//fetch ininital projects, first page of project, designs and quotes only
const fetchProject = (organizationID: string, options?:{title?: string}) => async (dispatch: any) => {
  let projects : any[] = [];
      const projectRes = await apiRequest({
        url: `/api/fhapp-service/projects/${organizationID}?page=0&limit=20${options?.title? `&title=${options.title}`:''}`,
        method: 'GET',
      })
      if (projectRes?.success) {
        //add type = 'project' property for project
        const projectList = produce(projectRes.projects, (draft: any) => {
          draft.forEach((each: any) => each.type = 'project')
        })
        projects = projects.concat(projectList)
      } else {
        console.log('fetch project failed, please check fetchProject.tsx')
      }

      const designRes = await apiRequest(
        {
          url:`/api/fhapp-service/designs/${organizationID}?page=0&limit=20&designOnly=yes${options?.title? `&title=${options.title}`:''}`,
          method:'GET'
        }
      )
      if(designRes.success){
        const designList = produce(designRes.projects, (draft: any) => {
          draft.forEach((each: any) => each.type = 'design')
        })
        projects = projects.concat(designList)
      }else{
        console.log('fetch design failed, please check fetchProject.tsx')
      }

      dispatch(
        {
          type: 'projects',
          payload: projects
        }
      )
  }

export default fetchProject;