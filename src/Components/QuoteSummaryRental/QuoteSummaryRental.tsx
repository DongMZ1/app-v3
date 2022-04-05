import { useState, useCallback } from 'react';
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
import produce from 'immer';
import debounce from 'lodash.debounce';
import apiRequest from '../../Service/apiRequest';
import { getQuoteDetail } from '../../redux/Actions';
const QuoteSummaryRental = () => {
    const [editable, seteditable] = useState(false);
    const [showCalendar, setshowCalendar] = useState(false);
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail);
    const userRole = useSelector((state: Tappstate) => state?.selectedProject?.userRole);
    const dispatch = useDispatch()
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID)

    const updateQuoteField = async ({
        field, value
    }: {
        field: string,
        value: any,
    }) => {
        dispatch({
            type: 'appLoader',
            payload: true
        })
        const res = await apiRequest({
            url: `/api/fhapp-service/quote/${currentOrgID}/${quoteDetail?._id}`,
            method: 'PATCH',
            body: {
                [field]: value
            }
        })
        if (res?.success) {
            dispatch(getQuoteDetail({
                organizationID: currentOrgID ? currentOrgID : '',
                quoteID: quoteDetail?._id,
                loadingFalse: true
            }))
        } else {
            console.log('update quote failed at QuoteSummaryRental')
            dispatch({
                type: 'appLoader',
                payload: false
            })
        }
    }

    const debounceUpdateShipping = useCallback(debounce((value: number) => updateQuoteField({ field: 'shipping', value }), 1000), [currentOrgID, quoteDetail?._id]);

    const debounceUpdateAdditionalDiscount = useCallback(debounce((value: any) => updateQuoteField({ field: 'additionalDiscount', value }), 1000), [currentOrgID, quoteDetail?._id]);

    const debounceUpdateTax = useCallback(debounce((value: number) => updateQuoteField({ field: 'tax', value }), 1000), [currentOrgID, quoteDetail?._id]);

    const debounceUpdateCustomServiceCosts = useCallback(debounce((value: any) => updateQuoteField({ field: 'customServiceCosts', value }), 1000), [currentOrgID, quoteDetail?._id]);

    const updateshipping = (v: string) => {
        const newQuoteDetail = produce(quoteDetail, (draft: any) => {
            draft.shipping = v
        });
        dispatch({
            type: 'quoteDetail',
            payload: newQuoteDetail
        })
        debounceUpdateShipping(Number(v))
    }

    const setAdditionalDiscountPercent = (v: string) => {
        const newQuoteDetail: any = produce(quoteDetail, (draft: any) => {
            if (!draft.additionalDiscount) {
                draft.additionalDiscount = {}
            }
            draft.additionalDiscount.percent = v
        });
        debounceUpdateAdditionalDiscount(newQuoteDetail?.additionalDiscount);
        dispatch({
            type: 'quoteDetail',
            payload: newQuoteDetail
        })
    }

    const setAdditionalDiscountDescription = (v: string) => {
        const newQuoteDetail: any = produce(quoteDetail, (draft: any) => {
            if (!draft.additionalDiscount) {
                draft.additionalDiscount = {}
            }
            draft.additionalDiscount.description = v
        });
        debounceUpdateAdditionalDiscount(newQuoteDetail?.additionalDiscount);
        dispatch({
            type: 'quoteDetail',
            payload: newQuoteDetail
        })
    }

    if (selectedQuoteUnit) {
        return <UnitBudget />
    }

    return <div className='flex flex-col w-full h-full px-6 py-4 overflow-y-auto text-sm quote-summary-rental font-ssp'>
        <div className='flex'>
            <div className='my-auto text-2xl font-moret'>Rental Summary</div>
            {
                !editable && <>
                    <div className='my-auto ml-auto mr-8 text-sm font-ssp'>Start Date: May 1, 2021</div>
                    {userRole !== 'viewer' && (!quoteDetail?.approved) && <EditPenIcon onClick={() => seteditable(true)} className='my-auto cursor-pointer' />}
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
                <div className='w-1/12'>${eachUnit?.rentalPriceTotalPerMonthYear1?.toFixed(2)}</div>
                <div className='ml-auto width-12-percent'>${eachUnit?.rentalPricePerMonthPerUnitYear2?.toFixed(2)}</div>
                <div className='w-1/12'>${eachUnit?.rentalPriceTotalPerMonthYear2?.toFixed(2)}</div>
            </div>)
        }
        <div className='flex pt-2 border-t border-black border-solid'>
            <div className='w-4/12'>Totals</div>
            <div className='w-2/12'>{quoteDetail?.unitCount ? quoteDetail.unitCount : 0}</div>
            <div className='width-12-percent'></div>
            <div className='w-1/12'>${quoteDetail?.rentalPriceTotalPerMonthYear1 ? quoteDetail.rentalPriceTotalPerMonthYear1?.toFixed(2) : 0}</div>
            <div className='ml-auto width-12-percent'></div>
            <div className='w-1/12'>${quoteDetail?.rentalPriceTotalPerMonthYear2 ? quoteDetail.rentalPriceTotalPerMonthYear2?.toFixed(2) : 0}</div>
        </div>
        <div className='flex mt-4 font-ssp'>
            <div>
                <div className='text-sm font-ssp'>
                    Volume Discount
                </div>
                {editable ? <DropdownListInput initialValue={quoteDetail?.customVolumeDiscount ? quoteDetail?.customVolumeDiscount : quoteDetail?.defaultVolumeDiscount} options={['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5', 'Tier 6']} onSelect={(v) => updateQuoteField({
                    field: 'customVolumeDiscount',
                    value: v
                })} wrapperClassName='w-6rem-important' /> :
                    <div>
                        {quoteDetail?.customVolumeDiscount ? quoteDetail?.customVolumeDiscount : quoteDetail?.defaultVolumeDiscount}
                    </div>}
            </div>
            <div className='my-auto ml-auto'>{quoteDetail?.customVolumeDiscount ? quoteDetail?.customVolumeDiscount : quoteDetail?.defaultVolumeDiscount}</div>
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
                <div className='ml-auto'>${quoteDetail?.setupFee?.toFixed(2)}</div>
            </div>
            <div className='flex mt-3'>
                <div className='mr-1'>
                    Non rentable
                </div>
                <Tooltip text='' iconColor='blue' />
                <div className='ml-auto'>${quoteDetail?.nonRentalTotalAmount?.toFixed(2)}</div>
            </div>
            <div className='flex mt-3'>
                <div className='mr-1'>
                    First Month Rent On Product
                </div>
                <Tooltip text='' iconColor='blue' />
                <div className='ml-auto'>${quoteDetail?.rentalPriceTotalPerMonthYear1?.toFixed(2)}</div>
            </div>
            <div className='flex mt-3'>
                <div className='my-auto mr-1'>
                    Security Deposit
                </div>
                <Tooltip text='' iconColor='blue' />
                <div className='ml-auto'>${quoteDetail?.rentalPriceTotalPerMonthYear2?.toFixed(2)}</div>
            </div>
            <div className='flex mt-3'>
                <div className='my-auto mr-1'>
                    Shipping
                </div>
                <Tooltip text='' iconColor='blue' />
                {editable ?
                    <>
                        <TextInput prefix={<span>$</span>} className='w-24 h-10 ml-auto' variant='box' inputName='security deposit' value={quoteDetail?.shipping} onChange={
                            (e) => {
                                updateshipping((e.target as any).value)
                            }
                        } /></> : <div className='ml-auto'>${Number(quoteDetail?.shipping)?.toFixed(2)}</div>}
            </div>
            {
                quoteDetail?.customServiceCosts?.map(
                    (eachCost: any, key: any) =>
                        <div key={key} className='flex w-full mt-3'>
                            {editable ?
                                <TextInput inputName='payment term name' variant='box' value={eachCost?.term} onChange={
                                    (e) => {
                                        const newQuoteDetail: any = produce(quoteDetail, (draft: any) => {
                                            draft.customServiceCosts[key].term = (e.target as any).value
                                        });
                                        debounceUpdateCustomServiceCosts(newQuoteDetail?.customServiceCosts)
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
                                    <TextInput type='number' className='ml-auto mr-4 w-4rem-important' suffix={<span>$</span>} inputName='payment item amount' variant='box' value={eachCost?.amount} onChange={(e) => {
                                        const newQuoteDetail: any = produce(quoteDetail, (draft: any) => {
                                            draft.customServiceCosts[key].amount = (e.target as any).valueAsNumber
                                        });
                                        debounceUpdateCustomServiceCosts(newQuoteDetail?.customServiceCosts)
                                        dispatch({
                                            type: 'quoteDetail',
                                            payload: newQuoteDetail
                                        })
                                    }} />
                                </>
                                    :
                                    <div className='my-auto ml-auto'>
                                        ${Number(eachCost?.amount)?.toFixed(2)}
                                    </div>
                            }
                            {
                                editable && <RiDeleteBin6Fill color='red' className='my-auto cursor-pointer' onClick={() => {
                                    const newQuoteDetail: any = produce(quoteDetail, (draft: any) => {
                                        draft.customServiceCosts?.splice(key, 1);
                                    });
                                    debounceUpdateCustomServiceCosts(newQuoteDetail?.customServiceCosts)
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
                    const newQuoteDetail: any = produce(quoteDetail, (draft: any) => {
                        if (!draft.customServiceCosts) {
                            draft.customServiceCosts = [{
                                term: '',
                                amount: 0
                            }]
                        } else {
                            draft.customServiceCosts?.push({
                                term: '',
                                amount: 0
                            })
                        }
                    });
                    debounceUpdateCustomServiceCosts(newQuoteDetail?.customServiceCosts)
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
            <div className='ml-auto'>${quoteDetail?.rentalSubtotal?.toFixed(2)}</div>
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
                        <TextInput className='w-full' variant='box' inputName='additional discount' value={quoteDetail?.additionalDiscount?.percent} onChange={(e) => {
                            setAdditionalDiscountPercent((e.target as any).value)
                        }} suffix={<small>%</small>} />
                    </div>
                    <div className='w-2/3'>
                        <TextInput className='w-full' variant='box' inputName='rationale' value={quoteDetail?.additionalDiscount?.description} onChange={(e) => setAdditionalDiscountDescription((e.target as any).value)} />
                    </div>
                    <div className='my-auto ml-auto'>-{quoteDetail?.additionalDiscount?.percent}%</div>
                </div></> :
            <div className='flex'>
                <div className='w-1/3'>
                    <div>Additional Discount : {Number(quoteDetail?.additionalDiscount?.percent).toFixed(2)}%</div>
                    <div className='text-xs'>{quoteDetail?.additionalDiscount?.description}</div>
                </div>
                <div className='my-auto ml-auto'>-{Number(quoteDetail?.additionalDiscount?.percent).toFixed(2)}%</div>
            </div>
        }
        {
            editable ? <div className='flex mt-4'>
                <div>
                    <div >
                        <div className='flex'><Checkbox checked={true} onChange={(v) => { }} /><div>Estimated tax on sales </div></div>
                        <div className='flex'>
                            <div className='mr-1'><i>Approximation, adjusted at checkout</i></div><Tooltip text='' iconColor='blue' />
                        </div>
                    </div>
                </div>
                <div className='flex my-auto ml-auto'>
                    <TextInput type='number' className='ml-auto mr-4 w-4rem-important' suffix={<span>{"%"}</span>} inputName='tax on sale input' variant='box' value={quoteDetail?.tax} onChange={(e) => {
                        const newQuoteDetail: any = produce(quoteDetail, (draft: any) => {
                            draft.tax = (e.target as any).valueAsNumber
                        })
                        debounceUpdateTax((e.target as any).valueAsNumber)
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
                        {quoteDetail?.tax} %
                    </div>
                </div>
        }
        <div className='flex px-4 py-2 mt-4 border-4 border-black border-solid'>
            <div className='font-semibold '>Estimated Amount Due Today</div>
            <div className='ml-auto font-semibold'>${quoteDetail?.rentalEstimatedAmountDueToday?.toFixed(2)}</div>
        </div>
        <div className='flex px-4 py-2 mt-4 border border-black border-solid'>
            <div className='mr-1'>Total Quote Value Before Tax</div>
            <Tooltip text='' iconColor='blue' />
            <div className='ml-auto'>${quoteDetail?.rentalTotalQuoteBeforeTax?.toFixed(2)}</div>
        </div>
        <div className='flex px-4 py-2 mt-4 border border-black border-solid'>
            <div className='mr-1'>Total Quote Value After Tax</div>
            <Tooltip text='' iconColor='blue' />
            <div className='ml-auto'>${quoteDetail?.rentalTotalQuoteAfterEstimatedTax?.toFixed(2)}</div>
        </div>
        <div className='w-full px-4 py-2 mt-4 text-sm border border-black border-solid font-ssp'>
            <div className='my-auto text-xl font-moret'>End Of Lease Option</div>
            <div className='flex mt-2'>
                <div className='mr-1'>Buy Back After Year 1</div>
                <Tooltip text='' iconColor='blue' />
                <div className='ml-auto'>${quoteDetail?.buyBackPriceAfterYear1 ? quoteDetail.buyBackPriceAfterYear1?.toFixed(2) : 0}</div>
            </div>
            <div className='flex mt-2'>
                <div className='mr-1'>Buy Back After Year 2</div>
                <Tooltip text='' iconColor='blue' />
                <div className='ml-auto'>${quoteDetail?.buyBackPriceAfterYear2 ? quoteDetail.buyBackPriceAfterYear2?.toFixed(2) : 0}</div>
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