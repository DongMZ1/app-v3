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
    eachRoom: any;
}
const SelectedUnitMapProductsCategory = ({ eachCategory, eachRoom }: SelectedUnitMapProductsCategoryProps) => {
    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole;
    const draggedProduct = useSelector((state: Tappstate) => state.draggedProduct);
    const dispatch = useDispatch();
    const [currentIndex, setcurrentIndex] = useState(0);
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const quoteID = useSelector((state: Tappstate) => state.quoteDetail)?._id;
    const projectID = useSelector((state:Tappstate) => state.selectedProject)?._id;
    const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);

    const selectedCanvas = eachRoom?.selectedCanvas;

    useEffect(() => {
        if (selectedCanvas?.items?.[`${eachCategory?.categoryID}`]?.length === 1) {
            //this is a react slick bug, it cannot detect index become 0, thus, using a effect to resolve this bug
            setcurrentIndex(0);
        }
    })
    const ondrop = async (e: React.DragEvent<HTMLDivElement>, eachCategory: any) => {
        dispatch({
            type: 'appLoader',
            payload: true
        })
        const res = await apiRequest({
            url: `/api/fhapp-service/design/${currentOrgID}/canvases/${selectedCanvas?._id}`,
            method: 'PATCH',
            body: {
                items: {
                    ...selectedCanvas.items,
                    [eachCategory?.categoryID]: selectedCanvas.items?.[`${eachCategory?.categoryID}`] ? selectedCanvas.items?.[`${eachCategory?.categoryID}`]?.concat({
                        ...draggedProduct,
                        qty: 1
                    }) : [
                        {
                            ...draggedProduct,
                            qty: 1
                        },
                    ]
                },
                designItems: []
            }
        })
        if (res?.success) {
            dispatch(getQuoteDetailAndUpdateSelectedUnit({
                organizationID: currentOrgID ? currentOrgID : '',
                projectID,
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
        let newselectedCanvas: any = produce(selectedCanvas, (draft: any) => {
            draft.items[`${eachCategory?.categoryID}`]?.splice(currentIndex, 1)
        })
        const res = await apiRequest({
            url: `/api/fhapp-service/design/${currentOrgID}/canvases/${selectedCanvas?._id}`,
            method: 'PATCH',
            body: {
                items: newselectedCanvas?.items,
                designItems: []
            }
        })
        if (res?.success) {
            dispatch(getQuoteDetailAndUpdateSelectedUnit({
                organizationID: currentOrgID ? currentOrgID : '',
                projectID,
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
        const newSelectedQuoteUnit: any = produce(selectedQuoteUnit, (draft: any) => {
            draft.rooms[roomIndex].selectedCanvas.items[`${eachCategory?.categoryID}`][currentIndex].qty = v;
        })
        dispatch({
            type: 'selectedQuoteUnit',
            payload: newSelectedQuoteUnit
        })
        debounceUpdateCurrentFurnitureNumberRemote(newSelectedQuoteUnit?.rooms[roomIndex].selectedCanvas.items)
    }

    const updateCurrentFurnitureNumberRemote = async (items: object) => {
        dispatch({
            type: 'appLoader',
            payload: true
        });
        const res = await apiRequest({
            url: `/api/fhapp-service/design/${currentOrgID}/canvases/${selectedCanvas?._id}`,
            method: 'PATCH',
            body:
            {
                items: items,
                designItems: []
            }
        })
        if (res?.success) {
            dispatch(getQuoteDetailAndUpdateSelectedUnit({
                organizationID: currentOrgID ? currentOrgID : '',
                projectID,
                quoteID: quoteID,
                selectedQuoteUnitID: selectedQuoteUnit?.unitID
            }))
        }
        if (!res?.success) {
            console.log('updateCurrentFurnitureNumberRemote failed at SelectedUnitMapProductsCategory.tsx')
            dispatch({
                type: 'appLoader',
                payload: false
            });
        }
    }

    const debounceUpdateCurrentFurnitureNumberRemote = useCallback(debounce((items: any) => updateCurrentFurnitureNumberRemote(items), 500), [currentOrgID, quoteID, selectedQuoteUnit?.unitID, selectedCanvas?._id]);


    const showProductDetail = () => {
        dispatch({
            type: 'showselectedProductDetail',
            payload: true
        })
        dispatch({
            type: 'selectedProductDetail',
            payload: selectedCanvas?.items?.[`${eachCategory?.categoryID}`]?.[currentIndex]
        })
    }

    return <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => ondrop(e, eachCategory)} ><FurnitureInRoomRowCard
        imageUrl={selectedCanvas?.items?.[`${eachCategory?.categoryID}`]?.length > 0 ? selectedCanvas?.items?.[`${eachCategory?.categoryID}`]?.map((eachProduct: any) => eachProduct?.imageURLs?.[0]) : []}
        isDesign
        imageInfor={() => showProductDetail()}
        imageDelete={() => deleteProduct()}
        currentFurnitureNumber={selectedCanvas?.items?.[`${eachCategory?.categoryID}`]?.[currentIndex]?.qty}
        onCurrentFurnitureNumberChange={(v) => updateCurrentFurnitureNumber(v)}
        totalFurnitureNumber={selectedCanvas?.items?.[`${eachCategory?.categoryID}`]?.map((each: any) => each?.qty)?.reduce((a: number, b: number) => a + b, 0)}
        furnitureName={eachCategory?.name}
        furnitureBrandName={selectedCanvas?.items?.[`${eachCategory?.categoryID}`]?.[currentIndex]?.name}
        number={eachCategory?.qty}
        editable
        buy={!eachCategory?.rentable}
        buyMSRP={eachCategory?.budget?.toFixed(2)}
        rentMSRP={eachCategory?.budget?.toFixed(2)}
        isDesignViewer={userRole === 'viewer'}
        currentFurnitureIndex={(index) => {
            setcurrentIndex(index)
        }}
    />
    </div>
}

export default SelectedUnitMapProductsCategory;