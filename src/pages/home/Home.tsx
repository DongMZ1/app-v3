import "./Home.scss";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import apiRequest from '../../Service/apiRequest';
import { Tappstate } from "../../redux/reducers";
import { APP_ACCOUNTS_URL } from "../../Constant/url.constant";
import { ReactComponent as FulhausIcon } from "../../styles/images/fulhaus.svg";
import { ReactComponent as ShareAlt } from "../../styles/images/share-alt.svg";
import { ReactComponent as HomePageEmptyCover } from "../../styles/images/home-page-empty-cover.svg";
import { TiArrowSortedUp } from 'react-icons/ti'
import { TextInput } from "@fulhaus/react.ui.text-input";
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import { Popup } from '@fulhaus/react.ui.popup'

import EachProjectQuoteDesignRow from './homeComponents/EachProjectQuoteDesignRow'
import InvitePeople from "./homeComponents/InvitePeople";
import RemoveThisSeason from "./homeComponents/RemoveThisSeason";
import StartNewProjectQuotoDesign from "./homeComponents/StartNewProjectQuoteDesign"
const Home = () => {
  const [StartNewProjectQuoteDesignType, setStartNewProjectQuoteDesignType] = useState<'design' | 'quote' | 'project'>('project')
  const [showStartNewProjectQuotoDesign, setshowStartNewProjectQuotoDesign] = useState(false);
  const [searchkeyWord, setsearchKeyWord] = useState("");
  const [showInvitePeople, setshowInvitePeople] = useState(false);
  const [showConfirmRemoveThisSeason, setshowConfirmRemoveThisSeason] = useState(false);
  const [SelectedProjectToInvite, setSelectedProjectToInvite] = useState<{ name: string, id: string }>();
  //index show number of rows on homepage displayed
  const [showedInfoRowNumber, setshowedInfoRowNumber] = useState(20);
  const [showLoadingMessage, setshowLoadingMessage] = useState(false);
  const state = useSelector((state: Tappstate) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProject = async () => {
      if (!state?.projects) {
        const res = await apiRequest({
          url: '/api/fhapp-service/projects',
          method: 'GET',
        })
        if (res?.success) {
          dispatch(
            {
              type: 'projects',
              payload: res.data
            }
          )
        } else if(res?.message === 'User not authorized') {
          window.location.assign(`${APP_ACCOUNTS_URL}/login`);
        } else {
          console.log('fetch project failed, please check Home.tsx at line 48')
        }
      }
    }
    fetchProject();
  }, [])

  const chooseProjectQuoteDesignStart = (v: string) => {
    switch (v) {
      case 'Project':
        setStartNewProjectQuoteDesignType('project');
        break;
      case 'Quote Only':
        setStartNewProjectQuoteDesignType('quote');
        break;
      case 'Design Only':
        setStartNewProjectQuoteDesignType('design');
        break;
    }
    setshowStartNewProjectQuotoDesign(true);
  }

  const infiniteScroll = () => {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight && state.projects) {
      if (showedInfoRowNumber < state.projects?.length) {
        setshowLoadingMessage(true);
        setTimeout(() => {
          setshowedInfoRowNumber(showedInfoRowNumber + 10);
          setshowLoadingMessage(false);
        }, 1000)
      }
    }
  }

  const sortByDate = (arr: any[] | null, sorted: boolean) => {
    if (sorted) {
      return arr?.sort(function (a: any, b: any) {
        return (new Date((b.updatedAt as string)) as any) - (new Date(a.updatedAt) as any);
      });
    }
    return arr;
  }
  return (<>
    {<Popup
      onClose={() => {
        setshowStartNewProjectQuotoDesign(false);
      }}
      boxShadow={false}
      verticalAlignment='start'
      show={showStartNewProjectQuotoDesign}><StartNewProjectQuotoDesign
        type={StartNewProjectQuoteDesignType}
        close={() => setshowStartNewProjectQuotoDesign(false)}
      />
    </Popup>}
    {showConfirmRemoveThisSeason &&
      <RemoveThisSeason
        close={() => setshowConfirmRemoveThisSeason(false)}
      />}
    {showInvitePeople &&
      <InvitePeople
        projectName={SelectedProjectToInvite?.name}
        projectID={SelectedProjectToInvite?.id}
        close={() => {
          setSelectedProjectToInvite(undefined);
          setshowInvitePeople(false);
        }} />}
    <div className="app-v3-home-page" id={'app-v3-home-page'} onScroll={() => infiniteScroll()}>
      <div className="flex px-8 py-4 bg-white border-b border-black border-solid">
        <FulhausIcon />
        <ShareAlt onClick={() => setshowInvitePeople(true)} className="my-auto ml-auto mr-4 cursor-pointer" />
        <div
          onClick={() => setshowInvitePeople(true)}
          className="my-auto text-sm font-semibold border-b border-black border-solid cursor-pointer font-ssp"
        >
          Invite people
        </div>
      </div>
      <div className='pb-12 mx-8percent'>
        <div className="mt-8 bg-second">
          <div className="flex">
            <div className="text-4xl moret">SELECT A PROJECT</div>
            {/*<Button variant='secondary' className="my-2 ml-auto mr-4 font-ssp">Create a group</Button>*/}
            <div className='my-auto ml-auto'>
              <DropdownListInput
                onSelect={v => chooseProjectQuoteDesignStart(v)}
                wrapperClassName='border-none cursor-pointer' labelClassName='hidden'
                suffixIcon={<div className='flex px-2 py-2 text-sm font-semibold text-white bg-black font-ssp'><div className='my-auto'>Start a new project</div></div>}
                listWrapperFloatDirection='left' disabled={true}
                options={['Project', 'Quote Only', 'Design Only']} />
            </div>
          </div>
        </div>
        <TextInput
          variant="box"
          className='mt-6 text-xs'
          inputName="email"
          type="search"
          value={searchkeyWord}
          placeholder='Search for a project name'
          onChange={(e) => setsearchKeyWord(((e.target as any).value as string).toLowerCase())}
        />
        {/*
        <div className='flex mt-4'>
          <Button variant='secondary' className="mr-4 font-ssp fulhaus-button-bg-cream">PipeDrive Projects</Button>
          <Button active>Add Projects</Button>
        </div>
        */}
        {state?.projects ?
          <>
            <div className='flex mt-4 mb-2 text-sm font-ssp'>
              <div className='w-3/12 pl-4'>Project name</div>
              <div className='w-3/12'>Type</div>
              <div className='flex width-10-percent'>Last updated <TiArrowSortedUp className='cursor-pointer' /></div>
              <div className='width-10-percent'>Last edited by</div>
              <div className='width-10-percent'>Created on</div>
              <div className='width-10-percent'>Created by</div>
              <div className='width-10-percent'>Total Units</div>
            </div>
            {sortByDate(state?.projects, true)?.filter(each => (each?.name as string).toLowerCase().includes(searchkeyWord)).map((each: any, key: number) => <EachProjectQuoteDesignRow
              setSelectedProjectToInvite={setSelectedProjectToInvite}
              name={each?.name}
              type={each?.type}
              lastUpdated={each?.updatedAt}
              createdOn={each?.createdAt}
              createdBy={each?.createdBy}
              lastEditby={each?.lastEditedBy}
              totalUnits={'unknown'}
              projectID={each?.id}
              showInvitePeople={() => setshowInvitePeople(true)} />).slice(0, showedInfoRowNumber)}
          </> :
          <>
            <div className='flex mt-8 mb-4'><HomePageEmptyCover className='mx-auto' /></div>
            <div className='flex'><div className='mx-auto text-3xl moret'>No App Projects exist yet</div></div>
          </>
        }
        {showLoadingMessage && <div className='flex mt-2'><div className='mx-auto font-ssp'>Loading ...</div></div>}
      </div>
    </div>
  </>
  );
};

export default Home;
