import { useEffect, useState } from 'react'
import { GroupUnit } from '@fulhaus/react.ui.group-unit'
import { Popup } from '@fulhaus/react.ui.popup'
import { TextInput } from '@fulhaus/react.ui.text-input'
import { Button } from '@fulhaus/react.ui.button'
import { useDispatch, useSelector } from 'react-redux'
import produce from 'immer'
import NoteModal from '../../NoteModal/NoteModal'
import { Tappstate } from '../../../redux/reducers'
import apiRequest from '../../../Service/apiRequest'
import useDebounce from '../../../Hooks/useDebounce';
import useIsFirstRender from '../../../Hooks/useIsFirstRender'
type eachUnitType = {
    eachUnit: any,
    getUnitPackages: () => Promise<void>
}
const EachUnit = ({ eachUnit, getUnitPackages }: eachUnitType) => {
    const [showNote, setshowNote] = useState(false);
    const [name, setname] = useState(eachUnit?.name);
    const [notes, setnotes] = useState(eachUnit?.notes);
    const [unitCount, setunitCount] = useState(eachUnit?.count);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteID = useSelector((state: Tappstate) => state?.quoteDetail)?._id;
    const quoteDetail = useSelector((state: Tappstate) => state?.quoteDetail);
    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit)
    const dispatch = useDispatch();
    const isFirstRendering = useIsFirstRender();

    const [saveUnitPackageName, setsaveUnitPackageName] = useState('');
    const [showSaveAsUnitPackage, setshowSaveAsUnitPackage] = useState(false);

    const debouncedUnitCount = useDebounce(unitCount, 300);
    const viewOnly = userRole === 'viewer' || window.location.href.includes('/quote-summary-rental') || window.location.href.includes('/quote-summary-purchase') || window.location.href.includes('/project/design') || window.location.href.includes('/design-only');
    const darkMode = (window.location.href.includes('/quote-summary-rental') || window.location.href.includes('/quote-summary-purchase') || window.location.href.includes('/project/design') || window.location.href.includes('/design-only')) && eachUnit?.unitID === selectedQuoteUnit?.unitID;

    useEffect(() => {
        //add debounce to update the count of unit
        if (!isFirstRendering) {
            updateCount(debouncedUnitCount);
        }
    }, [debouncedUnitCount])

    const duplicateUnit = async () => {
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${eachUnit?.unitID}/duplicate`,
                method: 'POST'
            }
        )
        if (res?.success) {
            const newQuoteDetail = produce(quoteDetail, (draft: any) => {
                (draft?.data as any[])?.push(res?.duplicatedUnit);
            })
            dispatch({
                type: 'quoteDetail',
                payload: newQuoteDetail
            })
        } else {
            console.log('duplicate failed at line 38 EachUnit.tsx')
        }
    }

    const saveName = async () => {
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${eachUnit?.unitID}`,
                body: {
                    name
                },
                method: 'PATCH'
            }
        )
        if (res?.success) {
            const newQuoteDetail = produce(quoteDetail, (draftState: any) => {
                (draftState?.data?.filter((each: any) => each?.unitID === eachUnit.unitID)?.[0] as any).name = name
            })
            dispatch({
                type: 'quoteDetail',
                payload: newQuoteDetail
            })
        } else {
            console.log('saveName failed at line 61 EachUnit.tsx')
        }
    }

    const updateCount = async (v: number) => {
        const newQuoteDetail = produce(quoteDetail, (draftState: any) => {
            if (v) {
                (draftState?.data?.filter((each: any) => each?.unitID === eachUnit.unitID)?.[0] as any).count = v
            }
            else {
                (draftState?.data?.filter((each: any) => each?.unitID === eachUnit.unitID)?.[0] as any).count = 0
            }
        })
        dispatch({
            type: 'quoteDetail',
            payload: newQuoteDetail
        })
        const newSelectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
            if (v) {
                draft.count = v;
            } else {
                draft.count = 0
            }
        })
        dispatch({
            type: 'selectedQuoteUnit',
            payload: newSelectedQuoteUnit
        })
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${eachUnit?.unitID}`,
                body: {
                    count: v ? v : 0
                },
                method: 'PATCH'
            }
        )
        if (!res?.success) {
            console.log('updateCount failed at line 90 EachUnit.tsx')
        }
    }

    const saveNotes = async () => {
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${eachUnit?.unitID}`,
                body: {
                    notes
                },
                method: 'PATCH'
            }
        )
        if (res?.success) {
            const newQuoteDetail = produce(quoteDetail, (draftState: any) => {
                (draftState?.data?.filter((each: any) => each?.unitID === eachUnit.unitID)?.[0] as any).notes = notes
            })
            dispatch({
                type: 'quoteDetail',
                payload: newQuoteDetail
            })
            setshowNote(false);
        } else {
            console.log(res?.message)
        }
    }

    const onSelectUnit = () => {
        if((window.location.href.includes('/project/design') || window.location.href.includes('/design-only'))){
            dispatch({
                type: 'selectedQuoteUnit',
                payload: undefined
            }) 
        }
        if (true) {
            dispatch({
                type: 'appLoader',
                payload: true
            })
            setTimeout(() => {
                dispatch({
                    type: 'selectedQuoteUnit',
                    payload: eachUnit
                })
                dispatch({
                    type: 'appLoader',
                    payload: false
                })
            }, 1200)
        } else {
            dispatch({
                type: 'selectedQuoteUnit',
                payload: eachUnit
            })
        }
    }

    const deleteUnit = async () => {
        const res = await apiRequest({
            url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${eachUnit?.unitID}`,
            method: 'DELETE'
        })
        if (res?.success) {
            if (eachUnit?.unitID === selectedQuoteUnit?.unitID) {
                dispatch({
                    type: 'selectedQuoteUnit',
                    payload: undefined
                })
            }
            const newQuoteDetail = produce(quoteDetail, (draftState: any) => {
                draftState.data = draftState?.data?.filter((each: any) => each?.unitID !== eachUnit.unitID)
            })
            //not best approach, but seems like redux not detect arrays change inside deep copyed state 
            dispatch({
                type: 'quoteDetail',
                payload: undefined
            })
            dispatch({
                type: 'quoteDetail',
                payload: newQuoteDetail
            })
        } else {
            console.log(res?.message)
        }
    }

    const saveUnitAsUnitPackage = async () => {
        const res = await apiRequest({
            url: `/api/fhapp-service/package/unit/${currentOrgID}`,
            body: {
                name: saveUnitPackageName,
                rooms: eachUnit.rooms
            },
            method: 'POST'
        })
        if (res?.success) {
            getUnitPackages();
        } else {
            console.log('saveUnitAsRoomPackage failed at EachUnit.tsx')
        }
    }
    return <>
        <Popup horizontalAlignment='center' verticalAlignment='center' onClose={() => setshowSaveAsUnitPackage(false)} show={showSaveAsUnitPackage}>
            <div className='px-8 py-4 border border-black border-solid w-96 bg-cream'>
                <div className='mx-2 text-2xl text-center font-moret'>
                    What will you name your unit package?
                </div>
                <div className='mt-2 text-xs font-ssp'>
                    unit Name
                </div>
                <TextInput className='mt-2' inputName='save as room package input' variant='box' value={saveUnitPackageName} onChange={(e) => setsaveUnitPackageName((e.target as any).value)} />
                <div className='flex my-2'>
                    <Button onClick={() => {
                        setshowSaveAsUnitPackage(false);
                    }} className='w-20 mr-4' variant='secondary'>Cancel</Button>
                    <Button disabled={!saveUnitPackageName} onClick={() => {
                        saveUnitAsUnitPackage();
                        setsaveUnitPackageName('')
                        setshowSaveAsUnitPackage(false);
                    }} variant='primary' className='w-20'>Save</Button>
                </div>
            </div>
        </Popup>
        <NoteModal show={showNote} close={() => { setshowNote(false); setnotes(eachUnit.notes); }} text={notes} onChange={(text) => setnotes(text)} save={() => { saveNotes() }} unitName={`${eachUnit.name ? eachUnit.name : 'Unknown'}`} />
        <div className='w-full mt-4'>
            <GroupUnit
                saveUnitAsUnitPackage={() => setshowSaveAsUnitPackage(true)}
                onSelected={eachUnit?.unitID === selectedQuoteUnit?.unitID}
                onUnitsChange={(count) => setunitCount(count)}
                duplicateUnit={() => duplicateUnit()}
                deleteUnit={() => deleteUnit()}
                finishRenameUnit={() => saveName()}
                renameUnit={(v) => setname(v)}
                viewOnly={viewOnly}
                onSelectedChange={() => onSelectUnit()}
                unitName={name}
                //check if it is selected, if not then give it a unit count
                units={eachUnit?.unitID === selectedQuoteUnit?.unitID ? unitCount : unitCount ? unitCount : 0}
                hasNotes={notes}
                openNotesModal={() => setshowNote(true)}
                darkmod={darkMode}
            />
        </div>
    </>
}

export default EachUnit;