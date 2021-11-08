import React, {useState} from 'react'
import './InvitePeople.scss'
import {ClickOutsideAnElementHandler} from '@fulhaus/react.ui.click-outside-an-element-handler'
type InvitePeopleProps = {
    close: () => void
}
const InvitePeople = ({close}:InvitePeopleProps) =>{
    return <ClickOutsideAnElementHandler onClickedOutside={()=>close()}><div className='invite-people border-solid border border-black'>

    </div></ClickOutsideAnElementHandler>
}

export default InvitePeople;