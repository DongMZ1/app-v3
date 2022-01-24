import React, { useEffect, useState } from 'react'
import './AppSideBar.scss'
import SelectAll from './AppSideBarComponents/SelectAll';
import EachUnit from './AppSideBarComponents/EachUnit';
import produce from 'immer'
import { useSelector, useDispatch } from 'react-redux';
import { Tappstate } from '../../redux/reducers';
import apiRequest from '../../Service/apiRequest';
import { AiOutlineUnorderedList, AiOutlineLeft, AiOutlineDown } from 'react-icons/ai';
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
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
    const [unitOptionCheckList, setunitOptionCheckList] = useState<string[]>([]);
    const [unitPackageKeyword, setunitPackageKeyword] = useState('');
    const [unitOptionList, setunitOptionList] = useState<{ name: string, id: string }[]>([]);
    const totalUnitCount = quoteDetail?.data?.map((each: any) => each.count)?.reduce((a: any, b: any) => a + b, 0);
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
        let allUnitsNames = unitOptionCheckList 
        //add costum names
        if(customUnitName){
            allUnitsNames = unitOptionCheckList.concat(customUnitName);
        }
        for (let eachUnitName of allUnitsNames){
            const res = await apiRequest(
                {
                    url: `/api/fhapp-service/quote/${currentOrgID}/${quoteDetail?.quoteID}`,
                    body: {
                        unitName: eachUnitName
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
        setunitOptionCheckList([]);
        setshowAddUnitDropdown(false);
    }
    return (showEntendSideBar ? <div className={`h-full width-500px flex flex-col app-side-bar py-4 border-black border-r border-solid border-t`}>
        {userRole !== 'viewer' && <>
            <div className='flex px-4'>
                <div className='my-auto mr-4 text-sm font-ssp'>add:</div>
                <div className='relative w-20 text-sm-important'>
                    <div onClick={() => setshowAddUnitDropdown(true)} className='flex w-full h-8 border border-black border-solid cursor-pointer'><div className='my-auto ml-auto mr-1'>Units</div><AiOutlineDown className='my-auto mr-auto' /></div>
                    {showAddUnitDropdown && <ClickOutsideAnElementHandler onClickedOutside={() => setshowAddUnitDropdown(false)}>
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
                                setunitOptionCheckList([]);
                            }}
                            />
                            <div className='w-full overflow-y-auto max-h-60'>
                                {unitOptionList?.filter(eachUnit => eachUnit?.name.toLowerCase().includes(unitPackageKeyword.toLowerCase())).map(each =>
                                    <Checkbox className='my-2' label={each?.name} checked={unitOptionCheckList.includes(each.name)} onChange={(v) => {
                                        if (v) {
                                            setunitOptionCheckList(state => [...state, each?.name])
                                        } else {
                                            setunitOptionCheckList(state => state.filter(e => e !== each?.name))
                                        }
                                    }} />)}
                            </div>
                            <div className='flex my-2'>
                                <Button onClick={() => {
                                    setshowAddUnitDropdown(false)
                                }} className='w-32 mr-4' variant='secondary'>Cancel</Button>
                                <Button disabled={unitOptionCheckList.length === 0 && customUnitName === ''} onClick={() => {
                                      createUnits();
                                }} variant='primary' className='w-32'>Create Units</Button>
                            </div>
                        </div>
                    </ClickOutsideAnElementHandler>}
                </div>
                {/**
                 * <div className='w-20 ml-4 text-sm-important dropdown-list-input-box-display-none'>
                    <DropdownListInput prefixIcon={<div className='flex'><div className='m-auto'>Group</div></div>} wrapperClassName='cursor-pointer' listWrapperClassName='width-52-important' options={['Custom Unit', 'Studio', '1BR', '2BR', '3BR', '1BR-HOTEL']} /></div>
                 */}
                <div className='my-auto ml-auto cursor-pointer' onClick={() => setshowEntendSideBar(false)}>
                    <AiOutlineLeft size={22} />
                </div>
            </div>
            <div className='px-4'><SelectAll /></div>
            <div className='px-4 mt-2 text-sm font-ssp'>Total Units: {totalUnitCount}</div>
            <div className='w-full h-full px-4 overflow-y-auto'>
                {
                    quoteDetail?.data?.map((each: any) => <EachUnit eachUnit={each} />)
                }
            </div>
        </>}
    </div> : <div className='w-auto px-4 py-4 border-r border-black border-solid'>
        <AiOutlineUnorderedList className='cursor-pointer' onClick={() => setshowEntendSideBar(true)} />
    </div>)
}

export default AppSideBar;