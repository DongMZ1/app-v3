import "./HomePage.scss";
import React, { useState } from "react";
import { ReactComponent as FulhausIcon } from "../../styles/images/fulhaus.svg";
import { ReactComponent as ShareAlt } from "../../styles/images/share-alt.svg";
import {ReactComponent as HomePageExit} from '../../styles/images/home-page-exit.svg'
import {ResponsiveLink} from '@fulhaus/react.ui.responsive-link'
import {Button} from '@fulhaus/react.ui.button'
import {TextInput} from '@fulhaus/react.ui.text-input';
const Home = (): JSX.Element => {
  const [searchkeyWord, setsearchKeyWord] = useState('');
  return (
    <div className="app-v3-home-page">
      <div className="px-8 py-4 flex bg-white">
        <FulhausIcon />
        <ShareAlt className='ml-auto my-auto mr-4 cursor-pointer' />
        <ResponsiveLink className='my-auto font-semibold text-sm border-solid border-black border-b mr-8' url=''>Invite people</ResponsiveLink>
        <HomePageExit className='my-auto cursor-pointer' />
      </div>
      <div className='mt-10 mx-5percent bg-second'>
            <div className='flex justify-between'>
              <div className='text-4xl moret'>SELECT A PROJECT</div>
              <Button className='my-2'>Start a new project</Button>
            </div>
      </div>
    </div>
  );
};

export default Home;
