import React, { useEffect, useState } from 'react'
import './Canvas.scss'
import { DesignCanvas } from '@fulhaus/react.ui.design-canvas'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { useSelector } from 'react-redux';
import { Tappstate } from '../../../redux/reducers'
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler';
import { CSSTransition } from 'react-transition-group'
type CanvasState = {
    tabState: string;
}
const Canvas = ({ tabState }: CanvasState) => {
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
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

    useEffect(() => updateDesignItems(), [JSON.stringify(selectedQuoteUnit?.rooms?.filter((each: any) => each?.roomID === selectedRoom?.roomID)?.[0]?.selectedCanvas?.items)])

    useEffect(() => {
        setselectedRoom(undefined);
    }, [selectedQuoteUnit?.unitID])

    const onRoomSelect = (eachRoom: any) => {
        setselectedRoom(eachRoom);
        setshowRoomOptions(false);
    }


    return <div className={`${tabState !== "Canvas" && 'canvas-display-none-important'} flex flex-col h-full canvas`}>
        <div className='flex'>
            <div className='relative px-4'>
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
        <DesignCanvas designItems={designItems?.length > 0 ? designItems : []} />
    </div>
}

export default Canvas