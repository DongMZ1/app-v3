import { useState, useEffect } from 'react';
import { ReactComponent as ExitIcon } from '../../../styles/images/exit.svg';
import { Popup } from '@fulhaus/react.ui.popup';
import { Button } from '@fulhaus/react.ui.button';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineRight } from 'react-icons/ai'
import apiRequest from '../../../Service/apiRequest';
import { Tappstate } from '../../../redux/reducers';
import { Loader } from '@fulhaus/react.ui.loader';
import getQuoteDetail from '../../../redux/Actions/getQuoteDetail'
type VersionHistoryType = {
    close: () => void
}
const VersionHistory = ({ close }: VersionHistoryType) => {
    const [showConfirm, setshowConfirm] = useState(false);
    const [allversions, setallversions] = useState<any[]>();
    const [selectedVersion, setselectedVersion] = useState<any>();
    const [loading, setloading] = useState(true);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteID = useSelector((state: Tappstate) => state.quoteDetail)?._id;
    const quoteRefID = useSelector((state: Tappstate) => state.quoteDetail)?.quoteRefID;
    const selectedProject = useSelector((state: Tappstate) => state.selectedProject)
    const dispatch = useDispatch();
    useEffect(
        () => {
            const getAllVersions = async () => {
                const res = await apiRequest({
                    url: `/api/fhapp-service/quote/${currentOrgID}/${quoteRefID}/versions`,
                    method: 'GET'
                })
                if (res?.success) {
                    setallversions(res.quoteVersions)
                }
                setloading(false);
            }
            getAllVersions();
        }, []
    )

    const revertVersion = async () => {
        if (selectedVersion) {
            const res = await apiRequest({
                url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/revert`,
                method: 'PATCH',
                body: {
                    revert_to_quote_id: selectedVersion._id
                }
            })
            if (res?.success) {
                setshowConfirm(false);
                //need some backend improvement in the future, fetch quote again, not best approach
                //if it is a project or quote-only, then get the quote based on projectID
                if ((selectedProject?.type === 'project' || selectedProject?.type === 'quote') && currentOrgID) {
                    dispatch(getQuoteDetail({ organizationID: currentOrgID, quoteID: selectedProject?.quote?._id }))
                }
                //
                //make selected unit undefined to avoid mistake
                dispatch({
                    type: 'selectedQuoteUnit',
                    payload: undefined
                })
            } else {
                console.log('revert version failed at VersionHistory.tsx')
            }
        }
    }
    return <>
        <div className='fixed top-0 z-10 flex w-full h-full overflow-y-auto bg-black bg-opacity-50'>
            <div className='w-2/3 h-full' onClick={() => close()}></div>
            <div className='z-10 w-1/3 h-full px-4 py-4 overflow-auto border-l border-black border-solid bg-cream'>
                <div className='flex'>
                    <div className='text-2xl uppercase font-moret'>version history</div>
                    <ExitIcon onClick={() => close()} className='my-auto ml-auto cursor-pointer' />
                </div>
                {
                    !loading && allversions?.map(eachVersion =>
                        <div onClick={() => {
                            setselectedVersion(eachVersion);
                            setshowConfirm(true);
                        }} className='flex px-2 py-2 text-sm border-b border-black border-solid cursor-pointer'>
                            <div className='my-auto'>{eachVersion.versionName}</div>
                            <AiOutlineRight className='my-auto ml-auto cursor-pointer' />
                        </div>)
                }
                {
                    loading && <div className='flex justify-center mt-12'>
                            <Loader />
                        </div>
                }
                {
                    !loading && (allversions?.length === 0 || !allversions) && <div className='mt-4 text-sm font-ssp'>
                               No Saved Version
                        </div>
                }
            </div>
        </div>
        <Popup horizontalAlignment='center' verticalAlignment='center' onClose={() => setshowConfirm(false)} show={showConfirm}>
            <div className='px-8 py-4 border border-black border-solid w-96 bg-cream'>
                <div className='mx-2 text-base text-center font-moret'>
                    Are you sure you want to go back to <b>{selectedVersion?.versionName}</b>, changes you made will not be saved
                </div>
                <div className='flex mt-4 mb-2'>
                    <Button onClick={() => {
                        setshowConfirm(false);
                    }} className='w-20 ml-auto mr-4' variant='secondary'>Cancel</Button>
                    <Button onClick={() => revertVersion()} variant='primary' className='w-20'>Revert</Button>
                </div>
            </div>
        </Popup>
    </>
}

export default VersionHistory