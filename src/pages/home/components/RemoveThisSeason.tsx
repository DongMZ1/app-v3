import React from "react";
import "./RemoveThisSeason.scss";
import { Button } from "@fulhaus/react.ui.button";
import { ClickOutsideAnElementHandler } from "@fulhaus/react.ui.click-outside-an-element-handler";
type RemoveThisSeasonProps = {
  close: () => void;
};
const RemoveThisSeason = ({ close }: RemoveThisSeasonProps) => {
  return (
    <ClickOutsideAnElementHandler onClickedOutside={()=>close()}>
      <div className="border border-black border-solid remove-this-season bg-sand">
        <div className="flex">
          <div className="mx-auto text-2xl font-moret">REMOVE THIS SEASON</div>
        </div>
        <div className="mt-8">
          <div className="text-sm font-ssp">
            Once you confirm, the project will be erased.
          </div>
          <div className="text-sm font-ssp">
            You cannot reverse this action.
          </div>
        </div>
        <div className="flex mt-auto">
          <Button
            onClick={() => close()}
            className="ml-auto mr-4 font-ssp"
            variant="secondary"
          >
            Never Mind
          </Button>
          <Button variant="primary" className="font-ssp alert">
            Confirm
          </Button>
        </div>
      </div>
    </ClickOutsideAnElementHandler>
  );
};

export default RemoveThisSeason;
