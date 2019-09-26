import * as React from "react";
import Select from "react-select";

import ("../scss/components/SupportedAddOns.scss");

class SupportedAddOns extends React.Component {
  state = {
    kubernetesVersions: [
      { version: "1.15.0" },
      { version: "1.15.1" },
      { version: "1.15.2" },
      { version: "1.15.3" }],
    selectedVersion: { version: "1.15.3" }
  }

  onVersionChange = (selectedVersion) => {
    this.setState({ selectedVersion });
  }

  getLabel = ({ version }) => {
    return (
      <div style={{ alignItems: "center", display: "flex" }}>
        <span style={{ fontSize: 18, marginRight: "0.5em" }} className="icon u-kubernetesIcon"></span>
        <span style={{ fontSize: 14 }}>{version}</span>
      </div>
    );
  }

  render() {
    const { kubernetesVersions, selectedVersion } = this.state;

    return (
      <div className="u-minHeight--full u-width--full flex-column flex1 u-overflow--auto">
        <div className="container u-marginBottom---40">
          <div className="u-textAlign--center">
            <h3> Supported Add-ons</h3>
          </div>
          <div className="flex u-marginTop--30 wrapperForm">
            <div className="flex flex-1-auto">
              <span className="u-fontWeight--medium u-color--tuna u-fontSize--large u-lineHeight--more">
                It all starts with Kubernetes. Kurl uses <a href="https://kustomize.io/" target="_blank" rel="noopener noreferrer" className="u-color--royalBlue">Kustomize </a> to assist in the automation of tasks enabling any
                user to deploy to a Kubernetes cluster with a single script.
                Select the version of Kubernetes you’re using to see which add-ons are supported.
              </span>
            </div>
            <div className="flex flex1 u-marginLeft--30 justifyContent--flexEnd alignItems--center">
              <div className="u-width--400">
                <Select
                  options={kubernetesVersions}
                  getOptionLabel={this.getLabel}
                  getOptionValue={(version) => version}
                  value={selectedVersion}
                  onChange={this.onVersionChange}
                  matchProp="value"
                  isOptionSelected={() => false}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-auto u-width--full flexWrap--wrap u-marginTop--30">
            <div className="AddOns--wrapper">
              <div className="addOnsBackground flex-auto justifyContent--center alignItems--center u-textAlign--center">
                <span className="icon u-weaveworksFlux u-marginBottom--small u-marginTop--30"></span>
                <div className="u-fontSize--largest u-fontWeight--medium u-color--tuna">Weaveworks flux</div>
              </div>
              <div className="flex-auto flex u-marginTop--20 u-fontSize--small u-fontWeight--medium u-marginBottom--30">
                <div className="flex flex1 flex-column u-paddingLeft--more u-paddingRight--more">
                  <div className="flex flex1">
                    <div className="flex flex1 text-wrapper justifyContent--center alignItems--center">Supported versions</div>
                    <div className="flex flex1 text-wrapper justifyContent--center alignItems--center">Pairs well with</div>
                  </div>

                  <div className="flex flex1">
                    <div className="flex flex1 flex-column justifyContent--center alignItems--center">
                      <span className="u-color--dustyGray u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> latest </span>
                      <span className="u-color--dustyGray u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> 2.5.2 </span>
                      <a href="https://github.com/replicatedhq/kurl" target="_blank" rel="noopener noreferrer" className="u-color--royalBlue u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> Contribute more </a>
                    </div>
                    <div className="flex flex1 flex-column justifyContent--center alignItems--center">
                      <span className="u-color--dustyGray u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> latest </span>
                      <span className="u-color--dustyGray u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> 2.5.2 </span>
                      <a href="https://github.com/replicatedhq/kurl" target="_blank" rel="noopener noreferrer" className="u-color--royalBlue u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> Try it </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="AddOns--wrapper">
              <div className="addOnsBackground flex-auto justifyContent--center alignItems--center u-textAlign--center">
                <span className="icon u-contour u-marginBottom--small u-marginTop--30"></span>
                <div className="u-fontSize--largest u-fontWeight--medium u-color--tuna">Contour</div>
              </div>
              <div className="flex-auto flex u-marginTop--20 u-fontSize--small u-fontWeight--medium u-marginBottom--30">
                <div className="flex flex1 flex-column u-paddingLeft--more u-paddingRight--more">
                  <div className="flex flex1">
                    <div className="flex flex1 text-wrapper justifyContent--center alignItems--center">Supported versions</div>
                    <div className="flex flex1 text-wrapper justifyContent--center alignItems--center">Pairs well with</div>
                  </div>

                  <div className="flex flex1">
                    <div className="flex flex1 flex-column justifyContent--center alignItems--center">
                      <span className="u-color--dustyGray u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> latest </span>
                      <span className="u-color--dustyGray u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> 2.5.2 </span>
                      <a href="https://github.com/replicatedhq/kurl" target="_blank" rel="noopener noreferrer" className="u-color--royalBlue u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> Contribute more </a>
                    </div>
                    <div className="flex flex1 flex-column justifyContent--center alignItems--center">
                      <span className="u-color--dustyGray u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> latest </span>
                      <span className="u-color--dustyGray u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> 2.5.2 </span>
                      <a href="https://github.com/replicatedhq/kurl" target="_blank" rel="noopener noreferrer" className="u-color--royalBlue u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> Try it </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="AddOns--wrapper">
              <div className="addOnsBackground flex-auto justifyContent--center alignItems--center u-textAlign--center">
                <span className="icon u-rook u-marginBottom--small u-marginTop--30"></span>
                <div className="u-fontSize--largest u-fontWeight--medium u-color--tuna">Rook</div>
              </div>
              <div className="flex-auto flex u-marginTop--20 u-fontSize--small u-fontWeight--medium u-marginBottom--30">
                <div className="flex flex1 flex-column u-paddingLeft--more u-paddingRight--more">
                  <div className="flex flex1">
                    <div className="flex flex1 text-wrapper justifyContent--center alignItems--center">Supported versions</div>
                    <div className="flex flex1 text-wrapper justifyContent--center alignItems--center">Pairs well with</div>
                  </div>

                  <div className="flex flex1">
                    <div className="flex flex1 flex-column justifyContent--center alignItems--center">
                      <span className="u-color--dustyGray u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> latest </span>
                      <span className="u-color--dustyGray u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> 2.5.2 </span>
                      <a href="https://github.com/replicatedhq/kurl" target="_blank" rel="noopener noreferrer" className="u-color--royalBlue u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> Contribute more </a>
                    </div>
                    <div className="flex flex1 flex-column justifyContent--center alignItems--center">
                      <span className="u-color--dustyGray u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> latest </span>
                      <span className="u-color--dustyGray u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> 2.5.2 </span>
                      <a href="https://github.com/replicatedhq/kurl" target="_blank" rel="noopener noreferrer" className="u-color--royalBlue u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> Try it </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="AddOns--wrapper">
              <div className="addOnsBackground flex-auto justifyContent--center alignItems--center u-textAlign--center">
                <span className="icon u-dockerRegistry u-marginBottom--small u-marginTop--30"></span>
                <div className="u-fontSize--largest u-fontWeight--medium u-color--tuna">Docker registry</div>
              </div>
              <div className="flex-auto flex u-marginTop--20 u-fontSize--small u-fontWeight--medium u-marginBottom--30">
                <div className="flex flex1 flex-column u-paddingLeft--more u-paddingRight--more">
                  <div className="flex flex1">
                    <div className="flex flex1 text-wrapper justifyContent--center alignItems--center">Supported versions</div>
                    <div className="flex flex1 text-wrapper justifyContent--center alignItems--center">Pairs well with</div>
                  </div>

                  <div className="flex flex1">
                    <div className="flex flex1 flex-column justifyContent--center alignItems--center">
                      <span className="u-color--dustyGray u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> latest </span>
                      <span className="u-color--dustyGray u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> 2.5.2 </span>
                      <a href="https://github.com/replicatedhq/kurl" target="_blank" rel="noopener noreferrer" className="u-color--royalBlue u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> Contribute more </a>
                    </div>
                    <div className="flex flex1 flex-column justifyContent--center alignItems--center">
                      <span className="u-color--dustyGray u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> latest </span>
                      <span className="u-color--dustyGray u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> 2.5.2 </span>
                      <a href="https://github.com/replicatedhq/kurl" target="_blank" rel="noopener noreferrer" className="u-color--royalBlue u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> Try it </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="AddOns--footer flex flex-1-auto">
          <div className="flex1 flex-column u-marginTop--30 justifyContent--center alignItems--center u-textAlign--center">
            <div className="flex title"> Want more Add-ons? </div>
            <p className="flex u-width--half"> We’re working to always add more add-ons to Kurl. If there is a particular service you want check out our contributing guide and submit a PR. </p>
            <a href="https://github.com/replicatedhq/kurl" target="_blank" rel="noopener noreferrer" className="Button secondary-white u-marginTop--normal u-marginBottom--normal"> Contribute to Kurl </a>
          </div>
        </div>
      </div>
    );
  }
}

export default SupportedAddOns;