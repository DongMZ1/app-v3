
import { useEffect, useState } from 'react'
import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler'
import { CSSTransition } from 'react-transition-group'
import produce from 'immer'
import { Button } from '@fulhaus/react.ui.button'
import { Checkbox } from '@fulhaus/react.ui.checkbox'
import { useSelector, useDispatch } from 'react-redux'
import { Tappstate } from '../../../../redux/reducers'
import { DropdownListInput } from '@fulhaus/react.ui.dropdown-list-input'
import apiRequest from '../../../../Service/apiRequest'

type CatalogueFilterRoomAndStyleProp = {
    setshowRoomsAndStyle: React.Dispatch<React.SetStateAction<boolean>>
    tags: any[]
}
const CatalogueFilterRoomAndStyle = ({ setshowRoomsAndStyle, tags }: CatalogueFilterRoomAndStyleProp) => {
    const filterCatalogue = useSelector((state: Tappstate) => state.filterCatalogue);
    const roomOptions = tags.filter((eachtag: any) => eachtag.category === 'Room');
    const collectionsOptions = tags.filter((eachtag: any) => eachtag.category === 'Style');
    const [groupOptions, setgroupOptions] = useState(['Not Available']);
    const [roomsAndStyleRoom, setroomsAndStyleRoom] = useState<any[]>(filterCatalogue?.roomsAndStyleRoom ? filterCatalogue?.roomsAndStyleRoom : []);
    const [roomsAndStyleCollections, setroomsAndStyleCollections] = useState<any[]>(filterCatalogue?.roomsAndStyleCollections ? filterCatalogue.roomsAndStyleCollections : []);
    const dispatch = useDispatch();
    const applyRoomAndStyleFilter = () => {
        const newFilterCatalogue = produce(filterCatalogue, (draft: any) => {
            draft.roomsAndStyleRoom = roomsAndStyleRoom;
            draft.roomsAndStyleCollections = roomsAndStyleCollections;
        })
        dispatch({
            type: 'filterCatalogue',
            payload: newFilterCatalogue
        });
        setshowRoomsAndStyle(false)
    }

    return <ClickOutsideAnElementHandler onClickedOutside={() => setshowRoomsAndStyle(false)}>
        <div className='absolute z-50 px-4 py-6 border border-black border-solid w-500px bg-cream'>
            <div className='flex'>
                <div className='w-1/2 mr-4'>
                    <div className='text-sm font-semibold font-ssp'>Room</div>
                    <div></div>
                    {roomOptions.every(each => roomsAndStyleRoom.includes(each)) ?
                        <div onClick={() => setroomsAndStyleRoom([])} className='mt-2 text-sm cursor-pointer select-none font-ssp text-link w-max'>
                            Unselect All
                        </div>
                        :
                        <div onClick={() => setroomsAndStyleRoom(roomOptions)} className='mt-2 text-sm cursor-pointer select-none font-ssp text-link w-max'>
                            Select All
                        </div>}
                    <div className='overflow-auto max-h-60'>
                        {roomOptions.map(eachRoom => <Checkbox label={eachRoom?.name} className='mt-4 text-sm text-secondary' checked={roomsAndStyleRoom.includes(eachRoom)} onChange={(checked) => {
                            if (checked) {
                                setroomsAndStyleRoom(state => state.concat(eachRoom))
                            } else {
                                setroomsAndStyleRoom(state => state.filter(each => each !== eachRoom))
                            }
                        }} />)}
                    </div>
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
                    <div className='overflow-auto max-h-60'>
                        {collectionsOptions.map(eachRoom => <Checkbox label={eachRoom?.name} className='mt-4 text-sm text-secondary' checked={roomsAndStyleCollections.includes(eachRoom)} onChange={(checked) => {
                            if (checked) {
                                setroomsAndStyleCollections(state => state.concat(eachRoom))
                            } else {
                                setroomsAndStyleCollections(state => state.filter(each => each !== eachRoom))
                            }
                        }} />)}
                    </div>
                </div>
            </div>
            <div className='flex mt-8 mb-2'>
                <Button onClick={() => setshowRoomsAndStyle(false)} variant='secondary' className='w-24 ml-auto mr-4'>Cancel</Button>
                <Button onClick={() => applyRoomAndStyleFilter()} className='w-24'>Apply</Button>
            </div>
        </div>
    </ClickOutsideAnElementHandler>
}

export default CatalogueFilterRoomAndStyle;