import {useState} from 'react'
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler'
import { Button } from '@fulhaus/react.ui.button'
import { Tappstate } from '../../../../redux/reducers'
import {useSelector, useDispatch} from 'react-redux'
import produce from 'immer'
type CatalogueFilterPriceProps = {
    showPrice: boolean,
    setshowPrice: React.Dispatch<React.SetStateAction<boolean>>,
}
const CatalogueFilterPrice = ({ showPrice, setshowPrice}: CatalogueFilterPriceProps) => {
    const filterCatalogue = useSelector((state: Tappstate) => state.filterCatalogue);
    const dispatch = useDispatch();
    const [minPrice, setminPrice] = useState(filterCatalogue?.minPrice ? filterCatalogue?.minPrice : 0);
    const [maxPrice, setmaxPrice] = useState(filterCatalogue?.maxPrice ? filterCatalogue?.maxPrice : 50000);

    const apply = () => {
        const newFilterCatalogue = produce(filterCatalogue, (draft: any) => {
            draft.minPrice = minPrice;
            draft.maxPrice = maxPrice;
        })
        dispatch({
            type: 'filterCatalogue',
            payload: newFilterCatalogue
        });
        setshowPrice(false);
    }
    return  <ClickOutsideAnElementHandler onClickedOutside={() => setshowPrice(false)}>
                <div className='absolute right-0 z-50 px-4 py-6 border border-black border-solid w-400px bg-cream'>
                    <div className='text-sm font-semibold font-ssp'>Price</div>
                    <div className='relative w-full mt-4'>
                        <input
                            type="range"
                            value={minPrice}
                            onChange={
                                (e) => {
                                    if (e.target.valueAsNumber < maxPrice) {
                                        setminPrice(e.target.valueAsNumber)
                                    }
                                }
                            }
                            min="0"
                            max="50000"
                            className="absolute w-full min-price-slider"
                        />
                        <input
                            type="range"
                            value={maxPrice}
                            onChange={(e) => {
                                if (e.target.valueAsNumber > minPrice) {
                                    setmaxPrice(e.target.valueAsNumber)
                                }
                            }}
                            min="0"
                            max="50000"
                            className="absolute w-full max-price-slider"
                        />
                    </div>
                    <div className='flex mt-8'>
                        <div className='w-1/2 text-xs font-ssp'>Minimum</div>
                        <div className='w-1/2 text-xs font-ssp'>Maximum</div>
                    </div>
                    <div className='flex input-active-outline-none'>
                        <div className='flex bg-white border-t border-b border-l border-black border-solid'><div className='pl-1 my-auto text-xs'>$</div></div>
                        <input type='number' value={minPrice} onChange={(e) => {if (e.target.valueAsNumber < maxPrice) {
                                        setminPrice(e.target.valueAsNumber)
                                    }}} className='py-1 text-xs border-t border-b border-r border-black border-solid w-36' />
                        <div className='flex bg-white border-t border-b border-l border-black border-solid ml-7'><div className='pl-1 my-auto text-xs'>$</div></div>
                        <input type='number' value={maxPrice} onChange={(e) => {
                            if (e.target.valueAsNumber > minPrice) {
                                setmaxPrice(e.target.valueAsNumber)
                            }
                        }} className='py-1 text-xs border-t border-b border-r border-black border-solid w-36' />
                    </div>
                    <div className='flex mt-8 mb-2'>
                        <Button onClick={() => setshowPrice(false)} variant='secondary' className='w-24 ml-auto mr-4'>Cancel</Button>
                        <Button disabled={minPrice > maxPrice} onClick={() => apply()} className='w-24'>Apply</Button>
                    </div>
                </div>
        </ClickOutsideAnElementHandler>
}

export default CatalogueFilterPrice;