import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler'
import { Checkbox } from '@fulhaus/react.ui.checkbox'
import { Button } from '@fulhaus/react.ui.button'
import { BsChevronDown } from 'react-icons/bs'

type CatalogueFilterSourceProps = {
    showSourceAvailability: boolean,
    setshowSourceAvailability: React.Dispatch<React.SetStateAction<boolean>>,
    setsource: React.Dispatch<React.SetStateAction<string[]>>,
    source: string[],
    availability: string[]
    setavailability: React.Dispatch<React.SetStateAction<string[]>>,
}
const sourceOptions = ['Vendor Data', 'Clipped Items', 'Starred / Favourited'];
const availabilityOptions = ['In Stock', 'Restocking', 'Out of Stock', 'Unknown'];
const CatalogueFilterSource = ({ showSourceAvailability, setshowSourceAvailability, source, setsource, availability, setavailability }: CatalogueFilterSourceProps) => {
    return <div className='w-40 mr-4'>
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
}
export default CatalogueFilterSource;