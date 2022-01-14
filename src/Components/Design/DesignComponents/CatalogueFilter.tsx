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
//rooms and styles options
const roomOptions = ['Dining Room', 'Bedroom', 'Living Room', 'Family Room', 'Bathroom', 'Office']
const collectionsOptions = ['Biophilia', 'Nuevo 80s', 'Dark Scandi', 'Grandmillennial', 'Classic Blue', 'LIght & Luxe']
const groupOptions = ['Spring/Summer 2021', 'Fall/Winter 2021']

//Source & Availability options
const sourceOptions = ['Vendor Data', 'Clipped Items', 'Starred / Favourited'];
const availabilityOptions = ['In Stock', 'Restocking', 'Out of Stock', 'Unknown'];
//Item type
const itemTypeOptions = ['Dining Chair', 'Office Chair', 'End Table', 'Office Table', 'Console Table', 'Couch', 'Loveseat']

const CatalogueFilter = () => {
    //Rooms and Styles states
    const [showRoomsAndStyle, setshowRoomsAndStyle] = useState(false);
    const [roomsAndStyleRoom, setroomsAndStyleRoom] = useState<string[]>([]);
    const [roomsAndStyleCollections, setroomsAndStyleCollections] = useState<string[]>([]);
    //Source & Availability state
    const [showSourceAvailability, setshowSourceAvailability] = useState(false);
    const [source, setsource] = useState<string[]>([]);
    const [availability, setavailability] = useState<string[]>([]);

    //Price state
    const [showPrice, setshowPrice] = useState(false);
    const [minPrice, setminPrice] = useState(0);
    const [maxPrice, setmaxPrice] = useState(3200);

    //Colour
    const [showColorMenu, setshowColorMenu] = useState(false);
    const [showOtherColorMenu, setshowOtherColorMenu] = useState(false);

    //itemType
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
                {/**-----------------------Rooms and Styles Selector ------------------------------------------------------------*/}
                <div className='relative w-32 mr-4' >
                    <div onClick={() => setshowRoomsAndStyle(true)} className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Rooms & Styles</div><BsChevronDown className='my-auto' /></div>
                    {showRoomsAndStyle &&
                        <ClickOutsideAnElementHandler onClickedOutside={() => setshowRoomsAndStyle(false)}>
                            <div className='absolute z-50 px-4 py-6 border border-black border-solid w-400px bg-cream'>
                                <div className='flex'>
                                    <div className='w-1/2'>
                                        <div className='text-sm font-semibold font-ssp'>Room</div>
                                        {roomOptions.every(each => roomsAndStyleRoom.includes(each)) ?
                                            <div onClick={() => setroomsAndStyleRoom([])} className='mt-2 text-sm cursor-pointer select-none font-ssp text-link w-max'>
                                                Unselect All
                                            </div>
                                            :
                                            <div onClick={() => setroomsAndStyleRoom(roomOptions)} className='mt-2 text-sm cursor-pointer select-none font-ssp text-link w-max'>
                                                Select All
                                            </div>}
                                        {roomOptions.map(eachRoom => <Checkbox label={eachRoom} className='mt-4 text-sm text-secondary' checked={roomsAndStyleRoom.includes(eachRoom)} onChange={(checked) => {
                                            if (checked) {
                                                setroomsAndStyleRoom(state => state.concat(eachRoom))
                                            } else {
                                                setroomsAndStyleRoom(state => state.filter(each => each !== eachRoom))
                                            }
                                        }} />)}
                                    </div>
                                    <div className='w-1/2 dropdown-list-input-overwrite'>
                                        <div className='text-sm font-semibold font-ssp'>Group</div>
                                        <DropdownListInput wrapperClassName='mt-2' initialValue={groupOptions[0]} options={groupOptions} />
                                        <div className='mt-4 text-sm font-semibold font-ssp'>Collection</div>
                                        {collectionsOptions.every(each => roomsAndStyleCollections.includes(each)) ?
                                            <div onClick={() => setroomsAndStyleCollections([])} className='mt-2 text-sm cursor-pointer select-none font-ssp text-link w-max'>
                                                Unselect All
                                            </div>
                                            :
                                            <div onClick={() => setroomsAndStyleCollections(collectionsOptions)} className='mt-2 text-sm cursor-pointer select-none font-ssp text-link w-max'>
                                                Select All
                                            </div>}
                                        {collectionsOptions.map(eachRoom => <Checkbox label={eachRoom} className='mt-4 text-sm text-secondary' checked={roomsAndStyleCollections.includes(eachRoom)} onChange={(checked) => {
                                            if (checked) {
                                                setroomsAndStyleCollections(state => state.concat(eachRoom))
                                            } else {
                                                setroomsAndStyleCollections(state => state.filter(each => each !== eachRoom))
                                            }
                                        }} />)}
                                    </div>
                                </div>
                                <div className='flex mt-8 mb-2'>
                                    <Button onClick={() => setshowRoomsAndStyle(false)} variant='secondary' className='w-24 ml-auto mr-4'>Cancel</Button>
                                    <Button className='w-24'>Apply</Button>
                                </div>
                            </div>
                        </ClickOutsideAnElementHandler>
                    }
                </div>
                {/*------------------------------------------------------Vendors------------------------------------------------*/}
                <div className='w-24 mr-4'>
                    <div className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Vendors</div><BsChevronDown className='my-auto' /></div>
                </div>
                {/*------------------------------------------------------Item type------------------------------------------------*/}
                <div className='w-24 mr-4'>
                    <div onClick={() => setshowItemType(true)} className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Item type</div><BsChevronDown className='my-auto' /></div>
                    {
                        showItemType && <ClickOutsideAnElementHandler onClickedOutside={() => setshowItemType(false)}>
                            <div className='absolute z-50 px-4 py-6 border border-black border-solid w-400px bg-cream'>
                                <div className='flex w-full'>
                                    <div className='w-2/5 '>
                                        <div className='text-sm font-semibold font-ssp'>Item Type</div>
                                        {itemTypeOptions.every(each => itemTypes.includes(each)) ?
                                            <div onClick={() => setitemTypes([])} className='mt-2 text-sm cursor-pointer select-none font-ssp text-link w-max'>
                                                Unselect All
                                            </div>
                                            :
                                            <div onClick={() => setitemTypes(itemTypeOptions)} className='mt-2 text-sm cursor-pointer select-none font-ssp text-link w-max'>
                                                Select All
                                            </div>}
                                        {itemTypeOptions.map(eachType => <Checkbox label={eachType} className='mt-4 text-sm text-secondary' checked={itemTypes.includes(eachType)} onChange={(checked) => {
                                            if (checked) {
                                                setitemTypes(state => state.concat(eachType))
                                            } else {
                                                setitemTypes(state => state.filter(each => each !== eachType))
                                            }
                                        }} />)}
                                    </div>
                                    <div className='w-3/5 '>
                                        <div className='text-sm font-semibold font-ssp'>Dimension</div>
                                        <div className='flex mt-4'>
                                            <DropdownListInput wrapperClassName='mr-4' initialValue={lengthUnit} options={['inch', 'cm']} />
                                            <DropdownListInput wrapperClassName='' initialValue={weightUnit} options={['Pounds', 'kg']} />
                                        </div>
                                        <div className='flex justify-between mt-4'>
                                            <div className='w-16 text-input-width-80p'>
                                                <TextInput
                                                    variant='box'
                                                    value={W}
                                                    onChange={(v) => setW((v.target as any).value)}
                                                    inputName='widthInput'
                                                    type='number'
                                                    prefix={<small>W</small>}
                                                />
                                            </div>
                                            <div className='w-16 text-input-width-80p'>
                                                <TextInput
                                                    variant='box'
                                                    value={L}
                                                    onChange={(v) => setL((v.target as any).value)}
                                                    inputName='widthInput'
                                                    type='number'
                                                    prefix={<small>L</small>}
                                                />
                                            </div>
                                            <div className='w-16 text-input-width-80p'>
                                                <TextInput
                                                    variant='box'
                                                    value={H}
                                                    onChange={(v) => setH((v.target as any).value)}
                                                    inputName='widthInput'
                                                    type='number'
                                                    prefix={<small>H</small>}
                                                />
                                            </div>
                                        </div>
                                        <div className='relative w-full mt-4'>
                                            <input
                                                type="range"
                                                value={minWeight}
                                                onChange={
                                                    (e) => {
                                                        if (e.target.valueAsNumber < maxWeight) {
                                                            setminWeight(e.target.valueAsNumber)
                                                        }
                                                    }
                                                }
                                                min="0"
                                                max="150"
                                                className="absolute w-full min-price-slider"
                                            />
                                            <input
                                                type="range"
                                                value={maxWeight}
                                                onChange={(e) => {
                                                    if (e.target.valueAsNumber > minWeight) {
                                                        setmaxWeight(e.target.valueAsNumber)
                                                    }
                                                }}
                                                min="0"
                                                max="150"
                                                className="absolute w-full max-price-slider"
                                            />
                                        </div>
                                        <div className='relative flex w-full mt-6'>
                                            <div className='absolute text-sm font-ssp' style={{ left: `${minWeight * 100 / (150 + minWeight / 10)}%` }}>{minWeight}</div>
                                            <div className='absolute text-sm font-ssp' style={{ left: `${maxWeight * 100 / (150 + maxWeight / 10)}%` }}>{maxWeight}</div>
                                        </div>
                                        <div className='flex mt-8'>
                                            <div className='w-1/2 text-xs font-ssp'>Minimum</div>
                                            <div className='w-1/2 text-xs font-ssp'>Maximum</div>
                                        </div>
                                        <div className='flex mt-4'>
                                            <div className='w-1/2 text-input-width-100p'>
                                                <TextInput
                                                    variant='box'
                                                    value={minWeight?.toString()}
                                                    onChange={(v) => {
                                                        if (((v.target as any).value <= 150 && (v.target as any).value < maxWeight) || !(v.target as any).value)
                                                            setminWeight((v.target as any).value)
                                                    }}
                                                    inputName='widthInput'
                                                    type='number'
                                                    suffix={<small>Lbs</small>}
                                                />
                                            </div>
                                            <div className='w-1/2 text-input-width-100p'>
                                                <TextInput
                                                    variant='box'
                                                    value={maxWeight?.toString()}
                                                    onChange={(v) => {
                                                        if (((v.target as any).value <= 150 && (v.target as any).value > minWeight) || !(v.target as any).value)
                                                            setmaxWeight((v.target as any).value)
                                                    }}
                                                    inputName='widthInput'
                                                    type='number'
                                                    suffix={<small>Lbs</small>}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex mt-4'>
                                    <Button onClick={() => setshowItemType(false)} variant='secondary' className='w-24 ml-auto mr-4'>Cancel</Button>
                                    <Button className='w-24'>Apply</Button>
                                </div>
                            </div>
                        </ClickOutsideAnElementHandler>
                    }
                </div>
                {/**--------------------------------------COLOUR-------------------------------------------------------- */}
                <div className='w-1/6 mr-4'>
                    <div onClick={() => setshowColorMenu(true)} className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Colour</div><BsChevronDown className='my-auto' /></div>
                    {
                        showColorMenu && <ClickOutsideAnElementHandler onClickedOutside={() => setshowColorMenu(false)}>
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
                        </ClickOutsideAnElementHandler>
                    }
                    {
                        showOtherColorMenu && <ClickOutsideAnElementHandler onClickedOutside={() => setshowOtherColorMenu(false)}>
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
                        </ClickOutsideAnElementHandler>
                    }
                </div>
            </div>
            <div className="flex mt-4 dropdown-component-overwrite">
                {/**--------------------------------source and availability--------------------------------------------- */}
                <div className='w-40 mr-4'>
                    <div onClick={() => setshowSourceAvailability(true)} className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Source & Availability</div><BsChevronDown className='my-auto' /></div>
                    {showSourceAvailability &&
                        <ClickOutsideAnElementHandler onClickedOutside={() => setshowSourceAvailability(false)}>
                            <div className='absolute z-50 px-4 py-6 border border-black border-solid w-400px bg-cream'>
                                <div className='flex'>
                                    <div className='w-1/2'>
                                        <div className='text-sm font-semibold font-ssp'>Source</div>
                                        {sourceOptions.every(each => source.includes(each)) ?
                                            <div onClick={() => setsource([])} className='mt-2 text-sm cursor-pointer select-none font-ssp text-link w-max'>
                                                Unselect All
                                            </div>
                                            :
                                            <div onClick={() => setsource(sourceOptions)} className='mt-2 text-sm cursor-pointer select-none font-ssp text-link w-max'>
                                                Select All
                                            </div>}
                                        {sourceOptions.map(eachSource => <Checkbox label={eachSource} className='mt-4 text-sm text-secondary' checked={source.includes(eachSource)} onChange={(checked) => {
                                            if (checked) {
                                                setsource(state => state.concat(eachSource))
                                            } else {
                                                setsource(state => state.filter(each => each !== eachSource))
                                            }
                                        }} />)}
                                    </div>
                                    <div className='w-1/2 dropdown-list-input-overwrite'>
                                        <div className='text-sm font-semibold font-ssp'>Collection</div>
                                        {availabilityOptions.every(each => availability.includes(each)) ?
                                            <div onClick={() => setavailability([])} className='mt-2 text-sm cursor-pointer select-none font-ssp text-link w-max'>
                                                Unselect All
                                            </div>
                                            :
                                            <div onClick={() => setavailability(availabilityOptions)} className='mt-2 text-sm cursor-pointer select-none font-ssp text-link w-max'>
                                                Select All
                                            </div>}
                                        {availabilityOptions.map(eachAvailability => <Checkbox label={eachAvailability} className='mt-4 text-sm text-secondary' checked={availability.includes(eachAvailability)} onChange={(checked) => {
                                            if (checked) {
                                                setavailability(state => state.concat(eachAvailability))
                                            } else {
                                                setavailability(state => state.filter(each => each !== eachAvailability))
                                            }
                                        }} />)}
                                    </div>
                                </div>
                                <div className='flex mt-8 mb-2'>
                                    <Button onClick={() => setshowSourceAvailability(false)} variant='secondary' className='w-24 ml-auto mr-4'>Cancel</Button>
                                    <Button className='w-24'>Apply</Button>
                                </div>
                            </div>
                        </ClickOutsideAnElementHandler>
                    }
                </div>
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