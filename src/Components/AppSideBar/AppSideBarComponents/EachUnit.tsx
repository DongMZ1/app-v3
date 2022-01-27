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
    const quoteID = useSelector((state: Tappstate) => state?.quoteDetail)?.quoteID;
    const quoteDetail = useSelector((state: Tappstate) => state?.quoteDetail);
    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit)
    const dispatch = useDispatch();
    const isFirstRendering = useIsFirstRender();

    const [saveRoomPackageName, setsaveRoomPackageName] = useState('');
    const [showSaveAsRoomPackage, setshowSaveAsRoomPackage] = useState(false);

    const debouncedUnitCount = useDebounce(unitCount, 300)
    const viewOnly = userRole === 'viewer'

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
                const unitIndex = draft.data.findIndex((each: any) => each?.unitID === eachUnit.unitID) + 1;
                (draft?.data as any[])?.splice(unitIndex, 0, res?.duplicatedUnit);
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
            (draftState?.data?.filter((each: any) => each?.unitID === eachUnit.unitID)?.[0] as any).count = v
        })
        dispatch({
            type: 'quoteDetail',
            payload: newQuoteDetail
        })
        const newSelectedQuoteUnit = produce(selectedQuoteUnit, (draft: any) => {
            draft.count = v;
        })
        dispatch({
            type: 'selectedQuoteUnit',
            payload: newSelectedQuoteUnit
        })
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${eachUnit?.unitID}`,
                body: {
                    count: v
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
        dispatch({
            type: 'selectedQuoteUnit',
            payload: eachUnit
        })
    }

    const deleteUnit = async () => {
        const res = await apiRequest({
            url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${eachUnit?.unitID}`,
            method: 'DELETE'
        })
        if (res?.success) {
            const newQuoteDetail = produce(quoteDetail, (draftState: any) => {
                draftState.data = draftState?.data?.filter((each: any) => each?.unitID !== eachUnit.unitID)
            })
            dispatch({
                type: 'quoteDetail',
                payload: newQuoteDetail
            })
        } else {
            console.log(res?.message)
        }
    }

    const saveUnitAsRoomPackage = async () => {
        const res = await apiRequest({
            url: `/api/fhapp-service/package/unit/${currentOrgID}`,
            body: {
                name: saveRoomPackageName,
                rooms: eachUnit.rooms.map((eachRoom: any) => eachRoom.roomID)
            },
            method: 'POST'
        })
        if (res?.success) {
            getUnitPackages();
        }else{
            console.log('saveUnitAsRoomPackage failed at EachUnit.tsx')
        }
    }
    return <>
        <Popup horizontalAlignment='center' verticalAlignment='center' onClose={() => setshowSaveAsRoomPackage(false)} show={showSaveAsRoomPackage}>
            <div className='px-8 py-4 border border-black border-solid w-96 bg-cream'>
                <div className='mx-2 text-2xl text-center font-moret'>
                    What will you name your multi-room package?
                </div>
                <div className='mt-2 text-xs font-ssp'>
                    Multi-Package Name
                </div>
                <TextInput className='mt-2' inputName='save as room package input' variant='box' value={saveRoomPackageName} onChange={(e) => setsaveRoomPackageName((e.target as any).value)} />
                <div className='flex my-2'>
                    <Button onClick={() => {
                        setshowSaveAsRoomPackage(false);
                    }} className='w-20 mr-4' variant='secondary'>Cancel</Button>
                    <Button disabled={!saveRoomPackageName} onClick={() => {
                        saveUnitAsRoomPackage();
                        setsaveRoomPackageName('')
                        setshowSaveAsRoomPackage(false);
                    }} variant='primary' className='w-20'>Save</Button>
                </div>
            </div>
        </Popup>
        <NoteModal show={showNote} close={() => { setshowNote(false); setnotes(eachUnit.notes); }} text={notes} onChange={(text) => setnotes(text)} save={() => { saveNotes() }} unitName={`${eachUnit.unitType}, ${eachUnit.name ? eachUnit.name : 'Unknown'}`} />
        <div className='w-full mt-4'>
            <GroupUnit
                saveUnitRoomPackage={() => setshowSaveAsRoomPackage(true)}
                onSelected={eachUnit?.unitID === selectedQuoteUnit?.unitID}
                onUnitsChange={(count) => setunitCount(count)}
                duplicateUnit={() => duplicateUnit()}
                deleteUnit={() => deleteUnit()}
                finishRenameUnit={() => saveName()}
                renameUnit={(v) => setname(v)}
                viewOnly={viewOnly}
                onSelectedChange={() => onSelectUnit()}
                unitName={name}
                units={unitCount}
                hasNotes={notes}
                openNotesModal={() => setshowNote(true)}
            />
        </div>
    </>
}

export default EachUnit;