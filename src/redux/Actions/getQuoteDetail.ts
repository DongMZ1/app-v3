import apiRequest from '../../Service/apiRequest'
const getQuoteDetail = ({
    organizationID,
    quoteID,
    projectID,
    loadingFalse,
}:{organizationID: string; quoteID: string; projectID:string; loadingFalse?: boolean}) => async (dispatch:any) => {
    const res = await apiRequest(
        {
            url:`/api/fhapp-service/quote/${organizationID}/${projectID}/${quoteID}`,
            method:'GET'
        }
    )
    if(res?.success){
         dispatch({
             type:'quoteDetail',
             payload: res?.quote
         })
    }
    if(!res?.success){
        console.log('get quote detail failed, see getQuoteDetail.ts')
    }
    if(loadingFalse){
        dispatch({
            type:'appLoader',
            payload: false
        })
    }
}

export default getQuoteDetail