import * as React from "react";
import Select from "react-select";

import("../scss/components/SupportedAddOns.scss");

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
    const { isMobile } = this.props;

    return (
      <div className="u-minHeight--full u-width--full flex-column flex1 u-overflow--auto">
        <div className={`${isMobile ? "mobile-container justifyContent--center alignItems--center flex flex-column" : "container"} u-marginBottom---40`}>
          <div className="u-textAlign--center">
            <h2> Supported Add-ons</h2>
          </div>
          <div className={`flex u-marginTop--30 ${isMobile ? "mobile-wrapperForm flex-column" : "wrapperForm"}`}>
            <div className="flex flex-1-auto">
              <span className="u-fontWeight--medium u-color--tuna u-fontSize--large u-lineHeight--more">
                It all starts with Kubernetes. kURL uses <a href="https://kustomize.io/" target="_blank" rel="noopener noreferrer" className="u-color--royalBlue">Kustomize </a> to assist in the automation of tasks enabling any
                user to deploy to a Kubernetes cluster with a single script.
                Select the version of Kubernetes you’re using to see which add-ons are supported.
              </span>
            </div>
            <div className={`flex flex1 justifyContent--flexEnd alignItems--center ${isMobile ? "u-marginTop--20" : "u-marginLeft--40"}`}>
              <div className="SelectKubernetes--wrapper u-width--400">
                <Select
                  options={kubernetesVersions}
                  getOptionLabel={this.getLabel}
                  getOptionValue={(version) => version}
                  value={selectedVersion}
                  onChange={this.onVersionChange}
                  matchProp="value"
                  isOptionSelected={() => false}
                  isSearchable={false}
                />
              </div>
            </div>
          </div>

          <div className={`flex-auto flex flexWrap--wrap u-width--full u-marginTop--30 ${isMobile && "justifyContent--center"}`}>
            <div className={`${isMobile ? "mobileAddOns--wrapper" : "AddOns--wrapper"}`}>
              <div className="addOnsBackground flex-auto justifyContent--center alignItems--center u-textAlign--center">
                <span className="icon u-weaveworksFlux u-marginBottom--small"></span>
                <div className="u-fontSize--largest u-fontWeight--medium u-color--tuna">Weave</div>
              </div>
              <div className="flex-auto flex u-marginTop--20 u-fontSize--small u-fontWeight--medium u-marginBottom--30">
                <div className="flex flex1 u-paddingLeft--more u-paddingRight--more">
                  <div className="flex flex1">
                    <div className="flex flex1 flex-column justifyContent--center alignItems--center">
                      <div className="flex flex1 text-wrapper justifyContent--center alignItems--center">Supported versions</div>
                      <span className="u-color--scorpion u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> latest </span>
                      <span className="u-color--scorpion u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> 2.5.2 </span>
                      <a href="https://github.com/replicatedhq/kurl" target="_blank" rel="noopener noreferrer" className="u-color--royalBlue u-fontWeight--medium u-fontSize--normal u-lineHeight--more u-textDecoration--underlineOnHover"> Contribute more </a>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className={`${isMobile ? "mobileAddOns--wrapper" : "AddOns--wrapper"}`}>
              <div className="addOnsBackground flex-auto justifyContent--center alignItems--center u-textAlign--center">
                <span className="icon u-contour u-marginBottom--small"></span>
                <div className="u-fontSize--largest u-fontWeight--medium u-color--tuna">Contour</div>
              </div>
              <div className="flex-auto flex u-marginTop--20 u-fontSize--small u-fontWeight--medium u-marginBottom--30">
                <div className="flex flex1 u-paddingLeft--more u-paddingRight--more">
                  <div className="flex flex1">
                    <div className="flex flex1 flex-column justifyContent--center alignItems--center">
                      <div className="flex flex1 text-wrapper justifyContent--center alignItems--center">Supported versions</div>
                      <span className="u-color--scorpion u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> latest </span>
                      <span className="u-color--scorpion u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> 0.14.0 </span>
                      <a href="https://github.com/replicatedhq/kurl" target="_blank" rel="noopener noreferrer" className="u-color--royalBlue u-fontWeight--medium u-fontSize--normal u-lineHeight--more u-textDecoration--underlineOnHover"> Contribute more </a>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className={`${isMobile ? "mobileAddOns--wrapper" : "AddOns--wrapper"}`}>
              <div className="addOnsBackground flex-auto justifyContent--center alignItems--center u-textAlign--center">
                <span className="icon u-rook u-marginBottom--small"></span>
                <div className="u-fontSize--largest u-fontWeight--medium u-color--tuna">Rook</div>
              </div>
              <div className="flex-auto flex u-marginTop--20 u-fontSize--small u-fontWeight--medium u-marginBottom--30">
                <div className="flex flex1 u-paddingLeft--more u-paddingRight--more">
                  <div className="flex flex1">
                    <div className="flex flex1 flex-column justifyContent--center alignItems--center">
                      <div className="flex flex1 text-wrapper justifyContent--center alignItems--center">Supported versions</div>
                      <span className="u-color--scorpion u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> latest </span>
                      <span className="u-color--scorpion u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> 1.0.4 </span>
                      <a href="https://github.com/replicatedhq/kurl" target="_blank" rel="noopener noreferrer" className="u-color--royalBlue u-fontWeight--medium u-fontSize--normal u-lineHeight--more u-textDecoration--underlineOnHover"> Contribute more </a>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className={`${isMobile ? "mobileAddOns--wrapper" : "AddOns--wrapper"}`}>
              <div className="addOnsBackground flex-auto justifyContent--center alignItems--center u-textAlign--center">
                <span className="icon u-dockerRegistry u-marginBottom--small"></span>
                <div className="u-fontSize--largest u-fontWeight--medium u-color--tuna">Docker registry</div>
              </div>
              <div className="flex-auto flex u-marginTop--20 u-fontSize--small u-fontWeight--medium u-marginBottom--30">
                <div className="flex flex1 u-paddingLeft--more u-paddingRight--more">
                  <div className="flex flex1">
                    <div className="flex flex1 flex-column justifyContent--center alignItems--center">
                      <div className="flex flex1 text-wrapper justifyContent--center alignItems--center">Supported versions</div>
                      <span className="u-color--scorpion u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> latest </span>
                      <span className="u-color--scorpion u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> 2.7.1 </span>
                      <a href="https://github.com/replicatedhq/kurl" target="_blank" rel="noopener noreferrer" className="u-color--royalBlue u-fontWeight--medium u-fontSize--normal u-lineHeight--more u-textDecoration--underlineOnHover"> Contribute more </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${isMobile ? "mobileAddOns--wrapper" : "AddOns--wrapper"}`}>
              <div className="addOnsBackground flex-auto justifyContent--center alignItems--center u-textAlign--center">
                <span className="icon u-prometheus u-marginBottom--small"></span>
                <div className="u-fontSize--largest u-fontWeight--medium u-color--tuna">Prometheus</div>
              </div>
              <div className="flex-auto flex u-marginTop--20 u-fontSize--small u-fontWeight--medium u-marginBottom--30">
                <div className="flex flex1 u-paddingLeft--more u-paddingRight--more">
                  <div className="flex flex1">
                    <div className="flex flex1 flex-column justifyContent--center alignItems--center">
                      <div className="flex flex1 text-wrapper justifyContent--center alignItems--center">Supported versions</div>
                      <span className="u-color--scorpion u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> latest </span>
                      <span className="u-color--scorpion u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> 0.33.0 </span>
                      <a href="https://github.com/replicatedhq/kurl" target="_blank" rel="noopener noreferrer" className="u-color--royalBlue u-fontWeight--medium u-fontSize--normal u-lineHeight--more u-textDecoration--underlineOnHover"> Contribute more </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${isMobile ? "mobileAddOns--wrapper" : "AddOns--wrapper"}`}>
              <div className="addOnsBackground flex-auto justifyContent--center alignItems--center u-textAlign--center">
                <span className="icon u-kotsadm u-marginBottom--small"></span>
                <div className="u-fontSize--largest u-fontWeight--medium u-color--tuna">Kotsadm</div>
              </div>
              <div className="flex-auto flex u-marginTop--20 u-fontSize--small u-fontWeight--medium u-marginBottom--30">
                <div className="flex flex1 u-paddingLeft--more u-paddingRight--more">
                  <div className="flex flex1">
                    <div className="flex flex1 flex-column justifyContent--center alignItems--center">
                      <div className="flex flex1 text-wrapper justifyContent--center alignItems--center">Supported versions</div>
                      <span className="u-color--scorpion u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> latest </span>
                      <span className="u-color--scorpion u-fontWeight--medium u-fontSize--normal u-lineHeight--more"> 1.4.1 </span>
                      <a href="https://github.com/replicatedhq/kurl" target="_blank" rel="noopener noreferrer" className="u-color--royalBlue u-fontWeight--medium u-fontSize--normal u-lineHeight--more u-textDecoration--underlineOnHover"> Contribute more </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="AddOns--footer flex flex-1-auto">
          <div className="AddOns--background flex flex-1-auto">
            <div className="flex1 flex-column u-marginTop--40 u-marginBottom--40 justifyContent--center alignItems--center u-textAlign--center">
              <div className="flex title"> Want more Add-ons? </div>
              <p className="flex u-width--half u-lineHeight--more"> We’re working to always add more add-ons to kURL. If there is a particular service you want check out our contributing guide and submit a PR. </p>
              <a href="https://github.com/replicatedhq/kurl" target="_blank" rel="noopener noreferrer" className="Button secondary-white u-marginTop--normal u-marginBottom--more"> Contribute to kURL </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SupportedAddOns;
