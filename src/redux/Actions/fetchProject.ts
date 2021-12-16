import { each } from 'immer/dist/internal';
import apiRequest from '../../Service/apiRequest'
const fetchProject = (organizationID: string) => async (dispatch: any) => {
      let ProjectQuoteDesignList: any[] = [];
      const projectRes = await apiRequest({
        url: `/api/fhapp-service/projects/${organizationID}`,
        method: 'GET',
      })
      if (projectRes?.success) {
        ProjectQuoteDesignList = ProjectQuoteDesignList.concat(projectRes.projects)
      } else {
        console.log('fetch project failed, please check fetchProject.tsx')
      }

      const designRes = await apiRequest(
        {
          url:`/api/fhapp-service/designs/${organizationID}?designOnly=yes`,
          method:'GET'
        }
      )

      dispatch(
        {
          type: 'projects',
          payload: ProjectQuoteDesignList
        }
      )
  }

export default fetchProject;