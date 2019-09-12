import * as React from "react";
import autoBind from "react-autobind";
import { withRouter } from "react-router-dom";

import MonacoEditor from "react-monaco-editor";
import Select from "react-select";

import "../scss/components/Kurlsh";

class Kurlsh extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      versions: {
        kubernetes: [
          {version: "0.15.0"},
          {version: "0.15.1"},
          {version: "0.15.2"},
          {version: "0.15.3"},
          {version: "latest"},
        ],
        weave: [
          {version: "2.5.2"},
          {version: "latest"},
          {version: "None"},
        ],
        contour: [
          {version: "0.14.0"},
          {version: "latest"},
          {version: "None"},
        ],
        rook: [
          {version: "1.0.4"},
          {version: "latest"},
          {version: "None"},
        ]
      },
      selectedVersions: {
        kubernetes: {version: "latest"},
        weave: {version: "latest"},
        contour: {version: "latest"},
        rook: {version: "latest"}
      }
    };
    autoBind(this);
  }

  getYaml = () => {
    const required = 
`apiVersion: kurl.sh/v1beta1
kind: Installer
metadata:
  name: ""
spec:
  kubernetes:
    version: "${this.state.selectedVersions.kubernetes.version}"`;
    const optionalWeave = `        
  weave:
    version: "${this.state.selectedVersions.weave.version}"`;
    const optionalRook = `        
  rook:
    version: "${this.state.selectedVersions.rook.version}"`;
    const optionalContour = `        
  contour:
    version: "${this.state.selectedVersions.contour.version}"`;
    return required + (this.state.selectedVersions.weave.version !== "None" ? optionalWeave : "") + 
    (this.state.selectedVersions.contour.version !== "None" ? optionalContour : "") +
    (this.state.selectedVersions.rook.version !== "None" ? optionalRook : "")
  }

  onVersionChange = name => value => {
    this.setState({ selectedVersions: { ...this.state.selectedVersions, [name]: value }});
  }

  getLabel = ({ version }) => {
    return (
      <div>
        <span style={{ fontSize: 14 }}>{version}</span>
      </div>
    );
  }

  render() {
    return (
      <div className="u-minHeight--full u-width--full u-overflow--auto container flex-column flex1 alignItems--center">
        <div className="flex-auto u-width--full">
          <span className="u-fontSize--header2 u-fontWeight--bold u-color--tarawera">kurl</span>
          <span className="u-fontSize--header2 u-fontWeight--bold u-color--dustyGray">.sh</span>
        </div>
        <div className="u-flexTabletReflow flex-1-auto u-width--full">
          <div className="flex1 flex-column">
            <div className="left-content-wrap flex-column">
              <div className="u-marginTop--more u-fontSize--larger u-fontWeight--medium u-lineHeight--more u-color--tuna">
                  Kurl is a Kubernetes installer for airgapped and online clusters. 
                  This form allows you to quickly build an installer and will provide you with a URL that it can be installed at.
                </div>
                <div className="flex u-marginTop--30">
                  <div className="flex flex1">
                    <div className="flex1"> 
                      <div className="FormLabel"> Kubernetes version </div>
                      <div className="u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--more"> What version of Kubernetes are you using? </div>
                    </div>  
                    <div className="flex1 u-paddingLeft--60 alignSelf--center"> 
                      <div>
                        <Select
                          options={this.state.versions.kubernetes}
                          getOptionLabel={this.getLabel}
                          getOptionValue={(kubernetes) => kubernetes}
                          value={this.state.selectedVersions.kubernetes}
                          onChange={this.onVersionChange("kubernetes")}
                          matchProp="value"
                          isOptionSelected={() => false}
                        />
                      </div>
                    </div>  
                  </div>
                </div>

                <div className="flex u-marginTop--30">
                  <div className="flex flex1">
                    <div className="flex1"> 
                      <div className="FormLabel"> Weave version </div>
                      <div className="u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--more"> What version of Weave are you using? </div>
                    </div>  
                    <div className="flex1 u-paddingLeft--60 alignSelf--center">
                      <div>
                          <Select
                            options={this.state.versions.weave}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(weave) => weave}
                            value={this.state.selectedVersions.weave}
                            onChange={this.onVersionChange("weave")}
                            matchProp="value"
                            isOptionSelected={() => false}
                          />
                        </div>
                    </div>  
                  </div>
                </div>

                <div className="flex u-marginTop--30">
                  <div className="flex flex1">
                    <div className="flex1"> 
                      <div className="FormLabel"> Contour version </div>
                      <div className="u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--more"> What version of Contour are you using? </div>
                    </div>  
                    <div className="flex1 u-paddingLeft--60 alignSelf--center">
                      <div>
                          <Select
                            options={this.state.versions.contour}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(contour) => contour}
                            value={this.state.selectedVersions.contour}
                            onChange={this.onVersionChange("contour")}
                            matchProp="value"
                            isOptionSelected={() => false}
                          />
                        </div>
                    </div>  
                  </div>
                </div>

                <div className="flex u-marginTop--30">
                  <div className="flex flex1">
                    <div className="flex1"> 
                      <div className="FormLabel"> Rook version </div>
                      <div className="u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--more"> What version of Rook are you using? </div>
                    </div>  
                    <div className="flex1 u-paddingLeft--60 alignSelf--center">
                      <div>
                          <Select
                            options={this.state.versions.rook}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(rook) => rook}
                            value={this.state.selectedVersions.rook}
                            onChange={this.onVersionChange("rook")}
                            matchProp="value"
                            isOptionSelected={() => false}
                          />
                        </div>
                    </div>  
                  </div>
                </div>
              </div>
            </div>
          <div className="u-paddingLeft--60 flex1 flex-column">
            <div className="MonacoEditor--wrapper helm-values flex1 flex u-height--full u-width--full u-marginTop--20">
                <div className="flex u-width--full u-overflow--hidden">
                  <MonacoEditor
                    ref={(editor) => { this.monacoEditor = editor }}
                    language="yaml"
                    value={this.getYaml()}
                    height="100%"
                    width="100%"
                    options={{
                      readOnly: true,
                      minimap: {
                        enabled: false
                      }, 
                    scrollBeyondLastLine: false,
                    lineNumbers:"off"
                  }}
                  />
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Kurlsh);