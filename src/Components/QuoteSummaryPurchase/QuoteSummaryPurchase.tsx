import { useState } from 'react';
import './QuoteSummaryPurchase.scss'
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
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input';
import { Button } from '@fulhaus/react.ui.button';
import {RiDeleteBin6Fill} from 'react-icons/ri'
const QuoteSummaryPurchase = () => {
    const [editable, seteditable] = useState(false);
    const [showCalendar, setshowCalendar] = useState(false);
    const [discount, setdiscount] = useState('15');
    const [securityDeposit, setsecurityDeposit] = useState('10');
    const [shipping, setshipping] = useState('10000')
    const [paymentTerms, setpaymentTerms] = useState<any[]>([]);
    const [paymentTermsUnit, setpaymentTermsUnit] = useState('%');
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    if (selectedQuoteUnit) {
        return <UnitBudget />
    }
    return <div className='flex flex-col w-full h-full px-6 py-4 overflow-y-auto text-sm quote-summary-purchase font-ssp'>
        <div className='flex'>
            <div className='my-auto text-2xl font-moret'>Payment Terms</div>
            {
                !editable && <>
                    <div className='my-auto ml-auto mr-8 text-sm font-ssp'>Start Date: May 1, 2021</div>
                    <EditPenIcon onClick={() => seteditable(true)} className='my-auto cursor-pointer' />
                </>
            }
            {
                editable && <>
                    <div className='flex h-full px-4 ml-auto text-sm border border-black border-solid'><div className='m-auto'>Start Date</div></div>
                    <div className='relative flex px-4 mr-8 text-sm bg-white border border-black border-solid'>
                        <div className='my-auto mr-4'>May 1, 2021</div>
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
        <div className='w-full p-4 mt-4 border border-black border-solid'>
            {editable &&
                < DropdownListInput wrapperClassName='w-4rem-important' initialValue={paymentTermsUnit} onSelect={(v) => setpaymentTermsUnit(v)} options={['%', '$']} />
            }
            {
                paymentTerms?.map(
                    (eachTerm, key) => <div className='flex w-full py-2 border-b border-black border-solid '>
                        <div className='my-auto mr-4'>{key + 1}.</div>
                        {editable ?
                            <TextInput inputName='payment term name' variant='box' value={eachTerm?.name} onChange={
                                (e) => {
                                    let newPaymentTerms = [...paymentTerms]
                                    newPaymentTerms[key].name = (e.target as any).value;
                                    setpaymentTerms(newPaymentTerms);
                                }
                            } />
                            :
                            <div className='my-auto'>{eachTerm?.name}</div>
                        }
                        {
                            editable ? <TextInput type='number' className='ml-auto mr-4 w-4rem-important' suffix={<span>{paymentTermsUnit}</span>} inputName='payment item amount' variant='box' value={eachTerm?.amount} onChange={(e) => {
                                let newPaymentTerms = [...paymentTerms]
                                newPaymentTerms[key].amount = (e.target as any).valueAsNumber;
                                setpaymentTerms(newPaymentTerms);
                            }} />
                                :
                                <div className='my-auto ml-auto mr-4'>
                                    {eachTerm?.amount} {paymentTermsUnit}
                                </div>
                        }
                        {
                             editable && <RiDeleteBin6Fill color='red' className='my-auto cursor-pointer' onClick={() => {
                                let newPaymentTerms = [...paymentTerms];
                                newPaymentTerms.splice(key, 1);
                                setpaymentTerms(newPaymentTerms);
                             }} />
                        }
                    </div>
                )
            }
            {
                editable && <Button className='mt-2' variant='primary' onClick={() => setpaymentTerms(
                    state => [...state, {
                        name: "",
                        amount: null
                    }]
                )} >Add new Service Cost</Button>
            }
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

export default QuoteSummaryPurchase