import { useState } from 'react'
import { BsChevronDown } from 'react-icons/bs'
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler'
import { TextInput } from '@fulhaus/react.ui.text-input'
import { CSSTransition } from 'react-transition-group'
type CatalogueFilterVendorProps = {
    showVendor: boolean,
    setshowVendor: React.Dispatch<React.SetStateAction<boolean>>,
    vendorRegions: "All regions" | "North America" | "Europe",
    setvendorRegions: React.Dispatch<React.SetStateAction<"All regions" | "North America" | "Europe">>
}
const CatalogueFilterVendor = ({ showVendor, setshowVendor, vendorRegions, setvendorRegions }: CatalogueFilterVendorProps) => {
    const [vendorKeyword, setvendorKeyword] = useState('')
    return <div className='w-24 mr-4'>
        <div onClick={() => setshowVendor(true)} className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Vendors</div><BsChevronDown className='my-auto' /></div>
        <ClickOutsideAnElementHandler onClickedOutside={() => setshowVendor(false)}>
            <CSSTransition in={showVendor} timeout={300} unmountOnExit classNames='opacity-animation'>
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
            </CSSTransition>
        </ClickOutsideAnElementHandler>
    </div>
}

export default CatalogueFilterVendor;