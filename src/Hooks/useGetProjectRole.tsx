import { Tappstate } from "../redux/reducers";
import { useSelector } from "react-redux";

const useGetProjectRole = (projectID: string) =>{
    const state = useSelector((state:Tappstate) => state);
    if(state.currentOrgRole){
        return state.currentOrgRole as string;
    }
    if(!state.currentOrgRole){
        return state.userRole?.projects?.filter(each => each.projectID === projectID)[0]?.role[0]?
         (state.userRole?.projects?.filter(each => each.projectID === projectID)[0]?.role[0] as string)
          : undefined;
    }
}

export {
    useGetProjectRole
}