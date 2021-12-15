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
    ProjectQuoteDesignInfoNeedDuplicate?: {
        projectTitle?: string,
        currency?: string,
        budget?: string,
        clientName?: string,
        clientEmail?: string,
        phone?: string,
        organisation?: string,
        streetName?: string,
        province?: string,
        city?: string,
        postalCode?: string,
        country?: string,
        unit?: string,
    }
}
const StartNewProject = ({ type, close, ProjectQuoteDesignInfoNeedDuplicate }: StartNewProjectProps) => {
    const [projectTitle, setprojectTitle] = useState(ProjectQuoteDesignInfoNeedDuplicate?.projectTitle ? ProjectQuoteDesignInfoNeedDuplicate?.projectTitle : '');
    const [currency, setcurrency] = useState(ProjectQuoteDesignInfoNeedDuplicate?.currency? ProjectQuoteDesignInfoNeedDuplicate.currency :'');
    const [budget, setbudget] = useState(ProjectQuoteDesignInfoNeedDuplicate?.budget? ProjectQuoteDesignInfoNeedDuplicate.budget: '');

    const [clientName, setclientName] = useState(ProjectQuoteDesignInfoNeedDuplicate?.clientName? ProjectQuoteDesignInfoNeedDuplicate.clientName:'');
    const [clientEmail, setclientEmail] = useState(ProjectQuoteDesignInfoNeedDuplicate?.clientName? ProjectQuoteDesignInfoNeedDuplicate?.clientEmail : '');
    const [phone, setphone] = useState(ProjectQuoteDesignInfoNeedDuplicate?.phone? ProjectQuoteDesignInfoNeedDuplicate.phone:'');
    const [organisation, setorganisation] = useState(ProjectQuoteDesignInfoNeedDuplicate?.organisation? ProjectQuoteDesignInfoNeedDuplicate.organisation : '');

    const [streetName, setstreetName] = useState(ProjectQuoteDesignInfoNeedDuplicate?.streetName? ProjectQuoteDesignInfoNeedDuplicate.streetName : '');
    const [unit, setunit] = useState(ProjectQuoteDesignInfoNeedDuplicate?.unit? ProjectQuoteDesignInfoNeedDuplicate.unit : '');
    const [province, setprovince] = useState(ProjectQuoteDesignInfoNeedDuplicate?.province? ProjectQuoteDesignInfoNeedDuplicate.province : '');
    const [city, setcity] = useState(ProjectQuoteDesignInfoNeedDuplicate?.city? ProjectQuoteDesignInfoNeedDuplicate.city : '');
    const [postalCode, setpostalCode] = useState(ProjectQuoteDesignInfoNeedDuplicate?.postalCode? ProjectQuoteDesignInfoNeedDuplicate.postalCode : '');
    const [country, setcountry] = useState(ProjectQuoteDesignInfoNeedDuplicate?.country? ProjectQuoteDesignInfoNeedDuplicate.country : '');

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
                const res = await apiRequest(
                    {
                        url: `/api/fhapp-service/project/${organizationID}`,
                        method: 'POST',
                        body: {
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
                if (res?.success) {
                    //fetch projects as projects is updated
                    dispatch(fetchProject(organizationID ? organizationID : ''));
                    close();
                }
                if (!res?.success) {
                    dispatch(showMessageAction(true, res.message));
                }
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
                        currency? currency:undefined
                    } placeholder='Currency' onSelect={v => setcurrency(v)} options={['USD', 'CAD', 'EUR']} /></div>
                    <div className='w-1/2 ml-2'><TextInput variant='box' type='number' placeholder='Budget' inputName='budget' value={budget} onChange={e => setbudget((e.target as any).value)} /></div>
                </div>
                <div className='mt-3 text-xl font-semibold font-ssp'>Client Information</div>
                <TextInput className='mt-4' inputName='client name' variant='box' placeholder='Client Name' value={clientName} onChange={e => setclientName((e.target as any).value)} />
                <TextInput className='mt-4' inputName='client email' variant='box' placeholder='Client Email' value={clientEmail? clientEmail: ''} onChange={e => setclientEmail((e.target as any).value)} />
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
            <div className='flex mt-4'><Button disabled={!FormIsValid} onClick={() => submitForm()} className='justify-center w-full'>Create project</Button></div>
        </div>);
}

export default StartNewProject;