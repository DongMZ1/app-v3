import { useState, useEffect } from 'react'
import './CatalogueFilter.scss'
import { BsChevronDown } from 'react-icons/bs'
import { useSelector, useDispatch } from 'react-redux';
import { Tappstate } from '../../../../redux/reducers';
import produce from 'immer'
import CatalogueFilterRoomAndStyle from './CatalogueFilterRoomAndStyle';
import CatelogueFilterItemType from './CatelogueFilterItemType';
import { CatalogueFilterColorPageOne, CatalogueFilterColorPageTwo } from './CatalogueFilterColor';
import { CSSTransition } from 'react-transition-group'
import CatalogueFilterSource from './CatalogueFilterSource';
import CatalogueFilterVendor from './CatalogueFilterVendor';
import CatalogueFilterPrice from './CatalogueFilterPrice';
import CatalogueFilterDistance from './CatalogueFilterDistance'

import { TextInput } from '@fulhaus/react.ui.text-input';
import { GoX } from 'react-icons/go'

const CatalogueFilter = () => {

    const filterCatalogue = useSelector((state: Tappstate) => state.filterCatalogue);
    const dispatch = useDispatch();
    const [searchKeyword, setsearchKeyword] = useState("");
    //Rooms and Styles states => CatalogueFilterRoomAndStyle.tsx
    const [showRoomsAndStyle, setshowRoomsAndStyle] = useState(false);
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

    //vendor => CatalogueFilterVendor.tsx
    const [showVendor, setshowVendor] = useState(false);

    const resetFilter = () => {
        dispatch({
            type: 'filterCatalogue',
            payload: {}
        })
    }

    const fetchItems = () => {

    }
    return (
        <div className="w-full px-4 catalogue-filter">
            <div className="flex mt-4">
                <div className='relative w-32 mr-4' >
                    <div onClick={() => setshowRoomsAndStyle(true)} className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Rooms & Styles</div><BsChevronDown className='my-auto' /></div>
                    <CSSTransition in={showRoomsAndStyle} timeout={300} unmountOnExit classNames='opacity-animation'>
                        <CatalogueFilterRoomAndStyle setshowRoomsAndStyle={setshowRoomsAndStyle} />
                    </CSSTransition>
                </div>
                <div className='w-24 mr-4'>
                    <div onClick={() => setshowItemType(true)} className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'>
                        <div className='my-1'>Item type</div>
                        <BsChevronDown className='my-auto' />
                    </div>
                    <CSSTransition in={showItemType} timeout={300} unmountOnExit classNames='opacity-animation'>
                        <CatelogueFilterItemType
                            setshowItemType={setshowItemType}
                        />
                    </CSSTransition>
                </div>
                <div className='w-24 mr-4'>
                    <div onClick={() => setshowVendor(true)} className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Vendors</div><BsChevronDown className='my-auto' /></div>
                    <CSSTransition in={showVendor} timeout={300} unmountOnExit classNames='opacity-animation'>
                        <CatalogueFilterVendor
                            showVendor={showVendor}
                            setshowVendor={setshowVendor}
                        />
                    </CSSTransition>
                </div>
                <div className='w-1/6 mr-4'>
                    <div onClick={() => setshowColorMenu(true)} className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Colour</div><BsChevronDown className='my-auto' /></div>
                    <CSSTransition in={showColorMenu} timeout={300} unmountOnExit classNames='opacity-animation'>
                        <CatalogueFilterColorPageOne
                            showColorMenu={showColorMenu}
                            setshowColorMenu={setshowColorMenu}
                            showOtherColorMenu={showOtherColorMenu}
                            setshowOtherColorMenu={setshowOtherColorMenu}
                        />
                    </CSSTransition>
                    <CSSTransition in={showOtherColorMenu} timeout={300} unmountOnExit classNames='opacity-animation'>
                        <CatalogueFilterColorPageTwo
                            showColorMenu={showColorMenu}
                            setshowColorMenu={setshowColorMenu}
                            showOtherColorMenu={showOtherColorMenu}
                            setshowOtherColorMenu={setshowOtherColorMenu}
                        />
                    </CSSTransition>
                </div>
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
                <div className='w-1/6 mr-4'>
                    <div onClick={() => setshowPrice(true)} className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Price</div><BsChevronDown className='my-auto' /></div>
                    <CSSTransition in={showPrice} timeout={300} unmountOnExit classNames='opacity-animation'>
                        <CatalogueFilterPrice
                            showPrice={showPrice}
                            setshowPrice={setshowPrice}
                            minPrice={minPrice}
                            setminPrice={setminPrice}
                            maxPrice={maxPrice}
                            setmaxPrice={setmaxPrice}
                        />
                    </CSSTransition>
                </div>
                {
                    (filterCatalogue?.roomsAndStyleRoom?.length > 0 || filterCatalogue?.roomsAndStyleCollections?.length > 0) &&
                    <div className='flex mr-4 text-sm font-semibold border-b border-black border-solid cursor-pointer font-ssp'
                        onClick={() => {
                            const newFilterCatalogue = produce(filterCatalogue, (draft: any) => {
                                draft.roomsAndStyleRoom = undefined;
                                draft.roomsAndStyleCollections = undefined;
                            })
                            dispatch({
                                type: 'filterCatalogue',
                                payload: newFilterCatalogue
                            })
                        }}
                    ><GoX className='mt-auto mb-1 mr-1' /><div className='mt-auto'>Rooms & Styles</div></div>
                }
                <div onClick={() => resetFilter()} className='flex ml-auto mr-4 text-sm font-bold cursor-pointer'><div className='mt-auto'>Reset</div></div>
                {/*<CatalogueFilterDistance />*/}
            </div>
            <TextInput placeholder='Search for a product name, description, category or material' className='mt-4 position-initial-important' variant='box' inputName="filter keyword" type='search' value={searchKeyword} onChange={(e) => setsearchKeyword((e.target as any).value)} />
        </div>
    )
}

export default CatalogueFilter;