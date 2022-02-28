import './Catalogue.scss'
import { useState, useRef, useEffect } from 'react';
import CatalogueFilter from "./CatalogueFilter/CatalogueFilter";
import debouncePromise from 'debounce-promise'
import apiRequest from '../../../Service/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { Tappstate } from '../../../redux/reducers';
import { AppV3FurnitureCard } from '@fulhaus/react.ui.product-card-app'
import Product from '../Catalogue/CatalogueComponents/Product'
type CatalogueProps = {
    tabState: string
}
const Catalogue = ({ tabState }: CatalogueProps) => {
    const [calaloguePage, setcalaloguePage] = useState(1);
    const dispatch = useDispatch();
    const currency = useSelector((state: Tappstate) => state.quoteDetail?.currency);
    const products = useSelector((state: Tappstate) => state.products);
    const scrollRef = useRef<any>();
    useEffect(() => {
        fetchProducts();
    }, [currency]);

    const fetchMoreProducts = debouncePromise(async () => {
          if((scrollRef.current?.clientHeight + scrollRef.current?.scrollTop + 5) > scrollRef.current?.scrollHeight){
            const res = await apiRequest({
                url: `/api/products-service/products/${currency ? currency : 'CAD'}?page=${calaloguePage}&limit=20`,
                method: 'GET'
            })
            if(res?.success){
                dispatch({
                    type: 'products',
                    payload: [...products ,...res?.data?.products] 
                })
                setcalaloguePage(state => state + 1)
            }
          }
    }, 1000, { leading: true });
    const fetchProducts = async () => {
        const res = await apiRequest({
            url: `/api/products-service/products/${currency ? currency : 'CAD'}?page=0&limit=20`,
            method: 'GET'
        })
        if (res.success) {
            setcalaloguePage(1);
            dispatch({
                type: 'products',
                payload: res?.data?.products
            })
        }
    }
    return <div className={`${tabState !== "Catalogue" && 'catalogue-display-none-important'} flex h-full catalogue`}>
        <div className="flex flex-col w-1/2 overflow-hidden border-r border-black border-solid">
            <CatalogueFilter />
            <div ref={scrollRef} className='flex flex-wrap h-full overflow-auto' onScroll={()=>fetchMoreProducts()}>
                {
                    products?.map(each => <Product eachProduct={each} />)
                }
            </div>
        </div>
        <div className="w-1/2"></div>
    </div>
}

export default Catalogue;