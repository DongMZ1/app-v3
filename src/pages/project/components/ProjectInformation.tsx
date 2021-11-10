import './ProjectInformation.scss'
import React, { useState } from 'react'
import { ReactComponent as ExitIcon } from '../../../styles/images/exit.svg'
import { ReactComponent as CopyIcon } from '../../../styles/images/copy-black.svg'
import { ReactComponent as EditPenIcon } from '../../../styles/images/edit-pen.svg'
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
type ProjectInformationType = {
    close: () => void
}


const ProjectInformation = ({ close }: ProjectInformationType) => {
    const [CopiedQuoteID, setCopiedQuoteID] = useState(false);
    const [currency, setcurrency] = useState('CAD');
    const [discountCode, setdiscountCode] = useState('');

    const [installationUnit, setinstallationUnit] = useState('%');
    const [installationValue, setinstallationValue] = useState<number | undefined>();

    const [shippingUnit, setshippingUnit] = useState('CAD')
    const [shippingValue, setshippingValue] = useState<number | undefined>();

    return <div className='fixed right-0 z-10 w-5/12 h-full border-l border-black border-solid project-information'>
        <div className='flex'>
            <div className='text-2xl uppercase font-moret'>project information</div>
            <ExitIcon onClick={() => close()} className='my-auto ml-auto cursor-pointer' />
        </div>
        <div className='flex mt-2'>
            <div className='my-auto mr-8 text-sm font-ssp'>Quote ID: 45999DF</div>
            {CopiedQuoteID ? <div className='my-auto mr-4 text-sm font-semibold font-ssp'>Copied!</div> : <CopyIcon onClick={() => {
                navigator.clipboard.writeText('this is a copy icon');
                setCopiedQuoteID(true);
                setTimeout(() => setCopiedQuoteID(false), 500);
            }} className='my-auto mr-4 cursor-pointer' />}
            <a className='text-sm border-b border-solid cursor-pointer font-ssp text-link border-link'>View on Pipedrive</a>
        </div>
        <div className='flex mt-8'>
            <div className='my-auto mr-6 text-sm font-semibold font-ssp'>Currency:</div>
            <div className='w-20'>
                <DropdownListInput
                    initialValue={currency}
                    onSelect={(value) => setcurrency(value)}
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
                    <DropdownListInput
                        onSelect={(value) => setdiscountCode(value)}
                        options={['Premo1', 'Premo2', 'Premo3']} />
                </div>
                <div className='w-40 mr-8 font-ssp'>
                    <div className='mb-1 text-xs'>Installation Fee</div>
                    <div className='flex drop-down-bg-sand'>
                        <DropdownListInput
                            initialValue={installationUnit}
                            onSelect={value => setinstallationUnit(value)}
                            options={['%', 'CAD', 'USD', 'EURO']} />
                        <input type='number' value={installationValue} onChange={(e)=>setinstallationValue(e.target.valueAsNumber)} className='w-20 pl-1 text-xs border border-black border-solid' />
                    </div>
                </div>
                <div className='w-40 font-ssp'>
                    <div className='mb-1 text-xs'>Shipping Fee</div>
                    <div className='flex drop-down-bg-sand'>
                        <DropdownListInput
                            initialValue={shippingUnit}
                            onSelect={(value)=>setshippingUnit(value)}
                            options={['CAD', 'USD', 'EURO']} />
                        <div className='flex bg-white border-t border-b border-black border-solid'><div className='my-auto'>$</div></div>
                        <input className='w-20 text-xs border-t border-b border-r border-black border-solid' />
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default ProjectInformation;