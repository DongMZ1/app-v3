import { useState, useEffect } from 'react'
import { Tappstate } from "../../../redux/reducers";
import { useSelector } from "react-redux";
import apiRequest from '../../../Service/apiRequest';
import debounce from 'lodash.debounce';
const ProjectFooter = () => {
    const [unitTotal, setunitTotal] = useState(0);
    const [quoteTotal, setquoteTotal] = useState(0);
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID)
    const JSONquoteDetail = JSON.stringify(quoteDetail);
    const JSONselectedQuoteUnit = JSON.stringify(selectedQuoteUnit);
    useEffect(
        () => {
            const getQuoteTotal = async () => {
                const res = await apiRequest(
                    {
                        url: `/api/fhapp-service/quote/${currentOrgID}/${quoteDetail.quoteID}/total`,
                        method: 'GET'
                    }
                )
                if(res?.success){
                    setquoteTotal(res.quoteTotal);
                }
            }
            const debounceGetQuoteTotal = debounce(
                getQuoteTotal, 500
            )
            if (JSONquoteDetail) {
                debounceGetQuoteTotal();
            }
        }, [JSONquoteDetail]
    )
    useEffect(
        () => {
            const getUnitTotal = async () => {
                const res = await apiRequest(
                    {
                        url: `/api/fhapp-service/quote/${currentOrgID}/${quoteDetail.quoteID}/${selectedQuoteUnit.unitID}/total`,
                        method: 'GET'
                    }
                )
                if(res?.success){
                    setunitTotal(res.unitTotal);
                }
            }
            const debounceGetUnitTotal = debounce(
                getUnitTotal, 500
            )
            if(JSONselectedQuoteUnit){
                debounceGetUnitTotal();
            }
        }, [JSONselectedQuoteUnit]
    )
    return <div className='flex w-full px-6 text-white font-ssp bg-linkSelected h-14'>
        <div className='my-auto mr-4 text-lg font-semibold'>{selectedQuoteUnit ? selectedQuoteUnit.unitType : 'No Unit Selected'}</div>
        <div className='my-auto mr-4 text-3xl font-semibold'>·</div>
        <div className='my-auto text-lg font-semibold'>{selectedQuoteUnit ? selectedQuoteUnit.count : '0'} Unit</div>
        <div className='my-auto ml-auto mr-6 text-sm'>Unit Total <b>{selectedQuoteUnit? `$${unitTotal}`: 'No Unit Selected'}</b></div>
        <div className='my-auto mr-6 text-sm'>Project Total <b>${quoteTotal? quoteTotal : 0}</b></div>
        <div className='px-4 py-1 my-auto mr-6 text-sm font-semibold bg-black cursor-pointer'>View Overall Budget</div>
    </div>
}

export default ProjectFooter