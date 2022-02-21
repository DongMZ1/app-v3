import React, { useState } from 'react'
import './StartNewProjectQuoteDesign.scss'
import { GrFormClose } from 'react-icons/gr'
import { TextInput } from '@fulhaus/react.ui.text-input'
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '@fulhaus/react.ui.button'
import apiRequest from '../../../Service/apiRequest'
import { Tappstate } from '../../../redux/reducers'
import { fetchProject, showMessageAction } from '../../../redux/Actions'

type StartNewProjectProps = {
    type: 'project' | 'quote' | 'design'
    close: () => void
    duplicateProjInfo?: any
}
const StartNewProject = ({ type, close, duplicateProjInfo }: StartNewProjectProps) => {
    const [projectTitle, setprojectTitle] = useState(duplicateProjInfo?.title ? `${duplicateProjInfo.title} (Duplicated)` : '');
    //for create project
    const [currency, setcurrency] = useState(duplicateProjInfo?.currency ? duplicateProjInfo.currency : '');
    const [budget, setbudget] = useState(duplicateProjInfo?.budget ? duplicateProjInfo.budget : '');

    const [clientName, setclientName] = useState(duplicateProjInfo?.clientName ? duplicateProjInfo.clientName : '');
    const [clientEmail, setclientEmail] = useState(duplicateProjInfo?.clientName ? duplicateProjInfo.clientEmail : '');
    const [phone, setphone] = useState(duplicateProjInfo?.phone ? duplicateProjInfo.phone : '');
    const [organisation, setorganisation] = useState(duplicateProjInfo?.organisation ? duplicateProjInfo.organisation : '');

    const [streetName, setstreetName] = useState(duplicateProjInfo?.projectAddress?.street ? duplicateProjInfo.projectAddress?.street : '');
    const [unit, setunit] = useState(duplicateProjInfo?.projectAddress?.apt ? duplicateProjInfo.projectAddress.apt : '');
    const [province, setprovince] = useState(duplicateProjInfo?.projectAddress?.province ? duplicateProjInfo?.projectAddress.province : '');
    const [city, setcity] = useState(duplicateProjInfo?.projectAddress?.city ? duplicateProjInfo.projectAddress?.city : '');
    const [postalCode, setpostalCode] = useState(duplicateProjInfo?.projectAddress?.postalCode ? duplicateProjInfo.projectAddress?.postalCode : '');
    const [country, setcountry] = useState(duplicateProjInfo?.projectAddress?.country ? duplicateProjInfo?.projectAddress?.country : '');

    const organizationID = useSelector((state: Tappstate) => state.currentOrgID);
    const dispatch = useDispatch();

    let FormIsValid = false;
    if (type === 'project') {
        FormIsValid = !!(projectTitle && budget && clientName && clientEmail && streetName && postalCode && province && city && currency && country);
    }
    if (type === 'design') {
        FormIsValid = !!projectTitle;
    }
    if (type === 'quote') {
        FormIsValid = !!projectTitle;
    }

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const submitForm = async () => {
        switch (type) {
            case 'project':
                const projectRes = await apiRequest(
                    {
                        url: `/api/fhapp-service/project/${organizationID}`,
                        method: 'POST',
                        body: {
                            type: 'project',
                            title: projectTitle,
                            currency: currency,
                            budget: parseInt(budget),
                            clientInformation: {
                                name: clientName,
                                email: clientEmail,
                                phoneNumber: phone,
                                organization: organisation
                            },
                            projectAddress: {
                                street: streetName,
                                apt: unit,
                                city: city,
                                state: province,
                                postalCode: postalCode,
                                country: country
                            }
                        }
                    }
                )
                if (projectRes?.success) {
                    //fetch projects as projects is updated
                    dispatch(fetchProject(organizationID ? organizationID : ''));
                    close();
                }
                if (!projectRes?.success) {
                    dispatch(showMessageAction(true, projectRes.message));
                }
                break;
            case 'quote':
                const quoteRes = await apiRequest(
                    {
                        url: `/api/fhapp-service/project/${organizationID}`,
                        method: 'POST',
                        body: {
                            title: projectTitle,
                            organization: organizationID,
                            type: 'quote'
                        }
                    }
                )
                if (quoteRes?.success) {
                    //fetch projects as projects is updated
                    dispatch(fetchProject(organizationID ? organizationID : ''));
                    close();
                }
                if (!quoteRes?.success) {
                    dispatch(showMessageAction(true, quoteRes.message));
                }
                break;
            case 'design':
                const designRes = await apiRequest(
                    {
                        url: `/api/fhapp-service/project/${organizationID}`,
                        method: 'POST',
                        body: {
                            title: projectTitle,
                            type: 'design',
                            organization: organizationID,
                        }
                    }
                )
                if (designRes?.success) {
                    //fetch projects as projects is updated
                    dispatch(fetchProject(organizationID ? organizationID : ''));
                    close();
                }
                if (!designRes?.success) {
                    dispatch(showMessageAction(true, designRes.message));
                }
                break;
        }
    }
    return (
        <div className='relative px-6 py-4 mt-1 bg-white border border-black border-solid start-new-project'>
            <GrFormClose onClick={() => close()} size={22} className='absolute top-0 right-0 mt-4 mr-4 cursor-pointer' />
            <div className='flex'>
                <div className='mx-auto text-4xl font-moret'>
                    {type === 'project' && 'Create A New Project'}
                    {type === 'quote' && 'Create A New Quote'}
                    {type === 'design' && 'Create A New Design'}
                </div>
            </div>
            <TextInput className='mt-2' inputName='project title' variant='box' placeholder={`${capitalizeFirstLetter(type)} Title`} value={projectTitle} onChange={e => setprojectTitle((e.target as any).value)} />
            {type === 'project' && <>
                <div className='flex mt-4'>
                    <div className='w-1/2 mr-2'><DropdownListInput initialValue={
                        currency ? currency : undefined
                    } placeholder='Currency' onSelect={v => setcurrency(v)} options={['USD', 'CAD', 'EUR']} /></div>
                    <div className='w-1/2 ml-2'><TextInput variant='box' type='number' placeholder='Budget' inputName='budget' value={budget} onChange={e => setbudget((e.target as any).value)} /></div>
                </div>
                <div className='mt-3 text-xl font-semibold font-ssp'>Client Information</div>
                <TextInput className='mt-4' inputName='client name' variant='box' placeholder='Client Name' value={clientName} onChange={e => setclientName((e.target as any).value)} />
                <TextInput className='mt-4' inputName='client email' variant='box' placeholder='Client Email' value={clientEmail ? clientEmail : ''} onChange={e => setclientEmail((e.target as any).value)} />
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
                <div className='flex'>
                    <div className='w-1/2 pr-2'>
                        <TextInput className='mt-4' inputName='country' variant='box' placeholder='Country' value={country} onChange={e => setcountry((e.target as any).value)} />
                    </div>
                </div>
            </>}
            <div className='flex mt-4'><Button disabled={!FormIsValid} onClick={() => submitForm()} className='justify-center w-full'><>Create {capitalizeFirstLetter(type)}</></Button></div>
        </div>);
}

export default StartNewProject;