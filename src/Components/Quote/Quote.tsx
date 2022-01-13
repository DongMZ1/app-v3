import './Quote.scss'
import { ReactComponent as AddUnitIcon } from "../../styles/images/add-a-unit-to-get-start.svg";
import Room from './QuoteComponents/Room';
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import produce from 'immer'
import { useSelector, useDispatch } from 'react-redux';
import { Tappstate } from '../../redux/reducers';
import apiRequest from '../../Service/apiRequest';
const Quote = () => {
    const quoteUnitLength = useSelector((state: Tappstate) => state.quoteDetail)?.data?.length;
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail)
    const quoteID = useSelector((state: Tappstate) => state?.quoteDetail)?.quoteID;
    const unitID = useSelector((state: Tappstate) => state.selectedQuoteUnit)?.unitID;
    const dispatch = useDispatch();
    const addRoom = async (room: string) => {
        const res = await apiRequest({
            url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${unitID}`,
            body: { roomType: room },
            method: 'POST'
        })
        if(res?.success){
            const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft:any) => {
                draft.rooms = draft.rooms?.concat(res.newRoom);
            });
            //update selectedQuoteUnit
            dispatch({
                type:'selectedQuoteUnit',
                payload:newselectedQuoteUnit
            });
            //update quoteDetail
            const newquoteDetail = produce(quoteDetail, (draft:any) => {
                const index = draft.data.findIndex((each:any) => each?.unitID === unitID)
                draft.data[index] = newselectedQuoteUnit;
            });
            dispatch({
                type:'quoteDetail',
                payload:newquoteDetail
            });
        }else{
            console.log(res?.message)
        }
    }
    return <div className='flex flex-col w-full h-full px-6 pt-4 overflow-y-auto quote'>
        {(selectedQuoteUnit) ?
            <>
                <div className='flex'>
                    <div className='w-32 mr-8 text-sm-important'>
                        <DropdownListInput prefixIcon={<div className='flex'><div className='m-auto'>Add Room</div></div>} wrapperClassName='cursor-pointer dropdown-list-input-box-display-none' listWrapperClassName='width-52-important'
                            onSelect={(v) => addRoom(v)}
                            options={['bedroom', 'dining room', 'bathroom', 'living room', 'accessories', 'pillow set']} />
                    </div>
                    <div className='w-60 text-sm-important'>
                        <DropdownListInput placeholder='Add Muti-Room Package' wrapperClassName='cursor-pointer' listWrapperClassName='' options={['Custom Unit', 'Studio', '1BR', '2BR', '3BR', '1BR-HOTEL']} />
                    </div>
                </div>
                {
                    selectedQuoteUnit?.rooms?.map((each:any) => <Room eachRoom={each} />)
                }
            </>
            :
            <div className='m-auto'>
                <AddUnitIcon />
                <div className='flex text-4xl font-moret'><div className='mx-auto'>{quoteUnitLength === 0 ? 'Add' : 'Select'} a unit to get started</div></div>
            </div>
        }
    </div>
}

export default Quote;