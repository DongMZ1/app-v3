import { ClickOutsideAnElementHandler } from '@fulhaus/react.ui.click-outside-an-element-handler'
import { Tappstate } from '../../../../redux/reducers'
import { useSelector, useDispatch } from 'react-redux'
import { Checkbox } from '@fulhaus/react.ui.checkbox'
import produce from 'immer'
type CatalogueFilterSortProps = {
    showSort: boolean,
    setshowSort: React.Dispatch<React.SetStateAction<boolean>>
}
const CatalogueFilterSort = ({ showSort, setshowSort }: CatalogueFilterSortProps) => {
    const filterCatalogue = useSelector((state: Tappstate) => state.filterCatalogue);
    const dispatch = useDispatch();
    const apply = (v: boolean, each: string) => {
        if (v) {
            const newFilterCatalogue = produce(filterCatalogue, (draft: any) => {
                draft.sort = draft?.sort ? [...draft.sort, each] : [each];
                if(each === 'Price low to high'){
                    draft.sort = draft?.sort?.filter((every: any) => every !== 'Price high to low')
                }
                if(each === 'Price high to low'){
                    draft.sort = draft?.sort?.filter((every: any) => every !== 'Price low to high')
                }
            })
            dispatch({
                type: 'filterCatalogue',
                payload: newFilterCatalogue
            });
        }
        if (!v) {
            const newFilterCatalogue = produce(filterCatalogue, (draft: any) => {
                draft.sort = draft?.sort?.filter((every: any) => every !== each)
            })
            dispatch({
                type: 'filterCatalogue',
                payload: newFilterCatalogue
            });
        }
    }
    return <ClickOutsideAnElementHandler onClickedOutside={() => setshowSort(false)}>
        <div className="absolute right-0 z-50 bg-white border border-black border-solid w-200px">
            {
                ['Price low to high', 'Price high to low', 'Last Updated', 'In Stock'].map((each) =>
                    <Checkbox className='mx-4 my-2' label={each} checked={filterCatalogue?.sort?.includes(each)} onChange={(v) => apply(v, each)} />
                )
            }
        </div>
    </ClickOutsideAnElementHandler>
}

export default CatalogueFilterSort;