import React, { useState, useEffect } from "react";
import "./InvitePeople.scss";
import { ClickOutsideAnElementHandler } from "@fulhaus/react.ui.click-outside-an-element-handler";
import { ReactComponent as ExitIcon } from '../../../styles/images/exit.svg'
import { ReactComponent as AngleDown } from '../../../styles/images/angle-down.svg'
import { TextInput } from "@fulhaus/react.ui.text-input";
import { Button } from "@fulhaus/react.ui.button";
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import apiRequest from '../../../Service/apiRequest'
type InvitePeopleProps = {
  close: () => void;
  projectName?: string;
  projectID?:string;
};
const InvitePeople = ({ close, projectName, projectID}: InvitePeopleProps) => {
  const [peopleKeyWord, setpeopleKeyWord] = useState('');
  const [invitePeopleSearchList, setinvitePeopleSearchList] = useState([]);
  const dropdownListAction = (v :string) => {
      console.log(v);
  }
  useEffect(
    ()=>{},[]
  )
  const invite = async () => {
    const invitePeopleNameArray = peopleKeyWord.split(', ');
    const res = await apiRequest({
      url: "/auth/invite-users",
      method: 'POST',
      body: {
        emails: invitePeopleNameArray
      }
    })
    if (res?.success) {
      setinvitePeopleSearchList(res);
      alert(`invite ${peopleKeyWord} successfully`)
      setpeopleKeyWord('');
    }else{
      console.log('search invite people failed @ InvitePeople.tsx line 31');
      alert(res.message);
    }
  } 
  return (
    <ClickOutsideAnElementHandler onClickedOutside={() => close()}>
      <div className="border border-black border-solid invite-people bg-cream">
        <div className='flex justify-between'>
          <div className='text-2xl font-moret'>INVITE PEOPLE {projectName && ` to ${projectName}`}</div>
          <ExitIcon onClick={() => close()} className='my-auto cursor-pointer' role='button' />
        </div>
        <div className='flex mt-4'>
          <TextInput className='w-11/12 text-xs' placeholder='Email, commas seperated' inputName='invite people search bar' variant="box" type='search' value={peopleKeyWord} onChange={e => setpeopleKeyWord((e as any).target.value)} />
          <div className='w-1/12'><Button onClick={()=>invite()} className='justify-center w-full'>Invite</Button></div>
        </div>
        <div className='flex justify-between pr-8 my-2'>
          <div className='text-sm font-ssp'>Ryan Smith(you)</div>
          <div className='text-sm font-ssp'>ryan.smith@gmail.com</div>
          <div className='px-3 text-sm font-ssp'>Owner</div>
        </div>
        <div className='flex justify-between pr-8 my-2'>
          <div className='flex text-sm font-ssp'><div className='my-auto'>Ryan Terry(you)</div></div>
          <div className='flex text-sm font-ssp'><div className='my-auto'>ryan.terry@gmail.com</div></div>
          <div className='flex text-sm font-ssp'><div className='my-auto'>User</div>
            <DropdownListInput
              listWrapperClassName='last-child-red'
              onSelect={v => dropdownListAction(v)}
              wrapperClassName='border-none cursor-pointer w-40 last:text-error' labelClassName='hidden' listWrapperFloatDirection='left' disabled={true}
              options={['Owner', 'User', 'Remove User']} />
          </div>
        </div>
      </div>
    </ClickOutsideAnElementHandler>
  );
  
};

export default InvitePeople;
