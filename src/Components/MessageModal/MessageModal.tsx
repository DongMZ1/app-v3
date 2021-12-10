import { Popup } from "@fulhaus/react.ui.popup";
import { useSelector, useDispatch } from "react-redux";
import { Tappstate } from "../../redux/reducers";
const MessageModal = () => {
    const dispatch = useDispatch();
    const modalMessage = useSelector((state:Tappstate) => state.modalMessage);
    const showModal = useSelector((state:Tappstate) => state.showModal);
    return <Popup boxShadow={false} show={showModal} onClose={()=>dispatch({type:'showModal', payload: false})}>
        <div className="flex p-4 border border-black border-solid w-80 h-60 bg-cream">
            <div className="m-auto font-moret">{modalMessage}</div>
        </div>
    </Popup>
}

export default MessageModal;