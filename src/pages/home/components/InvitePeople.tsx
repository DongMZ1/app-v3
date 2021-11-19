import React, { useState } from "react";
import "./InvitePeople.scss";
import { ClickOutsideAnElementHandler } from "@fulhaus/react.ui.click-outside-an-element-handler";
import {ReactComponent as ExitIcon} from '../../../styles/images/exit.svg' 
import {ReactComponent as AngleDown} from '../../../styles/images/angle-down.svg' 
import { TextInput } from "@fulhaus/react.ui.text-input";
import { Button } from "@fulhaus/react.ui.button";
import {DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
type InvitePeopleProps = {
  close: () => void;
};
const InvitePeople = ({ close }: InvitePeopleProps) => {
    const [peopleKeyWord, setpeopleKeyWord] = useState('');
  return (
    <ClickOutsideAnElementHandler onClickedOutside={() => close()}>
      <div className="border border-black border-solid invite-people bg-cream">
          <div className='flex justify-between'>
              <div className='text-2xl font-moret'>INVITE PEOPLE</div>
              <ExitIcon onClick={()=>close()} className='my-auto cursor-pointer' role='button' />
          </div>
          <div className='flex mt-4'>
              <TextInput className='w-11/12 text-xs' placeholder='Email, commas seperated' inputName='invite people search bar' variant="box" type='search' value={peopleKeyWord} onChange={e => setpeopleKeyWord((e as any).target.value)} />
              <div className='w-1/12'><Button className='w-full'>Invite</Button></div>
          </div>
          <div className='flex justify-between pr-10 my-2'>
              <div className='text-sm font-ssp'>Ryan Smith(you)</div>
              <div className='text-sm font-ssp'>ryan.smith@gmail.com</div>
              <div className='text-sm font-ssp'>Owner</div>
          </div>
          <div className='flex justify-between pr-10 my-2'>
              <div className='text-sm font-ssp'>Ryan Terry(you)</div>
              <div className='text-sm font-ssp'>ryan.terry@gmail.com</div>
              <div className='flex text-sm font-ssp'><div className='my-auto'>User</div>
              <DropdownListInput prefixIcon={<AngleDown className='my-auto ml-1 cursor-pointer' />} options={['Owner', 'User', 'Remove User']} />
              </div>
          </div>
      </div>
    </ClickOutsideAnElementHandler>
  );
};

export default InvitePeople;
