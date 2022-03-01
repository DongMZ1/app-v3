import { useState } from 'react'
import { BsChevronDown } from 'react-icons/bs'
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler'
import { TextInput } from '@fulhaus/react.ui.text-input'
import { Checkbox } from '@fulhaus/react.ui.checkbox'
import { Button } from '@fulhaus/react.ui.button'
import produce from 'immer'
import { CSSTransition } from 'react-transition-group'
import { useDispatch, useSelector } from 'react-redux'
import { Tappstate } from '../../../../redux/reducers'
type CatalogueFilterVendorProps = {
    showVendor: boolean,
    setshowVendor: React.Dispatch<React.SetStateAction<boolean>>,
    vendorOptions: any[],
}
const CatalogueFilterVendor = ({ showVendor, setshowVendor, vendorOptions }: CatalogueFilterVendorProps) => {
    const filterCatalogue = useSelector((state: Tappstate) => state.filterCatalogue);
    const [vendorKeyword, setvendorKeyword] = useState('')
    const [vendorRegions, setvendorRegions] = useState<'All regions' | 'North America' | 'Europe'>('All regions');
    const [selectedVendors, setselectedVendors] = useState<any[]>([]);
    const dispatch = useDispatch()
    if (vendorRegions === 'Europe') {
        vendorOptions = vendorOptions.filter((each: any) => each?.region === 'EU')
    }
    if (vendorRegions === 'North America') {
        vendorOptions = vendorOptions.filter((each: any) => each?.region === 'NA')
    }

    const applyVendor = () => {
        const newFilterCatalogue = produce(filterCatalogue, (draft: any) => {
            draft.vendors = selectedVendors;
        })
        dispatch({
            type: 'filterCatalogue',
            payload: newFilterCatalogue
        });
        setshowVendor(false);
    }
    return <ClickOutsideAnElementHandler onClickedOutside={() => setshowVendor(false)}>
        <div className='absolute z-50 px-4 py-6 border border-black border-solid w-400px bg-cream'>
            <div className='text-sm font-semibold font-ssp'>Vendor</div>
            <div className='flex w-full mt-2'>
                <div onClick={() => setvendorRegions("All regions")} className={` border cursor-pointer border-black border-solid w-1/3 py-1 flex font-ssp text-sm font-semibold ${vendorRegions === 'All regions' ? "bg-black text-white" : ''}`}>
                    <div className='m-auto'>
                        All regions
                    </div>
                </div>
                <div onClick={() => setvendorRegions("North America")} className={`border-black cursor-pointer border-solid border w-1/3 py-1 flex font-ssp text-sm font-semibold ${vendorRegions === 'North America' ? "bg-black text-white" : ''}`}>
                    <div className='m-auto'>
                        North America
                    </div>
                </div>
                <div onClick={() => setvendorRegions("Europe")} className={`border-black cursor-pointer border-solid border w-1/3 py-1 flex font-ssp text-sm font-semibold ${vendorRegions === 'Europe' ? "bg-black text-white" : ''}`}>
                    <div className='m-auto'>
                        Europe
                    </div>
                </div>
            </div>
            <TextInput className='mt-4 display-block-important' variant='box' type='search' inputName='vendor search' value={vendorKeyword} onChange={(e) => setvendorKeyword((e.target as any).value)} />
            <div className='overflow-auto max-h-60'>
                {Array.from(new Set([...vendorOptions.filter((each: any) => each?.name?.toLowerCase().includes(vendorKeyword.toLowerCase())), ...selectedVendors])).map(eachVendor => <Checkbox label={eachVendor?.name} className='mt-4 text-sm text-secondary' checked={selectedVendors.includes(eachVendor)} onChange={(checked) => {
                    if (checked) {
                        setselectedVendors(state => state.concat(eachVendor))
                    } else {
                        setselectedVendors(state => state.filter(each => each !== eachVendor))
                    }
                }} />)}
            </div>
            <div className='flex mt-8 mb-2'>
                <Button onClick={() => setshowVendor(false)} variant='secondary' className='w-24 ml-auto mr-4'>Cancel</Button>
                <Button onClick={() => applyVendor()} className='w-24'>Apply</Button>
            </div>
        </div>
    </ClickOutsideAnElementHandler>
}

export default CatalogueFilterVendor;