
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler'
import { Button } from '@fulhaus/react.ui.button'
import { Checkbox } from '@fulhaus/react.ui.checkbox'
import { BsChevronDown } from 'react-icons/bs'
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
//rooms and styles options
const roomOptions = ['Dining Room', 'Bedroom', 'Living Room', 'Family Room', 'Bathroom', 'Office']
const collectionsOptions = ['Biophilia', 'Nuevo 80s', 'Dark Scandi', 'Grandmillennial', 'Classic Blue', 'LIght & Luxe']
const groupOptions = ['Spring/Summer 2021', 'Fall/Winter 2021']

type CatalogueFilterRoomAndStyleProps = {
    showRoomsAndStyle: boolean,
    setshowRoomsAndStyle: React.Dispatch<React.SetStateAction<boolean>>,
    roomsAndStyleRoom: string[],
    setroomsAndStyleRoom: React.Dispatch<React.SetStateAction<string[]>>,
    roomsAndStyleCollections: string[],
    setroomsAndStyleCollections: React.Dispatch<React.SetStateAction<string[]>>
}
const CatalogueFilterRoomAndStyle = ({ showRoomsAndStyle, setshowRoomsAndStyle, roomsAndStyleRoom, setroomsAndStyleRoom, roomsAndStyleCollections, setroomsAndStyleCollections }: CatalogueFilterRoomAndStyleProps) => {
    return <div className='relative w-32 mr-4' >
        <div onClick={() => setshowRoomsAndStyle(true)} className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Rooms & Styles</div><BsChevronDown className='my-auto' /></div>
        {showRoomsAndStyle &&
            <ClickOutsideAnElementHandler onClickedOutside={() => setshowRoomsAndStyle(false)}>
                <div className='absolute z-50 px-4 py-6 border border-black border-solid w-400px bg-cream'>
                    <div className='flex'>
                        <div className='w-1/2'>
                            <div className='text-sm font-semibold font-ssp'>Room</div>
                            {roomOptions.every(each => roomsAndStyleRoom.includes(each)) ?
                                <div onClick={() => setroomsAndStyleRoom([])} className='mt-2 text-sm cursor-pointer select-none font-ssp text-link w-max'>
                                    Unselect All
                                </div>
                                :
                                <div onClick={() => setroomsAndStyleRoom(roomOptions)} className='mt-2 text-sm cursor-pointer select-none font-ssp text-link w-max'>
                                    Select All
                                </div>}
                            {roomOptions.map(eachRoom => <Checkbox label={eachRoom} className='mt-4 text-sm text-secondary' checked={roomsAndStyleRoom.includes(eachRoom)} onChange={(checked) => {
                                if (checked) {
                                    setroomsAndStyleRoom(state => state.concat(eachRoom))
                                } else {
                                    setroomsAndStyleRoom(state => state.filter(each => each !== eachRoom))
                                }
                            }} />)}
                        </div>
                        <div className='w-1/2 dropdown-list-input-overwrite'>
                            <div className='text-sm font-semibold font-ssp'>Group</div>
                            <DropdownListInput wrapperClassName='mt-2' initialValue={groupOptions[0]} options={groupOptions} />
                            <div className='mt-4 text-sm font-semibold font-ssp'>Collection</div>
                            {collectionsOptions.every(each => roomsAndStyleCollections.includes(each)) ?
                                <div onClick={() => setroomsAndStyleCollections([])} className='mt-2 text-sm cursor-pointer select-none font-ssp text-link w-max'>
                                    Unselect All
                                </div>
                                :
                                <div onClick={() => setroomsAndStyleCollections(collectionsOptions)} className='mt-2 text-sm cursor-pointer select-none font-ssp text-link w-max'>
                                    Select All
                                </div>}
                            {collectionsOptions.map(eachRoom => <Checkbox label={eachRoom} className='mt-4 text-sm text-secondary' checked={roomsAndStyleCollections.includes(eachRoom)} onChange={(checked) => {
                                if (checked) {
                                    setroomsAndStyleCollections(state => state.concat(eachRoom))
                                } else {
                                    setroomsAndStyleCollections(state => state.filter(each => each !== eachRoom))
                                }
                            }} />)}
                        </div>
                    </div>
                    <div className='flex mt-8 mb-2'>
                        <Button onClick={() => setshowRoomsAndStyle(false)} variant='secondary' className='w-24 ml-auto mr-4'>Cancel</Button>
                        <Button className='w-24'>Apply</Button>
                    </div>
                </div>
            </ClickOutsideAnElementHandler>
        }
    </div>
}

export default CatalogueFilterRoomAndStyle;