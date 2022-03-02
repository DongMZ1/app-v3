import './Catalogue.scss'
import { useState, useRef, useEffect } from 'react';
import CatalogueFilter from "./CatalogueFilter/CatalogueFilter";
import debouncePromise from 'debounce-promise'
import apiRequest from '../../../Service/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { Tappstate } from '../../../redux/reducers';
import SelectedProductDetail from './CatalogueComponents/SelectedProductDetail';
import Product from '../Catalogue/CatalogueComponents/Product'
import { Loader } from "@fulhaus/react.ui.loader";
type CatalogueProps = {
    tabState: string
}
const Catalogue = ({ tabState }: CatalogueProps) => {
    const [calaloguePage, setcalaloguePage] = useState(1);
    const dispatch = useDispatch();
    const quoteDetail = useSelector((state: Tappstate) => state.quoteDetail)
    const currency = useSelector((state: Tappstate) => state.quoteDetail?.currency);
    const products = useSelector((state: Tappstate) => state.products);
    const scrollRef = useRef<any>();
    const filterCatalogue = useSelector((state: Tappstate) => state.filterCatalogue);
    const [loading, setloading] = useState(false);
    useEffect(() => {
        if (quoteDetail) {
            fetchProducts();
        }
    }, [quoteDetail, JSON.stringify(filterCatalogue)]);

    const fetchMoreProducts = debouncePromise(async () => {
        if ((scrollRef.current?.clientHeight + scrollRef.current?.scrollTop + 5) > scrollRef.current?.scrollHeight) {
            setloading(true);
            const res = await apiRequest({
                url: `/api/products-service/products/${currency ? currency : 'CAD'}?page=${calaloguePage}&limit=20${filterCatalogue?.minPrice !== undefined ? `&priceMin=${Number(filterCatalogue?.minPrice)}` : ``}${filterCatalogue?.maxPrice ? `&priceMax=${Number(filterCatalogue?.maxPrice)}` : ''}${filterCatalogue?.nameOrSKU ? `&nameOrSKU=${filterCatalogue?.nameOrSKU}` : ''}${filterCatalogue?.color ? `&colorName=${filterCatalogue?.color}` : ''}${filterCatalogue?.maxWeight ? `&weight=${filterCatalogue?.maxWeight}` : ''}${filterCatalogue?.weightUnit ? `&weightUnit=${filterCatalogue?.weightUnit}` : ''}${filterCatalogue?.lengthUnit ? `&dimensionUnit=${filterCatalogue?.lengthUnit}` : ''}${filterCatalogue?.L ? `&length=${filterCatalogue?.L}` : ''}${filterCatalogue?.W ? `&width=${filterCatalogue?.W}` : ''}${filterCatalogue?.H ? `&height=${filterCatalogue?.H}` : ''}`,
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
    }, 1000, { leading: true });
    const fetchProducts = async () => {
        setloading(true);
        let tags:any = [];
        if(filterCatalogue?.roomsAndStyleRoom?.map((eachRoom: any) => eachRoom?._id)){
          tags = filterCatalogue?.roomsAndStyleRoom?.map((eachRoom: any) => eachRoom?._id);
        }
        if(filterCatalogue?.roomsAndStyleCollections?.map((eachRoom: any) => eachRoom?._id)){
            tags = [...tags, filterCatalogue?.roomsAndStyleCollections?.map((eachRoom: any) => eachRoom?._id)]
        }

        let categoryIDs = filterCatalogue?.itemTypes?.map((eachCategory: any) => eachCategory._id);
        let vendorIDs = filterCatalogue?.vendors?.map((eachVendor: any) => eachVendor._id)
        const res = await apiRequest({
            url: `/api/products-service/products/${currency ? currency : 'CAD'}?page=0&limit=20${filterCatalogue?.minPrice !== undefined ? `&priceMin=${Number(filterCatalogue?.minPrice)}` : ``}${filterCatalogue?.maxPrice ? `&priceMax=${Number(filterCatalogue?.maxPrice)}` : ''}${filterCatalogue?.nameOrSKU ? `&nameOrSKU=${filterCatalogue?.nameOrSKU}` : ''}${filterCatalogue?.color ? `&colorName=${filterCatalogue?.color}` : ''}${filterCatalogue?.maxWeight ? `&weight=${filterCatalogue?.maxWeight}` : ''}${filterCatalogue?.weightUnit ? `&weightUnit=${filterCatalogue?.weightUnit}` : ''}${filterCatalogue?.lengthUnit ? `&dimensionUnit=${filterCatalogue?.lengthUnit}` : ''}${filterCatalogue?.L ? `&length=${filterCatalogue?.L}` : ''}${filterCatalogue?.W ? `&width=${filterCatalogue?.W}` : ''}${filterCatalogue?.H ? `&height=${filterCatalogue?.H}` : ''}${tags?.length > 0 ? `&tagIDs=[${tags?.join()}]` : ''}${categoryIDs?.length > 0 ? `&categoryIDs=[${categoryIDs?.join()}]` : ''}${vendorIDs?.length > 0 ? `&vendorIDs=[${vendorIDs?.join()}]` : ''}`,
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
    return <>
        <SelectedProductDetail />
        <div className={`${tabState !== "Catalogue" && 'catalogue-display-none-important'} flex h-full catalogue`}>
            <div className="flex flex-col w-1/2 overflow-hidden border-r border-black border-solid">
                <CatalogueFilter />
                <div ref={scrollRef} id='catalogue-product-ref' className='flex flex-wrap h-full overflow-auto' onScroll={() => fetchMoreProducts()}>
                    {
                        products?.map(each => <Product eachProduct={each} />)
                    }
                    {
                        loading && <div className='m-auto'><Loader /></div>
                    }
                </div>
            </div>
            <div className="w-1/2"></div>
        </div>
    </>
}

export default Catalogue;