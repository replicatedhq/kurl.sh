import React from "react";

export default function OptionWrapper({children}) {
  return (
    <div className="wrapperForm">
      <div className="u-position--relative flex">
        <div className="flex-column">
          <div className="flex alignItems--center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
