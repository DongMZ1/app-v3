import React, { useEffect, useState } from 'react'
import './AppSideBar.scss'
import SelectAll from './AppSideBarComponents/SelectAll';
import EachUnitQuote from './AppSideBarComponents/EachUnitQuote';
import produce from 'immer'
import { useSelector, useDispatch } from 'react-redux';
import { Tappstate } from '../../redux/reducers';
import apiRequest from '../../Service/apiRequest';
import { AiOutlineUnorderedList, AiOutlineLeft, AiOutlineDown } from 'react-icons/ai';
import { SwitchTransition, CSSTransition, Transition } from 'react-transition-group'
import { TextInput } from '@fulhaus/react.ui.text-input';
import { Checkbox } from '@fulhaus/react.ui.checkbox'
import { Button } from '@fulhaus/react.ui.button'
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler';

const AppSideBar = () => {
    const userRole = useSelector((state: Tappstate) => state?.selectedProject)?.userRole;
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteDetail = useSelector((state: Tappstate) => state?.quoteDetail);
    const dispatch = useDispatch();
    const [showEntendSideBar, setshowEntendSideBar] = useState(false);
    const [showAddUnitDropdown, setshowAddUnitDropdown] = useState(false);
    const [customUnitName, setcustomUnitName] = useState('');
    const [unitPackageKeyword, setunitPackageKeyword] = useState('');
    const [unitOptionCheckedList, setunitOptionCheckedList] = useState<{ name: string, id: string | null }[]>([]);
    const [unitOptionList, setunitOptionList] = useState<{ name: string, id: string }[]>([]);
    const totalUnitCount = quoteDetail?.data?.map((each: any) => each.count)?.reduce((a: any, b: any) => a + b, 0);
    const editable = userRole !== 'viewer' && (!window.location.href.includes('/quote-summary-rental')) && (!window.location.href.includes('/quote-summary-purchase')) && (!window.location.href.includes('/project/design')) && (!window.location.href.includes('/design-only'));
    useEffect(() => {
        getUnitPackages()
    }, [currentOrgID])
    const getUnitPackages = async () => {
        if (currentOrgID) {
            const res = await apiRequest(
                {
                    url: `/api/fhapp-service/packages/unit/${currentOrgID}`,
                    method: 'GET'
                }
            )
            if (res?.success) {
                setunitOptionList(res?.unitPackages?.map((each: any) => { return { name: each.name, id: each._id } }

                ))
            }
        }
    }
    const createUnits = async () => {
        let newUnits: any = [];
        let allUnitsNames = unitOptionCheckedList
        //add costum names
        if (customUnitName) {
            allUnitsNames = unitOptionCheckedList.concat({
                name: customUnitName,
                id: null
            });
        }
        for (let eachUnit of allUnitsNames) {
            const res = await apiRequest(
                {
                    url: `/api/fhapp-service/quote/${currentOrgID}/${quoteDetail?._id}`,
                    body: {
                        unitName: eachUnit.name,
                        packageID: eachUnit.id
                    },
                    method: 'POST'
                }
            )
            if (res?.success) {
                newUnits = newUnits.concat(res.newUnit)
            } else {
                console.log('createUnits failed at AppSideBar.tsx')
            }
        }

        const newQuoteDetail = produce(quoteDetail, (draft: any) => {
            draft.data = draft.data?.concat(newUnits);
        })
        dispatch({
            type: 'quoteDetail',
            payload: newQuoteDetail
        })
        //set name to default
        setcustomUnitName('');
        setunitOptionCheckedList([]);
        setshowAddUnitDropdown(false);
    }
    return (<>
        <CSSTransition in={!showEntendSideBar} mountOnEnter unmountOnExit timeout={300} classNames='display-none-animation'>
            <div className='w-auto px-4 py-4 border-r border-black border-solid'>
                <AiOutlineUnorderedList className='cursor-pointer' onClick={() => setshowEntendSideBar(true)} />
            </div>
        </CSSTransition>
        <CSSTransition in={showEntendSideBar} timeout={300} mountOnEnter unmountOnExit classNames={'appv3-sidebar-animation'}>
            <div className={`h-full width-500px flex flex-col app-side-bar py-4 border-black border-r border-solid border-t`}>
                <div className='flex px-4'>
                    {editable && <>
                        <div className='my-auto mr-4 text-sm font-ssp'>add:</div>
                        <div className='relative w-20 text-sm-important'>
                            <div onClick={() => setshowAddUnitDropdown(true)} className='flex w-full h-8 border border-black border-solid cursor-pointer hover:bg-black hover:border-transparent hover:text-white'><div className='my-auto ml-auto mr-1'>Units</div><AiOutlineDown className='my-auto mr-auto' /></div>
                            <ClickOutsideAnElementHandler onClickedOutside={() => setshowAddUnitDropdown(false)}>
                                <CSSTransition in={showAddUnitDropdown} timeout={300} unmountOnExit classNames='height-800px-animation'>
                                    <div className='absolute z-50 p-4 overflow-y-auto bg-white border border-black border-solid w-96'>

                                        <div className='text-sm font-semibold font-ssp'>
                                            New Unit
                                        </div>
                                        <TextInput placeholder='Enter Unit Name' variant='box' className='mt-2' inputName='customUnitName' value={customUnitName} onChange={(e) => setcustomUnitName((e.target as any).value)} />
                                        <div className='mt-4 text-sm font-semibold font-ssp'>
                                            Choose an existing unit package
                                        </div>
                                        <TextInput placeholder='Search existing unit packages' variant='box' className='mt-2' inputName='unit package keywords' value={unitPackageKeyword} onChange={(e) => {
                                            setunitPackageKeyword((e.target as any).value);
                                            setunitOptionCheckedList([]);
                                        }}
                                        />
                                        <div className='w-full overflow-y-auto max-h-60'>
                                            {unitOptionList?.filter(eachUnit => eachUnit?.name.toLowerCase().includes(unitPackageKeyword.toLowerCase())).map(each =>
                                                <Checkbox className='my-2' label={each?.name} checked={unitOptionCheckedList.includes(each)} onChange={(v) => {
                                                    if (v) {
                                                        setunitOptionCheckedList(state => [...state, each])
                                                    } else {
                                                        setunitOptionCheckedList(state => state.filter(e => e !== each))
                                                    }
                                                }} />)}
                                        </div>
                                        <div className='flex my-2'>
                                            <Button onClick={() => {
                                                setshowAddUnitDropdown(false)
                                            }} className='w-32 mr-4' variant='secondary'>Cancel</Button>
                                            <Button disabled={unitOptionCheckedList.length === 0 && customUnitName === ''} onClick={() => {
                                                createUnits();
                                            }} variant='primary' className='w-32'>Create Units</Button>
                                        </div>
                                    </div>
                                </CSSTransition>
                            </ClickOutsideAnElementHandler>
                        </div>
                        <div className='my-auto ml-auto cursor-pointer' onClick={() => setshowEntendSideBar(false)}>
                            <AiOutlineLeft size={22} />
                        </div>
                    </>}
                </div>
                {editable &&
                    <div className='px-4'>
                        <SelectAll />
                    </div>
                }
                <div className='flex px-4 mt-2'>
                    {(!window.location.href.includes('/project/design')) && (!window.location.href.includes('/design-only')) && <div className='text-sm font-ssp'>Total Units: {totalUnitCount}</div>}
                    {!editable &&
                        <div className='my-auto ml-auto cursor-pointer' onClick={() => setshowEntendSideBar(false)}>
                            <AiOutlineLeft size={22} />
                        </div>
                    }
                </div>
                <div className='w-full h-full px-4 overflow-y-auto'>
                    {
                        (!window.location.href.includes('/project/design')) && (!window.location.href.includes('/design-only')) && quoteDetail?.data?.map((each: any) => <EachUnitQuote getUnitPackages={getUnitPackages} eachUnit={each} />)
                    }
                </div>
            </div>
        </CSSTransition>
    </>)
}

export default AppSideBar;