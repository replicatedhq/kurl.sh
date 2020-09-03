import * as React from "react";
import { Utilities } from "./utilities";

export default class AppVersionCard extends React.Component {
  displayName = (name) => {
    if (name === "ekco") {
      return "EKCO";
    } else if (name === "kotsadm") {
      return "KOTS";
    } else if (name === "openebs") {
      return "OpenEBS";
    } else {
      return Utilities.toTitleCase(name);
    }
  }

  render() {
    const { selectedSpec, name, installerData, whatYouGet } = this.props;

    return (
      <div className={`flex u-cursor--pointer alignItems--center u-padding--20 ${selectedSpec === name && "isSelected"}`} onClick={() => whatYouGet(name)}>
      <div className="flex u-width--250">
        <div className={`flex icon u-${name === "ekco" ? "kubernetes" : name} u-marginRight--normal`}></div>
        <div className="WhatYouGet--wrapper flex flex-column">
          <p className="u-color--tuna u-fontSize--large u-fontWeight--bold u-paddingBottom--small"> {this.displayName(name)} </p>
          <p className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> {installerData.version === "latest" ? "Latest version" : `Version ${installerData.version}`} </p>
        </div>
      </div>
      <div className="icon u-arrow u-marginRight--normal"></div>
    </div>
    )
  }
}
