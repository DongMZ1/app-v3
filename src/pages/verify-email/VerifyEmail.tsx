import { useState } from 'react'
import { Loader } from "@fulhaus/react.ui.loader";
import useLocationSearch from '../../Hooks/useLocationSearch'
const VerifyEmail = () => {
    const [token] = useLocationSearch('token');
    return <div className='flex w-screen h-screen bg-cream'>
        <div className='m-auto'>
            <Loader />
        </div>
    </div>
}

export default VerifyEmail;