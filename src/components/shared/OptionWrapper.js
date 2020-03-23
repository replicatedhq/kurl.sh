import React from "react";

export default function OptionWrapper({ children }) {
  return (
    <div className="wrapperForm u-marginTop--small">
      <div className="u-position--relative flex">
        <div className="AdvancedOptions--wrapper flex flex-column">
          {children}
        </div>
      </div>
    </div>
  );
}
