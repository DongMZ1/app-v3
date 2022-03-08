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
import { RiDeleteBin6Fill } from 'react-icons/ri'
import { Radio } from '@fulhaus/react.ui.radio';
import { Checkbox } from '@fulhaus/react.ui.checkbox';
const QuoteSummaryPurchase = () => {
    const [editable, seteditable] = useState(false);
    const [showCalendar, setshowCalendar] = useState(false);
    const [shipping, setshipping] = useState('10000')
    const [paymentTerms, setpaymentTerms] = useState<any[]>([]);
    const [paymentTermsUnit, setpaymentTermsUnit] = useState('%');
    const [additionalDiscount, setadditionalDiscount] = useState('5');
    const [rationale, setrationale] = useState('');
    const [checkedTax, setcheckedTax] = useState(false);
    const [taxOnSale, settaxOnSale] = useState('0')
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail);
    const userRole = useSelector((state: Tappstate) => state?.selectedProject?.userRole);
    if (selectedQuoteUnit) {
        return <UnitBudget />
    }
    return <div className='flex flex-col w-full h-full px-6 py-4 overflow-y-auto text-sm quote-summary-purchase font-ssp'>
        <div className='flex'>
            <div className='my-auto text-2xl font-moret'>Order Summary</div>
            {
                !editable && <>
                    <div className='my-auto ml-auto mr-8 text-sm font-ssp'>Start Date: May 1, 2021</div>
                    {userRole !== 'viewer' && <EditPenIcon onClick={() => seteditable(true)} className='my-auto cursor-pointer' />}
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
        <div className='flex py-2 mt-4 border-b border-black border-solid'>
            <div className='w-1/4 '>Unit Type</div>
            <div className='w-1/4'>Qty</div>
            <div className='w-1/4'>Price Per Unit</div>
            <div className='w-1/4'>Price Of All Units</div>
        </div>
        {
            quoteDetail?.data?.map((eachUnit: any) => <div className='flex py-2 border-b border-black border-solid'>
                <div className='w-1/4 '>{eachUnit?.name}</div>
                <div className='w-1/4'>{eachUnit?.count}</div>
                <div className='w-1/4'>Need to implement</div>
                <div className='w-1/4'>Need to implement</div>
            </div>)
        }
        <div className='flex py-2'>
            <div className='w-1/4 '>Totals</div>
            <div className='w-1/2'>{quoteDetail?.unitCount}</div>
            <div className='w-1/4'>Need to implement</div>
        </div>
        <div className='flex mt-2 font-ssp'>
            <div>
                <div className='text-sm font-ssp'>
                    Volume Discount
                </div>
                {editable ? <DropdownListInput initialValue={'Tier 1'} options={['Tier 1']} wrapperClassName='w-6rem-important' /> :
                    <div>
                        Tier 1
                    </div>}
            </div>
            <div className='my-auto ml-auto'>- 9999.00$</div>
        </div>
        <div className='w-full p-4 mt-4 border border-black border-solid'>
            <div className='flex'>
                <div className='mr-1'>Setup Fee</div>
                <Tooltip text='' iconColor='blue' />
                <div className='ml-auto'>Included</div>
            </div>
            <div className='flex mt-3'>
                <div className='my-auto mr-1'>
                    Shipping
                </div>
                <Tooltip text='' iconColor='blue' />
                {editable ?
                    <>
                        <DropdownListInput
                            wrapperClassName=' w-6rem-important h-2-5-rem-important ml-auto'
                            options={['CAD', 'USD', 'EURO']} />
                        <TextInput prefix={<span>$</span>} className='w-24 h-2-5-rem-important' variant='box' inputName='security deposit' value={shipping} onChange={
                            (e) => setshipping((e.target as any).value)
                        } /></> : <div className='ml-auto'>${shipping}</div>}
            </div>
            <div className='flex pt-4 pb-4 mt-4 border-t border-black border-solid'>
                <div className='mr-1 font-semibold font-ssp'>Subtotal</div>
                <Tooltip text='' iconColor='blue' />
                <div className='ml-auto'>$9999.00</div>
            </div>
            {editable ?
                <div className='flex mt-4'>
                    <div className='w-1/12 mr-4'>
                        <div>Additional Discount</div>
                        <TextInput className='w-full' variant='box' inputName='additional discount' value={additionalDiscount} onChange={(e) => setadditionalDiscount((e.target as any).value)} suffix={<small>%</small>} />
                    </div>
                    <div className='w-2/3 mr-4'>
                        <div>Rationale</div>
                        <TextInput className='w-full' variant='box' inputName='rationale' value={rationale} onChange={(e) => setrationale((e.target as any).value)} />
                    </div>
                    <div className='my-auto ml-auto'>-3578$</div>
                </div> :
                <div className='flex'>
                    <div className='w-1/3'>
                        <div>Additional Discount : {additionalDiscount}%</div>
                        <div className='text-xs'>{rationale}</div>
                    </div>
                    <div className='my-auto ml-auto'>-3578$</div>
                </div>

            }
            <div className='flex pt-4 mt-4 border-t border-black border-solid'>
                 <div className='my-auto font-semibold'>
                     Total Quote Before Tax
                 </div>
                 <div className='ml-auto'>
                     $128500.00
                 </div>
            </div>
            {
                editable ? <div className='flex mt-4'>
                    <div>
                        <div >
                            <div className='flex'><Checkbox checked={checkedTax} onChange={(v) => setcheckedTax(v)} /><div>Estimated tax on sales </div></div>
                            <div className='flex'>
                                <div className='mr-1'><i>Approximation, adjusted at checkout</i></div><Tooltip text='' iconColor='blue' />
                            </div>
                        </div>
                    </div>
                    <div className='flex my-auto ml-auto'>
                        <DropdownListInput
                            initialValue={'$'}
                            wrapperClassName='w-6rem-important h-2-5-rem-important ml-auto'
                            options={['$', '%']} />
                        <TextInput type='number' className='mr-4 w-4rem-important' suffix={<span>{"$"}</span>} inputName='tax on sale input' variant='box' value={taxOnSale} onChange={(e) => {
                            settaxOnSale((e.target as any).value)
                        }} />
                    </div>
                </div>
                    :
                    <div className='flex mt-4'>
                        <div>
                            <div>Estimated tax on sales </div>
                            <div className='flex'>
                                <div className='mr-1'><i>Approximation, adjusted at checkout</i></div><Tooltip text='' iconColor='blue' />
                            </div>
                        </div>
                    </div>
            }
            <div className='flex pt-4 mt-4 border-t border-black border-solid'>
                 <div className='my-auto font-semibold'>
                     Total Quote After Estimated Tax
                 </div>
                 <div className='ml-auto'>
                     $128500.00
                 </div>
            </div>
        </div>
        <div className='my-2 text-2xl font-moret'>Payment Terms</div>
        <div className='w-full p-4 mt-4 border border-black border-solid'>
            <div className='flex'>
                <div className='my-auto text-xs font-ssp'>
                    TOTAL QUOTE BUDGET : $100000
                </div>
                {editable &&
                    <>
                        <Radio className='ml-auto mr-12' label='%' checked={paymentTermsUnit === '%'} onChange={() => { setpaymentTermsUnit('%') }} />
                        <Radio className='mr-12' label='$' checked={paymentTermsUnit === '$'} onChange={() => { setpaymentTermsUnit('$') }} />
                    </>
                }
            </div>
            <div className='my-1 text-sm font-ssp'><i>Tax Not Included</i></div>
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
                            editable ? <>
                                <TextInput type='number' disabled={paymentTermsUnit !== '$'} className={`${paymentTermsUnit !== '$' ? 'input-gray-disable' : ''} ml-auto w-4rem-important`} suffix={<span>$</span>} inputName='payment item amount' variant='box' value={eachTerm?.amount} onChange={(e) => {
                                    let newPaymentTerms = [...paymentTerms]
                                    newPaymentTerms[key].amount = (e.target as any).valueAsNumber;
                                    setpaymentTerms(newPaymentTerms);
                                }} />
                                <TextInput type='number' disabled={paymentTermsUnit !== '%'} className={`${paymentTermsUnit !== '%' ? 'input-gray-disable' : ''} mr-4 w-4rem-important`} suffix={<span>%</span>} inputName='payment item amount' variant='box' value={eachTerm?.percent} onChange={(e) => {
                                    let newPaymentTerms = [...paymentTerms]
                                    newPaymentTerms[key].percent = (e.target as any).valueAsNumber;
                                    setpaymentTerms(newPaymentTerms);
                                }} />
                            </>
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
        <div className='flex px-4 py-2 mt-4 border-4 border-black border-solid'>
            <div className='font-semibold '>Estimated Amount Due Today</div>
            <div className='ml-auto font-semibold'>$9000.00</div>
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