import { BsChevronDown } from 'react-icons/bs'
const CatalogueFilterVendor = () => {
    return <div className='w-24 mr-4'>
        <div className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Vendors</div><BsChevronDown className='my-auto' /></div>
    </div>
}

export default CatalogueFilterVendor;