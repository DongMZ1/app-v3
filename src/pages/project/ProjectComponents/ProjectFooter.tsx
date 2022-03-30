import { useState, useEffect, useCallback } from 'react'
import { Tappstate } from "../../../redux/reducers";
import { useSelector, useDispatch } from "react-redux";
import apiRequest from '../../../Service/apiRequest';
import debounce from 'lodash.debounce';
import { useHistory } from 'react-router';
import { getQuoteDetail } from '../../../redux/Actions';
import useDebounce from '../../../Hooks/useDebounce'
const ProjectFooter = () => {
    const [unitTotal, setunitTotal] = useState(0);
    const [quoteTotal, setquoteTotal] = useState(0);
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const selectedProject = useSelector((state: Tappstate) => state.selectedProject)
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID)
    const JSONquoteDetail = useDebounce(JSON.stringify(quoteDetail), 1500);
    const JSONselectedQuoteUnit = useDebounce(JSON.stringify(selectedQuoteUnit), 1500);
    const history = useHistory();
    const dispatch = useDispatch();
    useEffect(
        () => {
            if (JSONquoteDetail && ((window.location.href.includes('/project/quote')) || (window.location.href.includes('/quote-only')|| window.location.href.includes('/project/design') || window.location.href.includes('/design-only')))) {
                getQuoteTotal()
            }
        }, [JSONquoteDetail, window.location.href]
    )
    useEffect(
        () => {
            if (JSONselectedQuoteUnit && ((window.location.href.includes('/project/quote')) || (window.location.href.includes('/quote-only')|| window.location.href.includes('/project/design') || window.location.href.includes('/design-only')))) {
                getUnitTotal()
            }
        }, [JSONselectedQuoteUnit, window.location.href]
    )
    const getUnitTotal = async () => {
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/quote/${currentOrgID}/${quoteDetail?._id}/${selectedQuoteUnit?.unitID}/total`,
                method: 'GET'
            }
        )
        if (res?.success) {
            setunitTotal(res.unitTotal);
        }
    }
    const getQuoteTotal = async () => {
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/quote/${currentOrgID}/${quoteDetail?._id}/total`,
                method: 'GET'
            }
        )
        if (res?.success) {
            setquoteTotal(res.quoteTotal);
        }
    }
    return <div className='flex w-full px-6 text-white font-ssp bg-linkSelected h-14'>
        {(window.location.href.includes('/project/quote') || window.location.href.includes('/quote-only') || window.location.href.includes('/project/design') || window.location.href.includes('/design-only')) &&
            <>
                <div className='my-auto mr-4 text-lg font-semibold'>{selectedQuoteUnit ? selectedQuoteUnit.name : 'No Unit Selected'}</div>
                <div className='my-auto mr-4 text-3xl font-semibold'>·</div>
                <div className='my-auto text-lg font-semibold'>{selectedQuoteUnit ? selectedQuoteUnit.count : '0'} Unit</div>
                <div className='my-auto ml-auto mr-6 text-sm'>Unit Total: <b>{selectedQuoteUnit ? `$${unitTotal.toFixed(2)}` : 'No Unit Selected'}</b></div>
                <div className='my-auto mr-6 text-sm'>Project Total <b>${quoteTotal ? quoteTotal.toFixed(2) : 0}</b></div>
                <div onClick={() => {
                    dispatch({
                        type: 'appLoader',
                        payload: true
                    })
                    dispatch({
                        type: 'selectedQuoteUnit',
                        payload: undefined
                    })
                    dispatch(getQuoteDetail({
                        organizationID: currentOrgID ? currentOrgID : '',
                        quoteID: quoteDetail?._id
                    }))
                    setTimeout(() => {
                        dispatch({
                            type: 'appLoader',
                            payload: false
                        })
                        history.push('/quote-summary-rental')
                    }, 1200)
                }} className='px-4 py-1 my-auto mr-6 text-sm font-semibold bg-black cursor-pointer'>View Overall Budget</div>
            </>}
        {
            (window.location.href.includes('/quote-summary-rental') || window.location.href.includes('/quote-summary-purchase')) &&
            <>
                <div className='my-auto mr-4 text-lg font-semibold'>Client Name</div>
                <div onClick={() => {
                    history.push(selectedProject?.type === 'project' ? '/project/quote' : '/quote-only')
                }} className='px-4 py-1 my-auto ml-auto mr-6 text-sm font-semibold bg-black cursor-pointer'>Exit Overall Budget</div>
                <div onClick={() => { }} className='px-4 py-1 my-auto mr-6 text-sm font-semibold bg-black cursor-pointer'>Export PDF</div>
            </>
        }
    </div>
}

export default ProjectFooter