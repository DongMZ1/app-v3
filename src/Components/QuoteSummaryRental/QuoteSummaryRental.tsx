import { useState } from 'react';
import './QuoteSummaryRental.scss'
import UnitBudget from '../UnitBudget/UnitBudget'
import { useSelector } from 'react-redux'
import { Tappstate } from '../../redux/reducers'
import { ReactComponent as EditPenIcon } from '../../styles/images/edit-pen.svg'
import { DatePicker } from '@fulhaus/react.ui.date-picker'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler';
import { ImCross } from 'react-icons/im'
const QuoteSummaryRental = () => {
    const [editable, seteditable] = useState(false);
    const [showCalendar, setshowCalendar] = useState(false);
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    if (selectedQuoteUnit) {
        return <UnitBudget />
    }
    return <div className='flex flex-col w-full h-full px-6 py-4 overflow-y-auto quote-summary-rental'>
        <div className='flex'>
            <div className='my-auto text-2xl font-moret'>Rental Summary</div>
            {
                !editable && <>
                    <div className='my-auto ml-auto mr-8 text-sm font-ssp'>Start Date: May 1, 2021</div>
                    <EditPenIcon onClick={() => seteditable(true)} className='my-auto cursor-pointer' />
                </>
            }
            {
                editable && <>
                    <div className='flex h-full px-4 ml-auto text-sm border border-black border-solid'>
                        <div className='m-auto'>Start Date</div>
                    </div>
                    <div className='relative flex px-4 mr-8 bg-white border border-black border-solid'>
                        <div className='my-auto mr-4 text-sm'>May 1, 2021</div>
                        <FaRegCalendarAlt onClick={() => setshowCalendar(true)} className='my-auto cursor-pointer' />
                        {showCalendar &&
                            <ClickOutsideAnElementHandler onClickedOutside={() => setshowCalendar(false)}>
                                <div className='absolute right-0 z-50 p-4 bg-white border border-black border-solid top-full w-80'>
                                    <DatePicker onSelectDate={(selectedDate) =>
                                        setshowCalendar(false)
                                    } />
                                </div>
                            </ClickOutsideAnElementHandler>}
                    </div>
                    <ImCross className='my-auto cursor-pointer' onClick={() => seteditable(false)} />
                </>
            }
        </div>
        <div className='flex pb-4 mt-12 border-b border-black border-solid'>
            <div className='flex w-1/3 text-base font-ssp'><div className='mx-auto'>Average Per Unit</div></div>
            <div className='flex w-1/3 text-base font-ssp'><div className='mx-auto'>Year 1, $666/mo</div></div>
            <div className='flex w-1/3 text-base font-ssp'><div className='mx-auto'>Year 2, $200/mo</div></div>
        </div>
    </div>
}

export default QuoteSummaryRental