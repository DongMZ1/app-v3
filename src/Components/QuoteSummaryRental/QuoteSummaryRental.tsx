import { useState } from 'react';
import './QuoteSummaryRental.scss'
import UnitBudget from '../UnitBudget/UnitBudget'
import { useDispatch, useSelector } from 'react-redux'
import { Tappstate } from '../../redux/reducers'
import { ReactComponent as EditPenIcon } from '../../styles/images/edit-pen.svg'
import { DatePicker } from '@fulhaus/react.ui.date-picker'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler';
import { ImCross } from 'react-icons/im'
import { Tooltip } from '@fulhaus/react.ui.tooltip'
import { TextInput } from '@fulhaus/react.ui.text-input';
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import { Button } from '@fulhaus/react.ui.button';
import { RiDeleteBin6Fill } from 'react-icons/ri'
import { Checkbox } from '@fulhaus/react.ui.checkbox';
import produce, { Immer } from 'immer';
const QuoteSummaryRental = () => {
    const [editable, seteditable] = useState(false);
    const [showCalendar, setshowCalendar] = useState(false);
    const [checkedTax, setcheckedTax] = useState(false);
    const [taxOnSale, settaxOnSale] = useState('0')
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail);
    const userRole = useSelector((state: Tappstate) => state?.selectedProject?.userRole);
    const dispatch = useDispatch()
    if (selectedQuoteUnit) {
        return <UnitBudget />
    }

    const updateshipping = (v: string) => {
        const newQuoteDetail = produce(quoteDetail, (draft: any) => {
            draft.shipping = v
        });
        dispatch({
            type: 'quoteDetail',
            payload: newQuoteDetail
        })
    }

    const setAdditionalDiscountPercent = (v: string) => {
        const newQuoteDetail = produce(quoteDetail, (draft: any) => {
            if (!draft.additionalDiscount) {
                draft.additionalDiscount = {}
            }
            draft.additionalDiscount.percent = v
        });
        dispatch({
            type: 'quoteDetail',
            payload: newQuoteDetail
        })
    }

    const setAdditionalDiscountDescription = (v: string) => {
        const newQuoteDetail = produce(quoteDetail, (draft: any) => {
            if (!draft.additionalDiscount) {
                draft.additionalDiscount = {}
            }
            draft.additionalDiscount.description = v
        });
        dispatch({
            type: 'quoteDetail',
            payload: newQuoteDetail
        })
    }
    return <div className='flex flex-col w-full h-full px-6 py-4 overflow-y-auto text-sm quote-summary-rental font-ssp'>
        <div className='flex'>
            <div className='my-auto text-2xl font-moret'>Rental Summary</div>
            {
                !editable && <>
                    <div className='my-auto ml-auto mr-8 text-sm font-ssp'>Start Date: May 1, 2021</div>
                    {userRole !== 'viewer' && <EditPenIcon onClick={() => seteditable(true)} className='my-auto cursor-pointer' />}
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
                    {userRole !== 'viewer' && <ImCross className='my-auto cursor-pointer' onClick={() => seteditable(false)} />}
                </>
            }
        </div>
        <div className='flex pb-4 mt-12 border-b border-black border-solid'>
            <div className='flex w-1/3 text-base font-ssp'><div className='mx-auto'>Average Per Unit</div></div>
            <div className='flex w-1/3 text-base font-ssp'><div className='mx-auto'>Year 1</div></div>
            <div className='flex w-1/3 text-base font-ssp'><div className='mx-auto'>Year 2</div></div>
        </div>
        <div className='flex mt-4'>
            <div className='flex w-1/4 ml-auto mr-16'><div className='m-auto'>Year 1</div></div>
            <div className='flex w-1/4 mr-4'><div className='m-auto'>Year 2(40% off)</div></div>
        </div>
        <div className='flex'>
            <div className='w-1/4 h-2 ml-auto mr-16 border-t border-l border-r border-black border-dashed'></div>
            <div className='w-1/4 h-2 mr-4 border-t border-l border-r border-black border-dashed'></div>
        </div>
        <div className='flex mt-4 mb-2'>
            <div className='w-4/12'>Unit Type</div>
            <div className='w-2/12'>Qty</div>
            <div className='width-12-percent'>Per Month Per Unit</div>
            <div className='w-1/12'>Total Per Unit</div>
            <div className='ml-auto width-12-percent'>Per Month Per Unit</div>
            <div className='w-1/12'>Total Per Unit</div>
        </div>
        {
            quoteDetail?.data.map((eachUnit: any) => <div className='flex py-2 border-t border-black border-solid'>
                <div className='w-4/12'>{eachUnit?.name}</div>
                <div className='w-2/12'>{eachUnit?.count}</div>
                <div className='width-12-percent'>${eachUnit?.rentalPricePerMonthPerUnitYear1?.toFixed(2)}</div>
                <div className='w-1/12'>{eachUnit?.rentalPriceTotalPerMonthYear1?.toFixed(2)}</div>
                <div className='ml-auto width-12-percent'>${eachUnit?.rentalPricePerMonthPerUnitYear2?.toFixed(2)}</div>
                <div className='w-1/12'>{eachUnit?.rentalPriceTotalPerMonthYear2?.toFixed(2)}</div>
            </div>)
        }
        <div className='flex pt-2 border-t border-black border-solid'>
            <div className='w-4/12'>Totals</div>
            <div className='w-2/12'>{quoteDetail?.unitCount ? quoteDetail.unitCount : 0}</div>
            <div className='width-12-percent'></div>
            <div className='w-1/12'>${quoteDetail?.rentalPriceTotalPerMonthYear1 ? quoteDetail.rentalPriceTotalPerMonthYear1 : 0}</div>
            <div className='ml-auto width-12-percent'></div>
            <div className='w-1/12'>${quoteDetail?.rentalPriceTotalPerMonthYear2 ? quoteDetail.rentalPriceTotalPerMonthYear2 : 0}</div>
        </div>
        <div className='flex mt-4 font-ssp'>
            <div>
                <div className='text-sm font-ssp'>
                    Volume Discount
                </div>
                {editable ? <DropdownListInput initialValue={'Tier Not Available'} options={['Tier Not Available']} wrapperClassName='w-6rem-important' /> :
                    <div>
                        Tier Not Available
                    </div>}
            </div>
            <div className='my-auto ml-auto'>Volume Discount NOT Implement Yet</div>
        </div>
        <div className='mt-10 text-2xl font-moret'>Order Summary</div>
        <div className='flex mt-4 text-sm font-ssp'>
            <div>Item</div>
            <div className='ml-auto'>Rate</div>
        </div>
        <div className={`mt-2 ${editable ? 'border mb-6 px-4 py-6' : 'mb-6 border px-4 py-4'} border-black border-solid`}>
            <div className='flex'>
                <div className='mr-1'>Setup Fee</div>
                <Tooltip text='' iconColor='blue' />
                <div className='ml-auto'>${quoteDetail?.setupFee}</div>
            </div>
            <div className='flex mt-3'>
                <div className='mr-1'>
                    Non rentable
                </div>
                <Tooltip text='' iconColor='blue' />
                <div className='ml-auto'>${quoteDetail?.nonRentalTotalAmount}</div>
            </div>
            <div className='flex mt-3'>
                <div className='mr-1'>
                    First Month Rent On Product
                </div>
                <Tooltip text='' iconColor='blue' />
                <div className='ml-auto'>${quoteDetail?.rentalPriceTotalPerMonthYear1}</div>
            </div>
            <div className='flex mt-3'>
                <div className='my-auto mr-1'>
                    Security Deposit
                </div>
                <Tooltip text='' iconColor='blue' />
                <div className='ml-auto'>${quoteDetail?.securityDeposit}</div>
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
                        <TextInput prefix={<span>$</span>} className='w-24 h-10' variant='box' inputName='security deposit' value={quoteDetail?.shipping} onChange={
                            (e) => {
                                updateshipping((e.target as any).value)
                            }
                        } /></> : <div className='ml-auto'>${quoteDetail?.shipping}</div>}
            </div>
            {
                quoteDetail?.paymentTerms?.map(
                    (eachCost: any, key: any) =>
                        <div key={key} className='flex w-full mt-3'>
                            {editable ?
                                <TextInput inputName='payment term name' variant='box' value={eachCost?.term} onChange={
                                    (e) => {
                                        const newQuoteDetail = produce(quoteDetail, (draft: any) => {
                                            draft.paymentTerms[key].term = (e.target as any).value
                                        });
                                        dispatch({
                                            type: 'quoteDetail',
                                            payload: newQuoteDetail
                                        })
                                    }
                                } />
                                :
                                <div className='my-auto'>{eachCost?.term}</div>
                            }
                            {
                                editable ? <>
                                    <DropdownListInput
                                        initialValue={eachCost?.type === 'PERCENT' ? '%' : '$'}
                                        wrapperClassName='ml-auto  w-6rem-important h-2-5-rem-important ml-auto'
                                        onSelect={(v) => {
                                            const newQuoteDetail = produce(quoteDetail, (draft: any) => {
                                                if (v === '%') {
                                                    draft.paymentTerms[key].type = 'PERCENT'
                                                }
                                                if (v === '$') {
                                                    draft.paymentTerms[key].type = 'ABSOLUTE'
                                                }
                                            });
                                            dispatch({
                                                type: 'quoteDetail',
                                                payload: newQuoteDetail
                                            })
                                        }}
                                        options={['$', '%']} />
                                    <TextInput type='number' className='mr-4 w-4rem-important' suffix={<span>{eachCost?.type === 'PERCENT' ? '%' : '$'}</span>} inputName='payment item amount' variant='box' value={eachCost?.amount} onChange={(e) => {
                                        const newQuoteDetail = produce(quoteDetail, (draft: any) => {
                                            draft.paymentTerms[key].amount = (e.target as any).value
                                        });
                                        dispatch({
                                            type: 'quoteDetail',
                                            payload: newQuoteDetail
                                        })
                                    }} />
                                </>
                                    :
                                    <div className='my-auto ml-auto'>
                                        {eachCost?.type === 'ABSOLUTE' ? '$' : ''}{eachCost?.amount}{eachCost?.type === 'PERCENT' ? '%' : ''}
                                    </div>
                            }
                            {
                                editable && <RiDeleteBin6Fill color='red' className='my-auto cursor-pointer' onClick={() => {
                                    const newQuoteDetail = produce(quoteDetail, (draft: any) => {
                                        draft.paymentTerms?.splice(key, 1);
                                    });
                                    dispatch({
                                        type: 'quoteDetail',
                                        payload: newQuoteDetail
                                    })
                                }} />
                            }
                        </div>
                )
            }
            {
                editable && <Button className='mt-2' variant='primary' onClick={() => {
                    const newQuoteDetail = produce(quoteDetail, (draft: any) => {
                        draft.paymentTerms?.push({
                            term: '',
                            type: 'PERCENT',
                            amount: 0
                        })
                    });
                    dispatch({
                        type: 'quoteDetail',
                        payload: newQuoteDetail
                    })
                }} >Add new Service Cost</Button>
            }
        </div>
        <div className='flex pt-4 pb-4 mt-4 border-t border-black border-solid'>
            <div className='mr-1 font-semibold font-ssp'>Subtotal</div>
            <Tooltip text='' iconColor='blue' />
            <div className='ml-auto'>${quoteDetail?.rentalSubtotal}</div>
        </div>
        {editable ?
            <>
                <div className='flex'>
                    <div className='w-1/6 mr-4'>
                        Additional Discount
                    </div>
                    <div className='w-2/3'>
                        Rationale
                    </div>
                </div>
                <div className='flex'>
                    <div className='w-1/6 my-auto mr-4'>
                        <TextInput className='w-full' variant='box' inputName='additional discount' value={quoteDetail?.additionalDiscount?.percent} onChange={(e) => setAdditionalDiscountPercent((e.target as any).value)} suffix={<small>%</small>} />
                    </div>
                    <div className='w-2/3'>
                        <TextInput className='w-full' variant='box' inputName='rationale' value={quoteDetail?.additionalDiscount?.description} onChange={(e) => setAdditionalDiscountDescription((e.target as any).value)} />
                    </div>
                    <div className='my-auto ml-auto'>-{quoteDetail?.additionalDiscount?.percent}%</div>
                </div></> :
            <div className='flex'>
                <div className='w-1/3'>
                    <div>Additional Discount : {quoteDetail?.additionalDiscount?.percent}%</div>
                    <div className='text-xs'>{quoteDetail?.additionalDiscount?.description}</div>
                </div>
                <div className='my-auto ml-auto'>-{quoteDetail?.additionalDiscount?.percent}%</div>
            </div>
        }
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
                    <TextInput type='number' className='mr-4 w-4rem-important' suffix={<span>{"$"}</span>} inputName='tax on sale input' variant='box' value={quoteDetail?.tax} onChange={(e) => {
                        const newQuoteDetail = produce(quoteDetail, (draft: any) => {
                            draft.tax = (e.target as any).valueAsNumber
                        })
                        dispatch({
                            type: 'quoteDetail',
                            payload: newQuoteDetail
                        })
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
                    <div className='my-auto ml-auto'>
                        ${quoteDetail?.tax}
                    </div>
                </div>
        }
        <div className='flex px-4 py-2 mt-4 border-4 border-black border-solid'>
            <div className='font-semibold '>Estimated Amount Due Today</div>
            <div className='ml-auto font-semibold'>${quoteDetail?.rentalEstimatedAmountDueToday}</div>
        </div>
        <div className='flex px-4 py-2 mt-4 border border-black border-solid'>
            <div className='mr-1'>Total Quote Value Before Tax</div>
            <Tooltip text='' iconColor='blue' />
            <div className='ml-auto'>${quoteDetail?.rentalTotalQuoteBeforeTax}</div>
        </div>
        <div className='w-full px-4 py-2 mt-4 text-sm border border-black border-solid font-ssp'>
            <div className='my-auto text-xl font-moret'>End Of Lease Option</div>
            <div className='flex mt-2'>
                <div className='mr-1'>Buy Back After Year 1</div>
                <Tooltip text='' iconColor='blue' />
                <div className='ml-auto'>${quoteDetail?.buyBackPriceAfterYear1 ? quoteDetail.buyBackPriceAfterYear1 : 0}</div>
            </div>
            <div className='flex mt-2'>
                <div className='mr-1'>Buy Back After Year 2</div>
                <Tooltip text='' iconColor='blue' />
                <div className='ml-auto'>${quoteDetail?.buyBackPriceAfterYear2 ? quoteDetail.buyBackPriceAfterYear2 : 0}</div>
            </div>
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