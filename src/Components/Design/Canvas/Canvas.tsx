import React, { useEffect, useState } from 'react'
import './Canvas.scss'
import { DesignCanvas } from '@fulhaus/react.ui.design-canvas'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { useSelector, useDispatch} from 'react-redux';
import { Tappstate } from '../../../redux/reducers'
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler';
import { CSSTransition } from 'react-transition-group'
import apiRequest from '../../../Service/apiRequest';
import { getQuoteDetailAndUpdateSelectedUnit } from '../../../redux/Actions'

type CanvasState = {
    tabState: string;
}
const Canvas = ({ tabState }: CanvasState) => {
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const currentOrgID = useSelector((state: Tappstate) => state?.currentOrgID);
    const quoteID = useSelector((state: Tappstate) => state.quoteDetail)?._id;
    const unitID = useSelector((state: Tappstate) => state.selectedQuoteUnit)?.unitID;
    const dispatch = useDispatch()

    const [selectedRoom, setselectedRoom] = useState<any>(undefined);
    const [showRoomOptions, setshowRoomOptions] = useState(false);
    const [designItems, setdesignItems] = useState<any[]>([]);

    const updateDesignItems = () => {
        let items: any[] = [];
        let selectedRoomCanvasItems: any = selectedQuoteUnit?.rooms?.filter((each: any) => each?.roomID === selectedRoom?.roomID)?.[0]?.selectedCanvas?.items;
        if (selectedRoomCanvasItems) {
            for (let variable in selectedRoomCanvasItems) {
                for (let product of selectedRoomCanvasItems[variable]) {
                    if (product?.qty > 1) {
                        let index = product?.qty;
                        for (let i = 0; i < index; i++) {
                            items.push({
                                type: "image",
                                name: product?.name,
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
        setdesignItems(items);
    }

    useEffect(
        () => updateDesignItems(),
        [JSON.stringify(selectedQuoteUnit?.rooms?.filter((each: any) => each?.roomID === selectedRoom?.roomID)?.[0]?.selectedCanvas?.items)]
    )

    useEffect(() => {
        setselectedRoom(undefined);
    }, [selectedQuoteUnit?.unitID])

    const onRoomSelect = (eachRoom: any) => {
        setselectedRoom(eachRoom);
        setshowRoomOptions(false);
    }

    const goThisDraft = async (draftID: string) => {
        if (draftID !== selectedQuoteUnit?.rooms?.filter((each: any) => each?.roomID === selectedRoom?.roomID)?.[0]?.selectedCanvas?._id) {
            dispatch(
                {
                    type: 'appLoader',
                    payload: true
                }
            )
            const res = await apiRequest({
                url: `/api/fhapp-service/design/${currentOrgID}/${quoteID}/${unitID}/${selectedQuoteUnit?.rooms?.filter((each: any) => each?.roomID === selectedRoom?.roomID)?.[0]?.roomID}/selectCanvasDraft`,
                body: {
                    canvas_id: draftID
                },
                method: 'PATCH'
            })
            if (res?.success) {
                dispatch(getQuoteDetailAndUpdateSelectedUnit({
                    organizationID: currentOrgID ? currentOrgID : '',
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


    return <div className={`${tabState !== "Canvas" && 'canvas-display-none-important'} flex flex-col h-full canvas`}>
        <div className='flex px-4'>
            <div className='relative mr-8'>
                <div onClick={() => setshowRoomOptions(true)} className='flex px-2 py-2 text-lg font-semibold cursor-pointer font-moret'>
                    {selectedQuoteUnit ? (selectedRoom?.name ? selectedRoom?.name : 'SELECT A ROOM TO GET START') : 'SELECT A UNIT TO GET START'} <MdKeyboardArrowDown className='my-auto ml-2' /></div>
                {selectedQuoteUnit &&
                    <CSSTransition in={showRoomOptions} timeout={300} unmountOnExit classNames='opacity-animation'>
                        <div className='absolute z-50 bg-white border border-black border-solid w-72'>
                            <ClickOutsideAnElementHandler noStyle onClickedOutside={() => setshowRoomOptions(false)}>
                                {
                                    selectedQuoteUnit?.rooms?.map((eachRoom: any) => <div onClick={() => onRoomSelect(eachRoom)} className='w-full px-2 py-2 text-sm cursor-pointer font-ssp hover:bg-gray-200'>
                                        {eachRoom?.name}
                                    </div>
                                    )
                                }
                            </ClickOutsideAnElementHandler>
                        </div></CSSTransition>}
            </div>
        </div>
        <div className='flex flex-wrap px-4'>{
            selectedQuoteUnit?.rooms?.filter((each: any) => each?.roomID === selectedRoom?.roomID)?.[0]?.canvases?.map((eachCanvas: any) => <div onClick={()=>goThisDraft(eachCanvas)} className={`flex px-4 py-1 border border-solid mr-6 ${eachCanvas?._id === selectedQuoteUnit?.rooms?.filter((each: any) => each?.roomID === selectedRoom?.roomID)?.[0]?.selectedCanvas?._id ? 'text-white border-link bg-link' : 'text-black bg-transparent border-black cursor-pointer '}`}>
                {eachCanvas?.draftName}
            </div>
            )
        }
        </div>
        <DesignCanvas designItems={designItems?.length > 0 ? designItems : []} />
    </div>
}

export default Canvas