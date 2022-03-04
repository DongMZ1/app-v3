import './ProjectInformation.scss'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Tappstate } from '../../../redux/reducers'
import { ReactComponent as ExitIcon } from '../../../styles/images/exit.svg'
import { ReactComponent as CopyIcon } from '../../../styles/images/copy-black.svg'
import { ReactComponent as EditPenIcon } from '../../../styles/images/edit-pen.svg'
import { ReactComponent as FilesIcon } from '../../../styles/images/files-black.svg'
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input';

type ProjectInformationType = {
    close: () => void
}

const ProjectInformation = ({ close }: ProjectInformationType) => {
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail);
    const selectedProject = useSelector((state: Tappstate) => state.selectedProject);
    const [CopiedQuoteID, setCopiedQuoteID] = useState(false);
    const [discountCode, setdiscountCode] = useState('');

    const [installationUnit, setinstallationUnit] = useState('%');
    const [installationValue, setinstallationValue] = useState<number | undefined>(quoteDetail?.installation);

    const [shippingUnit, setshippingUnit] = useState('CAD')
    const [shippingValue, setshippingValue] = useState<number | undefined>();

    const [editNotes, seteditNotes] = useState(false);
    const [notesContent, setnotesContent] = useState('Dexter "The Blade" Jackson (born November 25, 1969) is a retired American IFBB professional bodybuilder and the 2008 Mr. Olympia bodybuilding champion.');
    return (
        <div className='fixed top-0 right-0 z-10 flex w-full h-full bg-black bg-opacity-50'>
            <div className='w-1/2 h-full' onClick={() => close()}></div>
            <div className='z-10 w-1/2 h-full overflow-auto border-l border-black border-solid opacity-100 bg-cream project-information'>
                <div className='flex'>
                    <div className='text-2xl uppercase font-moret'>project information</div>
                    <ExitIcon onClick={() => close()} className='my-auto ml-auto cursor-pointer' />
                </div>
                <div className='flex mt-2'>
                    <div className='my-auto mr-8 text-sm font-ssp'>Quote ID: {quoteDetail?._id ? quoteDetail._id : ''}</div>
                    {CopiedQuoteID ? <div className='my-auto mr-4 text-sm font-semibold font-ssp'>Copied!</div> : <CopyIcon onClick={() => {
                        navigator.clipboard.writeText(quoteDetail?._id);
                        setCopiedQuoteID(true);
                        setTimeout(() => setCopiedQuoteID(false), 500);
                    }} className='my-auto mr-4 cursor-pointer' />}
                    <a className='text-sm border-b border-solid cursor-pointer font-ssp text-link border-link'>View on Pipedrive</a>
                </div>
                <div className='flex mt-8'>
                    <div className='my-auto mr-6 text-sm font-semibold font-ssp'>Currency:</div>
                    <div className='w-20'>
                        <DropdownListInput
                            initialValue={quoteDetail?.currency}
                            onSelect={(value) => { }}
                            options={['CAD', 'USD', 'EURO']} />
                    </div>
                </div>
                <div className='flex mt-8'>
                    <div className='my-auto mr-6 text-sm font-semibold font-ssp'>Design Style</div>
                    <EditPenIcon className='my-auto ml-auto cursor-pointer' />
                </div>
                <div className='mt-8'>
                    <div className='my-auto mr-6 text-sm font-semibold font-ssp'>Price modifiers</div>
                    <div className='flex mt-4'>
                        <div className='w-32 mr-8 font-ssp'>
                            <div className='mb-1 text-xs'>Discount Code</div>
                            <input type='text' className='w-20 h-8 pl-1 text-xs border border-black border-solid' />
                        </div>
                        <div className='w-40 mr-8 font-ssp'>
                            <div className='mb-1 text-xs'>Installation Fee</div>
                            <div className='flex drop-down-bg-cream'>
                                <DropdownListInput
                                    initialValue={installationUnit}
                                    onSelect={value => setinstallationUnit(value)}
                                    options={['%', 'CAD', 'USD', 'EURO']} />
                                <input type='number' value={installationValue} onChange={(e) => setinstallationValue(e.target.valueAsNumber)} className='w-20 pl-1 text-xs border border-black border-solid' />
                            </div>
                        </div>
                        <div className='w-40 font-ssp'>
                            <div className='mb-1 text-xs'>Shipping Fee</div>
                            <div className='flex drop-down-bg-cream'>
                                <DropdownListInput
                                    initialValue={shippingUnit}
                                    onSelect={(value) => setshippingUnit(value)}
                                    options={['$', '%']} />
                                <div className='flex bg-white border-t border-b border-black border-solid'><div className='my-auto'>$</div></div>
                                <input type='number' value={shippingValue} onChange={(e) => setshippingValue(e.target.valueAsNumber)} className='w-20 text-xs border-t border-b border-r border-black border-solid' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex mt-8'>
                    <div className='my-auto text-sm font-semibold font-ssp'>Files</div>
                    <FilesIcon onClick={() => document.getElementById('project-info-fileupload')?.click()} className='my-auto ml-auto cursor-pointer' />
                    <input id='project-info-fileupload' type='file' className='hidden' />
                </div>
                <div className='flex mt-6 mb-4'>
                    <div className='my-auto text-sm font-semibold font-ssp'>Notes</div>
                    <EditPenIcon onClick={() => { if (editNotes) { seteditNotes(false) } else { seteditNotes(true) } }} className='my-auto ml-auto cursor-pointer' />
                </div>
                {
                    editNotes ? <textarea className='w-full p-1 text-sm border border-black border-solid font-ssp' onBlur={() => {
                        seteditNotes(false);
                    }} onChange={e => setnotesContent(e.target.value)} value={notesContent} /> : <div className='text-sm font-ssp'>{notesContent}</div>
                }
                <div className='mt-6 text-sm font-semibold font-ssp'>
                    Contact Information
                </div>
                <div className='flex mt-4 font-ssp'>
                    <div className='w-1/2'>
                        <div className='text-xs'>Client Name</div>
                        <div className='mt-1 text-sm'>Albert Schuey</div>
                    </div>
                    <div className='w-1/2'>
                        <div className='text-xs'>Email</div>
                        <div className='mt-1 text-sm'>aschuey@theassociates.com</div>
                    </div>
                </div>
                <div className='flex mt-4 font-ssp'>
                    <div className='w-1/2'>
                        <div className='text-xs'>Project Address</div>
                        <div className='mt-1 text-sm'>
                            {selectedProject?.projectAddress?.apt ? 'Apt.' + selectedProject?.projectAddress?.apt + ', ' : ''}{selectedProject?.projectAddress?.street ? selectedProject?.projectAddress?.street + ', ' : ''}
                            {selectedProject?.projectAddress?.city ? selectedProject?.projectAddress?.city + ', ' : ''}
                            {selectedProject?.projectAddress?.state ? selectedProject?.projectAddress?.state + ', ' : ''}
                            {selectedProject?.projectAddress?.country ? selectedProject?.projectAddress?.country + ', ' : ''}
                            {selectedProject?.projectAddress ? <br /> : ''}
                            {selectedProject?.projectAddress?.postalCode ? selectedProject?.projectAddress?.postalCode + ', ' : ''}
                        </div>
                    </div>
                    <div className='w-1/2'>
                        <div className='text-xs'>Phone</div>
                        <div className='mt-1 text-sm'>123-456-7890</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectInformation;