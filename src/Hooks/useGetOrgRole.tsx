import { Tappstate } from "../redux/reducers";
import { useSelector } from "react-redux";


const useGetOrgRole = () => {
    const currentOrgID = useSelector((state:Tappstate) => state.currentOrgID);
    const userRole = useSelector((state: Tappstate) => state.userRole);
    const organizationRole = userRole?.organizations?.filter((each: any) => each?.organization?._id === currentOrgID)?.[0]?.role[0];
    return organizationRole;
}

export default useGetOrgRole