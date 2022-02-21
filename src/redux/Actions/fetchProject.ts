import apiRequest from '../../Service/apiRequest'
import produce from 'immer';
//fetch ininital projects, first page of project, designs and quotes only
const fetchProject = (organizationID: string, options?:{title?: string}) => async (dispatch: any) => {
      const projectRes = await apiRequest({
        url: `/api/fhapp-service/projects/${organizationID}?page=0&limit=20${options?.title? `&title=${options.title}`:''}`,
        method: 'GET',
      })
      if (projectRes?.success) {
        dispatch(
          {
            type: 'projects',
            payload: projectRes.projects
          }
        )
      } else {
        console.log('fetch project failed, please check fetchProject.tsx')
      }
  }

export default fetchProject;