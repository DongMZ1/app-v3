import React from 'react'
import { Popup } from '@fulhaus/react.ui.popup'
import {Button} from '@fulhaus/react.ui.button'
import './NoteModal.scss'
type NoteModalProps = {
    unitName?: string;
    show: boolean;
    text?: string;
    onChange?: (text: string) => void;
    close: () => void;
    save?: () => void
}

const NoteModal = ({ text, onChange, close, save, show, unitName }: NoteModalProps) => {
    return <Popup boxShadow={false} show={show} onClose={close}>
        <div className='border border-black border-solid w-96 bg-cream note-modal'>
            <div className='flex'>
                <div className='mx-auto my-6 text-2xl font-moret'>Note: {unitName}</div>
            </div>
            <div className='px-4'>
            <textarea className='w-full h-20 p-1 text-xs border border-black border-solid outline-none font-ssp' value={text} onChange={(e) => { if (onChange) { onChange(e.target.value) } }} />
            </div>
            <div className='flex my-4'>
                <Button onClick={()=>{close();}} className='justify-center w-20 ml-auto'>Cancel</Button>
                <Button onClick={save?()=>{save();}: ()=>{}} variant='secondary' className='justify-center w-20 mx-4 fulhaus-bg-cream'>Save</Button>
            </div>
        </div>
    </Popup>
}

export default NoteModal;