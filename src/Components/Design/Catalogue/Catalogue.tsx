import './Catalogue.scss'
import { useState, useRef, useEffect } from 'react';
import CatalogueFilter from "./CatalogueFilter/CatalogueFilter";
import debouncePromise from 'debounce-promise'
import apiRequest from '../../../Service/apiRequest';
import { useSelector } from 'react-redux';
import { Tappstate } from '../../../redux/reducers';
import {AppV3FurnitureCard} from '@fulhaus/react.ui.product-card-app'
type CatalogueProps = {
    tabState: string
}
const Catalogue = ({ tabState }: CatalogueProps) => {
    const [calaloguePage, setcalaloguePage] = useState(0);
    const currency = useSelector((state: Tappstate) => state.quoteDetail?.currency);
    useEffect(() => {
        fetchProducts();
    }, [currency])
    const fetchMoreProducts = debouncePromise(async () => {
    }, 1000, { leading: true });
    const fetchProducts = async () => {
        const res = await apiRequest({
            url: `/api/products-service/products/${currency ? currency : 'CAD'}?`,
            method: 'GET'
        })
    }
    return <div className={`${tabState !== "Catalogue" && 'catalogue-display-none-important'} flex w-full h-full catalogue`}>
        <div className="w-1/2 overflow-y-auto border-r border-black border-solid">
            <CatalogueFilter />
        </div>
        <div className="w-1/2"></div>
    </div>
}

export default Catalogue;