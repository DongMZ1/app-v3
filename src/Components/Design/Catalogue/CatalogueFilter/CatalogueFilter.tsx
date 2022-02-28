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
import apiRequest from '../../../../Service/apiRequest';
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

    //Colour => CatalogueFilterColor.tsx
    const [showColorMenu, setshowColorMenu] = useState(false);
    const [showOtherColorMenu, setshowOtherColorMenu] = useState(false);

    //itemType => CatelogueFilterItemType.tsx
    const [showItemType, setshowItemType] = useState(false);

    //vendor => CatalogueFilterVendor.tsx
    const [showVendor, setshowVendor] = useState(false);

    //tags options
    const [tags, settags] = useState<any[]>([]);
    const [catagoriesOption, setcatagoriesOption] = useState<any[]>([]);
    const [vendorOptions, setvendorOptions] = useState<any[]>([]);
    useEffect(() => {
        const fetchTags = async () => {
            const res = await apiRequest({
                url: '/api/products-service/tags',
                method: 'GET'
            })
            if (res?.success) {
                settags(res.data.tags);
            }
        }

        const fetchCatagories = async () => {
            const res = await apiRequest({
                url:'/api/products-service/categories',
                method:'GET'
            })
            if(res?.success){
                setcatagoriesOption(res?.data)
            }
        }

        const fetchVendors = async () => {
             const res = await apiRequest({
                 url:'/api/products-service/vendors',
                 method:'GET'
             })
             if(res?.success){

             }
        }
        fetchTags();
        fetchCatagories();
        fetchVendors();
    }, [])

    const resetFilter = () => {
        dispatch({
            type: 'filterCatalogue',
            payload: {}
        })
    }
    return (
        <div className="w-full px-4 catalogue-filter">
            <div className="flex mt-4">
                <div className='relative w-32 mr-4' >
                    <div onClick={() => setshowRoomsAndStyle(true)} className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'><div className='my-1'>Rooms & Styles</div><BsChevronDown className='my-auto' /></div>
                    <CSSTransition in={showRoomsAndStyle} timeout={300} unmountOnExit classNames='opacity-animation'>
                        <CatalogueFilterRoomAndStyle tags={tags} setshowRoomsAndStyle={setshowRoomsAndStyle} />
                    </CSSTransition>
                </div>
                <div className='w-24 mr-4'>
                    <div onClick={() => setshowItemType(true)} className='flex justify-between w-full px-1 text-sm border border-black border-solid cursor-pointer select-none'>
                        <div className='my-1'>Item type</div>
                        <BsChevronDown className='my-auto' />
                    </div>
                    <CSSTransition in={showItemType} timeout={300} unmountOnExit classNames='opacity-animation'>
                        <CatelogueFilterItemType
                            setshowItemType={setshowItemType} catagoriesOption={catagoriesOption}
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
                {
                    (filterCatalogue?.itemTypes?.length > 0 || filterCatalogue?.lengthUnit || filterCatalogue?.weightUnit || filterCatalogue?.W || filterCatalogue?.L || filterCatalogue?.H || filterCatalogue?.minWeight || filterCatalogue?.maxWeight) &&
                    <div className='flex mr-4 text-sm font-semibold border-b border-black border-solid cursor-pointer font-ssp'
                        onClick={() => {
                            const newFilterCatalogue = produce(filterCatalogue, (draft: any) => {
                                draft.itemTypes = undefined;
                                draft.lengthUnit = undefined;
                                draft.weightUnit = undefined;
                                draft.W = undefined;
                                draft.L = undefined;
                                draft.H = undefined;
                                draft.minWeight = undefined;
                                draft.maxWeight = undefined;
                            })
                            dispatch({
                                type: 'filterCatalogue',
                                payload: newFilterCatalogue
                            })
                        }}
                    ><GoX className='mt-auto mb-1 mr-1' /><div className='mt-auto'>Item type</div></div>
                }
                <div onClick={() => resetFilter()} className='flex ml-auto mr-4 text-sm font-bold cursor-pointer'><div className='mt-auto'>Reset</div></div>
                {/*<CatalogueFilterDistance />*/}
            </div>
            <TextInput placeholder='Search for a product name, description, category or material' className='mt-4 position-initial-important' variant='box' inputName="filter keyword" type='search' value={searchKeyword} onChange={(e) => setsearchKeyword((e.target as any).value)} />
        </div>
    )
}

export default CatalogueFilter;