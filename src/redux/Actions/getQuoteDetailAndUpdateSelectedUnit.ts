import apiRequest from '../../Service/apiRequest'
const getQuoteDetailAndUpdateSelectedUnit = ({
    organizationID,
    projectID,
    quoteID,
    selectedQuoteUnitID
}: { organizationID: string; projectID: string; quoteID: string; selectedQuoteUnitID: string }) => async (dispatch: any) => {
    const res = await apiRequest(
        {
            url: `/api/fhapp-service/quote/${organizationID}/${projectID}/${quoteID}`,
            method: 'GET'
        }
    )
    if (res?.success) {
        dispatch({
            type: 'quoteDetail',
            payload: res?.quote
        })
        if (selectedQuoteUnitID) {
            dispatch({
                type: 'selectedQuoteUnit',
                payload: res?.quote?.data?.filter((eachUnit: any) => eachUnit.unitID === selectedQuoteUnitID)[0]
            })
        }
        dispatch({
            type: 'appLoader',
            payload: false
        })
    }
    if (!res?.success) {
        console.log('get quote detail failed, see getQuoteDetail.ts')
    }
}

export default getQuoteDetailAndUpdateSelectedUnit;