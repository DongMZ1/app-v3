import { useState } from 'react'
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler'
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import { Checkbox } from '@fulhaus/react.ui.checkbox'
import { Button } from '@fulhaus/react.ui.button'
import { TextInput } from '@fulhaus/react.ui.text-input'
import { Tappstate } from '../../../../redux/reducers'
import { useSelector, useDispatch } from 'react-redux'
import produce from 'immer'
type CatelogueFilterItemTypeProps = {
    setshowItemType: React.Dispatch<React.SetStateAction<boolean>>
    catagoriesOption: any[]
}
const CatelogueFilterItemType = ({
    setshowItemType,
    catagoriesOption
}: CatelogueFilterItemTypeProps) => {
    const filterCatalogue = useSelector((state: Tappstate) => state.filterCatalogue);
    const dispatch = useDispatch();
    const [itemTypes, setitemTypes] = useState<any[]>(filterCatalogue?.itemTypes ? filterCatalogue?.itemTypes : []);
    const [lengthUnit, setlengthUnit] = useState(filterCatalogue?.lengthUnit ? filterCatalogue?.lengthUnit : 'in');
    const [weightUnit, setweightUnit] = useState(filterCatalogue?.weightUnit ? filterCatalogue?.weightUnit : 'lbs');
    const [W, setW] = useState(filterCatalogue?.W ? filterCatalogue?.W : '');
    const [L, setL] = useState(filterCatalogue?.L ? filterCatalogue?.L : '');
    const [H, setH] = useState(filterCatalogue?.H ? filterCatalogue?.H : '');
    const [minWeight, setminWeight] = useState(filterCatalogue?.minWeight ? filterCatalogue?.minWeight : 0);
    const [maxWeight, setmaxWeight] = useState(filterCatalogue?.maxWeight ? filterCatalogue?.maxWeight : 150);

    const apply = () => {
        const newFilterCatalogue = produce(filterCatalogue, (draft: any) => {
            draft.itemTypes = itemTypes;
            draft.lengthUnit = lengthUnit;
            draft.weightUnit = weightUnit;
            draft.W = W;
            draft.L = L;
            draft.H = H;
            draft.minWeight = minWeight;
            draft.maxWeight = maxWeight;
        })
        dispatch({
            type: 'filterCatalogue',
            payload: newFilterCatalogue
        });
        setshowItemType(false)
    }
    return <ClickOutsideAnElementHandler onClickedOutside={() => setshowItemType(false)}>
        <div className='absolute z-50 py-6 pl-4 pr-8 border border-black border-solid w-500px bg-cream'>
            <div className='flex w-full'>
                <div className='w-2/5 mr-4'>
                    <div className='text-sm font-semibold font-ssp'>Item Type</div>
                    {catagoriesOption.every(each => itemTypes.includes(each)) ?
                        <div onClick={() => setitemTypes([])} className='mt-2 text-sm cursor-pointer select-none font-ssp text-link w-max'>
                            Unselect All
                        </div>
                        :
                        <div onClick={() => setitemTypes(catagoriesOption)} className='mt-2 text-sm cursor-pointer select-none font-ssp text-link w-max'>
                            Select All
                        </div>}
                    <div className='overflow-auto max-h-60'>
                        {catagoriesOption.map(eachType => <Checkbox label={eachType?.name} className='mt-4 text-sm text-secondary' checked={itemTypes.includes(eachType)} onChange={(checked) => {
                            if (checked) {
                                setitemTypes(state => state.concat(eachType))
                            } else {
                                setitemTypes(state => state.filter(each => each !== eachType))
                            }
                        }} />)}
                    </div>
                </div>
                <div className='w-3/5 '>
                    <div className='text-sm font-semibold font-ssp'>Dimension</div>
                    <div className='flex mt-4'>
                        <DropdownListInput listWrapperClassName='z-99-important' onSelect={(v) => setlengthUnit(v)} wrapperClassName='mr-4' initialValue={lengthUnit} options={["in", "cm", "mm", "ft", "m"]} />
                        <DropdownListInput onSelect={(v) => setweightUnit(v)} listWrapperClassName='z-99-important' wrapperClassName='' initialValue={weightUnit} options={["lbs", "kg", "gr", "oz"]} />
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
                                suffix={<small>{lengthUnit}</small>}
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
                                suffix={<small>{lengthUnit}</small>}
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
                                suffix={<small>{lengthUnit}</small>}
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
                                suffix={<small>{weightUnit}</small>}
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
                                suffix={<small>{weightUnit}</small>}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex mt-4'>
                <Button onClick={() => setshowItemType(false)} variant='secondary' className='w-24 ml-auto mr-4'>Cancel</Button>
                <Button className='w-24' onClick={() => apply()}>Apply</Button>
            </div>
        </div>
    </ClickOutsideAnElementHandler>
}

export default CatelogueFilterItemType