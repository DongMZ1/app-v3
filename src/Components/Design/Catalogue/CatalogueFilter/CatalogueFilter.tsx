import { useState, useRef } from 'react'
import { ColorPicker } from "@fulhaus/react.ui.color-picker";
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler'
import { Button } from '@fulhaus/react.ui.button'
import { Checkbox } from '@fulhaus/react.ui.checkbox'
import { BsChevronDown } from 'react-icons/bs'
import { AiOutlineRight } from 'react-icons/ai'
import { FiArrowLeft } from 'react-icons/fi'
import { TextInput } from '@fulhaus/react.ui.text-input'
import './CatalogueFilter.scss'

import CatalogueFilterRoomAndStyle from './CatalogueFilterRoomAndStyle';
import CatelogueFilterItemType from './CatelogueFilterItemType';
import CatalogueFilterColor from './CatalogueFilterColor';
import CatalogueFilterSource from './CatalogueFilterSource';

const CatalogueFilter = () => {
    //Rooms and Styles states => CatalogueFilterRoomAndStyle.tsx
    const [showRoomsAndStyle, setshowRoomsAndStyle] = useState(false);
    const [roomsAndStyleRoom, setroomsAndStyleRoom] = useState<string[]>([]);
    const [roomsAndStyleCollections, setroomsAndStyleCollections] = useState<string[]>([]);
    //Source & Availability state => CatalogueFilterSource.tsx
    const [showSourceAvailability, setshowSourceAvailability] = useState(false);
    const [source, setsource] = useState<string[]>([]);
    const [availability, setavailability] = useState<string[]>([]);

    //Price state
    const [showPrice, setshowPrice] = useState(false);
    const [minPrice, setminPrice] = useState(0);
    const [maxPrice, setmaxPrice] = useState(3200);

    //Colour => CatalogueFilterColor.tsx
    const [showColorMenu, setshowColorMenu] = useState(false);
    const [showOtherColorMenu, setshowOtherColorMenu] = useState(false);

    //itemType => CatelogueFilterItemType.tsx
    const [showItemType, setshowItemType] = useState(false);
    const [itemTypes, setitemTypes] = useState<string[]>([]);
    const [lengthUnit, setlengthUnit] = useState('inch');
    const [weightUnit, setweightUnit] = useState('Pounds');
    const [W, setW] = useState('');
    const [L, setL] = useState('');
    const [H, setH] = useState('');
    const [minWeight, setminWeight] = useState(0);
    const [maxWeight, setmaxWeight] = useState(150);

    return (
        <div className="w-full px-4 catalogue-filter">
            <div className="flex mt-4">
                <CatalogueFilterRoomAndStyle 
                setroomsAndStyleRoom={setroomsAndStyleRoom}
                roomsAndStyleRoom={roomsAndStyleRoom}
                setroomsAndStyleCollections={setroomsAndStyleCollections}
                showRoomsAndStyle={showRoomsAndStyle}
                setshowRoomsAndStyle={setshowRoomsAndStyle}
                roomsAndStyleCollections={roomsAndStyleCollections}
                />
                <CatelogueFilterItemType
                showItemType={showItemType}
                setshowItemType={setshowItemType}
                itemTypes={itemTypes}
                setitemTypes={setitemTypes}
                lengthUnit={lengthUnit}
                setlengthUnit={setlengthUnit}
                weightUnit={weightUnit}
                setweightUnit={setweightUnit}
                W={W}
                setW={setW}
                L={L}
                setL={setL}
                H={H}
                setH={setH}
                minWeight={minWeight}
                setminWeight={setminWeight}
                maxWeight={maxWeight}
                setmaxWeight={setmaxWeight}
                />
                {/*------------------------------------------------------Vendors------------------------------------------------*/}
                <div className='w-24 mr-4'>
                    <div className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Vendors</div><BsChevronDown className='my-auto' /></div>
                </div>
                <CatalogueFilterColor
                showColorMenu={showColorMenu}
                setshowColorMenu={setshowColorMenu}
                showOtherColorMenu={showOtherColorMenu}
                setshowOtherColorMenu ={setshowOtherColorMenu }
                />
            </div>
            <div className="flex mt-4 dropdown-component-overwrite">
                {/**--------------------------------source and availability--------------------------------------------- */}
                <CatalogueFilterSource
                showSourceAvailability={showSourceAvailability}
                setshowSourceAvailability={setshowSourceAvailability}
                source={source}
                setsource={setsource}
                availability={availability}
                setavailability={setavailability}
                />
                {/**---------------------------------------price--------------------------------------------------------- */}
                <div className='w-1/6 mr-4'>
                    <div onClick={() => setshowPrice(true)} className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Price</div><BsChevronDown className='my-auto' /></div>
                    {showPrice &&
                        <ClickOutsideAnElementHandler onClickedOutside={() => setshowPrice(false)}>
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
                                    <Button className='w-24'>Apply</Button>
                                </div>
                            </div>
                        </ClickOutsideAnElementHandler>
                    }
                </div>
                <div className='w-1/6 mr-4'>
                    <div className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Distance</div><BsChevronDown className='my-auto' /></div>
                </div>
            </div>
        </div>
    )
}

export default CatalogueFilter;