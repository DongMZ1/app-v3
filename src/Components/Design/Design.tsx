import { useState, useEffect } from 'react'
import "./Design.scss";
import { Tab, TabProps } from '@fulhaus/react.ui.tab'
import { IoMdBook } from "react-icons/io";
import { FaRegListAlt } from "react-icons/fa";
import Catalogue from './Catalogue/Catalogue'
import { useDispatch, useSelector } from 'react-redux';
import { Tappstate } from '../../redux/reducers';
import apiRequest from '../../Service/apiRequest';
import { getQuoteDetailAndUpdateSelectedUnit } from '../../redux/Actions';
const tabs = [
  { icon: <FaRegListAlt style={{ marginRight: "0.5rem" }} />, label: "Catalogue" },
  { icon: <IoMdBook style={{ marginRight: "0.5rem" }} />, label: "Canvas" },
];
const Design = () => {
  const [tabState, settabState] = useState("Catalogue");
  const selectedProject = useSelector((state: Tappstate) => state.selectedProject);
  const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
  const quoteID = useSelector((state: Tappstate) => state.quoteDetail?._id);
  const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit)
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchDesign = async () => {
      const res = await apiRequest({
        url: `/api/fhapp-service/design/${currentOrgID}/${selectedProject.design}`,
        method: 'GET'
      })
    }
    if (currentOrgID && selectedProject) {
      fetchDesign()
    }
  }, [selectedProject, currentOrgID])
  useEffect(() => {
    //sync with remote, because previously custom items does not have a ID, so by fetch get single quote, it will have a ID now
    if (currentOrgID && quoteID) {
      dispatch(getQuoteDetailAndUpdateSelectedUnit({
        organizationID: currentOrgID,
        quoteID: quoteID,
        selectedQuoteUnitID: selectedQuoteUnit?.unitID
      }))
    }
  }, [currentOrgID, quoteID])
  return (
    <div className="w-full design">
      <div className="flex justify-center py-2 border-b border-black border-solid justify-items-center h-14 tab-css-overwrite">
        <Tab initialActiveTabLabel='Catalogue' onChange={(label) => settabState(label)} tabs={tabs} />
      </div>
      <Catalogue tabState={tabState} />
    </div>
  );
};

export default Design;
