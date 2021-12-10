import apiRequest from '../apiRequest'
const fetchProject = (organizationID: string) => async (dispatch: any) => {
      const res = await apiRequest({
        url: `/api/fhapp-service/projects/${organizationID}`,
        method: 'GET',
      })
      if (res?.success) {
        dispatch(
          {
            type: 'projects',
            payload: res.projects
          }
        )
      } else {
        console.log('fetch project failed, please check fetchProject.tsx')
      }
  }

export default fetchProject;