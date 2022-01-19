import { useState } from 'react'
import { GroupUnit } from '@fulhaus/react.ui.group-unit'
import { useDispatch, useSelector } from 'react-redux'
import produce from 'immer'
import NoteModal from '../../NoteModal/NoteModal'
import { Tappstate } from '../../../redux/reducers'
import apiRequest from '../../../Service/apiRequest'
type eachUnitType = {
    eachUnit: any
}
const EachUnit = ({ eachUnit }: eachUnitType) => {
    const [showNote, setshowNote] = useState(false);
    const [name, setname] = useState(eachUnit?.name);
    const [notes, setnotes] = useState(eachUnit?.notes);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteID = useSelector((state: Tappstate) => state?.quoteDetail)?.quoteID;
    const quoteDetail = useSelector((state: Tappstate) => state?.quoteDetail);
    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit)
    const dispatch = useDispatch();

    const duplicateUnit = async () => {
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${eachUnit?.unitID}/duplicate`,
                method:'POST'
            }
        )
        if(res?.success){
            const newQuoteDetail = produce(quoteDetail, (draft: any) => {
                const unitIndex = draft.data.findIndex((each: any) => each?.unitID === eachUnit.unitID) + 1;
                (draft?.data as any[])?.splice(unitIndex, 0, res?.duplicatedUnit);
            })
            dispatch({
                type: 'quoteDetail',
                payload: newQuoteDetail
            })
        }else{
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
    return <>
        <NoteModal show={showNote} close={() => { setshowNote(false); setnotes(eachUnit.notes); }} text={notes} onChange={(text) => setnotes(text)} save={() => { saveNotes() }} unitName={`${eachUnit.unitType}, ${eachUnit.name ? eachUnit.name : 'Unknown'}`} />
        <div className='w-full mt-4'>
            <GroupUnit
                onSelected={eachUnit?.unitID === selectedQuoteUnit?.unitID}
                onUnitsChange={(count) => updateCount(count)}
                duplicateUnit={()=>duplicateUnit()}
                deleteUnit={() => deleteUnit()}
                finishRenameUnit={() => saveName()}
                renameUnit={(v) => setname(v)}
                viewOnly={userRole === 'viewer'}
                onSelectedChange={() => onSelectUnit()}
                unitName={eachUnit?.name}
                units={eachUnit?.count}
                hasNotes={notes}
                openNotesModal={() => setshowNote(true)}
            />
        </div>
    </>
}

export default EachUnit;