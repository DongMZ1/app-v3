import { DropdownComponent } from '@fulhaus/react.ui.dropdown-component'
import './CatalogueFilter.scss'
const CatalogueFilter = () => {
    return <div className="w-full px-4 catalogue-filter">
        <div className="flex mt-4 dropdown-component-overwrite">
            <div className='w-1/5 mr-4'>
                <DropdownComponent label='Rooms & Styles'>
                    <></>
                </DropdownComponent>
            </div>
            <div className='w-1/6 mr-4'>
                <DropdownComponent label='Vendors'>
                    <></>
                </DropdownComponent>
            </div>
            <div className='w-1/6 mr-4'>
                <DropdownComponent dropDownFloat='left' label='Item Type'>
                    <></>
                </DropdownComponent>
            </div>
            <div className='w-1/6 mr-4'>
                <DropdownComponent dropDownFloat='left' label='Colour'>
                    <></>
                </DropdownComponent>
            </div>
        </div>
        <div className="flex mt-4 dropdown-component-overwrite">
            <div className='w-1/4 mr-4'>
                <DropdownComponent label='Source & Availability'>
                    <></>
                </DropdownComponent>
            </div>
            <div className='w-1/6 mr-4'>
                <DropdownComponent label='Vendors'>
                    <></>
                </DropdownComponent>
            </div>
            <div className='w-1/6 mr-4'>
                <DropdownComponent dropDownFloat='left' label='Item Type'>
                    <></>
                </DropdownComponent>
            </div>
        </div>
    </div>
}

export default CatalogueFilter;