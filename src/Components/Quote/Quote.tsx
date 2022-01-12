import './Quote.scss'
import { ReactComponent as AddUnitIcon } from "../../styles/images/add-a-unit-to-get-start.svg";
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import { useSelector } from 'react-redux';
import { Tappstate } from '../../redux/reducers';
const Quote = () => {
    const quoteUnitLength = useSelector((state: Tappstate) => state.quoteDetail)?.data?.length;
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    return <div className='flex w-full h-full px-6 pt-4 quote'>
        {(selectedQuoteUnit) ?
            <>
                <div className='flex'>
                <div className='w-32 mr-8 text-sm-important'>
                    <DropdownListInput placeholder='Add Room' wrapperClassName='cursor-pointer' listWrapperClassName='width-52-important' options={['bedroom', 'dining room', 'bathroom', 'living room', 'accessories', 'pillow set']} />
                </div>
                <div className='w-60 text-sm-important'>
                    <DropdownListInput placeholder='Add Muti-Room Package' wrapperClassName='cursor-pointer' listWrapperClassName='' options={['Custom Unit', 'Studio', '1BR', '2BR', '3BR', '1BR-HOTEL']} />
                </div>
                </div>
            </>
            :
            <div className='m-auto'>
                <AddUnitIcon />
                <div className='flex text-4xl font-moret'><div className='mx-auto'>{quoteUnitLength === 0 ? 'Add' : 'Select'} a unit to get started</div></div>
            </div>
        }
    </div>
}

export default Quote;