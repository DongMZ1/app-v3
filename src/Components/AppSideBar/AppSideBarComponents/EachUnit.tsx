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
    const [name, setname] = useState(eachUnit?.unitName);
    const [count, setcount] = useState(1);
    const [notes, setnotes] = useState(eachUnit.notes);
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteID = useSelector((state: Tappstate) => state?.quoteDetail)?.quoteID;
    const quoteDetail = useSelector((state: Tappstate) => state?.quoteDetail);
    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole
    const dispatch = useDispatch();
    const saveName = async (v : string) => {
           setname(v)
           console.log(v);
    }
    const saveNotes = async () => {
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/${currentOrgID}/${quoteID}/${eachUnit?.unitID}`,
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
                type:'quoteDetail',
                payload:newQuoteDetail
            })
            setshowNote(false);
        }else{
            console.log(res?.message)
        }
    }
    const onSelectUnit = () => {
        dispatch({
            type: 'selectedQuoteUnit',
            payload: eachUnit
        })
    }
    return <>
        <NoteModal show={showNote} close={() => { setshowNote(false); setnotes(eachUnit.notes); }} text={notes} onChange={(text) => setnotes(text)} save={() => { saveNotes() }} unitName={`${eachUnit.unitType}, ${eachUnit.unitName ? eachUnit.unitName : 'Unknown'}`} />
        <div className='w-full mt-4'>
            <GroupUnit
                renameUnit={(v) => saveName(v)}
                viewOnly={userRole === 'viewer'}
                onSelectedChange={() => onSelectUnit()} unitType={eachUnit?.unitType} unitName={name} units={count} hasNotes={notes}
                openNotesModal={() => setshowNote(true)}
            />
        </div>
    </>
}

export default EachUnit;