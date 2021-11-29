import React, { useState } from 'react'
import './StartNewProject.scss'
import { Link } from 'react-router-dom'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { TextInput } from '@fulhaus/react.ui.text-input'
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import { Button } from '@fulhaus/react.ui.button'
const StartNewProject = () => {
    const [projectTitle, setprojectTitle] = useState('');
    const [currency, setcurrency] = useState('');
    const [budget, setbudget] = useState('');

    const [clientName, setclientName] = useState('');
    const [clientEmail, setclientEmail] = useState('');
    const [phone, setphone] = useState('');
    const [organisation, setorganisation] = useState('');

    const [streetName, setstreetName] = useState('');
    const [unit, setunit] = useState('');
    const [province, setprovince] = useState('');
    const [city, setcity] = useState('');
    const [postalCode, setpostalCode] = useState('');
    return (
        <div className='bg-white border border-black border-solid start-new-project-form'>
            <div className='flex'><div className='mx-auto text-4xl font-moret'>Create A New Project</div></div>
            <TextInput className='mt-2' inputName='project title' variant='box' placeholder='Project Title' value={projectTitle} onChange={e => setprojectTitle((e.target as any).value)} />
            <div className='flex mt-4'>
                <div className='w-1/2 mr-2'><DropdownListInput placeholder='Currency' onSelect={v => setcurrency(v)} options={['USD', 'CAD', 'EUR']} /></div>
                <div className='w-1/2 ml-2'><TextInput variant='box' placeholder='Budget' inputName='budget' value={budget} onChange={e => setbudget((e.target as any).value)} /></div>
            </div>
            <div className='mt-3 text-xl font-semibold font-ssp'>Client Information</div>
            <TextInput className='mt-4' inputName='client name' variant='box' placeholder='Client Name' value={clientName} onChange={e => setclientName((e.target as any).value)} />
            <TextInput className='mt-4' inputName='client email' variant='box' placeholder='Client Email' value={clientEmail} onChange={e => setclientEmail((e.target as any).value)} />
            <TextInput className='mt-4' inputName='phone' variant='box' placeholder='Phone (optional)' value={phone} onChange={e => setphone((e.target as any).value)} />
            <TextInput className='mt-4' inputName='organisation' variant='box' placeholder='organisation (optional)' value={organisation} onChange={e => setorganisation((e.target as any).value)} />
            <div className='mt-3 text-xl font-semibold font-ssp'>Project Address</div>
            <TextInput className='mt-4' inputName='street name' variant='box' placeholder='Street name' value={streetName} onChange={e => setstreetName((e.target as any).value)} />
            <div className='flex'>
                <div className='w-1/2 mr-2'>
                    <TextInput className='mt-4' inputName='unit' variant='box' placeholder='Unit # (optional)' value={unit} onChange={e => setunit((e.target as any).value)} />
                </div>
                <div className='w-1/2 ml-2'>
                    <TextInput className='mt-4' inputName='province' variant='box' placeholder='Province' value={province} onChange={e => setprovince((e.target as any).value)} />
                </div>
            </div>
            <div className='flex'>
                <div className='w-1/2 mr-2'>
                    <TextInput className='mt-4' inputName='city' variant='box' placeholder='City' value={city} onChange={e => setcity((e.target as any).value)} />
                </div>
                <div className='w-1/2 ml-2'>
                    <TextInput className='mt-4' inputName='postal code' variant='box' placeholder='Postal Code' value={postalCode} onChange={e => setpostalCode((e.target as any).value)} />
                </div>
            </div>
            <div className='flex mt-4'><Button disabled={!(projectTitle && budget && clientName && clientEmail && streetName && postalCode && province && city && currency)} className='justify-center w-full'>Create project</Button></div>
        </div>);
}

export default StartNewProject;