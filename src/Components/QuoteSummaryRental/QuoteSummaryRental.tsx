import './QuoteSummaryRental.scss'
import UnitBudget from '../UnitBudget/UnitBudget'
import { useSelector } from 'react-redux'
import { Tappstate } from '../../redux/reducers'
const QuoteSummaryRental = () => {
    const selectedQuoteUnit = useSelector((state:Tappstate) => state.selectedQuoteUnit);
    if(selectedQuoteUnit){
        return <UnitBudget />
    }
    return  <div className='flex flex-col w-full h-full px-6 py-4 overflow-y-auto quote-summary-rental'>

    </div>
}

export default QuoteSummaryRental