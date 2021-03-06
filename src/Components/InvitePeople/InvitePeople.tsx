import React, { useState, useEffect } from "react";
import "./InvitePeople.scss";
import produce from 'immer'
import { ImCross } from 'react-icons/im'
import { useSelector, useDispatch } from 'react-redux';
import { showMessageAction } from "../../redux/Actions";
import { Tappstate } from "../../redux/reducers";
import { TextInput } from "@fulhaus/react.ui.text-input";
import { Button } from "@fulhaus/react.ui.button";
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import apiRequest from '../../Service/apiRequest'
import { useGetProjectRole } from "../../Hooks/useGetProjectRole";
import { Loader } from '@fulhaus/react.ui.loader'
type InvitePeopleProps = {
  close: () => void;
  projectName?: string;
  projectID?: string;
  userRole?: string | undefined
};
const InvitePeople = ({ close, projectName, projectID, userRole }: InvitePeopleProps) => {
  const [peopleKeyWord, setpeopleKeyWord] = useState('');
  const [peopleList, setpeopleList] = useState<any[]>([]);
  const [loading, setloading] = useState(true);
  const dispatch = useDispatch();
  const OrganizationID = useSelector((state: Tappstate) => state.currentOrgID);
  //external user organization ID
  useEffect(
    () => {
      if (!projectName) {
        fetchOrganizationUser();
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

  const fetchOrganizationUser = async () => {
    const res = await apiRequest({
      url: `/api/fhapp-service/organization/${OrganizationID}/users`,
      method: 'GET'
    })
    if (res?.success) {
      setpeopleList(res?.organizationUsers);
    }
    if (!res?.success) {
      console.log('fetch organization users failed')
    }
    setloading(false);
  }

  const fetchSpecificProjectUser = async () => {
    const res = await apiRequest({
      url: `/api/fhapp-service/organization/${OrganizationID}/project/${projectID}/users`,
      method: 'GET'
    });
    if (res?.success) {
      setpeopleList(res?.projectUsers);
    }
    if (!res?.success) {
      console.log('fetch organization users for specific project failed')
    }
    setloading(false);
  }

  const validateEmail = (email: any) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  return (
    <div>
      <div className="flex pb-4"><ImCross color="white" onClick={() => close()} className='ml-auto mr-4 cursor-pointer' role='button' /></div>
      <div className="border border-black border-solid invite-people bg-cream">
        <div className='flex justify-between'>
          <div className='text-2xl font-moret'>INVITE PEOPLE {projectName && ` to ${projectName}`}</div>
        </div>
        <div className='flex mt-4'>
          <TextInput className='w-11/12 text-xs' placeholder='Email, commas seperated' inputName='invite people search bar' variant="box" type='search' value={peopleKeyWord} onChange={e => setpeopleKeyWord((e as any).target.value)} />
          <div className='w-1/12'><Button disabled={peopleKeyWord.split(', ')?.some(eachEmail => !validateEmail(eachEmail))} onClick={() => {
            if (!peopleKeyWord.split(', ')?.some(eachEmail => !validateEmail(eachEmail))) {
              invite()
            }
          }} className='justify-center w-full'>Invite</Button></div>
        </div>
        {
          loading && <div className="flex justify-center mt-12">
            <Loader />
          </div>
        }
        {!loading && peopleList?.map(each =>
          <InvitePeopleUserRow
            userRole={userRole}
            peopleList={peopleList}
            setpeopleList={setpeopleList}
            projectID={projectID} name={`${each.lastName} ${each.firstName}`} email={each.email} eachUserID={each._id} role={each?.role} />
        )}
        {
          !loading && (peopleList?.length === 0 || !peopleList) &&
          <div className="justify-center mt-4 text-sm font-ssp">
            <div>
              Invite people to this project by enter their email above
            </div>
          </div>
        }
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
  peopleList: any;
  userRole: string | undefined;
  setpeopleList: React.Dispatch<React.SetStateAction<any>>;
}
const InvitePeopleUserRow = ({ name, email, role, projectID, eachUserID, peopleList, setpeopleList, userRole }: InvitePeopleUserRowProps) => {
  const state = useSelector((state: Tappstate) => state);
  const roleOnHomePage = useGetProjectRole(projectID ? projectID : '')
  let myRole;
  if (userRole) {
    myRole = userRole;
  } else {
    myRole = roleOnHomePage;
  }
  const dispatch = useDispatch();
  let optionList = [''];
  if (myRole === 'admin') {
    optionList = ['editor', 'viewer', 'remove user']
  }
  if (myRole === 'owner') {
    optionList = ['admin', 'editor', 'viewer', 'remove user']
  }
  const dropdownListAction = async (v: string) => {
    switch (v) {
      case 'admin':
      case 'editor':
      case 'viewer':
        // organization level
        if (!projectID) {
          const res = await apiRequest(
            {
              url: `/api/fhapp-service/organization/modify-organization-role/${state.currentOrgID}/${eachUserID}`,
              method: 'PATCH',
              body: {
                newRole: v
              }
            }
          )
          if (res?.success) {
            const newPeopleList = produce(peopleList, (draftState: any) => {
              if (draftState.filter((each: any) => each._id === eachUserID).length > 0) {
                draftState.filter((each: any) => each._id === eachUserID)[0].role = v;
              }
            })
            setpeopleList(newPeopleList);
          } else {
            dispatch(showMessageAction(true, res?.message));
          }
        }
        //project level
        if (projectID) {
          const res = await apiRequest(
            {
              url: `/api/fhapp-service/organization/modify-project-role/${state.currentOrgID}/${projectID}/${eachUserID}`,
              method: 'PATCH',
              body: {
                newRole: v
              }
            }
          )
          if (res?.success) {
            const newPeopleList = produce(peopleList, (draftState: any) => {
              if (draftState.filter((each: any) => each._id === eachUserID).length > 0) {
                draftState.filter((each: any) => each._id === eachUserID)[0].role = v;
              }
            })
            setpeopleList(newPeopleList);
          } else {
            dispatch(showMessageAction(true, res?.message));
          }
        }
        break;
      case 'remove user':
        //remove user from organization level
        if (!projectID) {
          const res = await apiRequest(
            {
              url: `/api/fhapp-service/organization/remove-from-organization/${state.currentOrgID}/${eachUserID}`,
              method: 'DELETE'
            }
          )
          if (res?.success) {
            const newPeopleList = produce(peopleList, (draftState: any) =>
              draftState.filter((each: any) => each._id !== eachUserID)
            )
            setpeopleList(newPeopleList);
          } else {
            dispatch(showMessageAction(true, res?.message));
          }
        }
        if (projectID) {
          const res = await apiRequest(
            {
              url: `/api/fhapp-service/organization/remove-from-project/${state.currentOrgID}/${projectID}/${eachUserID}`,
              method: 'DELETE'
            }
          )
          if (res?.success) {
            const newPeopleList = produce(peopleList, (draftState: any) =>
              draftState.filter((each: any) => each._id !== eachUserID)
            )
            setpeopleList(newPeopleList);
          } else {
            dispatch(showMessageAction(true, res?.message));
          }
        }
        break;
    }
  }

  return <div className='flex h-8 pr-8 my-2'>
    <div className='flex w-1/2 text-sm font-ssp'><div className='my-auto'>{name} {`${state?.userInfo?.lastName} ${state?.userInfo?.firstName}` === name ? <span className='font-semibold'>(You)</span> : ''}</div></div>
    <div className='flex w-4/12 text-sm font-ssp'><div className='my-auto'>{email}</div></div>
    <div className='flex w-2/12 text-sm font-ssp'><div className='my-auto ml-auto'>{`${state?.userInfo?.lastName} ${state?.userInfo?.firstName}` === name ? myRole : role}</div>
      <div className='hide-dropdown-list'>
        {`${state?.userInfo?.lastName} ${state?.userInfo?.firstName}` === name ?
          ''
          : (role !== 'owner' &&
            <DropdownListInput
              listWrapperClassName='last-child-red'
              onSelect={v => dropdownListAction(v)}
              wrapperClassName='border-none cursor-pointer w-40 last:text-error' labelClassName='hidden' listWrapperFloatDirection='left' disabled={true}
              options={optionList} />)
        }
      </div>
    </div>
  </div>
}
