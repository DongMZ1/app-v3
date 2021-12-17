import apiRequest from '../../Service/apiRequest'
import produce from 'immer';
//fetch more projects, first page of project, designs and quotes only
const fetchMoreProject = (organizationID: string, projects: any, options?:{title?: string, page: number}) => async (dispatch: any) => {
      const projectRes = await apiRequest({
        url: `/api/fhapp-service/projects/${organizationID}?page=${options?.page}&limit=20${options?.title? `&title=${options.title}`:''}`,
        method: 'GET',
      })
      if (projectRes?.success) {
        //add type = 'project' property for project
        const projectList = produce(projectRes.projects, (draft: any) => {
            draft.forEach((each: any) => each.type = 'project')
          })
        projects = projects.concat(projectList)
      } else {
        console.log('fetch more project failed, please check fetchMoreProject.tsx')
      }

      const QuoteRes = await apiRequest(
        {
          url:`/api/fhapp-service/quotes/${organizationID}?page=${options?.page}&limit=20&quoteOnly=yes${options?.title? `&title=${options.title}`:''}`,
          method:'GET'
        }
      )
      if(QuoteRes.success){
        const designList = produce(QuoteRes.projects, (draft: any) => {
          draft.forEach((each: any) => each.type = 'quote')
        })
        projects = projects.concat(designList)
      }else{
        console.log('fetch quote failed, please check fetchProject.tsx')
      }

      const designRes = await apiRequest(
        {
          url:`/api/fhapp-service/designs/${organizationID}?page=${options?.page}&limit=20&designOnly=yes${options?.title? `&title=${options.title}`:''}`,
          method:'GET'
        }
      )
      if(designRes.success){
        const designList = produce(designRes.projects, (draft: any) => {
          draft.forEach((each: any) => each.type = 'design')
        })
        projects = projects.concat(designList)
      }else{
        console.log('fetch more design failed, please check fetchMoreProject.tsx')
      }

      dispatch(
        {
          type: 'projects',
          payload: projects
        }
      )
  }

export default fetchMoreProject;