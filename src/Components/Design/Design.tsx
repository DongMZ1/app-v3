import {useState} from 'react'
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
    <div className="flex flex-col w-full h-full design">
      <div className="flex justify-center py-2 border-b border-black border-solid tab-css-overwrite">
        <Tab initialActiveTabLabel='Catalogue' onChange={(label) => settabState(label)} tabs={tabs} />
      </div>
      {tabState === 'Catalogue' && <Catalogue /> }
    </div>
  );
};

export default Design;
