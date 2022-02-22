import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler'
import { Button } from '@fulhaus/react.ui.button'
import { BsChevronDown } from 'react-icons/bs'
import { AiOutlineRight } from 'react-icons/ai'
import { FiArrowLeft } from 'react-icons/fi'
import { ColorPicker } from "@fulhaus/react.ui.color-picker";
import { CSSTransition } from 'react-transition-group'

type CatalogueFilterColorProps = {
    showColorMenu: boolean,
    setshowColorMenu: React.Dispatch<React.SetStateAction<boolean>>,
    showOtherColorMenu: boolean,
    setshowOtherColorMenu: React.Dispatch<React.SetStateAction<boolean>>
}
const CatalogueFilterColor = ({ showColorMenu, setshowColorMenu, showOtherColorMenu, setshowOtherColorMenu }: CatalogueFilterColorProps) => {
    return <div className='w-1/6 mr-4'>
        <div onClick={() => setshowColorMenu(true)} className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Colour</div><BsChevronDown className='my-auto' /></div>
        <ClickOutsideAnElementHandler onClickedOutside={() => setshowColorMenu(false)}>
            <CSSTransition in={showColorMenu} timeout={300} unmountOnExit classNames='opacity-animation'>
                <div className='absolute z-50 px-4 bg-white border border-black border-solid w-200px'>
                    {
                        ['red', 'blue', 'orange', 'black', 'grey'].map(each =>
                            <div className='flex px-1 py-2 cursor-pointer'>
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
            </CSSTransition>
        </ClickOutsideAnElementHandler>
          <ClickOutsideAnElementHandler onClickedOutside={() => setshowOtherColorMenu(false)}>
          <CSSTransition in={showOtherColorMenu} timeout={300} unmountOnExit classNames='opacity-animation'>
                <div className='absolute z-50 px-4 py-4 bg-white border border-black border-solid w-200px'>
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
                        <Button className='w-24'>Apply</Button>
                    </div>
                </div>
                </CSSTransition>
            </ClickOutsideAnElementHandler>
        
    </div>
}

export default CatalogueFilterColor;