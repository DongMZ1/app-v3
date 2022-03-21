import { useState } from 'react'
import { ImUnlocked } from 'react-icons/im'
import { useSelector, useDispatch } from 'react-redux'
import { Tappstate } from '../../../redux/reducers'
import { FaLock } from 'react-icons/fa'
import apiRequest from '../../../Service/apiRequest'
import produce from 'immer'
const LockQuote = () => {
    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole;
    const quoteDetail = useSelector((state: Tappstate) => state?.quoteDetail);
    const dispatch = useDispatch()
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const lockQuote = async () => {
        if (currentOrgID && quoteDetail?._id) {
            dispatch({
                type: 'appLoader',
                payload: true
            });
            const res = await apiRequest({
                url: `/api/fhapp-service/quote/${currentOrgID}/${quoteDetail?._id}/lockAndUnlockQuote`,
                body: {
                    approved: true
                },
                method: 'PATCH'
            })
            if (res?.success) {
                const newQuoteDetail = produce(quoteDetail, (draft: any) => {
                    draft.approved = true
                })
                dispatch({
                    type: 'quoteDetail',
                    payload: newQuoteDetail
                })
            }
            dispatch({
                type: 'appLoader',
                payload: false
            });
        }
    }
    const unlockQuote = async () => {
        if (userRole !== 'viewer' && userRole !== 'editor' && currentOrgID && quoteDetail?._id) {
            dispatch({
                type: 'appLoader',
                payload: true
            });
            const res = await apiRequest({
                url: `/api/fhapp-service/quote/${currentOrgID}/${quoteDetail?._id}/lockAndUnlockQuote`,
                body: {
                    approved: false
                },
                method: 'PATCH'
            })
            if (res?.success) {
                const newQuoteDetail = produce(quoteDetail, (draft: any) => {
                    draft.approved = false
                })
                dispatch({
                    type: 'quoteDetail',
                    payload: newQuoteDetail
                })
            }
            dispatch({
                type: 'appLoader',
                payload: false
            });
        }
    }
    return <>
        {
            userRole !== 'viewer' && userRole !== 'editor' && (window.location.href.includes('/quote-only') || window.location.href.includes('/project/quote')) && !quoteDetail?.approved && <ImUnlocked onClick={() => lockQuote()} className='my-auto mr-8 cursor-pointer' />
        }
        {
            quoteDetail?.approved && <FaLock color='red' onClick={() => unlockQuote()} className={`my-auto mr-8 ${(userRole !== 'viewer' && userRole !== 'editor') ? 'cursor-pointer' : ''}`} />
        }
    </>
}

export default LockQuote