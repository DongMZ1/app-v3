import React, { useState, useEffect } from "react";
import "./InvitePeople.scss";
import { ReactComponent as ExitIcon } from '../../../styles/images/exit.svg'
import { ImCross } from 'react-icons/im'
import { useSelector, useDispatch } from 'react-redux';
import { showMessageAction } from "../../../redux/Actions";
import { Tappstate } from "../../../redux/reducers";
import { TextInput } from "@fulhaus/react.ui.text-input";
import { Button } from "@fulhaus/react.ui.button";
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import apiRequest from '../../../Service/apiRequest'
type InvitePeopleProps = {
  close: () => void;
  projectName?: string;
  projectID?: string;
};
const InvitePeople = ({ close, projectName, projectID }: InvitePeopleProps) => {
  const [peopleKeyWord, setpeopleKeyWord] = useState('');
  const [peopleList, setpeopleList] = useState<any[]>([]);
  const userRole = useSelector((state: Tappstate) => state).userRole;
  const userInfo = useSelector((state: Tappstate) => state).userInfo;
  const dispatch = useDispatch();
  const OrganizationID = useSelector((state: Tappstate) => state.currentOrgID);
  //external user organization ID
  useEffect(
    () => {
      if (!projectName) {
        FetchOrganizationUser();
      }
      if (projectName) {
        fetchSpecificProjectUser();
      }
    }, []
  )
  const invite = async () => {
    const invitePeopleNameArray = peopleKeyWord.split(', ');
    //if this person is external user, then invite to this personal organization(organization's role is owner)
    if (!projectID) {
      const res = await apiRequest({
        url: "/api/fhapp-service/organization/invite/users",
        method: 'POST',
        body: {
          emails: invitePeopleNameArray,
          organizationID: OrganizationID
        }
      });
      if (res?.success) {
        dispatch(showMessageAction(true, `invite ${peopleKeyWord} successfully`))
        setpeopleKeyWord('');
      } else {
        dispatch(showMessageAction(true, res?.message))
      }
    }
    if (projectID) {
      const res = await apiRequest({
        url: "/api/fhapp-service/organization/invite/users",
        method: 'POST',
        body: {
          emails: invitePeopleNameArray,
          organizationID: OrganizationID,
          projectID: projectID
        }
      });
      if (res?.success) {
        dispatch(showMessageAction(true, `invite ${peopleKeyWord} to ${projectName} successfully`))
        setpeopleKeyWord('');
      } else {
        dispatch(showMessageAction(true, res?.message))
      }
    }
  }

  const FetchOrganizationUser = async () => {
    const res = await apiRequest({
      url: `/api/fhapp-service/organization/${OrganizationID}/users`,
      method: 'GET'
    })
    if (res?.success) {
      setpeopleList(res?.userProfiles?.data);
    }
    if (!res?.success) {
      console.log('fetch organization users failed')
    }
  }

  const fetchSpecificProjectUser = async () => {
    const res = await apiRequest({
      url: `/api/fhapp-service/organization/${OrganizationID}/project/${projectID}/users`,
      method: 'GET'
    });
    if (res?.success) {
      setpeopleList(res?.userProfiles?.data);
    }
    if (!res?.success) {
      console.log('fetch organization users for specific project failed')
    }
  }
  return (
    <div>
      <div className="flex pb-4"><ImCross color="white" onClick={() => close()} className='ml-auto mr-4 cursor-pointer' role='button' /></div>
      <div className="border border-black border-solid invite-people bg-cream">
        <div className='flex justify-between'>
          <div className='text-2xl font-moret'>INVITE PEOPLE {projectName && ` to ${projectName}`}</div>
        </div>
        <div className='flex mt-4'>
          <TextInput className='w-11/12 text-xs' placeholder='Email, commas seperated' inputName='invite people search bar' variant="box" type='search' value={peopleKeyWord} onChange={e => setpeopleKeyWord((e as any).target.value)} />
          <div className='w-1/12'><Button disabled={peopleKeyWord === ""} onClick={() => invite()} className='justify-center w-full'>Invite</Button></div>
        </div>
        {peopleList?.map(each =>
          <InvitePeopleUserRow projectID={projectID} name={`${each.lastName} ${each.firstName}`} email={each.email} eachUserID={each._id} role='Admin' />
        )}
      </div>
    </div>
  );
};

export default InvitePeople;


type InvitePeopleUserRowProps = {
  name: string;
  email: string;
  role: string;
  eachUserID: string;
  projectID?: string;
}
const InvitePeopleUserRow = ({ name, email, role, projectID, eachUserID }: InvitePeopleUserRowProps) => {
  const state = useSelector((state: Tappstate) => state);
  const dropdownListAction = (v: string) => {
    console.log(v);
  }

  return <div className='flex h-8 pr-8 my-2'>
    <div className='flex w-1/2 text-sm font-ssp'><div className='my-auto'>{name} {`${state?.userInfo?.lastName} ${state?.userInfo?.firstName}` === name ? <span className='font-semibold'>(You)</span> : ''}</div></div>
    <div className='flex w-4/12 text-sm font-ssp'><div className='my-auto'>{email}</div></div>
    <div className='flex w-2/12 text-sm font-ssp'><div className='my-auto ml-auto'>{role}</div>
      <div className='hide-dropdown-list'>
        {`${state?.userInfo?.lastName} ${state?.userInfo?.firstName}` === name ?
          ''
          :
          <DropdownListInput
            listWrapperClassName='last-child-red'
            onSelect={v => dropdownListAction(v)}
            wrapperClassName='border-none cursor-pointer w-40 last:text-error' labelClassName='hidden' listWrapperFloatDirection='left' disabled={true}
            options={['Owner', 'User', 'Remove User']} />
        }
      </div>
    </div>
  </div>
}
