import { useState, useEffect } from 'react'
import './CatalogueFilter.scss'

import { useSelector, useDispatch } from 'react-redux';
import { Tappstate } from '../../../../redux/reducers'; 
import produce from 'immer'
import CatalogueFilterRoomAndStyle from './CatalogueFilterRoomAndStyle';
import CatelogueFilterItemType from './CatelogueFilterItemType';
import CatalogueFilterColor from './CatalogueFilterColor';
import CatalogueFilterSource from './CatalogueFilterSource';
import CatalogueFilterVendor from './CatalogueFilterVendor';
import CatalogueFilterPrice from './CatalogueFilterPrice';
import CatalogueFilterDistance from './CatalogueFilterDistance'

import { TextInput } from '@fulhaus/react.ui.text-input';
import {GoX} from 'react-icons/go'

const CatalogueFilter = () => {
    
    const filterCatalogue = useSelector((state: Tappstate) => state.filterCatalogue);
    const dispatch = useDispatch();
    const [searchKeyword, setsearchKeyword] = useState("");
    //Rooms and Styles states => CatalogueFilterRoomAndStyle.tsx
    const [showRoomsAndStyle, setshowRoomsAndStyle] = useState(false);
    const [roomsAndStyleRoom, setroomsAndStyleRoom] = useState<string[]>([]);
    const [roomsAndStyleCollections, setroomsAndStyleCollections] = useState<string[]>([]);
    //Source & Availability state => CatalogueFilterSource.tsx
    const [showSourceAvailability, setshowSourceAvailability] = useState(false);
    const [source, setsource] = useState<string[]>([]);
    const [availability, setavailability] = useState<string[]>([]);

    //Price state
    const [showPrice, setshowPrice] = useState(false);
    const [minPrice, setminPrice] = useState(0);
    const [maxPrice, setmaxPrice] = useState(3200);

    //Colour => CatalogueFilterColor.tsx
    const [showColorMenu, setshowColorMenu] = useState(false);
    const [showOtherColorMenu, setshowOtherColorMenu] = useState(false);

    //itemType => CatelogueFilterItemType.tsx
    const [showItemType, setshowItemType] = useState(false);
    const [itemTypes, setitemTypes] = useState<string[]>([]);
    const [lengthUnit, setlengthUnit] = useState('inch');
    const [weightUnit, setweightUnit] = useState('Pounds');
    const [W, setW] = useState('');
    const [L, setL] = useState('');
    const [H, setH] = useState('');
    const [minWeight, setminWeight] = useState(0);
    const [maxWeight, setmaxWeight] = useState(150);

    //vendor => CatalogueFilterVendor.tsx
    const [showVendor, setshowVendor] = useState(false);
    const [vendorRegions, setvendorRegions] = useState<'All regions' | 'North America' | 'Europe'>('All regions');
    
    const resetFilter = () => {
        dispatch({
            type:'filterCatalogue',
            payload: {}
        })
        setsearchKeyword("");
        setroomsAndStyleRoom([]);
        setroomsAndStyleCollections([]);
        setminPrice(0);
        setmaxPrice(3200);
        setitemTypes([]);
        setlengthUnit('inch');
        setweightUnit('Pounds');
        setW('');
        setL('');
        setH('');
        setminWeight(0);
        setmaxWeight(150);
        setvendorRegions('All regions')
    }

    const fetchItems = () => {
        
    }
    return (
        <div className="w-full px-4 catalogue-filter">
            <div className="flex mt-4">
                <CatalogueFilterRoomAndStyle
                    setroomsAndStyleRoom={setroomsAndStyleRoom}
                    roomsAndStyleRoom={roomsAndStyleRoom}
                    setroomsAndStyleCollections={setroomsAndStyleCollections}
                    showRoomsAndStyle={showRoomsAndStyle}
                    setshowRoomsAndStyle={setshowRoomsAndStyle}
                    roomsAndStyleCollections={roomsAndStyleCollections}
                />
                <CatelogueFilterItemType
                    showItemType={showItemType}
                    setshowItemType={setshowItemType}
                    itemTypes={itemTypes}
                    setitemTypes={setitemTypes}
                    lengthUnit={lengthUnit}
                    setlengthUnit={setlengthUnit}
                    weightUnit={weightUnit}
                    setweightUnit={setweightUnit}
                    W={W}
                    setW={setW}
                    L={L}
                    setL={setL}
                    H={H}
                    setH={setH}
                    minWeight={minWeight}
                    setminWeight={setminWeight}
                    maxWeight={maxWeight}
                    setmaxWeight={setmaxWeight}
                />
                <CatalogueFilterVendor
                showVendor={showVendor}
                setshowVendor={setshowVendor}
                vendorRegions={vendorRegions}
                setvendorRegions={setvendorRegions}
                />
                <CatalogueFilterColor
                    showColorMenu={showColorMenu}
                    setshowColorMenu={setshowColorMenu}
                    showOtherColorMenu={showOtherColorMenu}
                    setshowOtherColorMenu={setshowOtherColorMenu}
                />
            </div>
            <div className="flex mt-4 dropdown-component-overwrite">
                {/*
                <CatalogueFilterSource
                    showSourceAvailability={showSourceAvailability}
                    setshowSourceAvailability={setshowSourceAvailability}
                    source={source}
                    setsource={setsource}
                    availability={availability}
                    setavailability={setavailability}
                />*/}
                <CatalogueFilterPrice
                    showPrice={showPrice}
                    setshowPrice={setshowPrice}
                    minPrice={minPrice}
                    setminPrice={setminPrice}
                    maxPrice={maxPrice}
                    setmaxPrice={setmaxPrice}
                />
                {
                   (filterCatalogue?.roomsAndStyleRoom?.length > 0 || filterCatalogue?.roomsAndStyleCollections?.length > 0) && 
                   <div className='flex mr-4 text-sm font-semibold border-b border-black border-solid cursor-pointer font-ssp'
                   onClick={() => {
                     const newFilterCatalogue = produce(filterCatalogue, (draft: any) => {
                        draft.roomsAndStyleRoom = undefined;
                        draft.roomsAndStyleCollections = undefined;
                     })
                    dispatch({
                        type:'filterCatalogue',
                        payload: newFilterCatalogue
                    })
                    setroomsAndStyleRoom([]);
                    setroomsAndStyleCollections([]);
                   }}
                   ><GoX className='mt-auto mb-1 mr-1' /><div className='mt-auto'>Rooms & Styles</div></div>
                }
                <div onClick={()=>resetFilter()} className='flex ml-auto mr-4 text-sm font-bold cursor-pointer'><div className='mt-auto'>Reset</div></div>
                {/*<CatalogueFilterDistance />*/}
            </div>
            <TextInput placeholder='Search for a product name, description, category or material' className='mt-4' variant='box' inputName="filter keyword" type='search' value={searchKeyword} onChange={(e) => setsearchKeyword((e.target as any).value)} />
        </div>
    )
}

export default CatalogueFilter;