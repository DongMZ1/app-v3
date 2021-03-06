import { useState } from 'react'
import { ReactComponent as SaveIcon } from "../../../styles/images/save.svg";
import { useSelector, useDispatch } from 'react-redux'
import { Popup } from '@fulhaus/react.ui.popup';
import { Button } from '@fulhaus/react.ui.button';
import { TextInput } from '@fulhaus/react.ui.text-input';
import { Tappstate } from '../../../redux/reducers';
import apiRequest from '../../../Service/apiRequest';
import produce from 'immer'
const SaveProject = () => {
    const [showConfirmSave, setshowConfirmSave] = useState(false);
    const [projectSaveName, setprojectSaveName] = useState("");
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    const quoteID = useSelector((state: Tappstate) => state.quoteDetail)?._id;
    const selectedProject = useSelector((state: Tappstate) => state.selectedProject);
    const projectID = useSelector((state:Tappstate) => state.selectedProject)?._id;
    const dispatch = useDispatch();
    const saveProject = async () => {
        const res = await apiRequest(
            {
                url: `/api/fhapp-service/quote/${currentOrgID}/${projectID}/${quoteID}/save`,
                method: 'PATCH',
                body: {
                    versionName: projectSaveName
                }
            }
        )
        
        if (res?.success) {
            setprojectSaveName("");
            const newSelectedProject = produce(selectedProject, (draft: any) => {
                draft.quote._id = res.newQuote_id
            })
            localStorage.setItem('selectedProject', JSON.stringify(newSelectedProject));
            dispatch({
                type:'selectedProject',
                payload:newSelectedProject
            })
            setshowConfirmSave(false);
        } else {
            console.log('save version failed at SaveProject.tsx')
        }
    }
    return <>
        <SaveIcon className='my-auto mr-8 cursor-pointer' onClick={() => setshowConfirmSave(true)} />
        <Popup horizontalAlignment='center' verticalAlignment='center' onClose={() => setshowConfirmSave(false)} show={showConfirmSave}>
            <div className='px-8 py-4 border border-black border-solid w-96 bg-cream'>
                <div className='mx-2 text-xl text-center font-moret'>
                    What will you describle your current version?
                </div>
                <div className='mt-4 text-sm font-ssp'>Maximum 50 characters</div>
                <TextInput className='mt-2' inputName='save as room package input' variant='box' value={projectSaveName} onChange={(e) => { if ((e.target as any).value?.length < 51) { setprojectSaveName((e.target as any).value) } }} />
                <div className='flex my-2'>
                    <Button onClick={() => {
                        setshowConfirmSave(false);
                    }} className='w-20 mr-4' variant='secondary'>Cancel</Button>
                    <Button disabled={!projectSaveName} onClick={() => {
                        saveProject();
                    }} variant='primary' className='w-20'>Save</Button>
                </div>
            </div>
        </Popup>
    </>
}

export default SaveProject;