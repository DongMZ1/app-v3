import "./Home.scss";
import React, { useState, useEffect, useRef } from "react";
import { APP_ACCOUNTS_URL } from '../../Constant/url.constant'
import debounce from 'lodash.debounce'
import { useSelector, useDispatch } from 'react-redux'
import useIsFirstRender from "../../Hooks/useIsFirstRender";
import useDebounce from "../../Hooks/useDebounce";
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
import { Loader } from "@fulhaus/react.ui.loader";

import EachProjectQuoteDesignRow from './homeComponents/EachProjectQuoteDesignRow'
import InvitePeople from "../../Components/InvitePeople/InvitePeople";
import RemoveThisSeason from "./homeComponents/RemoveThisSeason";
import StartNewProjectQuotoDesign from "./homeComponents/StartNewProjectQuoteDesign"
import OrganizationSelection from './homeComponents/OrganizationSelection'
import { fetchMoreProject, fetchProject } from "../../redux/Actions";
const Home = () => {
  const homePageSearchKeyword = useSelector((state: Tappstate) => state.homePageSearchKeyword);
  const homePageLoader = useSelector((state: Tappstate) => state.homePageLoader);
  const [StartNewProjectQuoteDesignType, setStartNewProjectQuoteDesignType] = useState<'design' | 'quote' | 'project'>('project')
  const [showStartNewProjectQuotoDesign, setshowStartNewProjectQuotoDesign] = useState(false);
  const [searchkeyWord, setsearchKeyWord] = useState(homePageSearchKeyword ? homePageSearchKeyword : '');
  const [showInvitePeople, setshowInvitePeople] = useState(false);
  const [showConfirmRemoveThisSeason, setshowConfirmRemoveThisSeason] = useState(false);
  const [SelectedProjectToInvite, setSelectedProjectToInvite] = useState<{ name: string, id: string, userRole: string | undefined }>();
  //index show number of rows on homepage displayed
  const [pageCount, setpageCount] = useState(1);
  const scrollRef = useRef<any>();
  const [orderByLastUpdated, setorderByLastUpdated] = useState(false);

  //copy the all of that specific project/quote/design info
  const [ProjectQuoteDesignInfoNeedDuplicate, setProjectQuoteDesignInfoNeedDuplicate] = useState<any>()

  const state = useSelector((state: Tappstate) => state);
  const isFirstRendering = useIsFirstRender();
  const dispatch = useDispatch();
  //debouncedSearchkeyword will only update every 1s if seachkeyword changed
  const debouncedSearchKeyWord = useDebounce(searchkeyWord, 1000);

  const currentOrgName = state?.allOrganizations?.filter(each => each._id === state.currentOrgID) ? state?.allOrganizations?.filter(each => each._id === state.currentOrgID)[0]?.name : '';

  useEffect(
    () => {
      if (!isFirstRendering) {
        //firstly if not first rendering, clear currently pageCount
        searchbyKeyword();
      }
    }, [debouncedSearchKeyWord]
  )

  const searchbyKeyword = () => {
    if (state.currentOrgID) {
      dispatch(fetchProject(state.currentOrgID, {
        title: searchkeyWord
      }))
      //add search keyword to redux store, once user go to next page then go back, it will not get lost
      dispatch({
        type: 'homePageSearchKeyword',
        payload: searchkeyWord
      })
      setpageCount(0);
    }
  }

  const infiniteScrollCallback = () => {
    if (((scrollRef.current?.clientHeight + scrollRef.current?.scrollTop + 5) > scrollRef.current?.scrollHeight) && state.projects) {
      //dispatch fetch more
      if (state.currentOrgID) {
        dispatch(fetchMoreProject(state.currentOrgID, state.projects, {
          title: searchkeyWord,
          page: pageCount
        }))
      }
      setpageCount(state => state + 1);
    }
  };
  //add a debounced function function to avoid throttle
  const infiniteScroll = debounce(infiniteScrollCallback, 1000);
  const logout = async () => {
    const res = await apiRequest(
      {
        url: '/auth/logout',
        method: 'POST'
      }
    )
    window.location.assign(`${APP_ACCOUNTS_URL}/login?redirectURL=${window.location.href}`);
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

  const sortByDate = (arr: any[] | null | undefined, sorted: boolean) => {
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
        searchkeyWord={searchkeyWord}
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
    <div ref={scrollRef} className="app-v3-home-page" id={'app-v3-home-page'} onScroll={() => infiniteScroll()}>
      <div className="flex px-8 py-4 bg-white border-b border-black border-solid">
        <FulhausIcon />
        <OrganizationSelection clearHomePageScrollState={clearHomePageScrollState} />
        {/* {(state.currentOrgRole !== 'viewer' && state.currentOrgRole !== 'editor') && state.currentOrgRole && <>
          <ShareAlt onClick={() => setshowInvitePeople(true)} className="my-auto mr-4 cursor-pointer" />
          <div
            onClick={() => setshowInvitePeople(true)}
            className="my-auto text-sm font-semibold border-b border-black border-solid cursor-pointer font-ssp"
          >
            Invite people
          </div>
        </>} */}
        <LogoutIcon onClick={() => logout()} className='my-auto ml-6 cursor-pointer' />
      </div>
      <div className='pb-12 mx-8percent'>
        <div className="mt-8 bg-second">
          <div className="flex">
            <div className="text-4xl moret">SELECT A PROJECT</div>
            {/*<Button variant='secondary' className="my-2 ml-auto mr-4 font-ssp">Create a group</Button>*/}
            {(state.currentOrgRole !== 'viewer' && state.currentOrgRole !== 'editor') && state.currentOrgRole && (state?.userInfo as any)?.type?.[0] !== 'external' &&
              <div className='my-auto ml-auto hide-dropdown-list'>
                <DropdownListInput
                  onSelect={v => chooseProjectQuoteDesignStart(v)}
                  listWrapperClassName="width-8-rem"
                  wrapperClassName='border-none cursor-pointer' labelClassName='hidden'
                  suffixIcon={<div className='flex px-2 py-2 text-sm font-semibold text-white bg-black font-ssp'><div className='my-auto'>Start something new</div></div>}
                  listWrapperFloatDirection='left' disabled={true}
                  options={currentOrgName === 'Fulhaus' ? ['Project', 'Quote Only'] : ['Project']} />
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
        {((state?.projects && state?.projects.length > 0) || homePageLoader) ?
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
            {homePageLoader && <div className="flex items-center justify-center h-60"><Loader /></div>}
          </> :
          <>
            <div className='flex mt-8 mb-4'><HomePageEmptyCover className='mx-auto' /></div>
            <div className='flex'><div className='mx-auto text-3xl moret'>No App Projects exist yet</div></div>
          </>
        }
        {/*showLoadingMessage && <div className='flex mt-2'><div className='mx-auto font-ssp'>Loading ...</div></div>*/}
      </div>
    </div>
  </>

  );
};

export default Home;
