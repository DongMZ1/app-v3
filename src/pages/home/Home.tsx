import "./HomePage.scss";
import React, { useState } from "react";
import { ReactComponent as FulhausIcon } from "../../styles/images/fulhaus.svg";
import { ReactComponent as ShareAlt } from "../../styles/images/share-alt.svg";
import { ReactComponent as HomePageExit } from "../../styles/images/home-page-exit.svg";
import { ReactComponent as HomePageEmptyCover } from "../../styles/images/home-page-empty-cover.svg";
import { ResponsiveLink } from "@fulhaus/react.ui.responsive-link";
import { Button } from "@fulhaus/react.ui.button";
import { TextInput } from "@fulhaus/react.ui.text-input";

import InvitePeople from "./components/InvitePeople";
const Home = (): JSX.Element => {
  const [searchkeyWord, setsearchKeyWord] = useState("");
  const [showInvitePeople, setshowInvitePeople] = useState(false);
  return (<>
    {showInvitePeople && <InvitePeople close={()=>setshowInvitePeople(false)} /> }
    <div className="app-v3-home-page">
      <div className="px-8 py-4 flex bg-white">
        <FulhausIcon />
        <ShareAlt className="ml-auto my-auto mr-4 cursor-pointer" />
        <div
          onClick={() => setshowInvitePeople(true)}
          className="my-auto font-semibold text-sm border-solid border-black border-b mr-8 cursor-pointer"
        >
          Invite people
        </div>
        <HomePageExit className="my-auto cursor-pointer" />
      </div>
      <div className="mt-10 mx-8percent bg-second">
        <div className="flex justify-between">
          <div className="text-4xl moret">SELECT A PROJECT</div>
          <Button className="my-2">Start a new project</Button>
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
      <div className='flex'><div className='text-3xl moret mx-auto'>Get started with a new project</div></div>
    </div>
    </>
  );
};

export default Home;
