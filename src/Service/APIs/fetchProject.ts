import apiRequest from '../apiRequest'
const fetchProject = () => async (dispatch: any) => {
      const res = await apiRequest({
        url: '/api/fhapp-service/projects',
        method: 'GET',
      })
      if (res?.success) {
        dispatch(
          {
            type: 'projects',
            payload: res.data
          }
        )
      } else {
        console.log('fetch project failed, please check fetchProject.tsx')
      }
  }

export default fetchProject;