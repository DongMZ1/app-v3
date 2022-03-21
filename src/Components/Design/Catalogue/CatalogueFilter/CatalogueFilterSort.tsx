import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler'
import { Tappstate } from '../../../../redux/reducers'
import { useSelector, useDispatch } from 'react-redux'
import produce from 'immer'
type CatalogueFilterSortProps = {
    showSort: boolean,
    setshowSort: React.Dispatch<React.SetStateAction<boolean>>
}
const CatalogueFilterSort = ({ showSort, setshowSort }: CatalogueFilterSortProps) => {
    const filterCatalogue = useSelector((state: Tappstate) => state.filterCatalogue);
    const dispatch = useDispatch();
    const apply = (v: string) => {
        const newFilterCatalogue = produce(filterCatalogue, (draft: any) => {
            draft.sort = v;
        })
        dispatch({
            type: 'filterCatalogue',
            payload: newFilterCatalogue
        });
        setshowSort(false);
    }
    return <ClickOutsideAnElementHandler onClickedOutside={() => setshowSort(false)}>
        <div className="absolute right-0 z-50 bg-white border border-black border-solid w-200px">
            {
                ['Price low to high', 'Price high to low', 'Last Updated', 'In Stock'].map((each) =>
                    <div onClick={() => apply(each)} className='w-full px-4 py-2 text-sm cursor-pointer font-ssp hover:bg-gray-200'>
                        {each}
                    </div>
                )
            }
        </div>
    </ClickOutsideAnElementHandler>
}

export default CatalogueFilterSort;