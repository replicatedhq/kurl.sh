import * as React from "react";
import { Link } from "@reach/router";

import json2yaml from "json2yaml";
import Select from "react-select";
import CodeSnippet from "./shared/CodeSnippet";
import Loader from "./shared/Loader";
import OptionWrapper from "./shared/OptionWrapper";

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
      advancedOptions: {
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
    const { 
      selectedVersions, 
      advancedOptions
    } = this.state;
    
    const generatedInstaller = {
      apiVersion: "kurl.sh/v1beta1",
      kind: "Installer",
      metadata: {
        name: ""
      },
      spec: {
        kubernetes: {
          version: selectedVersions.kubernetes.version
        }
      }
    };
    
    const getDiff = (defaults, modified) => {
      const diff = {};
      Object.entries(modified).forEach( ([key, value]) => {
        if (defaults[key] !== modified[key]) {
          diff[key] = value;
        }
      });
      
      return diff;
    }
    
    if (advancedOptions.kubernetes) {
      const diff = getDiff(OPTION_DEFAULTS.kubernetes, advancedOptions.kubernetes);
      
      if (Object.keys(diff).length) {
        generatedInstaller.spec.kubernetes = {
          ...generatedInstaller.spec.kubernetes,
          ...diff
        };
      }
    }
    
    if (selectedVersions.weave.version !== "None") {
      const diff = getDiff(OPTION_DEFAULTS.weave, advancedOptions.weave);
      generatedInstaller.spec.weave = {
        version: selectedVersions.weave.version
      };
      
      if (Object.keys(diff).length) {
        generatedInstaller.spec.weave = {
            ...generatedInstaller.spec.weave,
            ...diff
        };
      }
    }
    
    if (selectedVersions.rook.version !== "None") {
      const diff = getDiff(OPTION_DEFAULTS.rook, advancedOptions.rook);
      generatedInstaller.spec.rook = {
        version: selectedVersions.rook.version
      };
      
      if (Object.keys(diff).length) {
        generatedInstaller.spec.rook = {
          ...generatedInstaller.spec.rook,
          ...diff
        };
      }
    }
    
    if (selectedVersions.contour.version !== "None") {
      generatedInstaller.spec.contour = {
        version: selectedVersions.contour.version
      };
    }
    
    return json2yaml.stringify(generatedInstaller).replace("---\n", "");
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

  onToggleShowAdvancedOptions = (addOn) => {
    this.setState({ showAdvancedOptions: { ...this.state.showAdvancedOptions, [addOn]: !this.state.showAdvancedOptions[addOn] } })
  }
  
  handleOptionChange = (path, currentTarget) => {
    const { advancedOptions } = this.state;
    let value = currentTarget.value;
    let elementToFocus;
    const [ field, key ] = path.split('.');
    if (currentTarget.type === "checkbox") {
      value = currentTarget.checked;
      if (value && currentTarget.dataset.focusId) {
        elementToFocus = currentTarget.dataset.focusId;
        value = "";
      } else if (currentTarget.dataset.focusId) {
        value = OPTION_DEFAULTS[field][key];
      } 
    }
    
    this.setState({
      advancedOptions: {
        ...this.state.advancedOptions,
        [field]: {
          ...this.state.advancedOptions[field],
          [key]: value
        }  
      }
    }, () => {
      if (elementToFocus) {
        const el = document.getElementById(elementToFocus);
        el.focus();
      }
      window.monacoEditor.setValue(this.getYaml());
      this.postToKurlInstaller(this.getYaml());
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
    });
  }

  componentDidUpdate(lastProps, lastState) {
    if (typeof window !== "undefined") {
      if (this.state.selectedVersions !== lastState.selectedVersions) {
        window.monacoEditor.setValue(this.getYaml());
      }
    }
  }

  renderAdvancedOptions = addOn => {
    
    const { advancedOptions } = this.state;
    switch(addOn) {
      case "kubernetes": {
        return (
          <OptionWrapper>
            <div className="flex alignItems--center">
              <input
                type="checkbox"
                name="serviceCIDR"
                data-focus-id="kubernetes_serviceCIDR"
                onChange={e => this.handleOptionChange("kubernetes.serviceCIDR", e.currentTarget)}
                value={advancedOptions.kubernetes.serviceCIDR !== OPTION_DEFAULTS.kubernetes.serviceCIDR}
              />
              <label
                className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer"
                htmlFor="kubernetes_serviceCIDR">
                <span className="flex u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center">
                  Service CIDR
                </span>
              </label>
              <span className="icon clickable u-questionMarkCircle u-marginRight--normal"></span>
              <input
                id="kubernetes_serviceCIDR"
                className="flex2"
                type="text"
                onChange={e => this.handleOptionChange("kubernetes.serviceCIDR", e.currentTarget)}
                placeholder={OPTION_DEFAULTS.kubernetes.serviceCIDR}
                disabled={this.state.advancedOptions.kubernetes.serviceCIDR === OPTION_DEFAULTS.kubernetes.serviceCIDR}
                value={this.state.advancedOptions.kubernetes.serviceCIDR}
              />
            </div>
          </OptionWrapper>
        );
      }
      case "weave": {
        return (
          <OptionWrapper>
            <div className="flex-column">
              <div className="flex alignItems--center">
                <input
                  type="checkbox"
                  name="IPAllocRange"
                  data-focus-id="weave_IPAllocRange"
                  onChange={e => this.handleOptionChange("weave.IPAllocRange", e.currentTarget)}
                  checked={advancedOptions.weave.IPAllocRange !== OPTION_DEFAULTS.weave.IPAllocRange}
                />
                <label
                  className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer"
                  htmlFor="weave_IPAllocRange">
                  <span className="flex u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center">
                    IP Allocation Range
                  </span>
                </label>
                <span className="icon clickable u-questionMarkCircle u-marginRight--normal"></span>
                <input
                  id="weave_IPAllocRange"
                  className="flex2"
                  type="text"
                  onChange={e => this.handleOptionChange("weave.IPAllocRange", e.currentTarget)}
                  placeholder={OPTION_DEFAULTS.weave.IPAllocRange}
                  disabled={this.state.advancedOptions.weave.IPAllocRange === OPTION_DEFAULTS.weave.IPAllocRange}
                  value={this.state.advancedOptions.weave.IPAllocRange}
                />
              </div>
              <div className="flex u-marginTop--15">
                <input
                  type="checkbox"
                  name="encryptNetwork"
                  onChange={e => this.handleOptionChange("weave.encryptNetwork", e.currentTarget)}
                  checked={advancedOptions.weave.encryptNetwork}
                />
                <label
                  className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer"
                  htmlFor="weave_encryptNetwork">
                  <span className="flex u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center">
                    Encrypt Network
                    <span className="icon clickable u-questionMarkCircle u-marginLeft--normal"></span>
                  </span>
                </label>
                
              </div>
            </div>
          </OptionWrapper>
        );
      }
      
      case "rook": {
        return (
          <OptionWrapper>
            <div className="flex-column">
              <div className="flex alignItems--center">
                <input
                  type="checkbox"
                  name="IPAllocRange"
                  data-focus-id="rook_storageClass"
                  onChange={e => this.handleOptionChange("rook.storageClass", e.currentTarget)}
                  checked={advancedOptions.rook.storageClass !== OPTION_DEFAULTS.rook.storageClass}
                />
                <label
                  className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer"
                  htmlFor="rook_storageClass">
                  <span className="flex u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center">
                    Storage <br/>Class
                  </span>
                </label>
                <span className="flex-auto icon clickable u-questionMarkCircle u-marginRight--normal"></span>
                <input
                  id="rook_storageClass"
                  className="flex2"
                  type="text"
                  onChange={e => this.handleOptionChange("rook.storageClass", e.currentTarget)}
                  placeholder={OPTION_DEFAULTS.rook.storageClass}
                  disabled={advancedOptions.rook.storageClass === OPTION_DEFAULTS.rook.storageClass}
                  value={advancedOptions.rook.storageClass}
                />
              </div>
              <div className="flex u-marginTop--15">
                <input
                  type="checkbox"
                  name="cephPoolReplicas"
                  data-focus-id="rook_cephPoolReplicas"
                  onChange={e => this.handleOptionChange("rook.cephPoolReplicas", e.currentTarget)}
                  checked={advancedOptions.rook.cephPoolReplicas !== OPTION_DEFAULTS.rook.cephPoolReplicas}
                />
                <label
                  className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer"
                  htmlFor="weave_encryptNetwork">
                  <span className="flex u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center">
                    Ceph Pool Replicas
                  </span>
                </label>
                <span className="flex-auto icon clickable u-questionMarkCircle u-marginRight--normal"></span>
                <input
                  id="rook_cephPoolReplicas"
                  className="flex2"
                  type="number"
                  onChange={e => this.handleOptionChange("rook.cephPoolReplicas", e.currentTarget)}
                  placeholder={OPTION_DEFAULTS.rook.cephPoolReplicas}
                  disabled={advancedOptions.rook.cephPoolReplicas === OPTION_DEFAULTS.rook.cephPoolReplicas}
                  value={advancedOptions.rook.cephPoolReplicas}
                />
                
              </div>
            </div>
          </OptionWrapper>
        );
        
      }
      default: {
        return null;
      }
    }
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
