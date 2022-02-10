import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler'
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import { Checkbox } from '@fulhaus/react.ui.checkbox'
import { Button } from '@fulhaus/react.ui.button'
import { TextInput } from '@fulhaus/react.ui.text-input'
import { BsChevronDown } from 'react-icons/bs'
type CatelogueFilterItemTypeProps = {
    showItemType: boolean,
    setshowItemType: React.Dispatch<React.SetStateAction<boolean>>,
    itemTypes:string[],
    setitemTypes: React.Dispatch<React.SetStateAction<string[]>>,
    lengthUnit: string,
    setlengthUnit: React.Dispatch<React.SetStateAction<string>>,
    weightUnit: string,
    setweightUnit: React.Dispatch<React.SetStateAction<string>>,
    W: string,
    setW: React.Dispatch<React.SetStateAction<string>>,
    L: string,
    setL: React.Dispatch<React.SetStateAction<string>>,
    H: string,
    setH: React.Dispatch<React.SetStateAction<string>>,
    minWeight: number,
    setminWeight: React.Dispatch<React.SetStateAction<number>>,
    maxWeight: number,
    setmaxWeight: React.Dispatch<React.SetStateAction<number>>
}
const itemTypeOptions = ['Dining Chair', 'Office Chair', 'End Table', 'Office Table', 'Console Table', 'Couch', 'Loveseat']
const CatelogueFilterItemType = ({
    showItemType,
    setshowItemType,
    itemTypes,
    setitemTypes,
    lengthUnit,
    setlengthUnit,
    weightUnit,
    setweightUnit,
    W,
    setW,
    L,
    setL,
    H,
    setH,
    minWeight,
    setminWeight,
    maxWeight,
    setmaxWeight
}:CatelogueFilterItemTypeProps) => {
    return <div className='w-24 mr-4'>
                    <div onClick={() => setshowItemType(true)} className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Item type</div><BsChevronDown className='my-auto' /></div>
                    {
                        showItemType && <ClickOutsideAnElementHandler onClickedOutside={() => setshowItemType(false)}>
                            <div className='absolute z-50 py-6 pl-4 pr-8 border border-black border-solid w-400px bg-cream'>
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
}

export default CatelogueFilterItemType