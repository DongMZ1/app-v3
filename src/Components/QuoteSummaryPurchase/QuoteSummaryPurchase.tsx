import { useState } from 'react';
import './QuoteSummaryPurchase.scss'
import UnitBudget from '../UnitBudget/UnitBudget'
import { useSelector, useDispatch } from 'react-redux'
import { Tappstate } from '../../redux/reducers'
import { ReactComponent as EditPenIcon } from '../../styles/images/edit-pen.svg'
import { ImCross } from 'react-icons/im'
import { Tooltip } from '@fulhaus/react.ui.tooltip'
import { TextInput } from '@fulhaus/react.ui.text-input';
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input';
import { Button } from '@fulhaus/react.ui.button';
import { RiDeleteBin6Fill } from 'react-icons/ri'
import { Radio } from '@fulhaus/react.ui.radio';
import { Checkbox } from '@fulhaus/react.ui.checkbox';
import produce from 'immer'
const QuoteSummaryPurchase = () => {
    const [editable, seteditable] = useState(false);
    const [checkedTax, setcheckedTax] = useState(false);
    const [taxOnSale, settaxOnSale] = useState('0')
    const dispatch = useDispatch();
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail);
    const userRole = useSelector((state: Tappstate) => state?.selectedProject?.userRole);
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
    if (selectedQuoteUnit) {
        return <UnitBudget />
    }
    return <div className='flex flex-col w-full h-full px-6 py-4 overflow-y-auto text-sm quote-summary-purchase font-ssp'>
        <div className='flex'>
            <div className='my-auto text-2xl font-moret'>Order Summary</div>
            {
                !editable && <>
                    {userRole !== 'viewer' && <EditPenIcon onClick={() => seteditable(true)} className='my-auto ml-auto cursor-pointer' />}
                </>
            }
            {
                editable && <>
                    <ImCross className='my-auto ml-auto cursor-pointer' onClick={() => seteditable(false)} />
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
                <div className='w-1/4'>${eachUnit?.upfrontPricePerUnit?.toFixed(2)}</div>
                <div className='w-1/4'>${eachUnit?.upfrontPriceOfAllUnit?.toFixed(2)}</div>
            </div>)
        }
        <div className='flex py-2'>
            <div className='w-1/4 '>Totals</div>
            <div className='w-1/2'>{quoteDetail?.unitCount}</div>
            <div className='w-1/4'>${quoteDetail?.upfrontTotalPriceOfAllUnits?.toFixed(2)}</div>
        </div>
        <div className='flex mt-2 font-ssp'>
            <div>
                <div className='text-sm font-ssp'>
                    Volume Discount
                </div>
                {editable ?
                    <DropdownListInput initialValue={'Tier Not Available'} options={['Tier Not Available']} wrapperClassName='w-6rem-important' />
                    :
                    <div>
                        Tier Not Available
                    </div>}
            </div>
            <div className='my-auto ml-auto'>Tier Not Available</div>
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
                            options={['%', '$']} />
                        <TextInput prefix={<span>$</span>} className='w-24 h-10' variant='box' inputName='security deposit' value={quoteDetail?.shipping} onChange={
                            (e) => {
                                updateshipping((e.target as any).value)
                            }
                        } /></> : <div className='ml-auto'>${Number(quoteDetail?.shipping)?.toFixed(2)}</div>}
            </div>
            <div className='flex pt-4 pb-4 mt-4 border-t border-black border-solid'>
                <div className='mr-1 font-semibold font-ssp'>Subtotal</div>
                <Tooltip text='' iconColor='blue' />
                <div className='ml-auto'>${quoteDetail?.upfrontSubtotal?.toFixed(2)}</div>
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
            <div className='flex pt-4 mt-4 border-t border-black border-solid'>
                <div className='my-auto font-semibold'>
                    Total Quote Before Tax
                </div>
                <div className='ml-auto'>
                    Not Implement Yet
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
                        <TextInput type='number' className='ml-auto mr-4 w-4rem-important' suffix={<span>{"%"}</span>} inputName='tax on sale input' variant='box' value={quoteDetail?.tax} onChange={(e) => {
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
                        <div className='my-auto ml-auto'>
                            {quoteDetail?.tax} %
                        </div>
                    </div>
            }
            <div className='flex pt-4 mt-4 border-t border-black border-solid'>
                <div className='my-auto font-semibold'>
                    Total Quote After Estimated Tax
                </div>
                <div className='ml-auto'>
                    Not Implement Yet
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
                        <Radio className='ml-auto mr-12' label='%' checked={quoteDetail?.paymentTerms[0]?.type === 'PERCENT'} onChange={() => {
                            const newQuoteDetail = produce(quoteDetail, (draft: any) => {
                                draft?.paymentTerms?.forEach((each: any) => each.type = 'PERCENT')
                            });
                            dispatch({
                                type: 'quoteDetail',
                                payload: newQuoteDetail
                            })
                        }} />
                        <Radio className='mr-12' label='$' checked={quoteDetail?.paymentTerms[0]?.type === 'ABSOLUTE'} onChange={() => {
                            const newQuoteDetail = produce(quoteDetail, (draft: any) => {
                                draft?.paymentTerms?.forEach((each: any) => each.type = 'ABSOLUTE')
                            });
                            dispatch({
                                type: 'quoteDetail',
                                payload: newQuoteDetail
                            })
                        }} />
                    </>
                }
            </div>
            <div className='my-1 text-sm font-ssp'><i>Tax Not Included</i></div>
            {
                quoteDetail?.paymentTerms?.map(
                    (eachCost: any, key: any) => <div className='flex w-full py-2 border-b border-black border-solid '>
                        <div className='my-auto mr-4'>{key + 1}.</div>
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
                                <TextInput type='number' disabled={quoteDetail?.paymentTerms[0]?.type !== 'ABSOLUTE'} className={`${quoteDetail?.paymentTerms[0]?.type !== 'ABSOLUTE' ? 'input-gray-disable' : ''} ml-auto w-4rem-important`} suffix={<span>$</span>} inputName='payment item amount' variant='box' value={eachCost?.amount} onChange={(e) => {
                                    const newQuoteDetail = produce(quoteDetail, (draft: any) => {
                                        draft.paymentTerms[key].amount = (e.target as any).value
                                    });
                                    dispatch({
                                        type: 'quoteDetail',
                                        payload: newQuoteDetail
                                    })
                                }} />
                                <TextInput type='number' disabled={quoteDetail?.paymentTerms[0]?.type !== 'PERCENT'} className={`${quoteDetail?.paymentTerms[0]?.type !== 'PERCENT' ? 'input-gray-disable' : ''} mr-4 w-4rem-important`} suffix={<span>%</span>} inputName='payment item amount' variant='box' value={eachCost?.amount} onChange={(e) => {
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
                                <div className='my-auto ml-auto mr-4'>
                                    {eachCost?.amount} {quoteDetail?.paymentTerms[0]?.type === 'PERCENT' ? '%' : '$'}
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