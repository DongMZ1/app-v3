import {useState} from 'react'
import {FurnitureInRoomRowCard} from '@fulhaus/react.ui.furniture-in-room-row-card'
import {FurnitureInRoomHeader} from '@fulhaus/react.ui.furniture-in-room-header'
import {useSelector} from 'react-redux'
import { Tappstate } from '../../../redux/reducers'
type RoomType = {
    eachRoom: any
}
const Room = ({eachRoom}:RoomType) => {
    const [roomCount, setroomCount] = useState(1);
    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole;
    return <div className='w-full mt-6'>
        <FurnitureInRoomHeader addItemList={[]} roomNumber={roomCount} onRoomNumberChange={(v) => setroomCount(v)} roomName={eachRoom?.roomType} editable={userRole !== 'viewer'}></FurnitureInRoomHeader>
    </div>
}
export default Room;

const Category = () => {
    return <div>
    </div>
}