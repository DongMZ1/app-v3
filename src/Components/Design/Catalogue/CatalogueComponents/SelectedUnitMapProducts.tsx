import React, { useEffect, useState } from 'react'
import './SelectedUnitMapProducts.scss'
import { useDispatch, useSelector } from 'react-redux'
import { Tappstate } from '../../../../redux/reducers'
import { ReactComponent as AddUnitIcon } from "../../../../styles/images/add-a-unit-to-get-start.svg";
import { FurnitureInRoomHeader } from '@fulhaus/react.ui.furniture-in-room-header';
import { Button } from '@fulhaus/react.ui.button';
import { Popup } from '@fulhaus/react.ui.popup';
import { TextInput } from '@fulhaus/react.ui.text-input';
import {BsPlusLg} from 'react-icons/bs'
import SelectedUnitMapProductsCategory from './SelectedUnitMapProductsCategory';
import apiRequest from '../../../../Service/apiRequest';
import { getQuoteDetailAndUpdateSelectedUnit } from '../../../../redux/Actions'
const SelectedUnitMapProducts = () => {
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole;
    if (!selectedQuoteUnit) {
        return <div className='m-auto'>
            <AddUnitIcon />
            <div className='flex text-4xl font-moret'><div className='mx-auto'>Select a unit to get started</div></div>
        </div>
    }

    const calculateTotalRoomProductsPrice = (room: any) => {
        const roomTotal = room?.categories?.map((eachCategory: any) => {
            return eachCategory?.items?.map((each: any) => each?.retailPrice * each?.qty)?.reduce((a: any, b: any) => a + b, 0)
        })?.reduce((a: any, b: any) => a + b, 0) * room?.count
        return roomTotal ? roomTotal : 0;
    }
    return <><div className='flex-1 p-4 overflow-auto selected-unit-map-products'>
        {
            selectedQuoteUnit?.rooms?.map((eachRoom: any) => <SelectedUnitMapProductsRoom
                eachRoom={eachRoom}
                calculateTotalRoomProductsPrice={calculateTotalRoomProductsPrice}
                userRole={userRole}
            />)
        }
    </div>
    </>
}

type SelectedUnitMapProductsRoomProps = {
    eachRoom: any,
    calculateTotalRoomProductsPrice: (room: any) => number,
    userRole: string,
}
const SelectedUnitMapProductsRoom = ({ eachRoom, calculateTotalRoomProductsPrice, userRole }: SelectedUnitMapProductsRoomProps) => {
    const [showConfirmBackToDraft, setshowConfirmBackToDraft] = useState(false);
    const [showConfirmDeleteDraft, setshowConfirmDeleteDraft] = useState(false);

    const [showConfirmRenameDraft, setshowConfirmRenameDraft] = useState(false);
    const [projectRenameName, setprojectRenameName] = useState('');

    const [showConfirmDuplicateDraft, setshowConfirmDuplicateDraft] = useState(false);
    const [duplicateName, setduplicateName] = useState('');

    const [roomProductCanvas, setroomProductCanvas] = useState([]);

    const currentOrgID = useSelector((state: Tappstate) => state?.currentOrgID);
    const quoteID = useSelector((state: Tappstate) => state.quoteDetail)?._id;
    const unitID = useSelector((state: Tappstate) => state.selectedQuoteUnit)?.unitID;
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);

    const dispatch = useDispatch()
    useEffect(() => {
        const createCanvaForRoom = async () => {
            dispatch(
                {
                    type:'appLoader',
                    payload: true
                }
            )
            const res = await apiRequest({
                url: `/api/fhapp-service/design/${currentOrgID}/${quoteID}/${unitID}/${eachRoom?.roomID}/canvas`,
                method: 'POST',
            })
            if(res?.success){
                dispatch(getQuoteDetailAndUpdateSelectedUnit({
                    organizationID: currentOrgID ? currentOrgID : '',
                    quoteID: quoteID,
                    selectedQuoteUnitID: selectedQuoteUnit?.unitID
                }))
            }
        }
        if(eachRoom?.roomID && (!eachRoom?.selectedCanvas?._id)){
            createCanvaForRoom();
        }
    }, [eachRoom?.roomID])
    return <><div className='mb-6'>
        <FurnitureInRoomHeader totalProductPrice={calculateTotalRoomProductsPrice(eachRoom)} editable={false} roomNumber={eachRoom?.count} roomName={eachRoom?.name} totalPrice={eachRoom?.totalAmount} >
            <>
                {
                    eachRoom?.categories?.map(
                        (eachCategory: any) =>
                            <SelectedUnitMapProductsCategory selectedCanvas={eachRoom?.selectedCanvas} eachCategory={eachCategory} eachRoom={eachRoom} />
                    )
                }
                {userRole !== 'viewer' &&
                    <div className='flex flex-wrap mt-2 mr-28'>
                        <div className='flex px-4 py-1 mr-6 text-white bg-link'>
                            <div onClick={() => setshowConfirmBackToDraft(true)} className='my-auto text-sm font-semibold cursor-pointer'>Draft 1</div>
                            <div className='relative px-2 my-auto font-semibold show-draft-menu'>
                                <div>···</div>
                                <div className='z-50 text-sm font-normal bg-white border border-black border-solid cursor-pointer draft-menu'>
                                    <div className='py-2 pl-4 pr-6 text-black' onClick={() => setshowConfirmRenameDraft(true)}>Rename</div>
                                    <div className='py-2 pl-4 pr-6 text-black' onClick={() => setshowConfirmDuplicateDraft(true)}>Duplicate</div>
                                    <div className='py-2 pl-4 pr-6 text-red' onClick={() => setshowConfirmDeleteDraft(true)}>Delete</div>
                                </div>
                            </div>
                        </div>
                        <BsPlusLg className='my-auto cursor-pointer' />
                    </div>
                }
            </>
        </FurnitureInRoomHeader>
    </div>
        <Popup horizontalAlignment='center' verticalAlignment='center' onClose={() => setshowConfirmBackToDraft(false)} show={showConfirmBackToDraft}>
            <div className='px-8 py-4 border border-black border-solid w-96 bg-cream'>
                <div className='mx-2 text-base text-center font-moret'>
                    Are you sure you want to go back to <b>Draft 1</b>, changes you made will not be saved
                </div>
                <div className='flex mt-4 mb-2'>
                    <Button onClick={() => {
                        setshowConfirmBackToDraft(false);
                    }} className='w-20 ml-auto mr-4' variant='secondary'>Cancel</Button>
                    <Button onClick={() => { }} variant='primary' className='w-20'>Revert</Button>
                </div>
            </div>
        </Popup>
        <Popup horizontalAlignment='center' verticalAlignment='center' onClose={() => setshowConfirmDeleteDraft(false)} show={showConfirmDeleteDraft}>
            <div className='px-8 py-4 border border-black border-solid w-96 bg-cream'>
                <div className='mx-2 text-base text-center font-moret'>
                    Are you sure you want to <b>Delete Draft 1</b>?
                </div>
                <div className='flex mt-4 mb-2'>
                    <Button onClick={() => {
                        setshowConfirmDeleteDraft(false);
                    }} className='w-20 ml-auto mr-4' variant='secondary'>Cancel</Button>
                    <Button onClick={() => { }} variant='primary' className='w-20'>Delete</Button>
                </div>
            </div>
        </Popup>
        <Popup horizontalAlignment='center' verticalAlignment='center' onClose={() => setshowConfirmRenameDraft(false)} show={showConfirmRenameDraft}>
            <div className='px-8 py-4 border border-black border-solid w-96 bg-cream'>
                <div className='mx-2 text-xl text-center font-moret'>
                    Rename <b>Draft 1</b>
                </div>
                <div className='mt-4 text-sm font-ssp'>Maximum 50 characters</div>
                <TextInput className='mt-2' inputName='save as room package input' variant='box' value={projectRenameName} onChange={(e) => { if ((e.target as any).value?.length < 51) { setprojectRenameName((e.target as any).value) } }} />
                <div className='flex my-2'>
                    <Button onClick={() => {
                        setshowConfirmRenameDraft(false);
                    }} className='w-20 mr-4' variant='secondary'>Cancel</Button>
                    <Button disabled={!projectRenameName} onClick={() => {

                    }} variant='primary' className='w-20'>Save</Button>
                </div>
            </div>
        </Popup>
        <Popup horizontalAlignment='center' verticalAlignment='center' onClose={() => setshowConfirmDuplicateDraft(false)} show={showConfirmDuplicateDraft}>
            <div className='px-8 py-4 border border-black border-solid w-96 bg-cream'>
                <div className='mx-2 text-xl text-center font-moret'>
                    please enter a name for duplicate <b>Draft 1</b>
                </div>
                <div className='mt-4 text-sm font-ssp'>Maximum 50 characters</div>
                <TextInput className='mt-2' inputName='save as room package input' variant='box' value={duplicateName} onChange={(e) => { if ((e.target as any).value?.length < 51) { setduplicateName((e.target as any).value) } }} />
                <div className='flex my-2'>
                    <Button onClick={() => {
                        setshowConfirmDuplicateDraft(false);
                    }} className='w-20 mr-4' variant='secondary'>Cancel</Button>
                    <Button disabled={!duplicateName} onClick={() => {

                    }} variant='primary' className='w-20'>Save</Button>
                </div>
            </div>
        </Popup>
    </>
}

export default SelectedUnitMapProducts