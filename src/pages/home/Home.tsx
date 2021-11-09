import "./HomePage.scss";
import React, { useState } from "react";
import { ReactComponent as FulhausIcon } from "../../styles/images/fulhaus.svg";
import { ReactComponent as ShareAlt } from "../../styles/images/share-alt.svg";
import { ReactComponent as HomePageExit } from "../../styles/images/home-page-exit.svg";
import { ReactComponent as HomePageEmptyCover } from "../../styles/images/home-page-empty-cover.svg";
import { Button } from "@fulhaus/react.ui.button";
import { TextInput } from "@fulhaus/react.ui.text-input";

import InvitePeople from "./components/InvitePeople";
import RemoveThisSeason from "./components/RemoveThisSeason";

const Home = () => {
  const [searchkeyWord, setsearchKeyWord] = useState("");
  const [showInvitePeople, setshowInvitePeople] = useState(false);
  const [showConfirmRemoveThisSeason, setshowConfirmRemoveThisSeason] = useState(false);
  return (<>
    {showConfirmRemoveThisSeason && <RemoveThisSeason close={()=>setshowConfirmRemoveThisSeason(false)} />}
    {showInvitePeople && <InvitePeople close={()=>setshowInvitePeople(false)} /> }
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
      <div className="mt-10 mx-8percent bg-second">
        <div className="flex">
          <div className="text-4xl moret">SELECT A PROJECT</div>
          <Button variant='secondary' className="my-2 ml-auto mr-4 font-ssp">Create a group</Button>
          <Button className="my-2 font-ssp">Start a new project</Button>
        </div>
      </div>
      <div className="mx-8percent">
        <TextInput
          variant="box"
          className='mt-6 text-xs'
          inputName="email"
          type="search"
          value={searchkeyWord}
          placeholder='Search for a project name'
          onChange={(e) => setsearchKeyWord((e.target as any).value)}
        />
      </div>
      <div className='flex mt-8 mb-4'><HomePageEmptyCover className='mx-auto' /></div>
      <div className='flex'><div className='mx-auto text-3xl moret'>Get started with a new project</div></div>
    </div>
    </>
  );
};

export default Home;
