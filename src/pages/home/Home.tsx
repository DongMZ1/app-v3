import "./HomePage.scss";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as FulhausIcon } from "../../styles/images/fulhaus.svg";
import { ReactComponent as ShareAlt } from "../../styles/images/share-alt.svg";
import { ReactComponent as HomePageExit } from "../../styles/images/home-page-exit.svg";
import { ReactComponent as HomePageEmptyCover } from "../../styles/images/home-page-empty-cover.svg";
import { Button } from "@fulhaus/react.ui.button";
import { TextInput } from "@fulhaus/react.ui.text-input";

import InvitePeople from "./homeComponents/InvitePeople";
import RemoveThisSeason from "./homeComponents/RemoveThisSeason";

const Home = () => {
  const [searchkeyWord, setsearchKeyWord] = useState("");
  const [showInvitePeople, setshowInvitePeople] = useState(false);
  const [showConfirmRemoveThisSeason, setshowConfirmRemoveThisSeason] = useState(false);
  return (<>
    {showConfirmRemoveThisSeason && <RemoveThisSeason close={() => setshowConfirmRemoveThisSeason(false)} />}
    {showInvitePeople && <InvitePeople close={() => setshowInvitePeople(false)} />}
    <div className="app-v3-home-page">
      <div className="flex px-8 py-4 bg-white">
        <FulhausIcon />
        <ShareAlt className="my-auto ml-auto mr-4 cursor-pointer" />
        <div
          onClick={() => setshowInvitePeople(true)}
          className="my-auto mr-8 text-sm font-semibold border-b border-black border-solid cursor-pointer font-ssp"
        >
          Invite people
        </div>
        <HomePageExit className="my-auto cursor-pointer" />
      </div>
      <div className='mx-8percent'>
        <div className="mt-8 bg-second">
          <div className="flex">
            <div className="text-4xl moret">SELECT A PROJECT</div>
            {/*<Button variant='secondary' className="my-2 ml-auto mr-4 font-ssp">Create a group</Button>*/}
            <Link className='flex px-2 my-2 ml-auto text-sm font-semibold text-white bg-black font-ssp' to='/start-new-project'><div className='my-auto'>Start a new project</div></Link>
          </div>
        </div>
        <TextInput
          variant="box"
          className='mt-6 text-xs'
          inputName="email"
          type="search"
          value={searchkeyWord}
          placeholder='Search for a project name'
          onChange={(e) => setsearchKeyWord((e.target as any).value)}
        />
        <div className='flex mt-4'>
          <Button variant='secondary' className="mr-4 font-ssp fulhaus-button-bg-cream">PipeDrive Projects</Button>
          <Button active>Add Projects</Button>
        </div>
        {true ?
          <>
            <div className='flex mt-8 mb-4'><HomePageEmptyCover className='mx-auto' /></div>
            <div className='flex'><div className='mx-auto text-3xl moret'>No App Projects exist yet</div></div>
          </>
          : ''
        }
      </div>
    </div>
  </>
  );
};

export default Home;
