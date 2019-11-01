import * as React from "react";
import { Link } from "@reach/router";

import Select from "react-select";
import CodeSnippet from "./shared/CodeSnippet";
import Loader from "./shared/Loader";

import("../scss/components/Kurlsh.scss");

const OPTION_DEFAULTS = {
  kubernetes: {
    serviceCIDR: "10.96.0.0/12"
  },
  weave: {
    IPAllocRange: "10.32.0.0/12",
    encryptNetwork: true
  },
  rook: {
    storageClass: "default",
    cephPoolReplicas: 3
  }
};

class Kurlsh extends React.Component {
  constructor() {
    super();
    this.state = {
      versions: {
        kubernetes: [
          { version: "1.15.0" },
          { version: "1.15.1" },
          { version: "1.15.2" },
          { version: "1.15.3" },
          { version: "latest" },
        ],
        weave: [
          { version: "2.5.2" },
          { version: "latest" },
          { version: "None" },
        ],
        contour: [
          { version: "0.14.0" },
          { version: "latest" },
          { version: "None" },
        ],
        rook: [
          { version: "1.0.4" },
          { version: "latest" },
          { version: "None" },
        ]
      },
      selectedVersions: {
        kubernetes: { version: "latest" },
        weave: { version: "latest" },
        contour: { version: "latest" },
        rook: { version: "latest" }
      },
      installerSha: "latest",
      showAdvancedOptions: {
        "kubernetes": false,
        "weave": false,
        "contour": false,
        "rook": false
      },
      selectedAdvancedOptions: {
        kubernetes: {
          ...OPTION_DEFAULTS.kubernetes
        },
        weave: {
          ...OPTION_DEFAULTS.weave
        },
        // contour: {
          
        // },
        rook: {
          ...OPTION_DEFAULTS.rook
        },
        // docker: {

        // },
        // registry: {

        // },
        // prometheus: {
          
        // },
        // kotsadm: {
          
        // }
      },
      bootstrapToken: {
        "kubernetes": false,
        "weave": false,
        "contour": false,
        "rook": false
      },
      loadBalancer: {
        "kubernetes": false,
        "weave": false,
        "contour": false,
        "rook": false
      },
      reset: {
        "kubernetes": false,
        "weave": false,
        "contour": false,
        "rook": false
      },
      isLoading: false
    };
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
    this.setState({ selectedVersions: { ...this.state.selectedVersions, [name]: value } }, () => {
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
    const url = `${process.env.KURL_INSTALLER_URL}`
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

  onToggleShowAdvancedOptions = (version) => {
    this.setState({ showAdvancedOptions: { ...this.state.showAdvancedOptions, [version]: !this.state.showAdvancedOptions[version] } })
  }

  // handleOnChangeAdvancedOptions = (field, version, e) => {
  //   let nextState = {
  //     [field]: { ...this.state[field] }
  //   };
  //   let val;
  //   if (field === "bootstrapToken" || field === "loadBalancer" || field === "reset") {
  //     val = e.target.checked;
  //   } else {
  //     val = e.target.value;
  //   }

  //   nextState[field][version] = val;
  //   this.setState(nextState);
  // }
  
  handleOptionChange = (path, event) => {
    console.log(path, event);
    let value = event.currentTarget.value;
    const [ field, key ] = path.split('.');
    if (event.currentTarget.type === "checkbox") {
      value = !!value
    }
    this.setState({
      [field]: {
        [key]: value
      }
    });
  }
  

  renderMonacoEditor = () => {
    import("monaco-editor").then(monaco => {
      window.monacoEditor = monaco.editor.create(document.getElementById("monaco"), {
        value: this.getYaml(),
        language: "yaml",
        readOnly: true,
        minimap: {
          enabled: false
        },
        scrollBeyondLastLine: false,
        lineNumbers: "off",
      });
      this.setState({ isLoading: false });
    });
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    }, () => {
      this.renderMonacoEditor();
    })
  }

  componentDidUpdate(lastProps, lastState) {
    if (typeof window !== "undefined") {
      if (this.state.selectedVersions !== lastState.selectedVersions) {
        window.monacoEditor.setValue(this.getYaml());
      }
    }
  }

  renderAdvancedOptions = version => {
    
    const { selectedAdvancedOptions } = this.state;
    switch(version) {
      case "kubernetes": {
        return (
          <div className="wrapperForm">
            <div className="u-position--relative flex">
              <div className="flex-column">
                <div className="flex alignItems--center">
                  <div className="flex">
                    <input 
                      type="checkbox"
                      name="serviceCIDR"
                      onChange={e => this.handleOptionChange("kubernetes.serviceCIDR", e.currentTarget)}
                      value={!!selectedAdvancedOptions[version].serviceCIDR}
                    />
                    <label 
                      className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer"
                      htmlFor="serviceCIDR">
                      <span className="flex u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center">
                        Service CIDR
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case "weave": {
        return (
          <div className="wrapperForm">
            <div className="u-position--relative flex">
              <div className="flex-column">
                <div className="flex alignItems--center">
                  <div className="flex">
                    <input
                      type="checkbox"
                      name="serviceCIDR"
                      onChange={e => this.handleOptionChange("kubernetes.serviceCIDR", e.currentTarget)}
                      value={!!selectedAdvancedOptions[version].serviceCIDR}
                    />
                    <label
                      className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer"
                      htmlFor="serviceCIDR">
                      <span className="flex u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center">
                        Service CIDR
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      }
      
      case "rook": {
        return null;
        
      }
      default: {
        return null;
      }
    }
    return null;
    
    // This is unreachable and purely for reference
    return (
      <div className="wrapperForm u-marginTop--small">
        <div className="u-position--relative flex">
          <div className="flex-column">
            <div className="flex alignItems--center">
              <div className="flex">
                <input
                  type="checkbox"
                  id="bootstrapToken"
                  checked={this.state.bootstrapToken[version]}
                  onChange={(e) => { this.handleOnChangeAdvancedOptions("bootstrapToken", version, e) }}
                />
                <label htmlFor="bootstrapToken" className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer"> 
                  <span className="u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center flex">bootstrap-token</span>
                </label>
              </div>
              <div className="u-marginLeft--10">
                <input
                  className={`Input ${!this.state.bootstrapToken[version] ? "is-disabled" : ""}`}
                  value={this.state.bootstrapTokenValue}
                  onChange={(e) => { this.handleFormChange("bootstrapTokenValue", version, e) }}
                />
              </div>
              <span className="icon u-questionMarkCircle u-marginLeft--normal"></span>
            </div>

            <div className="flex u-marginTop--20 justifyContent--center alignItems--center alignSelf--center">
              <div className="flex">
                <input
                  type="checkbox"
                  id="loadBalancer"
                  checked={this.state.loadBalancer[version]}
                  onChange={(e) => { this.handleOnChangeAdvancedOptions("loadBalancer", version, e) }}
                />
                <label htmlFor="loadBalancer" className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer">
                  <span className="u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center flex">load-balancer-address</span>
                </label>
              </div>
              <div className="u-marginLeft--10">
                <input
                  className={`Input ${!this.state.loadBalancer[version] ? "is-disabled" : ""}`}
                  placeholder="127.0.0.1"
                  value={this.state.loadBalancerValue}
                  onChange={(e) => { this.handleFormChange("loadBalancerValue", e) }}
                />
              </div>
              <span className="icon u-questionMarkCircle u-marginLeft--normal"></span>
            </div>

            <div className="flex u-marginTop--20">
              <div className="flex justifyContent--center alignItems--center alignSelf--center">
                <input
                  type="checkbox"
                  id="reset"
                  checked={this.state.reset[version]}
                  onChange={(e) => { this.handleOnChangeAdvancedOptions("reset", version, e) }}
                />
                <label htmlFor="reset" className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer">
                  <span className="u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center flex">reset</span>
                </label>
                <span className="icon u-questionMarkCircle u-marginLeft--normal"></span>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }


  render() {
    const { versions, selectedVersions, installerSha, showAdvancedOptions, isLoading } = this.state;
    const { isMobile } = this.props;

    const installCommand = `curl https://kurl.sh/${installerSha} | sudo bash`;

    return (
      <div className={`u-minHeight--full u-width--full u-overflow--auto flex-column flex1 u-marginBottom---40 ${isMobile ? "mobile-container" : "container"}`}>
        <div className="u-flexTabletReflow flex1 u-width--full">
          <div className="flex u-width--70 u-paddingRight--60">
            <div className="left-content-wrap flex-column">
              <div className={`${isMobile ? "u-fontSize--normal" : "u-fontSize--large"} u-fontWeight--medium u-lineHeight--more u-color--tuna`}>
                Kurl is a custom Kubernetes distro creator. Think of Kurl as a link shortener for your favorite Kubernetes base components (aka add-ons). 
                It creates a unique URL for your specific components that can be installed with <code>curl</code> on a modern Linux server. 
                Kurl installation packages can be run online or download and executed in a completely airgapped environment.
                Kurl is <a href="https://github.com/replicatedhq/kurl/" target="_blank" rel="noopener noreferrer" className="replicated-link">open source</a> and easily extensible by contributing additional add-ons as Kustomization overlays.
              </div>
              <div className="flex u-marginTop--30">
                <div className="flex-column flex flex1">
                  <div className="flex flex1">
                    <div className="flex1">
                      <div className="FormLabel u-marginBottom--10"> Kubernetes version </div>
                      <div className="u-fontSize--small u-fontWeight--normal u-color--dustyGray u-lineHeight--normal"> What version of Kubernetes are you using? </div>
                    </div>
                    <div className="flex1 u-paddingLeft--50 alignSelf--center">
                      <div className="u-width--120">
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
                      <div>
                      </div>
                    </div>
                  </div>
                  <div className="flex u-fontSize--small u-color--royalBlue u-marginTop--small u-cursor--pointer" onClick={() => this.onToggleShowAdvancedOptions("kubernetes")}>
                    {showAdvancedOptions["kubernetes"] ? "Hide advanced options" : "Show advanced options"}
                  </div>
                  {showAdvancedOptions["kubernetes"] && this.renderAdvancedOptions("kubernetes")}
                </div>
              </div>

              <div className="flex u-marginTop--30">
                <div className="flex-column flex flex1">
                  <div className="flex flex1">
                    <div className="flex1">
                      <div className="FormLabel u-marginBottom--10"> Weave version </div>
                      <div className="u-fontSize--small u-fontWeight--normal u-color--dustyGray u-lineHeight--normal"> What version of Weave are you using? </div>
                    </div>
                    <div className="flex1 u-paddingLeft--50 alignSelf--center">
                      <div className="u-width--120">
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
                  <div className="flex u-fontSize--small u-color--royalBlue u-marginTop--small u-cursor--pointer" onClick={() => this.onToggleShowAdvancedOptions("weave")}>
                    {showAdvancedOptions["weave"] ? "Hide advanced options" : "Show advanced options"}
                  </div>
                  {showAdvancedOptions["weave"] && this.renderAdvancedOptions("weave")}
                </div>
              </div>

              <div className="flex u-marginTop--30">
                <div className="flex-column flex flex1">
                  <div className="flex flex1">
                    <div className="flex1">
                      <div className="FormLabel u-marginBottom--10"> Contour version </div>
                      <div className="u-fontSize--small u-fontWeight--normal u-color--dustyGray u-lineHeight--normal"> What version of Contour are you using? </div>
                    </div>
                    <div className="flex1 u-paddingLeft--50 alignSelf--center">
                      <div className="u-width--120">
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
              </div>

              <div className="flex u-marginTop--30">
                <div className="flex-column flex flex1">
                  <div className="flex flex1">
                    <div className="flex1">
                      <div className="FormLabel u-marginBottom--10"> Rook version </div>
                      <div className="u-fontSize--small u-fontWeight--normal u-color--dustyGray u-lineHeight--normal"> What version of Rook are you using? </div>
                    </div>
                    <div className="flex1 u-paddingLeft--50 alignSelf--center">
                      <div className="u-width--120">
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
                  <div className="flex u-fontSize--small u-color--royalBlue u-marginTop--small u-cursor--pointer" onClick={() => this.onToggleShowAdvancedOptions("rook")}>
                    {showAdvancedOptions["rook"] ? "Hide advanced options" : "Show advanced options"}
                  </div>
                  {showAdvancedOptions["rook"] && this.renderAdvancedOptions("rook")}
                </div>
              </div>
            </div>
          </div>
          <div className={`FixedWrapper flex-column ${isMobile ? "u-marginTop--30" : ""}`}>
            <div className="MonacoEditor--wrapper flex u-width--full">
              <div className="flex u-width--full u-overflow--hidden" id="monaco">
                {isLoading &&
                  <div className="flex-column flex-1-auto u-overflow--hidden justifyContent--center alignItems--center">
                    <Loader
                      size="70"
                    />
                  </div>}
              </div>
            </div>
            <div className="flex-column wrapperForm u-marginTop--30">
              <div className="FormLabel u-marginBottom--normal"> Installation URL </div>
              <div className="u-fontSize--small u-fontWeight--normal u-color--dustyGray u-lineHeight--normal">
                As your make changes to your YAML spec a new URL will be generated. To create custom URLs or make changes to this one
                    <a href="https://vendor.replicated.com/login" target="_blank" rel="noopener noreferrer" className="replicated-link"> log in to vendor.replicated.com</a>.
                  </div>
              <div className="flex flex-column u-marginTop--normal">
                <CodeSnippet
                  canCopy={true}
                  onCopyText={<span className="u-color--vidaLoca">URL has been copied to your clipboard</span>}
                  downloadAirgapLink={true}
                  downloadAirgapHtml={<Link to={`/download/${installerSha}`}  className="u-color--royalBlue u-lineHeight--normal u-fontSize--small u-textDecoration--underlineOnHover"> Download airgap installer </Link>}
                >
                  {installCommand}
                </CodeSnippet>
              </div>
            </div>
            <span className="u-fontSize--small u-fontWeight--medium u-color--dustyGray u-lineHeight--normal u-marginTop--small"> Want to add a new component to kurl? <a href="https://github.com/replicatedhq/kurl#contributing" target="_blank" rel="noopener noreferrer" className="replicated-link">Read our contributing</a> guide.</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Kurlsh;
