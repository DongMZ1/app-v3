import {useEffect, useState} from 'react';
import { FurnitureInRoomRowCard } from '@fulhaus/react.ui.furniture-in-room-row-card';
import { useSelector } from 'react-redux'
import { Tappstate } from '../../../../redux/reducers'
type SelectedUnitMapProductsCategoryProps = {
    eachCategory: any;
    eachRoom: any
}
const SelectedUnitMapProductsCategory = ({ eachCategory, eachRoom }: SelectedUnitMapProductsCategoryProps) => {
    const userRole = useSelector((state: Tappstate) => state.selectedProject)?.userRole;
    const draggedProduct = useSelector((state: Tappstate) => state.draggedProduct);
    const [currentIndex, setcurrentIndex] = useState(0);
    const ondrop = (e: React.DragEvent<HTMLDivElement>, eachRoom: any, eachCategory: any) => {
        console.log('droped ' + eachRoom?.name + ' ' + eachCategory?.name);
        console.log(draggedProduct)
    }
    useEffect(() => {
        setcurrentIndex(0);
    }, [eachCategory?.categoryID]);
    return <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => ondrop(e, eachRoom, eachCategory)} ><FurnitureInRoomRowCard
        imageUrl={eachCategory?.items.length > 0 ? eachCategory?.items?.map((eachItem: any) => eachItem?.imageURLs?.[0]) : []}
        isDesign
        currentFurnitureNumber={1}
        furnitureName={eachCategory?.name}
        number={eachCategory?.qty}
        editable
        buy={eachCategory?.rentable}
        buyMSRP={eachCategory?.budget}
        rentMSRP={eachCategory?.budget}
        isDesignViewer={userRole === 'viewer'}
        currentFurnitureIndex={(index) => setcurrentIndex(index)}
    />
    </div>
}

export default SelectedUnitMapProductsCategory;