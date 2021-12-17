import apiRequest from '../../Service/apiRequest'
import produce from 'immer';
//fetch more projects, first page of project, designs and quotes only
const fetchMoreProject = (organizationID: string, projects: any, options?:{title?: string, page: number}) => async (dispatch: any) => {
      const projectRes = await apiRequest({
        url: `/api/fhapp-service/projects/${organizationID}?page=${options?.page}&limit=20&${options?.title? `title=${options.title}`:''}`,
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

      dispatch(
        {
          type: 'projects',
          payload: projects
        }
      )
  }

export default fetchMoreProject;