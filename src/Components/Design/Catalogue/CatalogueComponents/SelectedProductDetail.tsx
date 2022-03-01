import { Popup } from "@fulhaus/react.ui.popup"
import './SelectedProductDetail.scss'
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from 'react-icons/ai'
import { Tappstate } from "../../../../redux/reducers";

const SelectedProductDetail = () => {
    const dispatch = useDispatch();
    const selectedProductDetail = useSelector((state: Tappstate) => state.selectedProductDetail);
    const showselectedProductDetail = useSelector((state: Tappstate) => state.showselectedProductDetail);
    return <Popup show={showselectedProductDetail} horizontalAlignment='center' verticalAlignment="center" onClose={() => {
        dispatch({
            type: 'showselectedProductDetail',
            payload: false
        })
    }} >
        <div className="relative px-4 py-6 border border-black border-solid w-30rem bg-cream">
            <AiOutlineClose className="absolute top-0 right-0 mt-4 mr-4 cursor-pointer" onClick={() => {
                dispatch({
                    type: 'showselectedProductDetail',
                    payload: false
                })
            }} />
            <div className="flex py-2 text-xl font-moret"><div className="m-auto">{selectedProductDetail?.fulhausProductName}</div></div>
        </div>
    </Popup>
}

export default SelectedProductDetail;