import { useState } from 'react'
import { BsChevronDown } from 'react-icons/bs'
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler'
import { TextInput } from '@fulhaus/react.ui.text-input'
import { CSSTransition } from 'react-transition-group'
type CatalogueFilterVendorProps = {
    showVendor: boolean,
    setshowVendor: React.Dispatch<React.SetStateAction<boolean>>,
}
const CatalogueFilterVendor = ({ showVendor, setshowVendor }: CatalogueFilterVendorProps) => {
    const [vendorKeyword, setvendorKeyword] = useState('')
    const [vendorRegions, setvendorRegions] = useState<'All regions' | 'North America' | 'Europe'>('All regions');
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
        </div>
    </ClickOutsideAnElementHandler>
}

export default CatalogueFilterVendor;