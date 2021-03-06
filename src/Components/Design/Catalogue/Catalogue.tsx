import './Catalogue.scss'
import { useState, useRef, useEffect } from 'react';
import CatalogueFilter from "./CatalogueFilter/CatalogueFilter";
import apiRequest from '../../../Service/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { Tappstate } from '../../../redux/reducers';
import SelectedProductDetail from './CatalogueComponents/SelectedProductDetail';
import Product from '../Catalogue/CatalogueComponents/Product'
import { Loader } from "@fulhaus/react.ui.loader";
import SelectedUnitMapProduct from './CatalogueComponents/SelectedUnitMapProducts'
import debounce from 'lodash.debounce'
type CatalogueProps = {
    tabState: string
}
const Catalogue = () => {
    const [calaloguePage, setcalaloguePage] = useState(1);
    const dispatch = useDispatch();
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail)
    const currency = useSelector((state: Tappstate) => state.selectedProject?.currency)
    const products = useSelector((state: Tappstate) => state.products);
    const scrollRef = useRef<any>();
    const filterCatalogue = useSelector((state: Tappstate) => state.filterCatalogue);
    const [loading, setloading] = useState(true);
    const [draggableWidth, setdraggableWidth] = useState<number>();
    const [isExpand, setisExpand] = useState(false);
    useEffect(() => {
        if (quoteDetail) {
            fetchProducts();
        }
    }, [quoteDetail?._id, JSON.stringify(filterCatalogue)]);

    const fetchMoreProducts = async () => {
        if ((scrollRef.current?.clientHeight + scrollRef.current?.scrollTop + 5) > scrollRef.current?.scrollHeight) {
            setloading(true);
            let tags: any = [];
            if (filterCatalogue?.roomsAndStyleRoom?.map((eachRoom: any) => eachRoom?._id)) {
                tags = filterCatalogue?.roomsAndStyleRoom?.map((eachRoom: any) => eachRoom?._id);
            }
            if (filterCatalogue?.roomsAndStyleCollections?.map((eachRoom: any) => eachRoom?._id)) {
                tags = tags?.concat(filterCatalogue?.roomsAndStyleCollections?.map((eachRoom: any) => eachRoom?._id))
            }
            let categoryIDs = filterCatalogue?.itemTypes?.map((eachCategory: any) => eachCategory._id);
            let vendorIDs = filterCatalogue?.vendors?.map((eachVendor: any) => eachVendor._id)
            const res = await apiRequest({
                url: `/api/products-service/products/${currency ? currency : 'CAD'}?page=${calaloguePage}&limit=20${filterCatalogue?.minPrice !== undefined ? `&tradePriceMin=${Number(filterCatalogue?.minPrice)}` : ``}${filterCatalogue?.maxPrice ? `&tradePriceMax=${Number(filterCatalogue?.maxPrice)}` : ''}${filterCatalogue?.nameOrSKU ? `&nameOrSKU=${filterCatalogue?.nameOrSKU}` : ''}${filterCatalogue?.color ? `&colorName=${filterCatalogue?.color}` : ''}${filterCatalogue?.minWeight ? `&minWeight=${filterCatalogue?.minWeight}` : ''}${filterCatalogue?.maxWeight ? `&maxWeight=${filterCatalogue?.maxWeight}` : ''}${filterCatalogue?.weightUnit ? `&weightUnit=${filterCatalogue?.weightUnit}` : ''}${filterCatalogue?.lengthUnit ? `&dimensionUnit=${filterCatalogue?.lengthUnit}` : ''}${filterCatalogue?.L ? `&length=${filterCatalogue?.L}` : ''}${filterCatalogue?.W ? `&width=${filterCatalogue?.W}` : ''}${filterCatalogue?.H ? `&height=${filterCatalogue?.H}` : ''}${tags?.length > 0 ? `&tagIDs=${tags?.join()}` : ''}${categoryIDs?.length > 0 ? `&categoryIDs=${categoryIDs?.join()}` : ''}${vendorIDs?.length > 0 ? `&vendorIDs=${vendorIDs?.join()}` : ''}${filterCatalogue?.sort?.filter((each: any) => each !== 'In Stock')?.length > 0 ? `&sortParams={${filterCatalogue?.sort?.includes('Price high to low') ? `"tradePrice":-1,` : ''}${filterCatalogue?.sort?.includes('Price low to high') ? `"tradePrice":1,` : ''}${filterCatalogue?.sort?.includes('Last Updated') ? `"stockDate":-1,` : ''}}` : ''}${filterCatalogue?.sort?.includes('In Stock') ? `&minStockQty=1` : ''}`,
                method: 'GET'
            })
            if (res?.success) {
                dispatch({
                    type: 'products',
                    payload: [...products, ...res?.data?.products]
                })
                setcalaloguePage(state => state + 1)
            }
            setloading(false);
        }
    }

    const debounceFetchMoreProducts = debounce(() => fetchMoreProducts(), 500);

    const fetchProducts = async () => {
        dispatch({
            type: 'products',
            payload: []
        })
        setloading(true);
        let tags: any = [];
        if (filterCatalogue?.roomsAndStyleRoom?.map((eachRoom: any) => eachRoom?._id)) {
            tags = filterCatalogue?.roomsAndStyleRoom?.map((eachRoom: any) => eachRoom?._id);
        }
        if (filterCatalogue?.roomsAndStyleCollections?.map((eachRoom: any) => eachRoom?._id)) {
            tags = tags?.concat(filterCatalogue?.roomsAndStyleCollections?.map((eachRoom: any) => eachRoom?._id))
        }
        let categoryIDs = filterCatalogue?.itemTypes?.map((eachCategory: any) => eachCategory._id);
        let vendorIDs = filterCatalogue?.vendors?.map((eachVendor: any) => eachVendor._id)
        const res = await apiRequest({
            url: `/api/products-service/products/${currency ? currency : 'CAD'}?page=0&limit=20${filterCatalogue?.minPrice !== undefined ? `&tradePriceMin=${Number(filterCatalogue?.minPrice)}` : ``}${filterCatalogue?.maxPrice ? `&tradePriceMax=${Number(filterCatalogue?.maxPrice)}` : ''}${filterCatalogue?.nameOrSKU ? `&nameOrSKU=${filterCatalogue?.nameOrSKU}` : ''}${filterCatalogue?.color ? `&colorName=${filterCatalogue?.color}` : ''}${filterCatalogue?.minWeight ? `&minWeight=${filterCatalogue?.minWeight}` : ''}${filterCatalogue?.maxWeight ? `&maxWeight=${filterCatalogue?.maxWeight}` : ''}${filterCatalogue?.weightUnit ? `&weightUnit=${filterCatalogue?.weightUnit}` : ''}${filterCatalogue?.lengthUnit ? `&dimensionUnit=${filterCatalogue?.lengthUnit}` : ''}${filterCatalogue?.L ? `&length=${filterCatalogue?.L}` : ''}${filterCatalogue?.W ? `&width=${filterCatalogue?.W}` : ''}${filterCatalogue?.H ? `&height=${filterCatalogue?.H}` : ''}${tags?.length > 0 ? `&tagIDs=${tags?.join()}` : ''}${categoryIDs?.length > 0 ? `&categoryIDs=${categoryIDs?.join()}` : ''}${vendorIDs?.length > 0 ? `&vendorIDs=${vendorIDs?.join()}` : ''}${filterCatalogue?.sort?.filter((each: any) => each !== 'In Stock')?.length > 0 ? `&sortParams={${filterCatalogue?.sort?.includes('Price high to low') ? `"tradePrice":-1,` : ''}${filterCatalogue?.sort?.includes('Price low to high') ? `"tradePrice":1,` : ''}${filterCatalogue?.sort?.includes('Last Updated') ? `"stockDate":-1,` : ''}}` : ''}${filterCatalogue?.sort?.includes('In Stock') ? `&minStockQty=1` : ''}`,
            method: 'GET'
        })
        if (res.success) {
            setcalaloguePage(1);
            dispatch({
                type: 'products',
                payload: res?.data?.products
            })
        }
        document.getElementById('catalogue-product-ref')?.animate({ scrollTop: 0 });
        setloading(false);
    }


    const dragMiddleLine = (e: React.DragEvent<HTMLDivElement>) => {
        if (e.clientX !== 0 && window.innerWidth - e.clientX > 100) {
            setdraggableWidth(e.clientX - (e.currentTarget.parentElement?.getBoundingClientRect().left as any));
        }
    }

    return <>
        <SelectedProductDetail />
        <div className={`flex h-full catalogue`}>
            <div style={draggableWidth ? { width: draggableWidth } : {}} className={`flex flex-col ${isExpand ? 'w-full' : 'w-1/2'} `}>
                <CatalogueFilter isExpand={isExpand} setisExpand={setisExpand} setdraggableWidth={setdraggableWidth} />
                <div ref={scrollRef} id='catalogue-product-ref' className='flex flex-wrap h-full overflow-auto' onScroll={() => debounceFetchMoreProducts()}>
                    {
                        products?.map(each => <Product isExpand={isExpand} draggableWidth={draggableWidth} eachProduct={each} />)
                    }
                    {
                        loading && <div className='m-auto'><Loader /></div>
                    }
                </div>
            </div>
            {!isExpand && <>
                <div draggable onDrag={(e) => dragMiddleLine(e)} onDragOver={(e) => e.preventDefault()} className='h-full w-0.5 mx-1 bg-black cursor-width'>
                </div>
                <SelectedUnitMapProduct />
            </>
            }
        </div>
    </>
}

export default Catalogue;