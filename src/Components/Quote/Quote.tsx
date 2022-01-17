import { useState, useEffect } from 'react'
import './Quote.scss'
import { ReactComponent as AddUnitIcon } from "../../styles/images/add-a-unit-to-get-start.svg";
import Room from './QuoteComponents/Room';
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import produce from 'immer'
import { useSelector, useDispatch } from 'react-redux';
import { Tappstate } from '../../redux/reducers';
import apiRequest from '../../Service/apiRequest';
const Quote = () => {
    const [roomItemOptions, setroomItemOptions] = useState<string[]>();
    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole;
    const quoteUnitLength = useSelector((state: Tappstate) => state.quoteDetail)?.data?.length;
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail)
    const quoteID = useSelector((state: Tappstate) => state?.quoteDetail)?.quoteID;
    const unitID = useSelector((state: Tappstate) => state.selectedQuoteUnit)?.unitID;
    const dispatch = useDispatch();
    const allRentable = !(selectedQuoteUnit?.rooms as any[])?.some(eachRoom => (eachRoom?.categories as any[])?.some(eachCategory => !eachCategory.rentable))
    useEffect(
        () => {
            //if item options is not provided
            const getRoomItemOptions = async () => {
                const res = await apiRequest({
                    url: '/api/products-service/categories',
                    method: 'GET'
                })
                if (res?.success) {
                    setroomItemOptions(res.data.map((each: any) => each.name))
                }
            }
            if (!roomItemOptions) {
                getRoomItemOptions();
            }
        }, []
    )

    //need to update this every time, because selectedQuoteUnit info will not update with updateQuoteDetail
    const updateQuoteDetail = (newselectedQuoteUnit: any) => {
        //update quoteDetail
        const newquoteDetail = produce(quoteDetail, (draft: any) => {
            const index = draft.data.findIndex((each: any) => each?.unitID === unitID)
            draft.data[index] = newselectedQuoteUnit;
        });
        dispatch({
            type: 'quoteDetail',
            payload: newquoteDetail
        });
    }

    const markAll = () => {
        //if all of them are rentable, then we need to unmark them
            const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
                draft.rooms.forEach((eachRoom: any) => {
                    eachRoom.categories.forEach((eachCategory: any) => eachCategory.rentable = !allRentable)
                    const res = apiRequest({
                        url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${unitID}/${eachRoom.roomID}`,
                        body: {
                            categories: eachRoom.categories
                        },
                        method: 'PATCH'
                    })
                    if (!(res as any)?.success) {
                        console.log((res as any).message)
                    }
                })
            });
            dispatch({
                type: 'selectedQuoteUnit',
                payload: newselectedQuoteUnit
            });
            updateQuoteDetail(newselectedQuoteUnit);
    }
    const addRoom = async (room: string) => {
        const res = await apiRequest({
            url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${unitID}`,
            body: { roomType: room },
            method: 'POST'
        })
        if (res?.success) {
            const newselectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
                draft.rooms = draft.rooms?.concat(res.newRoom);
            });
            //update selectedQuoteUnit
            dispatch({
                type: 'selectedQuoteUnit',
                payload: newselectedQuoteUnit
            });
            //update quoteDetail
            const newquoteDetail = produce(quoteDetail, (draft: any) => {
                const index = draft.data.findIndex((each: any) => each?.unitID === unitID)
                draft.data[index] = newselectedQuoteUnit;
            });
            dispatch({
                type: 'quoteDetail',
                payload: newquoteDetail
            });
        } else {
            console.log(res?.message)
        }
    }
    return <div className='flex flex-col w-full h-full px-6 py-4 overflow-y-auto quote'>
        {(selectedQuoteUnit) ?
            <>
                {userRole !== 'viewer' &&
                    <div className='flex'>
                        <div className='w-32 mr-8 text-sm-important'>
                            <DropdownListInput prefixIcon={<div className='flex'><div className='m-auto'>Add Room</div></div>} wrapperClassName='cursor-pointer dropdown-list-input-box-display-none' listWrapperClassName='width-52-important'
                                onSelect={(v) => addRoom(v)}
                                options={['bedroom', 'dining room', 'bathroom', 'living room', 'accessories', 'pillow set']} />
                        </div>
                        <div className='w-60 text-sm-important'>
                            <DropdownListInput placeholder='Add Muti-Room Package' wrapperClassName='cursor-pointer' listWrapperClassName='' options={['Custom Unit', 'Studio', '1BR', '2BR', '3BR', '1BR-HOTEL']} />
                        </div>
                        <div
                            onClick={() => markAll()}
                            className='my-auto ml-auto font-semibold border-b border-solid cursor-pointer text-link font-ssp border-link'>{allRentable ? 'Mark all as not rentable' : 'Mark all as rentable'}</div>
                    </div>
                }
                {
                    selectedQuoteUnit?.rooms?.map((each: any) => <Room updateQuoteDetail={updateQuoteDetail} roomItemOptions={roomItemOptions} eachRoom={each} />)
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