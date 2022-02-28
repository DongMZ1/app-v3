import {useState} from 'react'
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler'
import { Button } from '@fulhaus/react.ui.button'

type CatalogueFilterPriceProps = {
    showPrice: boolean,
    setshowPrice: React.Dispatch<React.SetStateAction<boolean>>,
}
const CatalogueFilterPrice = ({ showPrice, setshowPrice}: CatalogueFilterPriceProps) => {
    const [minPrice, setminPrice] = useState(0);
    const [maxPrice, setmaxPrice] = useState(3200);
    return  <ClickOutsideAnElementHandler onClickedOutside={() => setshowPrice(false)}>
                <div className='absolute z-50 px-4 py-6 border border-black border-solid w-400px bg-cream'>
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
                            max="3200"
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
                            max="3200"
                            className="absolute w-full max-price-slider"
                        />
                    </div>
                    <div className='relative flex w-full mt-6'>
                        <div className='absolute text-sm font-ssp' style={{ left: `${minPrice * 100 / (3200 + minPrice / 10)}%` }}>{minPrice}</div>
                        <div className='absolute text-sm font-ssp' style={{ left: `${maxPrice * 100 / (3200 + maxPrice / 10)}%` }}>{maxPrice}</div>
                    </div>
                    <div className='flex mt-8'>
                        <div className='w-1/2 text-xs font-ssp'>Minimum</div>
                        <div className='w-1/2 text-xs font-ssp'>Maximum</div>
                    </div>
                    <div className='flex input-active-outline-none'>
                        <div className='flex bg-white border-t border-b border-l border-black border-solid'><div className='pl-1 my-auto text-xs'>$</div></div>
                        <input type='number' value={minPrice} onChange={(e) => setminPrice(e.target.valueAsNumber)} className='py-1 text-xs border-t border-b border-r border-black border-solid w-36' />
                        <div className='flex bg-white border-t border-b border-l border-black border-solid ml-7'><div className='pl-1 my-auto text-xs'>$</div></div>
                        <input type='number' value={maxPrice} onChange={(e) => setmaxPrice(e.target.valueAsNumber)} className='py-1 text-xs border-t border-b border-r border-black border-solid w-36' />
                    </div>
                    <div className='flex mt-8 mb-2'>
                        <Button onClick={() => setshowPrice(false)} variant='secondary' className='w-24 ml-auto mr-4'>Cancel</Button>
                        <Button disabled={minPrice > maxPrice} className='w-24'>Apply</Button>
                    </div>
                </div>
        </ClickOutsideAnElementHandler>
}

export default CatalogueFilterPrice;