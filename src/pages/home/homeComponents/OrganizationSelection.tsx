import {useEffect} from 'react'
import { DropdownListInput } from "@fulhaus/react.ui.dropdown-list-input"
import { useSelector, useDispatch } from "react-redux"
import { Tappstate } from "../../../redux/reducers"
import {fetchProject} from '../../../redux/Actions'
const OrganizationSelection = () =>{
    const options:any = useSelector((state: Tappstate) => state.userRole)?.organizations.map(each => each.organization.name);
    const organizations = useSelector((state: Tappstate) => state.userRole)?.organizations;
    const dispatch = useDispatch();
    useEffect(() => {
        if(organizations){
        const firstOrganizationID = organizations[0]?.organization?._id;
        dispatch(fetchProject(firstOrganizationID));
        dispatch({type:'currentOrgID', payload: firstOrganizationID});
        }
    }, [organizations])
    
    const oncurrentOrgIDChange = (v: string) => {
        const organizationID = organizations?.filter(each => each.organization.name === v)[0]?.organization?._id;
        dispatch(fetchProject(organizationID));
        dispatch({type:'currentOrgID', payload: organizationID});
    }
     return <div className="w-48 my-auto ml-auto mr-4">
     <DropdownListInput placeholder='Select A Organization' initialValue={organizations? organizations[0].organization.name : undefined} onSelect={v => oncurrentOrgIDChange(v)} options={options? options : []} />
     </div>
}

export default OrganizationSelection;
