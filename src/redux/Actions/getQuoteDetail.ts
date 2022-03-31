import apiRequest from '../../Service/apiRequest'
const getQuoteDetail = ({
    organizationID,
    quoteID,
    loadingFalse,
}:{organizationID: string; quoteID: string; loadingFalse?: boolean}) => async (dispatch:any) => {
    const res = await apiRequest(
        {
            url:`/api/fhapp-service/quote/${organizationID}/${quoteID}`,
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