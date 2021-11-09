import React, { useState } from 'react'
import "./Project.scss";
import { ReactComponent as RightArrowWhiteIcon } from "../../styles/images/right-arrow-white.svg";
import { Link } from 'react-router-dom'
import { ReactComponent as ShareAlt } from "../../styles/images/share-alt.svg";
import { ReactComponent as SaveIcon } from "../../styles/images/save.svg";
import { ReactComponent as InformationIcon } from "../../styles/images/information.svg";
import { ReactComponent as HistoryIcon } from "../../styles/images/history.svg";
import { ReactComponent as ExitIcon } from "../../styles/images/home-page-exit.svg";

import Quote from './Quote/Quote';
import Design from './Design/Design';

const Project = () => {
    const [QuoteOrDesign, setQuoteOrDesign] = useState<'Quote' | 'Design'>('Quote')
    return (
        <div className="project bg-sand">
            <div className="flex bg-white">
                <div className='flex w-1/6 px-4 py-3 text-white bg-black yx-4 font-moret'>
                    <Link className='my-auto cursor-pointer' to={'/'}><RightArrowWhiteIcon /></Link>
                    <div className='m-auto text-lg'>PROJECT NAME</div>
                    <div className='my-auto cursor-pointer'>···</div>
                </div>
                <div className='flex w-2/6'>
                    <div role='button' onClick={() => setQuoteOrDesign('Quote')} className={`my-auto ml-auto mr-8 cursor-pointer ${QuoteOrDesign === 'Quote' ? 'border-solid border-black border-b-2':'border-b-2 border-solid border-transparent'}`}>Quote</div>
                    <div role='button' onClick={() => setQuoteOrDesign('Design')} className={`my-auto cursor-pointer ${QuoteOrDesign === 'Design' ? 'border-b-2 border-solid border-black' : 'border-b-2 border-solid border-transparent'}`}>Design</div>
                </div>
                <div className='flex w-3/6'>
                      <div className='my-auto ml-auto mr-6 text-sm font-ssp'>v0</div>
                      <div className='my-auto mr-8 text-sm font-ssp'>Never saved</div>
                      <ShareAlt className='my-auto mr-8 cursor-pointer' />
                      <InformationIcon className='my-auto mr-8 cursor-pointer' />
                      <HistoryIcon className='my-auto mr-8 cursor-pointer' />
                      <SaveIcon className='my-auto mr-8 cursor-pointer' />
                      <ExitIcon className='my-auto mr-10 cursor-pointer' />
                </div>
            </div>
            {QuoteOrDesign === 'Quote' && <Quote />}
            {QuoteOrDesign === 'Design' && <Design />}
        </div>
    );
};

export default Project;
