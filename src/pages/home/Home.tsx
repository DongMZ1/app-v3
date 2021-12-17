import "./Home.scss";
import React, { useState, useEffect} from "react";
import debounce from 'lodash.debounce'
import { useSelector, useDispatch } from 'react-redux'
import apiRequest from '../../Service/apiRequest';
import { Tappstate } from "../../redux/reducers";
import { ReactComponent as FulhausIcon } from "../../styles/images/fulhaus.svg";
import { ReactComponent as ShareAlt } from "../../styles/images/share-alt.svg";
import { ReactComponent as HomePageEmptyCover } from "../../styles/images/home-page-empty-cover.svg";
import { ReactComponent as LogoutIcon } from '../../styles/images/logout.svg';
import { TiArrowSortedUp } from 'react-icons/ti'
import { TextInput } from "@fulhaus/react.ui.text-input";
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import { Popup } from '@fulhaus/react.ui.popup'

import EachProjectQuoteDesignRow from './homeComponents/EachProjectQuoteDesignRow'
import InvitePeople from "./homeComponents/InvitePeople";
import RemoveThisSeason from "./homeComponents/RemoveThisSeason";
import StartNewProjectQuotoDesign from "./homeComponents/StartNewProjectQuoteDesign"
import OrganizationSelection from './homeComponents/OrganizationSelection'
import { fetchMoreProject } from "../../redux/Actions";
const Home = () => {
  const [StartNewProjectQuoteDesignType, setStartNewProjectQuoteDesignType] = useState<'design' | 'quote' | 'project'>('project')
  const [showStartNewProjectQuotoDesign, setshowStartNewProjectQuotoDesign] = useState(false);
  const [searchkeyWord, setsearchKeyWord] = useState("");
  const [showInvitePeople, setshowInvitePeople] = useState(false);
  const [showConfirmRemoveThisSeason, setshowConfirmRemoveThisSeason] = useState(false);
  const [SelectedProjectToInvite, setSelectedProjectToInvite] = useState<{ name: string, id: string, userRole: string | undefined }>();
  //index show number of rows on homepage displayed
  const [pageCount, setpageCount] = useState(1);
  const [showLoadingMessage, setshowLoadingMessage] = useState(false);
  const [orderByLastUpdated, setorderByLastUpdated] = useState(false);

  //copy the all of that specific project/quote/design info
  const [ProjectQuoteDesignInfoNeedDuplicate, setProjectQuoteDesignInfoNeedDuplicate] = useState<any>()
  const state = useSelector((state: Tappstate) => state);
  const dispatch = useDispatch();

  const currentOrgName = state?.allOrganizations?.filter(each => each._id === state.currentOrgID) ? state?.allOrganizations?.filter(each => each._id === state.currentOrgID)[0]?.name : '';

  const logout = async () => {
    const res = await apiRequest(
      {
        url: '/account/user/logout',
        method: 'POST'
      }
    )
    if (!res?.success) {
      console.log(res?.message)
    }
  }

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
  const infiniteScrollCallback = () => {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight && state.projects) {
        //dispatch fetch more
        if (state.currentOrgID) {
          dispatch(fetchMoreProject(state.currentOrgID, state.projects, {
            page: pageCount
          }))
        }
        console.log(pageCount);
        setpageCount(state => state + 1);
    }
  };
  const infiniteScroll = debounce(infiniteScrollCallback, 1000);

  const sortByDate = (arr: any[] | null, sorted: boolean) => {
    if (sorted) {
      return arr?.slice().sort(function (a: any, b: any) {
        return (new Date((b.updatedAt as string)) as any) - (new Date(a.updatedAt) as any);
      });
    }
    return arr;
  }

  const clearHomePageScrollState = () => {
    //reset the page count index
    setpageCount(1);
    //set search keyword to none
    setsearchKeyWord('');
  }
  return (<>
    {<Popup
      onClose={() => {
        setshowStartNewProjectQuotoDesign(false);
        setProjectQuoteDesignInfoNeedDuplicate(undefined);
      }}
      boxShadow={false}
      verticalAlignment='start'
      allowCloseOnClickOutside={false}
      show={showStartNewProjectQuotoDesign}>
      <StartNewProjectQuotoDesign
        type={StartNewProjectQuoteDesignType}
        duplicateProjInfo={ProjectQuoteDesignInfoNeedDuplicate}
        close={() => {
          setshowStartNewProjectQuotoDesign(false)
          setProjectQuoteDesignInfoNeedDuplicate(undefined);
        }}
      />
    </Popup>}
    {showConfirmRemoveThisSeason &&
      <RemoveThisSeason
        close={() => setshowConfirmRemoveThisSeason(false)}
      />}
    <Popup show={showInvitePeople} allowCloseOnClickOutside={false} boxShadow={false} onClose={() => {
      setSelectedProjectToInvite(undefined);
      setshowInvitePeople(false);
    }}>
      <InvitePeople
        projectName={SelectedProjectToInvite?.name}
        projectID={SelectedProjectToInvite?.id}
        close={() => {
          setSelectedProjectToInvite(undefined);
          setshowInvitePeople(false);
        }} /></Popup>
    <div className="app-v3-home-page" id={'app-v3-home-page'} onScroll={() => infiniteScroll()}>
      <div className="flex px-8 py-4 bg-white border-b border-black border-solid">
        <FulhausIcon />
        <OrganizationSelection clearHomePageScrollState={clearHomePageScrollState} />
        {state.currentOrgRole !== ('viewer' || 'editor') && state.currentOrgRole && <>
          <ShareAlt onClick={() => setshowInvitePeople(true)} className="my-auto mr-4 cursor-pointer" />
          <div
            onClick={() => setshowInvitePeople(true)}
            className="my-auto text-sm font-semibold border-b border-black border-solid cursor-pointer font-ssp"
          >
            Invite people
          </div>
        </>}
        <LogoutIcon onClick={() => logout()} className='my-auto ml-6 cursor-pointer' />
      </div>
      <div className='pb-12 mx-8percent'>
        <div className="mt-8 bg-second">
          <div className="flex">
            <div className="text-4xl moret">SELECT A PROJECT</div>
            {/*<Button variant='secondary' className="my-2 ml-auto mr-4 font-ssp">Create a group</Button>*/}
            {state.currentOrgRole !== ('viewer' || 'editor') && state.currentOrgRole &&
              <div className='my-auto ml-auto hide-dropdown-list'>
                <DropdownListInput
                  onSelect={v => chooseProjectQuoteDesignStart(v)}
                  listWrapperClassName="width-8-rem"
                  wrapperClassName='border-none cursor-pointer' labelClassName='hidden'
                  suffixIcon={<div className='flex px-2 py-2 text-sm font-semibold text-white bg-black font-ssp'><div className='my-auto'>Start a new project</div></div>}
                  listWrapperFloatDirection='left' disabled={true}
                  options={currentOrgName === 'Fulhaus' ? ['Project', 'Quote Only', 'Design Only'] : ['Project']} />
              </div>
            }
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
        {(state?.projects && state?.projects.length > 0) ?
          <>
            <div className='flex mt-4 mb-2 text-sm font-ssp'>
              <div className='pl-4 width-30-percent'>Project name</div>
              <div className='width-10-percent'>Type</div>
              <div className='flex width-13-percent'>Last updated <TiArrowSortedUp onClick={() => setorderByLastUpdated(true)} className='cursor-pointer' /></div>
              <div className='width-13-percent'>Last edited by</div>
              <div className='width-13-percent'>Created on</div>
              <div className='width-13-percent'>Created by</div>
              <div className='width-8-percent'>Total Units</div>
            </div>
            {sortByDate(state?.projects, orderByLastUpdated)?.map((each: any, key: number) => <EachProjectQuoteDesignRow
              thisProject={each}
              setSelectedProjectToInvite={setSelectedProjectToInvite}
              setStartNewProjectQuoteDesignType={setStartNewProjectQuoteDesignType}
              setshowStartNewProjectQuotoDesign={setshowStartNewProjectQuotoDesign}
              setProjectQuoteDesignInfoNeedDuplicate={setProjectQuoteDesignInfoNeedDuplicate}
              showInvitePeople={() => setshowInvitePeople(true)} />)}
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
