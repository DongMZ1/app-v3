import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler'
import { Button } from '@fulhaus/react.ui.button'
import { BsChevronDown } from 'react-icons/bs'
import { AiOutlineRight } from 'react-icons/ai'
import { FiArrowLeft } from 'react-icons/fi'
const CatalogueFilterDistance = () => {
    return <div className='w-1/6 mr-4'>
        <div className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Distance</div><BsChevronDown className='my-auto' /></div>
    </div>
}

export default CatalogueFilterDistance;