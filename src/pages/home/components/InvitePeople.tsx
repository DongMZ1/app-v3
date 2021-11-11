import React, { useState } from "react";
import "./InvitePeople.scss";
import { ClickOutsideAnElementHandler } from "@fulhaus/react.ui.click-outside-an-element-handler";
import {ReactComponent as ExitIcon} from '../../../styles/images/exit.svg' 
import { TextInput } from "@fulhaus/react.ui.text-input";
import { Button } from "@fulhaus/react.ui.button";
type InvitePeopleProps = {
  close: () => void;
};
const InvitePeople = ({ close }: InvitePeopleProps) => {
    const [peopleKeyWord, setpeopleKeyWord] = useState('');
  return (
    <ClickOutsideAnElementHandler onClickedOutside={() => close()}>
      <div className="invite-people bg-cream border-solid border border-black">
          <div className='flex justify-between'>
              <div className='text-2xl font-moret'>INVITE PEOPLE</div>
              <ExitIcon onClick={()=>close()} className='my-auto cursor-pointer' role='button' />
          </div>
          <div className='flex mt-4'>
              <TextInput className='w-11/12 text-xs' placeholder='Email, commas seperated' inputName='invite people search bar' variant="box" type='search' value={peopleKeyWord} onChange={e => setpeopleKeyWord((e as any).target.value)} />
              <Button className='w-1/12'>Invite</Button>
          </div>
      </div>
    </ClickOutsideAnElementHandler>
  );
};

export default InvitePeople;
