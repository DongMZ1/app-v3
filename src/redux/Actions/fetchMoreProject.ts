import apiRequest from '../../Service/apiRequest'

//fetch more projects, first page of project, designs and quotes only
const fetchMoreProject = (organizationID: string, projects: any, options?:{title?: string, page: number}) => async (dispatch: any) => {
      const projectRes = await apiRequest({
        url: `/api/fhapp-service/projects/${organizationID}?page=0&limit=20&${options?.title? `title=${options.title}`:''}`,
        method: 'GET',
      })
      if (projectRes?.success) {
        projects = projects.concat(projectRes.projects)
      } else {
        console.log('fetch project failed, please check fetchProject.tsx')
      }

      const designRes = await apiRequest(
        {
          url:`/api/fhapp-service/designs/${organizationID}?designOnly=yes&${options?.title? `title=${options.title}`:''}`,
          method:'GET'
        }
      )

      dispatch(
        {
          type: 'projects',
          payload: projects
        }
      )
  }

export default fetchMoreProject;