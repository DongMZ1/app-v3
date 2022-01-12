import './Quote.scss'
import { ReactComponent as AddUnitIcon } from "../../styles/images/add-a-unit-to-get-start.svg";
import { useSelector } from 'react-redux';
import { Tappstate } from '../../redux/reducers';
const Quote = () => {
    const quoteUnitLength = useSelector((state: Tappstate) => state.quoteDetail)?.data?.length;
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    return <div className='flex w-full h-full'>
        {(selectedQuoteUnit) ?
            <div>

            </div>
            :
            <div className='m-auto'>
                <AddUnitIcon />
                <div className='flex text-4xl font-moret'><div className='mx-auto'>{quoteUnitLength === 0 ? 'Add' : 'Select'} a unit to get started</div></div>
            </div>
        }
    </div>
}

export default Quote;