
import { FC} from "react";

import { Button } from "@fulhaus/react.ui.button";



export type ITopBar = {
    allDesignElementCategories: any;
    selectedDesignElementCategory: any;
    onSelect: (category: any) => void;
}


const TopBar: FC<ITopBar> = ({allDesignElementCategories, selectedDesignElementCategory, onSelect }) =>
{


    return (
            <div className="flex items-center overflow-scroll">
                <p>Design Elements</p>
                <Button
                    variant={selectedDesignElementCategory?._id === "all" ? 'primary' : 'secondary'}
                    className="ml-8 cursor-pointer"
                    onClick={() => onSelect({ _id: "all"})}
                >
                    All
                </Button>
                {allDesignElementCategories?.map((designCategory: any) =>
                    <Button
                        key={designCategory?._id}
                        variant={selectedDesignElementCategory?._id === designCategory?._id ? "primary" : 'secondary'}
                        className="ml-8 cursor-pointer"
                        onClick={()=>onSelect(designCategory)}
                    >
                        {`${designCategory.name}s`}
                    </Button>)}
            </div>
    )
}

export default TopBar;