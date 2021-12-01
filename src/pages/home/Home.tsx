import "./Home.scss";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { ReactComponent as FulhausIcon } from "../../styles/images/fulhaus.svg";
import { ReactComponent as ShareAlt } from "../../styles/images/share-alt.svg";
import { ReactComponent as HomePageEmptyCover } from "../../styles/images/home-page-empty-cover.svg";
import { Button } from "@fulhaus/react.ui.button";
import { TextInput } from "@fulhaus/react.ui.text-input";
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import { Popup } from '@fulhaus/react.ui.popup'
import InfiniteScroll from 'react-infinite-scroll-component';
import InvitePeople from "./homeComponents/InvitePeople";
import RemoveThisSeason from "./homeComponents/RemoveThisSeason";
import StartNewProjectQuotoDesign from "./homeComponents/StartNewProjectQuoteDesign"
const Home = () => {
  const [StartNewProjectQuoteDesignType, setStartNewProjectQuoteDesignType] = useState<'design' | 'quote' | 'project'>('project')
  const [showStartNewProjectQuotoDesign, setshowStartNewProjectQuotoDesign] = useState(false);
  const [searchkeyWord, setsearchKeyWord] = useState("");
  const [showInvitePeople, setshowInvitePeople] = useState(false);
  const [showConfirmRemoveThisSeason, setshowConfirmRemoveThisSeason] = useState(false);
  const [projectListNeedToRender, setprojectListNeedToRender] = useState<any[]>(Array.from({ length: 20 }));
  const [SelectedProjectToInvite, setSelectedProjectToInvite] = useState<{ name: string, id: string }>();

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
    <div className="app-v3-home-page" id={'app-v3-home-page'}>
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
          onChange={(e) => setsearchKeyWord((e.target as any).value)}
        />
        <div className='flex mt-4'>
          <Button variant='secondary' className="mr-4 font-ssp fulhaus-button-bg-cream">PipeDrive Projects</Button>
          <Button active>Add Projects</Button>
        </div>
        {false ?
          <>
            <div className='flex mt-8 mb-4'><HomePageEmptyCover className='mx-auto' /></div>
            <div className='flex'><div className='mx-auto text-3xl moret'>No App Projects exist yet</div></div>
          </>
          :
          <>
            <div className='flex mt-4 mb-2 text-sm font-ssp'>
              <div className='w-3/12 pl-4'>Project name</div>
              <div className='w-3/12'>Type</div>
              <div className='width-10-percent'>Last updated</div>
              <div className='width-10-percent'>Last edited by</div>
              <div className='width-10-percent'>Created on</div>
              <div className='width-10-percent'>Created by</div>
              <div className='width-10-percent'>Total Units</div>
            </div>
            <InfiniteScroll
              loader={<h4>Loading...</h4>}
              className='w-full h-auto'
              dataLength={projectListNeedToRender.length}
              next={() => {
                setTimeout(() => {
                  setprojectListNeedToRender(state => state.concat(Array.from({ length: 20 })));
                }, 1000)
              }}
              hasMore={true}
              scrollableTarget='app-v3-home-page'
            >
              {projectListNeedToRender.map((each, key) => <EachProjectQuoteDesignRow setSelectedProjectToInvite={setSelectedProjectToInvite} name={`Tester ${key}`} projectID='123456' showInvitePeople={() => setshowInvitePeople(true)} type='design-only' />)}
            </InfiniteScroll>
          </>
        }
      </div>
    </div>
  </>
  );
};

export default Home;


type EachProjecyQuoDesignRowProps = {
  name: string,
  projectID: string,
  type?: 'design-only' | 'project' | 'quote-only',
  lastUpdated?: string,
  lastEditby?: string,
  createdOn?: string,
  createdBy?: string,
  totalUnits?: number,
  showInvitePeople?: () => void,
  setSelectedProjectToInvite?: (object: { name: string, id: string }) => void
}
const EachProjectQuoteDesignRow = ({ name, projectID, type, lastUpdated, lastEditby, createdOn, createdBy, totalUnits, showInvitePeople, setSelectedProjectToInvite }: EachProjecyQuoDesignRowProps) => {
  const history = useHistory();
  const [showRenameProject, setshowRenameProject] = useState(false);
  const handleDropDown = (v: string) => {
    switch (v) {
      case 'Duplicate Project':
      case 'Duplicate Quote':
      case 'Duplicate Design':
        break;
      case 'Rename Project':
      case 'Rename Quote':
      case 'Rename Design':
        setshowRenameProject(true)
        break;
      case 'Share Design':
      case 'Share Quote':
      case 'Share Project':
        if (setSelectedProjectToInvite) {
          setSelectedProjectToInvite({
            name,
            id: projectID
          })
        }
        if (showInvitePeople) { showInvitePeople(); }
        break;
      case 'Delete Project':
      case 'Delete Quote':
      case 'Delete Design':
        break;
    }
  }
  let optionList = [''];
  let linkURL = '';
  if (type === 'design-only') {
    optionList = ['Duplicate Design', 'Rename Design', 'Share Design', 'Delete Design'];
    linkURL = `/design-only?id=${projectID}`
  }
  if (type === 'quote-only') {
    optionList = ['Duplicate Quote', 'Rename Quote', 'Share Quote', 'Delete Quote'];
    linkURL = `/quote-only?id=${projectID}`
  }
  if (type === 'project') {
    optionList = ['Duplicate Project', 'Rename Project', 'Share Project', 'Delete Project'];
    linkURL = `/project/quote`
  }
  return <div className='flex text-sm border border-black border-solid font-ssp'>
    <div onClick={() => history.push(linkURL)} className='flex w-3/12 pl-4 cursor-pointer'>
      {showRenameProject ?
        <input onKeyDown={e => {
          if (e.code === 'Enter') {
            setshowRenameProject(false);
          }
        }} className='px-2 my-auto' type='text' onClick={e => e.stopPropagation()} onBlur={() => setshowRenameProject(false)} />
        :
        <div className='my-auto'>{name}</div>
      }
    </div>
    <div onClick={() => history.push(linkURL)} className='w-3/12 my-auto cursor-pointer'>Design Only</div>
    <Link to={linkURL} className='flex width-10-percent'><div className='my-auto'>11/11/2021</div></Link>
    <Link to={linkURL} className='flex width-10-percent'><div className='my-auto'>Mingzhou Dong</div></Link>
    <Link to={linkURL} className='flex width-10-percent'><div className='my-auto'>11/11/1911</div></Link>
    <Link to={linkURL} className='flex width-10-percent'><div className='my-auto'>Mingzhou Dong</div></Link>
    <div className='flex justify-between width-10-percent'>
      <div className='my-auto'>0</div>
      <DropdownListInput
        listWrapperClassName='last-child-red'
        onSelect={v => handleDropDown(v)}
        wrapperClassName='border-none cursor-pointer w-40 last:text-error mr-4' labelClassName='hidden'
        suffixIcon={<div>···</div>}
        listWrapperFloatDirection='left' disabled={true}
        options={optionList} />
    </div>
  </div>
}