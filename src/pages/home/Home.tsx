import "./HomePage.scss";
import React, { useState } from "react";
import { ReactComponent as FulhausIcon } from "../../styles/images/fulhaus.svg";
import { ReactComponent as ShareAlt } from "../../styles/images/share-alt.svg";
import {ResponsiveLink} from '@fulhaus/react.ui.responsive-link'
const Home = (): JSX.Element => {
  return (
    <div className="app-v3-home-page bg-sand">
      <div className="px-8 py-4 flex bg-white">
        <FulhausIcon />
        <ShareAlt className='ml-auto my-auto mr-4' />
        <ResponsiveLink className='my-auto font-ssp' url=''>Invite people</ResponsiveLink>
      </div>
    </div>
  );
};

export default Home;
