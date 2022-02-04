import {useEffect} from 'react'
import { DropdownListInput } from "@fulhaus/react.ui.dropdown-list-input"
import { useSelector, useDispatch } from "react-redux"
import { Tappstate } from "../../../redux/reducers"
import {fetchProject} from '../../../redux/Actions'
type OrganizationSelectionProps = {
    clearHomePageScrollState: ()=>void
}
const OrganizationSelection = ({clearHomePageScrollState}:OrganizationSelectionProps) =>{
    const options:any = useSelector((state: Tappstate) => state.allOrganizations)?.map(each => each.name);
    const userRoleOrganizations = useSelector((state: Tappstate) => state?.userRole)?.organizations;
    const allOrganizations = useSelector((state: Tappstate) => state?.allOrganizations);
    const currentOrgID = useSelector((state:Tappstate) => state.currentOrgID);
    const dispatch = useDispatch();
    useEffect(
        () => {
            //if there is currentOrgID, which means user exit from project page so we keep the organization same as before
          if(currentOrgID){
            dispatch(fetchProject(currentOrgID));
            dispatch({type:'currentOrgID', payload: currentOrgID});
            const organizationRole = userRoleOrganizations?.filter(each => each.organization?._id === currentOrgID)[0]?.role[0];
            dispatch(
                {type:'currentOrgRole', payload: organizationRole}
            )
          }
        }, []
    )
    useEffect(() => {
        if(allOrganizations && !currentOrgID){
        clearHomePageScrollState();
        const firstOrganizationID = allOrganizations? allOrganizations[0]?._id : undefined;
        const firstOrganizationRole = userRoleOrganizations?.filter(each => each.organization?._id === firstOrganizationID)[0]?.role[0] ?userRoleOrganizations?.filter(each => each.organization?._id === firstOrganizationID)[0]?.role[0] : undefined;
        dispatch(fetchProject(firstOrganizationID));
        dispatch({type:'currentOrgID', payload: firstOrganizationID});
        dispatch(
            {type:'currentOrgRole', payload: firstOrganizationRole}
        )
        }
    }, [allOrganizations])
    
    const oncurrentOrgIDChange = (v: string) => {
        clearHomePageScrollState();
        const organizationID = allOrganizations?.filter(each => each.name === v)[0]?._id;
        const organizationRole = userRoleOrganizations?.filter(each => each.organization.name === v)[0]?.role[0] ? userRoleOrganizations?.filter(each => each.organization.name === v)[0]?.role[0] : undefined;
        dispatch(fetchProject(organizationID));
        dispatch({type:'currentOrgID', payload: organizationID});
        dispatch({type:'currentOrgRole', payload: organizationRole})
    }
     return <div className="w-48 my-auto ml-auto mr-4">
     <DropdownListInput placeholder='Select A Organization' initialValue={(allOrganizations && allOrganizations?.length > 0) ? allOrganizations.filter((each: any) => each._id === currentOrgID)[0]?.name : undefined} onSelect={v => oncurrentOrgIDChange(v)} options={options? options : []} />
     </div>
}

export default OrganizationSelection;
