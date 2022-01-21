import apiRequest from '../../Service/apiRequest'
const getQuoteDetail = ({
    organizationID,
    projectOrQuoteID,
    idType
}:{organizationID: string; projectOrQuoteID: string, idType: 'quoteID' | 'project'}) => async (dispatch:any) => {
    const res = await apiRequest(
        {
            url:`/api/fhapp-service/quote/${organizationID}/${projectOrQuoteID}`,
            body: {idType},
            method:'GET'
        }
    )
    if(res?.success && idType==='quoteID'){
         dispatch({
             type:'quoteDetail',
             payload: res?.quote
         })
    }
    if(!res?.success){
        console.log('get quote detail failed, see getQuoteDetail.ts')
    }
}

export default getQuoteDetail