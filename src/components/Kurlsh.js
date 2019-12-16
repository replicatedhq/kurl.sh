import * as React from "react";
import { Link } from "@reach/router";

import ReactTooltip from "react-tooltip";
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
  },
  docker: {
    bypassStorageDriverWarnings: false,
    hardFailOnLoopback: false,
    noCEOnEE: false
  },
  kotsadm: {
    applicationSlug: "Application Slug",
    uiBindPort: 8800
  }
};
function versionToState(version) {
  return {
    version
  };
}

class Kurlsh extends React.Component {
  constructor(props) {
    super(props);
    const { installerData } = props;

    const kubernetesVersions = installerData.kubernetes.map(versionToState);

    const contourVersions = installerData.contour.map(versionToState);
    contourVersions.push({ version: "None" });

    const weaveVersions = installerData.weave.map(versionToState);
    weaveVersions.push({ version: "None" });

    const rookVersions = installerData.rook.map(versionToState);
    rookVersions.push({ version: "None" });

    const dockerVersions = installerData.docker.map(versionToState);
    dockerVersions.push({ version: "None" });

    const prometheusVersions = installerData.prometheus.map(versionToState);
    prometheusVersions.push({ version: "None" });

    const registryVersions = installerData.registry.map(versionToState);
    registryVersions.push({ version: "None" });

    const kotsadmVersions = installerData.kotsadm.map(versionToState);
    kotsadmVersions.push({ version: "None" });

    this.state = {
      versions: {
        kubernetes: kubernetesVersions,
        weave: weaveVersions,
        contour: contourVersions,
        rook: rookVersions,
        docker: dockerVersions,
        prometheus: prometheusVersions,
        registry: registryVersions,
        kotsadm: kotsadmVersions
      },
      selectedVersions: {
        kubernetes: { version: "latest" },
        weave: { version: "latest" },
        contour: { version: "latest" },
        rook: { version: "latest" },
        docker: { version: "latest" },
        prometheus: { version: "latest" },
        registry: { version: "latest" },
        kotsadm: { version: "None" }
      },
      installerSha: "latest",
      showAdvancedOptions: {
        "kubernetes": false,
        "weave": false,
        "contour": false,
        "rook": false,
        "docker": false,
        "kotsadm": false
      },
      advancedOptions: {
        kubernetes: {
          ...OPTION_DEFAULTS.kubernetes
        },
        weave: {
          ...OPTION_DEFAULTS.weave
        },
        // contour: {
        // contour has no advanced options
        // },
        rook: {
          ...OPTION_DEFAULTS.rook
        },
        docker: {
          ...OPTION_DEFAULTS.docker
        },
        // registry: {
        // Registry has no advanced options
        // },
        // prometheus: {
        // Prometheus has no advanced options
        // },
        kotsadm: {
          ...OPTION_DEFAULTS.kotsadm
        }
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
      Object.entries(modified).forEach(([key, value]) => {
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

      // No advanced options for Contour!
    }

    if (selectedVersions.docker.version !== "None") {
      const diff = getDiff(OPTION_DEFAULTS.docker, advancedOptions.docker);
      generatedInstaller.spec.docker = {
        version: selectedVersions.docker.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.docker = {
          ...generatedInstaller.spec.docker,
          ...diff
        };
      }
    }

    if (selectedVersions.prometheus.version !== "None") {
      generatedInstaller.spec.prometheus = {
        version: selectedVersions.prometheus.version
      };
    }

    if (selectedVersions.registry.version !== "None") {
      generatedInstaller.spec.registry = {
        version: selectedVersions.registry.version
      };
    }

    if (selectedVersions.kotsadm.version !== "None") {
      const diff = getDiff(OPTION_DEFAULTS.kotsadm, advancedOptions.kotsadm);
      generatedInstaller.spec.kotsadm = {
        version: selectedVersions.kotsadm.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.kotsadm = {
          ...generatedInstaller.spec.kotsadm,
          ...diff
        };
      }
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
    let value = currentTarget.value;
    let elementToFocus;
    const [field, key] = path.split('.');
    if (currentTarget.type === "checkbox") {
      value = currentTarget.checked;
      if (value && currentTarget.dataset.focusId) {
        elementToFocus = currentTarget.dataset.focusId;
        value = "";
      } else if (currentTarget.dataset.focusId) {
        value = OPTION_DEFAULTS[field][key];
      }
    }

    if (currentTarget.type === "number") {
      value = parseInt(value, 10) || 0;
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

    switch (addOn) {
      case "kubernetes": {
        return (
          <OptionWrapper>
            <div className="flex flex1 alignItems--center">
              <div className="flex">
                <input
                  type="checkbox"
                  name="serviceCIDR"
                  id="kubernetes_serviceCIDR"
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
                <ReactTooltip id="tt_kubernetes_serviceCIDR">
                  Set ServiceCIDR here
              </ReactTooltip>
                <span data-tip data-for="tt_kubernetes_serviceCIDR" className="icon clickable u-questionMarkCircle u-marginLeft--normal u-marginRight--normal"></span>
              </div>
              <div>
                <input
                  id="kubernetes_serviceCIDR"
                  className="flex2"
                  type="text"
                  onChange={e => this.handleOptionChange("kubernetes.serviceCIDR", e.currentTarget)}
                  placeholder={OPTION_DEFAULTS.kubernetes.serviceCIDR}
                  disabled={advancedOptions.kubernetes.serviceCIDR === OPTION_DEFAULTS.kubernetes.serviceCIDR}
                  value={advancedOptions.kubernetes.serviceCIDR}
                />
              </div>
            </div>
          </OptionWrapper>
        );
      }
      case "weave": {
        return (
          <OptionWrapper>
            <div className="flex-column">
              <div className="flex flex1 alignItems--center">
                <div className="flex">
                  <input
                    type="checkbox"
                    name="IPAllocRange"
                    id="weave_IPAllocRange"
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
                  <ReactTooltip id="tt_weave_IPAllocRange">
                    IP Allocation Range for Weave
                </ReactTooltip>
                  <span data-tip data-for="tt_weave_IPAllocRange" className="icon clickable u-questionMarkCircle u-marginLeft--normal u-marginRight--normal"></span>
                </div>
                <div>
                  <input
                    id="weave_IPAllocRange"
                    className="flex2"
                    type="text"
                    onChange={e => this.handleOptionChange("weave.IPAllocRange", e.currentTarget)}
                    placeholder={OPTION_DEFAULTS.weave.IPAllocRange}
                    disabled={advancedOptions.weave.IPAllocRange === OPTION_DEFAULTS.weave.IPAllocRange}
                    value={advancedOptions.weave.IPAllocRange}
                  />
                </div>
              </div>
              <div className="flex u-marginTop--15">
                <div className="flex">
                  <input
                    type="checkbox"
                    name="encryptNetwork"
                    id="weave_encryptNetwork"
                    onChange={e => this.handleOptionChange("weave.encryptNetwork", e.currentTarget)}
                    checked={advancedOptions.weave.encryptNetwork}
                  />
                  <label
                    className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer"
                    htmlFor="weave_encryptNetwork">
                    <span className="flex u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center">
                      Encrypt Network
                    <span data-tip data-for="tt_weave_encryptNetwork" className="icon clickable u-questionMarkCircle u-marginLeft--normal"></span>
                    </span>
                    <ReactTooltip id="tt_weave_encryptNetwork">
                      Encrypt Network
                  </ReactTooltip>
                  </label>
                </div>
              </div>
            </div>
          </OptionWrapper>
        );
      }

      case "rook": {
        return (
          <OptionWrapper>
            <div className="flex-column">
              <div className="flex flex1 alignItems--center">
                <div className="flex">
                  <input
                    type="checkbox"
                    name="IPAllocRange"
                    id="rook_storageClass"
                    data-focus-id="rook_storageClass"
                    onChange={e => this.handleOptionChange("rook.storageClass", e.currentTarget)}
                    checked={advancedOptions.rook.storageClass !== OPTION_DEFAULTS.rook.storageClass}
                  />
                  <label
                    className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer"
                    htmlFor="rook_storageClass">
                    <span className="flex u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center">
                      Storage Class
                  </span>
                  </label>
                  <span data-tip data-for="tt_rook_storageClass" className="flex-auto icon clickable u-questionMarkCircle u-marginLeft--normal u-marginRight--normal"></span>
                  <ReactTooltip id="tt_rook_storageClass">
                    Name of storage volume
                </ReactTooltip>
                </div>
                <div className="flex">
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
              </div>
              <div className="flex alignItems--center u-marginTop--15">
                <div className="flex">
                  <input
                    type="checkbox"
                    name="cephPoolReplicas"
                    id="rook_cephPoolReplicas"
                    data-focus-id="rook_cephPoolReplicas"
                    onChange={e => this.handleOptionChange("rook.cephPoolReplicas", e.currentTarget)}
                    checked={advancedOptions.rook.cephPoolReplicas !== OPTION_DEFAULTS.rook.cephPoolReplicas}
                  />
                  <label
                    className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer"
                    htmlFor="rook_cephPoolReplicas">
                    <span className="flex u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center">
                      Ceph Pool Replicas
                  </span>
                  </label>
                  <ReactTooltip id="tt_rook_cephPoolReplicas">
                    Minimum Ceph Pool replicas
                </ReactTooltip>
                  <span data-tip data-for="tt_rook_cephPoolReplicas" className="flex-auto icon clickable u-questionMarkCircle u-marginLeft--normal u-marginRight--normal"></span>
                </div>
                <div className="flex">
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
            </div>
          </OptionWrapper>
        );

      }

      case "docker": {
        return (
          <OptionWrapper>
            <div className="flex-column">
              <div className="flex alignItems--center">
                <input
                  type="checkbox"
                  name="bypassStorageDriverWarnings"
                  id="docker_bypassStorageDriverWarnings"
                  onChange={e => this.handleOptionChange("docker.bypassStorageDriverWarnings", e.currentTarget)}
                  checked={advancedOptions.docker.bypassStorageDriverWarnings !== OPTION_DEFAULTS.docker.bypassStorageDriverWarnings}
                />
                <label
                  className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer"
                  htmlFor="docker_bypassStorageDriverWarnings">
                  <span className="flex u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center">
                    Bypass Storage Driver Warnings
                    <span data-tip data-for="tt_docker_bypassStorageDriverWarnings" className="icon clickable u-questionMarkCircle u-marginLeft--normal"></span>
                  </span>
                  <ReactTooltip id="tt_docker_bypassStorageDriverWarnings">
                    Bypass Storage Driver Warnings
                  </ReactTooltip>
                </label>
              </div>
              <div className="flex u-marginTop--15">
                <input
                  type="checkbox"
                  name="hardFailOnLoopback"
                  id="docker_hardFailOnLoopback"
                  onChange={e => this.handleOptionChange("docker.hardFailOnLoopback", e.currentTarget)}
                  checked={advancedOptions.docker.hardFailOnLoopback}
                />
                <label
                  className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer"
                  htmlFor="docker_hardFailOnLoopback">
                  <span className="flex u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center">
                    Hard Fail on Loopback
                    <span data-tip data-for="tt_docker_hardFailOnLoopback" className="icon clickable u-questionMarkCircle u-marginLeft--normal"></span>
                  </span>
                  <ReactTooltip id="tt_docker_hardFailOnLoopback">
                    Hard Fail on Loopback
                  </ReactTooltip>
                </label>
              </div>
              <div className="flex u-marginTop--15">
                <input
                  type="checkbox"
                  name="noCEOnEE"
                  id="docker_noCEOnEE"
                  onChange={e => this.handleOptionChange("docker.noCEOnEE", e.currentTarget)}
                  checked={advancedOptions.docker.noCEOnEE}
                />
                <label
                  className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer"
                  htmlFor="docker_noCEOnEE">
                  <span className="flex u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center">
                    no CEOnEE
                    <span data-tip data-for="tt_docker_noCEOnEE" className="icon clickable u-questionMarkCircle u-marginLeft--normal"></span>
                  </span>
                  <ReactTooltip id="tt_docker_noCEOnEE">
                    no CEOnEE
                  </ReactTooltip>
                </label>
              </div>
            </div>
          </OptionWrapper>
        );
      }

      case "prometheus": {
        // no advanced options for Prometheus!
        return null;
      }

      case "kotsadm": {
        return (
          <OptionWrapper>
            <div className="flex-column">
              <div className="flex flex1 alignItems--center">
                <div className="flex">
                <input
                  type="checkbox"
                  name="applicationSlug"
                  id="kotsadm_applicationSlug"
                  data-focus-id="kotsadm_applicationSlug"
                  onChange={e => this.handleOptionChange("kotsadm.applicationSlug", e.currentTarget)}
                  value={advancedOptions.kotsadm.applicationSlug !== OPTION_DEFAULTS.kotsadm.applicationSlug}
                />
                <label
                  className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer"
                  htmlFor="kotsadm_applicationSlug">
                  <span className="flex u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center">
                    Application Slug
                  </span>
                </label>
                <ReactTooltip id="tt_kotsadm_applicationSlug">
                  What slug prefix would you like?
                </ReactTooltip>
                <span data-tip data-for="tt_kotsadm_applicationSlug" className="icon clickable u-questionMarkCircle u-marginLeft--normal u-marginRight--normal"></span>
                </div>
                <div className="flex">
                <input
                  id="kotsadm_applicationSlug"
                  className="flex2"
                  type="text"
                  onChange={e => this.handleOptionChange("kotsadm.applicationSlug", e.currentTarget)}
                  placeholder={OPTION_DEFAULTS.kotsadm.applicationSlug}
                  disabled={advancedOptions.kotsadm.applicationSlug === OPTION_DEFAULTS.kotsadm.applicationSlug}
                  value={advancedOptions.kotsadm.applicationSlug}
                />
                </div>
              </div>
              <div className="flex alignItems--center u-marginTop--15">
                <div className="flex">
                <input
                  type="checkbox"
                  name="uiBindPort"
                  id="kotsadm_uiBindPort"
                  data-focus-id="kotsadm_uiBindPort"
                  onChange={e => this.handleOptionChange("kotsadm.uiBindPort", e.currentTarget)}
                  value={advancedOptions.kotsadm.uiBindPort !== OPTION_DEFAULTS.kotsadm.uiBindPort}
                />
                <label
                  className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer"
                  htmlFor="kotsadm_uiBindPort">
                  <span className="flex u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center">
                    UI Bind Port
                  </span>
                </label>
                <ReactTooltip id="tt_kotsadm_uiBindPort">
                  What port would you like Kotsadm to be visible on?
                </ReactTooltip>
                <span data-tip data-for="tt_kotsadm_uiBindPort" className="icon clickable u-questionMarkCircle u-marginLeft--normal u-marginRight--normal"></span>
                </div>
                <div className="flex">
                <input
                  id="kotsadm_uiBindPort"
                  className="flex2"
                  type="text"
                  onChange={e => this.handleOptionChange("kotsadm.uiBindPort", e.currentTarget)}
                  placeholder={OPTION_DEFAULTS.kotsadm.uiBindPort}
                  disabled={this.state.advancedOptions.kotsadm.uiBindPort === OPTION_DEFAULTS.kotsadm.uiBindPort}
                  value={this.state.advancedOptions.kotsadm.uiBindPort}
                />
                </div>
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
        <div className={`u-flexTabletReflow flex1 u-width--full ${isMobile && "justifyContent--center alignItems--center"}`}>
          <div className="flex u-width--70 u-paddingRight--60">
            <div className="left-content-wrap flex-column">
              <div className={`${isMobile ? "u-fontSize--normal" : "u-fontSize--large"} u-fontWeight--medium u-lineHeight--more u-color--tuna`}>
                kURL is a custom Kubernetes distro creator. Think of kURL as a link shortener for your favorite Kubernetes base components (aka add-ons).
                It creates a unique URL for your specific components that can be installed with <code>cURL</code> on a modern Linux server.
                kURL installation packages can be run online or download and executed in a completely airgapped environment.
                kURL is <a href="https://github.com/replicatedhq/kurl/" target="_blank" rel="noopener noreferrer" className="replicated-link">open source</a> and easily extensible by contributing additional add-ons as Kustomization overlays.
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
              <div className="flex u-marginTop--30">
                <div className="flex-column flex flex1">
                  <div className="flex flex1">
                    <div className="flex1">
                      <div className="FormLabel u-marginBottom--10"> Docker version </div>
                      <div className="u-fontSize--small u-fontWeight--normal u-color--dustyGray u-lineHeight--normal"> What version of Docker are you using? </div>
                    </div>
                    <div className="flex1 u-paddingLeft--50 alignSelf--center">
                      <div className="u-width--120">
                        <Select
                          options={versions.docker}
                          getOptionLabel={this.getLabel}
                          getOptionValue={(docker) => docker}
                          value={selectedVersions.docker}
                          onChange={this.onVersionChange("docker")}
                          matchProp="value"
                          isOptionSelected={() => false}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex u-fontSize--small u-color--royalBlue u-marginTop--small u-cursor--pointer" onClick={() => this.onToggleShowAdvancedOptions("docker")}>
                    {showAdvancedOptions["docker"] ? "Hide advanced options" : "Show advanced options"}
                  </div>
                  {showAdvancedOptions["docker"] && this.renderAdvancedOptions("docker")}
                </div>
              </div>
              <div className="flex u-marginTop--30">
                <div className="flex-column flex flex1">
                  <div className="flex flex1">
                    <div className="flex1">
                      <div className="FormLabel u-marginBottom--10"> Prometheus version </div>
                      <div className="u-fontSize--small u-fontWeight--normal u-color--dustyGray u-lineHeight--normal"> What version of Prometheus are you using? </div>
                    </div>
                    <div className="flex1 u-paddingLeft--50 alignSelf--center">
                      <div className="u-width--120">
                        <Select
                          options={versions.prometheus}
                          getOptionLabel={this.getLabel}
                          getOptionValue={(prometheus) => prometheus}
                          value={selectedVersions.prometheus}
                          onChange={this.onVersionChange("prometheus")}
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
                      <div className="FormLabel u-marginBottom--10"> Registry version </div>
                      <div className="u-fontSize--small u-fontWeight--normal u-color--dustyGray u-lineHeight--normal"> What version of Registry are you using? </div>
                    </div>
                    <div className="flex1 u-paddingLeft--50 alignSelf--center">
                      <div className="u-width--120">
                        <Select
                          options={versions.registry}
                          getOptionLabel={this.getLabel}
                          getOptionValue={(registry) => registry}
                          value={selectedVersions.registry}
                          onChange={this.onVersionChange("registry")}
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
                      <div className="FormLabel u-marginBottom--10"> Kotsadm version </div>
                      <div className="u-fontSize--small u-fontWeight--normal u-color--dustyGray u-lineHeight--normal"> What version of Kotsadm are you using? </div>
                    </div>
                    <div className="flex1 u-paddingLeft--50 alignSelf--center">
                      <div className="u-width--120">
                        <Select
                          options={versions.kotsadm}
                          getOptionLabel={this.getLabel}
                          getOptionValue={(kotsadm) => kotsadm}
                          value={selectedVersions.kotsadm}
                          onChange={this.onVersionChange("kotsadm")}
                          matchProp="value"
                          isOptionSelected={() => false}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex u-fontSize--small u-color--royalBlue u-marginTop--small u-cursor--pointer" onClick={() => this.onToggleShowAdvancedOptions("kotsadm")}>
                    {showAdvancedOptions["kotsadm"] ? "Hide advanced options" : "Show advanced options"}
                  </div>
                  {showAdvancedOptions["kotsadm"] && this.renderAdvancedOptions("kotsadm")}
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
                  downloadAirgapHtml={<Link to={`/download/${installerSha}`} className="u-color--royalBlue u-lineHeight--normal u-fontSize--small u-textDecoration--underlineOnHover"> Download airgap installer </Link>}
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
