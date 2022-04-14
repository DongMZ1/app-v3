import apiRequest from '../../Service/apiRequest'
const getProjectDetail = ({
    organizationID,
    projectID
}:{
    organizationID: string,
    projectID: string
}) => async (dispatch: any) => {
   const res = await apiRequest({
       url:`/api/fhapp-service/projects/${organizationID}/${projectID}`,
       method: 'GET'
   })
   if(res?.success){
       dispatch({
           type:'selectedProjectDetail',
           payload: res?.project
       })
   }
}

export default getProjectDetail;