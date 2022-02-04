import { useState } from 'react'
import { ReactComponent as SaveIcon } from "../../../styles/images/save.svg";
import { useSelector, useDispatch } from 'react-redux'
import { Popup } from '@fulhaus/react.ui.popup';
import { Button } from '@fulhaus/react.ui.button';
import { TextInput } from '@fulhaus/react.ui.text-input';
const SaveProject = () => {
    const [showConfirmSave, setshowConfirmSave] = useState(false);
    const [projectSaveName, setprojectSaveName] = useState("");
    return <>
        <SaveIcon className='my-auto mr-8 cursor-pointer' onClick={() => setshowConfirmSave(true)} />
        <Popup horizontalAlignment='center' verticalAlignment='center' onClose={() => setshowConfirmSave(false)} show={showConfirmSave}>
            <div className='px-8 py-4 border border-black border-solid w-96 bg-cream'>
                <div className='mx-2 text-xl text-center font-moret'>
                    What will you describle your current version?
                </div>
                <TextInput className='mt-2' inputName='save as room package input' variant='box' value={projectSaveName} onChange={(e) => setprojectSaveName((e.target as any).value)} />
                <div className='flex my-2'>
                    <Button onClick={() => {
                        setshowConfirmSave(false);
                    }} className='w-20 mr-4' variant='secondary'>Cancel</Button>
                    <Button disabled={!projectSaveName} onClick={() => {
                        setshowConfirmSave(false);
                    }} variant='primary' className='w-20'>Save</Button>
                </div>
            </div>
        </Popup>
    </>
}

export default SaveProject;