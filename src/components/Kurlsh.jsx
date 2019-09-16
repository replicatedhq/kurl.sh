import * as React from "react";
import { withRouter, Link } from "react-router-dom";

import MonacoEditor from "react-monaco-editor";
import Select from "react-select";

import CodeSnippet from "./shared/CodeSnippet.jsx";

import "../scss/components/Kurlsh";

class Kurlsh extends React.Component {
  state = {
    versions: {
      kubernetes: [
        {version: "1.15.0"},
        {version: "1.15.1"},
        {version: "1.15.2"},
        {version: "1.15.3"},
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
    },
    installerSha: "latest"
  };

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
    this.setState({ selectedVersions: { ...this.state.selectedVersions, [name]: value }}, () => {
      this.postToKurlInstaller(this.getYaml());
     })
  }

  getLabel = ({ version }) => {
    return (
      <div>
        <span style={{ fontSize: 14 }}>{version}</span>
      </div>
    );
  }

  postToKurlInstaller = async (yaml) => {
    const url = `${window.env.KURL_INSTALLER_URL}`
    try {
      const response = await fetch(url, {
        method: "POST",
        body: yaml,
        headers: {
          "Content-Type": "text/yaml",
        },
      });
      if (response.ok) {
        const res = await response.text();
        const splittedRes = res.split("/");
        const installerSha = splittedRes[splittedRes.length - 1];
        this.setState({ installerSha });
      }
    } catch (err) {
      console.log(err)
    }
  }


  render() {
    const { versions, selectedVersions, installerSha } = this.state;

    const installCommand = `curl https://kurl.sh/${installerSha} | sudo bash`

    return (
      <div className="u-minHeight--full u-width--full u-overflow--auto container flex-column flex1 alignItems--center">
        <div className="flex-auto u-width--full">
          <span className="u-fontSize--header2 u-fontWeight--bold u-color--tarawera u-lineHeight--more">kurl</span>
          <span className="u-fontSize--header2 u-fontWeight--bold u-color--dustyGray u-lineHeight--more">.sh</span>
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
                      <div className="FormLabel u-marginBottom--normal"> Kubernetes version </div>
                      <div className="u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--more"> What version of Kubernetes are you using? </div>
                    </div>  
                    <div className="flex1 u-paddingLeft--60 alignSelf--center"> 
                      <div>
                        <Select
                          options={versions.kubernetes}
                          getOptionLabel={this.getLabel}
                          getOptionValue={(kubernetes) => kubernetes}
                          value={selectedVersions.kubernetes}
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
                      <div className="FormLabel u-marginBottom--normal"> Weave version </div>
                      <div className="u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--more"> What version of Weave are you using? </div>
                    </div>  
                    <div className="flex1 u-paddingLeft--60 alignSelf--center">
                      <div>
                          <Select
                            options={versions.weave}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(weave) => weave}
                            value={selectedVersions.weave}
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
                      <div className="FormLabel u-marginBottom--normal"> Contour version </div>
                      <div className="u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--more"> What version of Contour are you using? </div>
                    </div>  
                    <div className="flex1 u-paddingLeft--60 alignSelf--center">
                      <div>
                          <Select
                            options={versions.contour}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(contour) => contour}
                            value={selectedVersions.contour}
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
                      <div className="FormLabel u-marginBottom--normal"> Rook version </div>
                      <div className="u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--more"> What version of Rook are you using? </div>
                    </div>  
                    <div className="flex1 u-paddingLeft--60 alignSelf--center">
                      <div>
                          <Select
                            options={versions.rook}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(rook) => rook}
                            value={selectedVersions.rook}
                            onChange={this.onVersionChange("rook")}
                            matchProp="value"
                            isOptionSelected={() => false}
                          />
                        </div>
                    </div>  
                  </div>
                </div>

                <div className="flex-column wrapperForm u-marginTop--normal">
                  <div className="FormLabel u-marginBottom--normal"> Installation URL </div>
                  <div className="u-fontWeight--normal u-color--dustyGray u-lineHeight--normal">
                    As your make changes to your YAML spec a new URL will be generated. To create custom URL’s or make changes to this one 
                    <a href="https://vendor.replicated.com/login" target="_blank" rel="noopener noreferrer" className="replicated-link"> log in to vendor.replicated.com</a>.
                  </div>
                  <div className="flex flex-column u-marginTop--normal">
                    <CodeSnippet
                      canCopy={true}
                      onCopyText={<span className="u-color--vidaLoca">URL has been copied to your clipboard</span>}
                      downloadAirgapLink={true}
                      downloadAirgapHtml={<Link to={`/${installerSha}/download`} className="u-color--astral u-lineHeight--normal u-fontSize--small u-textDecoration--underlineOnHover"> Download airgap installer </Link> }
                      >
                      {installCommand}
                    </CodeSnippet>
                  </div>
                </div>
              </div>
              <span className="u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginTop--small"> Want to add a new component to kurl? <a href="https://github.com/replicatedhq/kurl#contributing" target="_blank" rel="noopener noreferrer" className="replicated-link">Read our contributing guide.</a> </span>
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