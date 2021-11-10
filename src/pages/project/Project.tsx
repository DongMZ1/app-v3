import React, { useState } from 'react'
import "./Project.scss";
import { Link } from 'react-router-dom'
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler';
import { ReactComponent as RightArrowWhiteIcon } from "../../styles/images/right-arrow-white.svg";
import { ReactComponent as ShareAlt } from "../../styles/images/share-alt.svg";
import { ReactComponent as HistoryVersionIcon } from "../../styles/images/save.svg";
import { ReactComponent as InformationIcon } from "../../styles/images/information.svg";
import { ReactComponent as ProjectInforIcon } from "../../styles/images/history.svg";
import { ReactComponent as ExitIcon } from "../../styles/images/home-page-exit.svg";

import Quote from './Quote/Quote';
import Design from './Design/Design';
import ProjectInformation from './components/ProjectInformation';
import VersionHistory from './components/VersionHistory';

const Project = () => {
    const [QuoteOrDesign, setQuoteOrDesign] = useState<'Quote' | 'Design'>('Quote')
    const [showHistory, setshowHistory] = useState(false);
    const [showProjectInfor, setshowProjectInfor] = useState(false);
    const [showProjectStyleList, setshowProjectStyleList] = useState(false);
    return (
        <div className="project bg-sand">
            <div className="flex bg-white h-14">
                <div className='flex px-4 py-3 text-white bg-black font-moret'>
                    <Link className='my-auto mr-4 cursor-pointer' to={'/'}><RightArrowWhiteIcon /></Link>
                    <div className='my-auto mr-4 text-lg'>PROJECT NAME</div>
                    <div className='relative my-auto cursor-pointer'>···
                    {showProjectStyleList && <div className='absolute'>
                        hello!
                    </div>}
                    </div>
                </div>
                <div className='flex ml-auto'>
                    <div role='button' onClick={() => setQuoteOrDesign('Quote')} className={`my-auto ml-auto mr-8 cursor-pointer ${QuoteOrDesign === 'Quote' ? 'border-solid border-black border-b-2' : 'border-b-2 border-solid border-transparent'}`}>Quote</div>
                    <div role='button' onClick={() => setQuoteOrDesign('Design')} className={`my-auto cursor-pointer ${QuoteOrDesign === 'Design' ? 'border-b-2 border-solid border-black' : 'border-b-2 border-solid border-transparent'}`}>Design</div>
                </div>
                <div className='flex w-3/6'>
                    <div className='my-auto ml-auto mr-6 text-sm font-ssp'>v0</div>
                    <div className='my-auto mr-8 text-sm font-ssp'>Never saved</div>
                    <ShareAlt className='my-auto mr-8 cursor-pointer' />
                    <InformationIcon className='my-auto mr-8 cursor-pointer' />
                    <ProjectInforIcon onClick={() => setshowProjectInfor(true)} className='my-auto mr-8 cursor-pointer' />
                    <HistoryVersionIcon onClick={() => setshowHistory(true)} className='my-auto mr-8 cursor-pointer' />
                    <ExitIcon className='my-auto mr-10 cursor-pointer' />
                </div>
            </div>
            {showHistory && <ClickOutsideAnElementHandler onClickedOutside={() => setshowHistory(false)}>
                <VersionHistory close={()=>setshowHistory(false)} />
            </ClickOutsideAnElementHandler>}
            {
                showProjectInfor && <ClickOutsideAnElementHandler onClickedOutside={() => setshowProjectInfor(false)}>
                    <ProjectInformation close={() => setshowProjectInfor(false)} />
                </ClickOutsideAnElementHandler>
            }
            {QuoteOrDesign === 'Quote' && <Quote />}
            {QuoteOrDesign === 'Design' && <Design />}
            <div className='flex w-full px-6 text-white font-ssp bg-selectedBlue h-14'>
                <div className='my-auto mr-4 text-lg font-semibold'>1BD</div>
                <div className='my-auto mr-4 text-3xl font-semibold'>·</div>
                <div className='my-auto text-lg font-semibold'>1 Unit</div>
                <div className='my-auto ml-auto mr-6 text-sm'>Unit Total <b>$0.00</b></div>
                <div className='my-auto mr-6 text-sm'>Project Total <b>$0.00</b></div>
                <div className='px-4 py-1 my-auto mr-6 text-sm font-semibold bg-black cursor-pointer'>View Overall Budget</div>
            </div>
        </div>
    );
};

export default Project;
