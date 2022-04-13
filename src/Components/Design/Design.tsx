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
import Canvas from './Canvas/Canvas';
const Design = ({ tabState }: { tabState: "Catalogue" | "Canvas" }) => {

  const selectedProject = useSelector((state: Tappstate) => state.selectedProject);
  const currentOrgID = useSelector((state: Tappstate) => state.currentOrgID);
  const quoteID = useSelector((state: Tappstate) => state.quoteDetail?._id);
  const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit)
  const projectID = useSelector((state:Tappstate) => state.selectedProject)?._id;
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchDesign = async () => {
      const res = await apiRequest({
        url: `/api/fhapp-service/design/${currentOrgID}/${projectID}/${selectedProject.design}`,
        method: 'GET'
      })
    }
    if (currentOrgID && selectedProject) {
      fetchDesign()
    }
  }, [selectedProject?._id, currentOrgID])
  useEffect(() => {
    //sync with remote, because previously custom items does not have a ID, so by fetch get single quote, it will have a ID now
    if (currentOrgID && quoteID) {
      dispatch(getQuoteDetailAndUpdateSelectedUnit({
        organizationID: currentOrgID,
        projectID,
        quoteID: quoteID,
        selectedQuoteUnitID: selectedQuoteUnit?.unitID
      }))
    }
  }, [currentOrgID, quoteID])
  return (
    <div className="w-full design">
      {tabState === 'Catalogue' && <Catalogue />}
      {tabState === 'Canvas' && <Canvas />}
    </div>
  );
};

export default Design;
