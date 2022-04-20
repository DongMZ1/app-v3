import React, { useCallback, useEffect, useState } from 'react'
import './Canvas.scss'
import { DesignCanvas } from '@fulhaus/react.ui.design-canvas'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { useSelector, useDispatch } from 'react-redux';
import { Tappstate } from '../../../redux/reducers'
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler';
import { CSSTransition } from 'react-transition-group'
import apiRequest from '../../../Service/apiRequest';
import handleDownloadImages from '../../../Service/downloadImage';
import { getQuoteDetailAndUpdateSelectedUnit } from '../../../redux/Actions'
import DesignElements from './CanvasComponent/design-elements'
import produce from 'immer';
import debounce from 'lodash.debounce';
type CanvasState = {
    tabState: string;
}
const Canvas = () => {
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const currentOrgID = useSelector((state: Tappstate) => state?.currentOrgID);
    const quoteID = useSelector((state: Tappstate) => state.quoteDetail)?._id;
    const unitID = useSelector((state: Tappstate) => state.selectedQuoteUnit)?.unitID;
    const selectedProject = useSelector((state: Tappstate) => state.selectedProject);
    const projectID = useSelector((state: Tappstate) => state.selectedProject)?._id;
    const dispatch = useDispatch()

    const [selectedRoom, setselectedRoom] = useState<any>(undefined);
    const [showRoomOptions, setshowRoomOptions] = useState(false);
    const [showDesignElementsOption, setshowDesignElementsOption] = useState(false);

    const selectedCanvas = selectedQuoteUnit?.rooms?.filter((each: any) => each?.roomID === selectedRoom?.roomID)?.[0]?.selectedCanvas;

    useEffect(() => {
        if (selectedCanvas?._id && selectedCanvas?.designItems?.length === 0 && selectedCanvas?.items) {
            //if there is no design items, then initilite design items
            initialDesignItems();
        }
    }, [selectedCanvas?._id])

    useEffect(() => {
        setselectedRoom(undefined);
    }, [selectedQuoteUnit?.unitID]);

    useEffect(() => {
        //if room changes, I need to fetch the designItems with its position from remote, the sync it up
        if (selectedRoom?.roomID) {
            dispatch({
                type: 'appLoader',
                payload: true
            })
            dispatch(getQuoteDetailAndUpdateSelectedUnit({
                organizationID: currentOrgID ? currentOrgID : '',
                projectID,
                quoteID: quoteID,
                selectedQuoteUnitID: selectedQuoteUnit?.unitID
            }))
        }
    }, [selectedRoom?.roomID]);

    const debounceupdatePopulatedDesignItemsRemote = useCallback(debounce((designItems: any) => updatePopulatedDesignItemsRemote(designItems), 2000), [currentOrgID, selectedCanvas?._id, selectedProject?._id, projectID]);

    //when user drag items around, we add a debounce function to allow db save the items'location
    const updatePopulatedDesignItemsRemote = async (designItems: any) => {
        const res = await apiRequest({
            url: `/api/fhapp-service/design/${currentOrgID}/${projectID}/canvases/${selectedCanvas?._id}`,
            method: 'PATCH',
            body: { designItems }
        })
    }

    const initialDesignItems = async () => {
        let items: any[] = [];
        let selectedRoomCanvasItems: any = selectedCanvas?.items;
        //map everything inside items to design items
        if (selectedRoomCanvasItems) {
            for (let variable in selectedRoomCanvasItems) {
                for (let product of selectedRoomCanvasItems[variable]) {
                    if (product?.qty > 1) {
                        let index = product?.qty;
                        for (let i = 0; i < index; i++) {
                            items.push({
                                type: "image",
                                name: product?.name + (i >= 1 ? `--${i}` : ''),
                                value: product?.imageURLs[0],
                            })
                        }
                    }
                    if (product?.qty === 1) {
                        items.push({
                            type: "image",
                            name: product?.name,
                            value: product?.imageURLs[0],
                        })
                    }
                }
            }
        }
        dispatch({
            type: 'appLoader',
            payload: true
        })
        await updatePopulatedDesignItemsRemote(items);
        dispatch(getQuoteDetailAndUpdateSelectedUnit({
            organizationID: currentOrgID ? currentOrgID : '',
            projectID,
            quoteID: quoteID,
            selectedQuoteUnitID: selectedQuoteUnit?.unitID
        }))
    }

    const onRoomSelect = (eachRoom: any) => {
        setselectedRoom(eachRoom);
        setshowRoomOptions(false);
    }

    const goThisDraft = async (draftID: string) => {
        if (draftID !== selectedCanvas?._id) {
            dispatch(
                {
                    type: 'appLoader',
                    payload: true
                }
            )
            const res = await apiRequest({
                url: `/api/fhapp-service/design/${currentOrgID}/${projectID}/${quoteID}/${unitID}/${selectedQuoteUnit?.rooms?.filter((each: any) => each?.roomID === selectedRoom?.roomID)?.[0]?.roomID}/selectCanvasDraft`,
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

    const updateCanvasElement = async (item: any) => {
        if (selectedRoom?.roomID && selectedCanvas) {
            dispatch({
                type: 'appLoader',
                payload: true
            })
            const res = await apiRequest(
                {
                    url: `/api/fhapp-service/quote/${currentOrgID}/${selectedProject?._id}/${quoteID}`,
                    method: 'GET'
                }
            )
            if (res?.success) {
                dispatch({
                    type: 'quoteDetail',
                    payload: res?.quote
                })
                let resSelectedQuoteUnit = res?.quote?.data?.filter((eachUnit: any) => eachUnit.unitID === selectedQuoteUnit?.unitID)[0];
                const roomIndex = (resSelectedQuoteUnit.rooms as any[]).findIndex((each: any) => each.roomID === selectedRoom.roomID);
                await updatePopulatedDesignItemsRemote([...resSelectedQuoteUnit.rooms[roomIndex].selectedCanvas.designItems, item])
                const newSelectedQuoteUnit = produce(resSelectedQuoteUnit, (draft: any) => {
                    draft.rooms[roomIndex].selectedCanvas.designItems = [...draft.rooms[roomIndex].selectedCanvas.designItems, item]
                })
                dispatch({
                    type: 'selectedQuoteUnit',
                    payload: newSelectedQuoteUnit
                })
            }
            dispatch({
                type: 'appLoader',
                payload: false
            })
        }

    }


    return <div className={`w-full flex flex-col h-full canvas`}>
        <div className='flex px-4'>
            <div className='relative mr-8'>
                <div onClick={() => { if (selectedQuoteUnit) { setshowRoomOptions(true) } }} className='flex px-2 py-1 text-lg font-semibold cursor-pointer font-moret'>
                    {selectedQuoteUnit ? (selectedRoom?.name ? selectedRoom?.name : 'SELECT A ROOM TO GET START') : 'SELECT A UNIT TO GET START'} <MdKeyboardArrowDown className='my-auto ml-2' /></div>
                {selectedQuoteUnit &&
                    <CSSTransition in={showRoomOptions} timeout={300} unmountOnExit classNames='opacity-animation'>
                        <div className='absolute z-50 bg-white border border-black border-solid w-72'>
                            <ClickOutsideAnElementHandler noStyle onClickedOutside={() => setshowRoomOptions(false)}>
                                {
                                    selectedQuoteUnit?.rooms?.map((eachRoom: any) => <div onClick={() => onRoomSelect(eachRoom)} className='flex w-full px-2 py-2 text-sm cursor-pointer font-ssp hover:bg-gray-200'>
                                        {eachRoom?.name}
                                    </div>
                                    )
                                }
                            </ClickOutsideAnElementHandler>
                        </div></CSSTransition>}
            </div>
            {
                selectedQuoteUnit?.rooms?.filter((each: any) => each?.roomID === selectedRoom?.roomID)?.[0]?.canvases?.map((eachCanvas: any) => <div onClick={() => goThisDraft(eachCanvas)} className={`flex px-4 my-1 border border-solid mr-6 ${eachCanvas?._id === selectedCanvas?._id ? 'text-white border-link bg-link' : 'text-black bg-transparent border-black cursor-pointer '}`}>
                    <div className='m-auto'>{eachCanvas?.draftName}</div>
                </div>
                )
            }
        </div>
        <DesignCanvas
            onAddDesignElements={() => setshowDesignElementsOption(state => !state)}
            designItems={(selectedCanvas?.designItems?.length > 0 ? selectedCanvas?.designItems : [])}
            onDownloadImages={() => handleDownloadImages(selectedCanvas?.designItems)}
            onChange={(v) => debounceupdatePopulatedDesignItemsRemote(v?.designItems)}
        />
        {showDesignElementsOption && <DesignElements onSelect={(v, n) => {
            updateCanvasElement({
                type: "image",
                name: n,
                value: v,
            })
        }} />}
    </div>
}

export default Canvas