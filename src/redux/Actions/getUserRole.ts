import apiRequest from '../../Service/apiRequest'
const getUserRole = () => async (dispatch: any) => {
    const res = await apiRequest(
      {
        url: '/api/fhapp-service/organization/user/roles',
        method: 'GET'
      }
    )
    if (!res?.success) {
      console.log('get userRole failed');
    } else {
      dispatch(
        {
          type: "userRole",
          payload: res.roles
        }
      )
      dispatch({
          type:"allOrganizations",
          payload: res.organizations
      })
    }
  }

  export default getUserRole;
