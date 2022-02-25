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
import { Tooltip } from '@fulhaus/react.ui.tooltip'
import { TextInput } from '@fulhaus/react.ui.text-input';
const QuoteSummaryRental = () => {
    const [editable, seteditable] = useState(false);
    const [showCalendar, setshowCalendar] = useState(false);
    const [discount, setdiscount] = useState('15');
    const [securityDeposit, setsecurityDeposit] = useState('10');
    const [shipping, setshipping] = useState('10000')
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail);
    if (selectedQuoteUnit) {
        return <UnitBudget />
    }
    return <div className='flex flex-col w-full h-full px-6 py-4 overflow-y-auto text-sm quote-summary-rental font-ssp'>
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
        <div className='flex mt-4'>
            <div className='flex w-1/4 ml-auto mr-16'><div className='m-auto'>Year 1</div></div>
            <div className='flex w-1/4 mr-4'><div className='m-auto'>Year 2</div></div>
        </div>
        <div className='flex'>
            <div className='w-1/4 h-2 ml-auto mr-16 border-t border-l border-r border-black border-dashed'></div>
            <div className='w-1/4 h-2 mr-4 border-t border-l border-r border-black border-dashed'></div>
        </div>
        <div className='flex mt-4'>
            <div className='w-1/3'>Unit Type</div>
            <div className='w-1/12'>Qty</div>
        </div>
        <div className='w-full px-4 py-2 mt-4 text-sm border border-black border-solid font-ssp'>
            <div className='flex'>
                <div className='mr-1'>Buy Back After Year 1</div>
                <Tooltip text='' iconColor='blue' />
                <div className='ml-auto'>$159481.00</div>
            </div>
            <div className='flex mt-2'>
                <div className='mr-1'>Buy Back After Year 2</div>
                <Tooltip text='' iconColor='blue' />
                <div className='ml-auto'>$6666.00</div>
            </div>
        </div>
        <div className='mt-10 text-2xl font-moret'>Deal Summary</div>
        <div className='flex mt-4 text-sm font-ssp'>
            <div>Item</div>
            <div className='ml-auto'>Rate</div>
        </div>
        <div className='flex mt-4'>
            <div>Service Costs (individual line items can only be viewed by you)</div>
            <div className='ml-auto'>$99999.00</div>
        </div>
        <div className='w-full pt-4 mt-4 border-t border-black border-solid'>Discount(%)</div>
        <div className='flex mt-4'>
            {editable ?
                <TextInput prefix={<span>%</span>} className='w-24' variant='box' inputName='percentage discount' value={discount} onChange={
                    (e) => setdiscount((e.target as any).value)
                } /> : <div>{discount}% </div>}
            <div className='ml-auto'>-$15999.00</div>
        </div>
        <div className='flex pb-4 mt-4 border-b border-black border-solid'>
            <div>Subtotal</div>
            <div className='ml-auto'>$9999.00</div>
        </div>
        <div className='flex mt-4'>
            <div className='mr-1'>
                Non rentable
            </div>
            <Tooltip text='' iconColor='blue' />
            <div className='ml-auto'>$15941.00</div>
        </div>
        <div className='flex mt-4'>
            <div className='my-auto mr-1'>
                Security Deposit
            </div>
            <Tooltip text='' iconColor='blue' />
            {editable ? <TextInput prefix={<span>%</span>} className='w-24 ml-auto' variant='box' inputName='security deposit' value={securityDeposit} onChange={
                (e) => setsecurityDeposit((e.target as any).value)
            } /> : <div className='ml-auto'>$15981.00</div>}
        </div>
        <div className='flex mt-4'>
            <div className='my-auto mr-1'>
                Shipping
            </div>
            <Tooltip text='' iconColor='blue' />
            {editable ? <TextInput prefix={<span>$</span>} className='w-24 ml-auto' variant='box' inputName='security deposit' value={shipping} onChange={
                (e) => setshipping((e.target as any).value)
            } /> : <div className='ml-auto'>${shipping}</div>}
        </div>
        <div className='flex mt-4'>
            <div className='mr-1'>
                Tax(15%)
            </div>
            <Tooltip text='' iconColor='blue' />
            <div className='ml-auto'>$19481.00</div>
        </div>
        <div className='flex px-4 py-2 mt-4 border-4 border-black border-solid'>
            <div className='font-semibold '>Contract Start Fee</div>
            <div className='ml-auto font-semibold'>$9000</div>
        </div>
        <div className='flex px-4 py-2 mt-4 border border-black border-solid'>
            <div className='mr-1'>Total Contract Cost</div>
            <Tooltip text='' iconColor='blue' />
            <div className='ml-auto'>$9000</div>
        </div>
        <div className='mt-4 text-2xl font-moret'>Notes</div>
        <div className='px-4 py-2 mt-4 mb-8 bg-white border border-black border-solid'>
            <div>· Units include sofa bed in place of sofa</div>
            <div>· Unbundled services: Assembly, Site Delivery, Install, Disposal and Photography</div>
            <div>· Updated delivery probability due to Covid: 5 weeks</div>
        </div>
    </div>
}

export default QuoteSummaryRental