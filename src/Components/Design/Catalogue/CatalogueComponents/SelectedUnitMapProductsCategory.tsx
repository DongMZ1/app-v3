import { useCallback, useEffect, useState } from 'react';
import { FurnitureInRoomRowCard } from '@fulhaus/react.ui.furniture-in-room-row-card';
import { useSelector, useDispatch } from 'react-redux'
import { Tappstate } from '../../../../redux/reducers'
import apiRequest from '../../../../Service/apiRequest'
import { getQuoteDetailAndUpdateSelectedUnit } from '../../../../redux/Actions'
import produce from 'immer'
import debounce from 'lodash.debounce';
type SelectedUnitMapProductsCategoryProps = {
    eachCategory: any;
    eachRoom: any
}
const SelectedUnitMapProductsCategory = ({ eachCategory, eachRoom }: SelectedUnitMapProductsCategoryProps) => {
    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole;
    const draggedProduct = useSelector((state: Tappstate) => state.draggedProduct);
    const dispatch = useDispatch();
    const [currentIndex, setcurrentIndex] = useState(0);
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const quoteID = useSelector((state: Tappstate) => state.quoteDetail)?._id;
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
    useEffect(() => {
        if (eachCategory?.items?.length === 1) {
            //this is a react slick bug, it cannot detect index become 0, thus, using a effect to resolve this bug
            setcurrentIndex(0);
        }
    })
    const ondrop = async (e: React.DragEvent<HTMLDivElement>, eachRoom: any, eachCategory: any) => {
        dispatch({
            type: 'appLoader',
            payload: true
        })
        let items = (selectedQuoteUnit?.rooms?.filter((each: any) => each?.roomID === eachRoom?.roomID)[0]?.categories?.filter((eachC: any) => eachC.categoryID === eachCategory?.categoryID)[0]?.items as any[]).concat({
            ...draggedProduct,
            qty: 1
        })
        const res = await apiRequest({
            url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${selectedQuoteUnit?.unitID}/${eachRoom?.roomID}/${eachCategory?.categoryID}`,
            method: 'PATCH',
            body: { items }
        })
        if (res?.success) {
            dispatch(getQuoteDetailAndUpdateSelectedUnit({
                organizationID: currentOrgID ? currentOrgID : '',
                quoteID: quoteID,
                selectedQuoteUnitID: selectedQuoteUnit?.unitID
            }))
        }
        if (!res?.success) {
            console.log('add catagory for design failed at Product.tsx');
            dispatch({
                type: 'appLoader',
                payload: false
            });
        }
    }

    const deleteProduct = async () => {
        dispatch({
            type: 'appLoader',
            payload: true
        });
        let items = [...(eachCategory?.items as any[])];
        items.splice(currentIndex, 1);
        const res = await apiRequest({
            url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${selectedQuoteUnit?.unitID}/${eachRoom?.roomID}/${eachCategory?.categoryID}`,
            method: 'PATCH',
            body: { items }
        })
        if (res?.success) {
            dispatch(getQuoteDetailAndUpdateSelectedUnit({
                organizationID: currentOrgID ? currentOrgID : '',
                quoteID: quoteID,
                selectedQuoteUnitID: selectedQuoteUnit?.unitID
            }))
        }
        if (!res?.success) {
            console.log('add catagory for design failed at Product.tsx')
            dispatch({
                type: 'appLoader',
                payload: false
            });
        }
    }

    const updateCurrentFurnitureNumber = (v: number) => {
        const roomIndex = selectedQuoteUnit?.rooms?.findIndex((each: any) => each?.roomID === eachRoom?.roomID);
        const categoryIndex = selectedQuoteUnit.rooms[roomIndex].categories.findIndex((each: any) => each.categoryID === eachCategory?.categoryID);
        const newSelectedQuoteUnit: any = produce(selectedQuoteUnit, (draft: any) => {
            draft.rooms[roomIndex].categories[categoryIndex].items[currentIndex].qty = v;
        })
        debounceUpdateCurrentFurnitureNumberRemote(newSelectedQuoteUnit.rooms[roomIndex].categories[categoryIndex].items)
        dispatch({
            type: 'selectedQuoteUnit',
            payload: newSelectedQuoteUnit
        })
    }

    const updateCurrentFurnitureNumberRemote = async (items: any[]) => {
        dispatch({
            type: 'appLoader',
            payload: true
        });
        const res = await apiRequest({
            url: `/api/fhapp-service/quote/${currentOrgID}/${quoteID}/${selectedQuoteUnit?.unitID}/${eachRoom?.roomID}/${eachCategory?.categoryID}`,
            method: 'PATCH',
            body: { items }
        })
        if (res?.success) {
            dispatch(getQuoteDetailAndUpdateSelectedUnit({
                organizationID: currentOrgID ? currentOrgID : '',
                quoteID: quoteID,
                selectedQuoteUnitID: selectedQuoteUnit?.unitID
            }))
        }
        if (!res?.success) {
            console.log('add catagory for design failed at Product.tsx')
            dispatch({
                type: 'appLoader',
                payload: false
            });
        }
    }

    const debounceUpdateCurrentFurnitureNumberRemote = useCallback(debounce((items: any) => updateCurrentFurnitureNumberRemote(items), 500), [currentOrgID, quoteID, selectedQuoteUnit?.unitID, eachRoom?.roomID, eachCategory?.categoryID]);


    const showProductDetail = () => {
            dispatch({
                type: 'showselectedProductDetail',
                payload: true
            })
            dispatch({
                type: 'selectedProductDetail',
                payload: eachCategory?.items?.[currentIndex]
            })
    }

    return <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => ondrop(e, eachRoom, eachCategory)} ><FurnitureInRoomRowCard
        imageUrl={eachCategory?.items?.length > 0 ? eachCategory?.items?.map((eachItem: any) => eachItem?.imageURLs?.[0]) : []}
        isDesign
        imageInfor={()=>showProductDetail()}
        imageDelete={() => deleteProduct()}
        currentFurnitureNumber={eachCategory?.items?.[currentIndex]?.qty}
        onCurrentFurnitureNumberChange={(v) => updateCurrentFurnitureNumber(v)}
        totalFurnitureNumber={eachCategory?.items?.map((each: any) => each?.qty)?.reduce((a: number, b: number) => a + b, 0)}
        furnitureName={eachCategory?.name}
        furnitureBrandName={eachCategory?.items?.[currentIndex]?.name}
        number={eachCategory?.qty}
        editable
        buy={eachCategory?.rentable}
        buyMSRP={eachCategory?.budget}
        rentMSRP={eachCategory?.budget}
        isDesignViewer={userRole === 'viewer'}
        currentFurnitureIndex={(index) => {
            setcurrentIndex(index)
        }}
    />
    </div>
}

export default SelectedUnitMapProductsCategory;