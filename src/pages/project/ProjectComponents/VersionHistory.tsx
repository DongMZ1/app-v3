import { useState } from 'react';
import { ReactComponent as ExitIcon } from '../../../styles/images/exit.svg';
import { Popup } from '@fulhaus/react.ui.popup';
import { Button } from '@fulhaus/react.ui.button';
type VersionHistoryType = {
    close: () => void
}
const VersionHistory = ({ close }: VersionHistoryType) => {
    const [showConfirm, setshowConfirm] = useState(true);
    return <>
        <div className='fixed top-0 z-10 flex w-full h-full bg-black bg-opacity-50'>
            <div className='w-2/4 h-full' onClick={() => close()}></div>
            <div className='z-10 w-2/4 h-full px-4 py-4 overflow-auto border-l border-black border-solid bg-cream'>
                <div className='flex'>
                    <div className='text-2xl uppercase font-moret'>version history</div>
                    <ExitIcon onClick={() => close()} className='my-auto ml-auto cursor-pointer' />
                </div>
            </div>
        </div>
        <Popup horizontalAlignment='center' verticalAlignment='center' onClose={() => setshowConfirm(false)} show={showConfirm}>
            <div className='px-8 py-4 border border-black border-solid w-96 bg-cream'>
                <div className='mx-2 text-base text-center font-moret'>
                    Are you sure you want to go back to version 123, changes you made will not be saved
                </div>
                <div className='flex mt-4 mb-2'>
                    <Button onClick={() => {
                        setshowConfirm(false);
                    }} className='w-20 ml-auto mr-4' variant='secondary'>Cancel</Button>
                    <Button onClick={() => {
                        setshowConfirm(false);
                    }} variant='primary' className='w-20'>Save</Button>
                </div>
            </div>
        </Popup>
    </>
}

export default VersionHistory