import React from "react";

export default function OptionWrapper({ children }) {
  return (
    <div className="configForm u-marginTop--15">
      <div className="u-position--relative flex u-marginTop--15">
        <div className="AdvancedOptions--wrapper flex flex-column">
          {children}
        </div>
      </div>
    </div>
  );
}
