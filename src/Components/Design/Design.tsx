import {useState, useEffect} from 'react'
import "./Design.scss";
import { Tab } from '@fulhaus/react.ui.tab'
import { IoMdBook } from "react-icons/io";
import { FaRegListAlt } from "react-icons/fa";
import Catalogue from './Catalogue/Catalogue'
const tabs = [
  { icon: <FaRegListAlt style={{marginRight: "0.5rem"}} />, label: "Catalogue" },
  { icon: <IoMdBook style={{marginRight: "0.5rem"}} />, label: "Canvas" },
];
const Design = () => {
  const [tabState, settabState] = useState("Catalogue");
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
