import React, { useEffect, useState } from 'react'
import './SelectedUnitMapProducts.scss'
import { useDispatch, useSelector } from 'react-redux'
import { Tappstate } from '../../../../redux/reducers'
import { ReactComponent as AddUnitIcon } from "../../../../styles/images/add-a-unit-to-get-start.svg";
import { FurnitureInRoomHeader } from '@fulhaus/react.ui.furniture-in-room-header';
import { Button } from '@fulhaus/react.ui.button';
import { Popup } from '@fulhaus/react.ui.popup';
import { TextInput } from '@fulhaus/react.ui.text-input';
import { BsPlusLg } from 'react-icons/bs'
import SelectedUnitMapProductsCategory from './SelectedUnitMapProductsCategory';
import apiRequest from '../../../../Service/apiRequest';
import { getQuoteDetailAndUpdateSelectedUnit } from '../../../../redux/Actions'
const SelectedUnitMapProducts = () => {
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole;
    const projectID = useSelector((state:Tappstate) => state.selectedProject)?._id;
    if (!selectedQuoteUnit) {
        return <div className='m-auto'>
            <AddUnitIcon />
            <div className='flex text-4xl font-moret'><div className='mx-auto'>Select a unit to get started</div></div>
        </div>
    }
    return <><div className='flex-1 p-4 overflow-auto selected-unit-map-products'>
        {
            selectedQuoteUnit?.rooms?.map((eachRoom: any) => <SelectedUnitMapProductsRoom
                eachRoom={eachRoom}
                userRole={userRole}
            />)
        }
    </div>
    </>
}

type SelectedUnitMapProductsRoomProps = {
    eachRoom: any,
    userRole: string,
}
const SelectedUnitMapProductsRoom = ({ eachRoom, userRole }: SelectedUnitMapProductsRoomProps) => {
    const [showConfirmDeleteDraft, setshowConfirmDeleteDraft] = useState(false);

    const [showConfirmRenameDraft, setshowConfirmRenameDraft] = useState(false);
    const [draftRenameName, setdraftRenameName] = useState('');

    const [showConfirmDuplicateDraft, setshowConfirmDuplicateDraft] = useState(false);
    const [duplicateDraftName, setduplicateDraftName] = useState('');

    const [selectedDraft, setselectedDraft] = useState<any>();

    const currentOrgID = useSelector((state: Tappstate) => state?.currentOrgID);
    const quoteID = useSelector((state: Tappstate) => state.quoteDetail)?._id;
    const unitID = useSelector((state: Tappstate) => state.selectedQuoteUnit)?.unitID;
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const projectID = useSelector((state:Tappstate) => state.selectedProject)?._id;

    const dispatch = useDispatch()
    useEffect(() => {
        if (eachRoom?.roomID && (!eachRoom?.selectedCanvas?._id)) {
            createCanvaForRoom();
        }
    }, [eachRoom?.roomID]);

    const createCanvaForRoom = async () => {
        dispatch(
            {
                type: 'appLoader',
                payload: true
            }
        )
        const res = await apiRequest({
            url: `/api/fhapp-service/design/${currentOrgID}/${quoteID}/${unitID}/${eachRoom?.roomID}/canvas`,
            method: 'POST',
        })
        if (res?.success) {
            dispatch(getQuoteDetailAndUpdateSelectedUnit({
                organizationID: currentOrgID ? currentOrgID : '',
                projectID,
                quoteID: quoteID,
                selectedQuoteUnitID: selectedQuoteUnit?.unitID
            }))
        } else {
            dispatch(
                {
                    type: 'appLoader',
                    payload: false
                }
            )
        }
    }

    const calculateTotalRoomProductsPrice = () => {
        let roomTotal = 0;
        if (eachRoom?.selectedCanvas) {
            for (let variable in eachRoom?.selectedCanvas?.items) {
                roomTotal = roomTotal + (eachRoom?.selectedCanvas?.items?.[variable]?.length > 0 ? eachRoom?.selectedCanvas?.items?.[variable]?.map((eachProduct: any) => {
                    return eachProduct?.qty * eachProduct?.tradePrice
                }
                )?.reduce((a: any, b: any) => a + b, 0) : 0)
            }
        }
        return roomTotal * eachRoom?.count;
    }
    const renameCanvas = async () => {
        dispatch({
            type: 'appLoader',
            payload: true
        });
        const res = await apiRequest({
            url: `/api/fhapp-service/design/${currentOrgID}/canvases/${selectedDraft?._id}`,
            method: 'PATCH',
            body: { draftName: draftRenameName }
        })
        if (res?.success) {
            dispatch(getQuoteDetailAndUpdateSelectedUnit({
                organizationID: currentOrgID ? currentOrgID : '',
                projectID,
                quoteID: quoteID,
                selectedQuoteUnitID: selectedQuoteUnit?.unitID
            }))
            setshowConfirmRenameDraft(false);
        }
        if (!res?.success) {
            console.log('rename for draft failed at SelectedUnitMapProducts.tsx')
            dispatch({
                type: 'appLoader',
                payload: false
            });
        }
    }

    const duplicateDraft = async () => {
        dispatch({
            type: 'appLoader',
            payload: true
        });
        const draftItemNeedToDuplicateRes = await apiRequest({
            url: `/api/fhapp-service/design/${currentOrgID}/canvases/${selectedDraft?._id}`,
            method: 'GET'
        })
        if (draftItemNeedToDuplicateRes?.success) {
            const res = await apiRequest({
                url: `/api/fhapp-service/design/${currentOrgID}/${quoteID}/${unitID}/${eachRoom?.roomID}/canvas`,
                method: 'POST',
                body: {
                    draftName: duplicateDraftName,
                    items: draftItemNeedToDuplicateRes?.canvas?.items
                }
            })
            if (res?.success) {
                dispatch(getQuoteDetailAndUpdateSelectedUnit({
                    organizationID: currentOrgID as any,
                    projectID,
                    quoteID: quoteID,
                    selectedQuoteUnitID: selectedQuoteUnit?.unitID
                }))
                setshowConfirmDuplicateDraft(false);
            }
            if (!res?.success) {
                console.log('rename for draft failed at SelectedUnitMapProducts.tsx')
                dispatch({
                    type: 'appLoader',
                    payload: false
                });
            }
        } else {
            dispatch(
                {
                    type: 'appLoader',
                    payload: false
                }
            )
            console.log('draftItemNeedToDuplicateRes fail at SelectedUnitMapProducts.tsx')
        }
    }

    const goThisDraft = async (draftID: string) => {
        if (draftID !== eachRoom?.selectedCanvas?._id) {
            dispatch(
                {
                    type: 'appLoader',
                    payload: true
                }
            )
            const res = await apiRequest({
                url: `/api/fhapp-service/design/${currentOrgID}/${quoteID}/${unitID}/${eachRoom?.roomID}/selectCanvasDraft`,
                body: {
                    canvas_id: draftID
                },
                method: 'PATCH'
            })
            if (res?.success) {
                dispatch(getQuoteDetailAndUpdateSelectedUnit({
                    organizationID: currentOrgID ? currentOrgID : '',
                    projectID,
                    quoteID: quoteID,
                    selectedQuoteUnitID: selectedQuoteUnit?.unitID
                }))
            } else {
                dispatch(
                    {
                        type: 'appLoader',
                        payload: false
                    }
                )
                console.log('goThisDraft failed at SelectedUnitMapProduct.tsx')
            }
        }
    }

    const deleteDraft = async () => {
        dispatch(
            {
                type: 'appLoader',
                payload: true
            }
        )
        const res = await apiRequest({
            url: `/api/fhapp-service/design/${currentOrgID}/canvases/${selectedDraft?._id}`,
            method: 'DELETE',
            body: {
                quote_id: quoteID,
                unitID: unitID,
                roomID: eachRoom?.roomID,
                isSelectedCanvas: selectedDraft?._id === eachRoom?.selectedCanvas?._id
            }
        })
        if (res?.success) {
            dispatch(getQuoteDetailAndUpdateSelectedUnit({
                organizationID: currentOrgID ? currentOrgID : '',
                projectID,
                quoteID: quoteID,
                selectedQuoteUnitID: selectedQuoteUnit?.unitID
            }))
            setshowConfirmDeleteDraft(false);
        } else {
            dispatch(
                {
                    type: 'appLoader',
                    payload: false
                }
            )
            console.log('Delete Draft fail at SelectedUnitMapProduct.tsx')
        }
    }
    return <><div className='mb-6'>
        <FurnitureInRoomHeader totalProductPrice={Number(calculateTotalRoomProductsPrice().toFixed(2))} editable={false} roomNumber={eachRoom?.count} roomName={eachRoom?.name} totalPrice={eachRoom?.totalAmount?.toFixed(2)} >
            <>
                {
                    eachRoom?.categories?.map(
                        (eachCategory: any) =>
                            <SelectedUnitMapProductsCategory eachCategory={eachCategory} eachRoom={eachRoom} />
                    )
                }
                {userRole !== 'viewer' &&
                    <div className='flex flex-wrap mt-2 mr-28'>
                        {eachRoom?.canvases?.map((each: any) =>
                            <div className='my-1'>
                                <div className={`flex px-4 py-1 border border-solid mr-6 ${each?._id === eachRoom?.selectedCanvas?._id ? 'text-white border-link bg-link' : 'text-black bg-transparent border-black'}`}>
                                    <div onClick={() => goThisDraft(each?._id)} className='my-auto text-sm font-semibold cursor-pointer'>{each?.draftName}</div>
                                    <div className='relative px-2 my-auto font-semibold show-draft-menu'>
                                        <div className='cursor-pointer'>···</div>
                                        <div className='z-50 text-sm font-normal bg-white border border-black border-solid cursor-pointer draft-menu'>
                                            <div className='py-2 pl-4 pr-6 text-black' onClick={() => {
                                                setselectedDraft(each);
                                                setdraftRenameName(each?.draftName);
                                                setshowConfirmRenameDraft(true);
                                            }}>Rename</div>
                                            <div className='py-2 pl-4 pr-6 text-black' onClick={() => {
                                                setselectedDraft(each);
                                                setduplicateDraftName(each?.draftName);
                                                setshowConfirmDuplicateDraft(true);
                                            }}>Duplicate</div>
                                            {eachRoom?.canvases?.length > 1 &&
                                                <div className='py-2 pl-4 pr-6 text-red' onClick={() => {
                                                    setselectedDraft(each);
                                                    setshowConfirmDeleteDraft(true)
                                                }}>Delete</div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                        }
                        <BsPlusLg onClick={() => createCanvaForRoom()} className='my-auto cursor-pointer' />
                    </div>
                }
            </>
        </FurnitureInRoomHeader>
    </div>
        <Popup horizontalAlignment='center' verticalAlignment='center' onClose={() => setshowConfirmDeleteDraft(false)} show={showConfirmDeleteDraft}>
            <div className='px-8 py-4 border border-black border-solid w-96 bg-cream'>
                <div className='mx-2 text-base text-center font-moret'>
                    Are you sure you want to <b>Delete {selectedDraft?.draftName}</b>?
                </div>
                <div className='flex mt-4 mb-2'>
                    <Button onClick={() =>
                        setshowConfirmDeleteDraft(false)
                    } className='w-20 ml-auto mr-4' variant='secondary'>Cancel</Button>
                    <Button onClick={() => deleteDraft()} variant='primary' className='w-20'>Delete</Button>
                </div>
            </div>
        </Popup>
        <Popup horizontalAlignment='center' verticalAlignment='center' onClose={() => setshowConfirmRenameDraft(false)} show={showConfirmRenameDraft}>
            <div className='px-8 py-4 border border-black border-solid w-96 bg-cream'>
                <div className='mx-2 text-xl text-center font-moret'>
                    Rename <b>{selectedDraft?.draftName}</b>
                </div>
                <div className='mt-4 text-sm font-ssp'>Maximum 30 characters</div>
                <TextInput className='mt-2' inputName='save as room package input' variant='box' value={draftRenameName} onChange={(e) => { if ((e.target as any).value?.length < 31) { setdraftRenameName((e.target as any).value) } }} />
                <div className='flex my-2'>
                    <Button onClick={() => {
                        setshowConfirmRenameDraft(false);
                    }} className='w-20 mr-4' variant='secondary'>Cancel</Button>
                    <Button disabled={!draftRenameName} onClick={() => renameCanvas()} variant='primary' className='w-20'>Save</Button>
                </div>
            </div>
        </Popup>
        <Popup horizontalAlignment='center' verticalAlignment='center' onClose={() => setshowConfirmDuplicateDraft(false)} show={showConfirmDuplicateDraft}>
            <div className='px-8 py-4 border border-black border-solid w-96 bg-cream'>
                <div className='mx-2 text-xl text-center font-moret'>
                    please enter a name for duplicate <b>{selectedDraft?.draftName}</b>
                </div>
                <div className='mt-4 text-sm font-ssp'>Maximum 30 characters</div>
                <TextInput className='mt-2' inputName='save as room package input' variant='box' value={duplicateDraftName} onChange={(e) => { if ((e.target as any).value?.length < 31) { setduplicateDraftName((e.target as any).value) } }} />
                <div className='flex my-2'>
                    <Button onClick={() => {
                        setshowConfirmDuplicateDraft(false);
                    }} className='w-20 mr-4' variant='secondary'>Cancel</Button>
                    <Button disabled={!duplicateDraftName} onClick={() => duplicateDraft()} variant='primary' className='w-20'>Save</Button>
                </div>
            </div>
        </Popup>
    </>
}

export default SelectedUnitMapProducts