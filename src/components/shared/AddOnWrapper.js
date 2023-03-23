import * as React from "react";
import Select from "react-select";

class AddOnWrapper extends React.Component {

  render() {
    const { addOnId, addOnTitle, addOnIcon, isBeta, isDeprecated, options, getOptionLabel, getOptionValue, value, isAddOnChecked, disableAdvancedOptions, showAdvancedOptions, handleIsAddOnSelected, onVersionChange, onToggleShowAdvancedOptions, renderAdvancedOptions } = this.props;

    return (
      <div className={`AddOn--wrapper ${isAddOnChecked && "selected"} flex flex-column u-marginTop--15`} onClick={handleIsAddOnSelected}>
        <div className="flex flex1">
          <div className="flex flex1 alignItems--center">
            <input
              type="checkbox"
              className="u-marginRight--normal"
              checked={isAddOnChecked}
              readOnly
            />
            <span className={`icon ${addOnIcon ? addOnIcon : `u-${addOnId}`} u-marginBottom--small`} />
            <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
              <div className="FormLabel"> {addOnTitle} { isBeta && <span className="prerelease-tag sidebar beta">beta</span> } { isDeprecated && <span className="prerelease-tag sidebar deprecated">deprecated</span> } </div>
              <div className={`SelectVersion flex flex1 ${!isAddOnChecked && "disabled"}`} style={{ width: "200px" }}>
                <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!isAddOnChecked ? "Version None" : "Version"} </span>
                <Select
                  isSearchable={false}
                  options={options}
                  getOptionLabel={getOptionLabel}
                  getOptionValue={getOptionValue}
                  value={value}
                  onChange={onVersionChange}
                  matchProp="value"
                  isDisabled={!isAddOnChecked}
                  isOptionSelected={() => false} />
              </div>
            </div>
          </div>
          { disableAdvancedOptions ? null : <div className="flex flex1 justifyContent--flexEnd alignItems--center">
            <div className="flex u-fontSize--small u-fontWeight--medium u-color--royalBlue u-marginTop--small u-cursor--pointer configDiv" onClick={() => onToggleShowAdvancedOptions()}>
              {showAdvancedOptions ? "Hide config" : "Show config"}
            </div>
          </div> }
        </div>
        { disableAdvancedOptions ? null : showAdvancedOptions && renderAdvancedOptions() }
      </div>
    );
  }
}

export default AddOnWrapper;
