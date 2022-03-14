import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler'
import { Button } from '@fulhaus/react.ui.button'
import { BsChevronDown } from 'react-icons/bs'
import { AiOutlineRight } from 'react-icons/ai'
import { FiArrowLeft } from 'react-icons/fi'
import { ColorPicker } from "@fulhaus/react.ui.color-picker";
import { CSSTransition } from 'react-transition-group'
import { useSelector, useDispatch } from 'react-redux'
import { Tappstate } from '../../../../redux/reducers'
import produce from 'immer';
type CatalogueFilterColorProps = {
    showColorMenu: boolean,
    setshowColorMenu: React.Dispatch<React.SetStateAction<boolean>>,
    showOtherColorMenu: boolean,
    setshowOtherColorMenu: React.Dispatch<React.SetStateAction<boolean>>
}
export const CatalogueFilterColorPageOne = ({ showColorMenu, setshowColorMenu, showOtherColorMenu, setshowOtherColorMenu }: CatalogueFilterColorProps) => {
    const filterCatalogue = useSelector((state: Tappstate) => state.filterCatalogue);
    const dispatch = useDispatch();
    const applyColor = (color: string) => {
        const newFilterCatalogue = produce(filterCatalogue, (draft: any) => {
            draft.color = color;
        })
        dispatch({
            type: 'filterCatalogue',
            payload: newFilterCatalogue
        });
        setshowColorMenu(false)
    }
    return <ClickOutsideAnElementHandler onClickedOutside={() => setshowColorMenu(false)}>
        <div className='absolute z-50 px-4 bg-white border border-black border-solid w-200px'>
            {
                ['Red', 'Blue', 'Orange', 'Black', 'Grey'].map(each =>
                    <div className='flex px-1 py-2 cursor-pointer' onClick={() => applyColor(each)}>
                        <div style={{ borderRadius: '50%', backgroundColor: each }} className='w-2 h-2 my-auto mr-4'></div>
                        <div className='my-auto text-sm font-ssp text-secondary'>{each}</div>
                    </div>
                )
            }
            <div className='flex px-1 py-2 cursor-pointer' onClick={() => {
                setshowColorMenu(false);
                setshowOtherColorMenu(true);
            }}>
                <div style={{ borderRadius: '50%', background: 'conic-gradient(from 180deg at 50% 50%, #FF0000 0deg, #FFB800 68.86deg, #FFF500 136.36deg, #05FF00 198.24deg, #00F0FF 245.12deg, #000AFF 301.37deg, #FA00FF 360deg)' }} className='w-2 h-2 my-auto mr-4'></div>
                <div className='my-auto text-sm font-ssp text-secondary'>other</div>
                <AiOutlineRight className='my-auto ml-auto' />
            </div>
        </div>
    </ClickOutsideAnElementHandler>
}

export const CatalogueFilterColorPageTwo = ({ showColorMenu, setshowColorMenu, showOtherColorMenu, setshowOtherColorMenu }: CatalogueFilterColorProps) => {
    return <ClickOutsideAnElementHandler onClickedOutside={() => setshowOtherColorMenu(false)}>
        <div className='absolute z-50 px-4 py-4 bg-white border border-black border-solid w-400px'>
            <div className='flex mb-2'>
                <FiArrowLeft onClick={() => {
                    setshowColorMenu(true);
                    setshowOtherColorMenu(false);
                }} className='my-auto mr-4 cursor-pointer' />
                <div className='my-auto text-sm font-semibold font-ssp'>Other Colour</div>
            </div>
            <ColorPicker />
            <div className='flex justify-around mt-4'>
                <Button onClick={() => setshowOtherColorMenu(false)} variant='secondary' className='w-24 ml-auto mr-4'>Cancel</Button>
                <Button disabled className=''>RGBA Not Available</Button>
            </div>
        </div>
    </ClickOutsideAnElementHandler>
}