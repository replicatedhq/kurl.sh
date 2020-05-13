import * as React from "react";
import { Link } from "@reach/router";

import ReactTooltip from "react-tooltip";
import json2yaml from "json2yaml";
import Select from "react-select";
import isEmpty from "lodash/isEmpty";
import find from "lodash/find";

import CodeSnippet from "./shared/CodeSnippet";
import Loader from "./shared/Loader";
import OptionWrapper from "./shared/OptionWrapper";

import "../scss/components/Kurlsh.scss";
import versionDetails from "../../static/versionDetails.json"

const versionAddOns = ["kubernetes", "weave", "rook", "registry", "docker", "velero", "kotsadm"];
function versionToState(version) {
  return {
    version
  };
}

class Kurlsh extends React.Component {
  constructor(props) {
    super(props);
    const { supportedVersions } = props;

    const kubernetesVersions = supportedVersions.kubernetes.map(versionToState);

    const contourVersions = supportedVersions.contour.map(versionToState);
    contourVersions.push({ version: "None" });

    const weaveVersions = supportedVersions.weave.map(versionToState);
    weaveVersions.push({ version: "None" });

    const rookVersions = supportedVersions.rook.map(versionToState);
    rookVersions.push({ version: "None" });

    const dockerVersions = supportedVersions.docker.map(versionToState);
    dockerVersions.push({ version: "None" });

    const prometheusVersions = supportedVersions.prometheus.map(versionToState);
    prometheusVersions.push({ version: "None" });

    const registryVersions = supportedVersions.registry.map(versionToState);
    registryVersions.push({ version: "None" });

    const veleroVersions = supportedVersions.velero.map(versionToState);
    veleroVersions.push({ version: "None" });

    const kotsadmVersions = supportedVersions.kotsadm.map(versionToState);
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
        velero: veleroVersions,
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
        velero: { version: "None" },
        kotsadm: { version: "None" }
      },
      installerSha: "latest",
      showAdvancedOptions: {
        "kubernetes": false,
        "weave": false,
        "contour": false,
        "rook": false,
        "prometheus": false,
        "registry": false,
        "docker": false,
        "velero": false,
        "kotsadm": false
      },
      advancedOptions: {
        kubernetes: {},
        weave: {},
        rook: {},
        registry: {},
        docker: {},
        velero: {},
        kotsadm: {}
      },
      isLoading: false,
      optionDefaults: {},
      installerErr: false,
      installerErrMsg: ""
    };
  }

  helperToGenerateOptionsForYaml = (newObj) => {
    let result = {};
    for (let i = 0; i < Object.keys(newObj).length; ++i) {
      const obj = Object.keys(newObj)[i];
      if (newObj[obj].isChecked) {
        result[obj] = newObj[obj].inputValue
      }
    }
    return result;
  }

  generateAdvancedOptionsForYaml = (advancedOptions) => {
    let result = {};
    for (let i = 0; i < Object.keys(advancedOptions).length; ++i) {
      const objX = Object.keys(advancedOptions)[i];
      result[objX] = this.helperToGenerateOptionsForYaml(advancedOptions[objX])
    }
    return result;
  }

  getYaml = (sha) => {
    const {
      selectedVersions,
      advancedOptions
    } = this.state;

    const generatedInstaller = {
      apiVersion: `${process.env.CLUSTER_API_URL}/v1beta1`,
      kind: "Installer",
      metadata: {
        name: sha
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
    const { optionDefaults } = this.state;

    const options = this.generateAdvancedOptionsForYaml(advancedOptions);

    if (options.kubernetes) {
      const diff = getDiff(optionDefaults["kubernetes"], options.kubernetes);

      if (Object.keys(diff).length) {
        generatedInstaller.spec.kubernetes = {
          ...generatedInstaller.spec.kubernetes,
          ...diff
        };
      }
    }

    if (selectedVersions.weave.version !== "None") {
      const diff = getDiff(optionDefaults["weave"], options.weave);
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
      const diff = getDiff(optionDefaults["rook"], options.rook);
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
      const diff = getDiff(optionDefaults["docker"], options.docker);
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
      const diff = getDiff(optionDefaults["registry"], options.registry);
      generatedInstaller.spec.registry = {
        version: selectedVersions.registry.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.registry = {
          ...generatedInstaller.spec.registry,
          ...diff
        };
      }
    }

    if (selectedVersions.velero.version !== "None") {
      const diff = getDiff(optionDefaults["velero"], options.velero);
      generatedInstaller.spec.velero = {
        version: selectedVersions.velero.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.velero = {
          ...generatedInstaller.spec.velero,
          ...diff
        };
      }
    }

    if (selectedVersions.kotsadm.version !== "None") {
      const diff = getDiff(optionDefaults["kotsadm"], options.kotsadm);
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

    return json2yaml.stringify(generatedInstaller).replace("---\n", "").replace(/^ {2}/gm, "");
  }

  onVersionChange = name => value => {
    this.setState({ selectedVersions: { ...this.state.selectedVersions, [name]: value } }, () => {
      this.postToKurlInstaller(this.getYaml(this.state.installerSha));
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
    this.setState({
      installerErr: false,
      installerErrMsg: ""
    })
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
      } else {
        const body = await response.json();
        this.setState({
          installerErr: true,
          installerErrMsg: body.error.message
        })
      }
    } catch (err) {
      this.setState({
        installerErr: true,
        installerErrMsg: err
      })
    }
  }

  onToggleShowAdvancedOptions = (addOn) => {
    this.setState({
      showAdvancedOptions: { ...this.state.showAdvancedOptions, [addOn]: !this.state.showAdvancedOptions[addOn] }
    })
  }

  handleOptionChange = (path, currentTarget, type) => {
    let addOnData = {}
    let elementToFocus;
    const [field, key] = path.split('.');

    if (currentTarget.type === "checkbox") {
      if (type === "boolean") {
        addOnData = {
          inputValue: currentTarget.checked ? true : false,
          isChecked: currentTarget.checked
        }
      } else {
        if (type === "string") {
          addOnData = {
            inputValue: "",
            isChecked: currentTarget.checked,
          }
        } else {
          addOnData = {
            inputValue: 0,
            isChecked: currentTarget.checked,
          }
        }
      }
    } else if (currentTarget.type === "number") {
      addOnData = {
        inputValue: parseInt(currentTarget.value, 10) || 0
      }
    } else {
      addOnData = {
        inputValue: currentTarget.value
      }
    }

    this.setState({
      advancedOptions: {
        ...this.state.advancedOptions,
        [field]: {
          ...this.state.advancedOptions[field],
          [key]: Object.assign(
            {},
            this.state.advancedOptions[field][key] ? this.state.advancedOptions[field][key] : { inputValue: "", isChecked: false },
            addOnData
          )
        }
      }
    }, () => {
      if (elementToFocus) {
        const el = document.getElementById(elementToFocus);
        el.focus();
      }
      if (this.state.installerSha) {
        window.monacoEditor.setValue(this.getYaml(this.state.installerSha));
        this.postToKurlInstaller(this.getYaml(this.state.installerSha));
      }
    });
  }

  renderMonacoEditor = () => {
    import("monaco-editor").then(monaco => {
      window.monacoEditor = monaco.editor.create(document.getElementById("monaco"), {
        value: this.getYaml(this.state.installerSha),
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

    let options = {}
    versionAddOns.forEach(version => {
      options = {
        ...options,
        [version]: versionDetails[version]
      }
    })
    this.setState({ optionDefaults: options });
  }

  componentDidUpdate(lastProps, lastState) {
    if (typeof window !== "undefined") {
      if (this.state.selectedVersions !== lastState.selectedVersions && this.state.installerSha) {
        window.monacoEditor.setValue(this.getYaml(this.state.installerSha));
      }
    }
    if (this.state.installerSha !== lastState.installerSha && this.state.installerSha) {
      window.monacoEditor.setValue(this.getYaml(this.state.installerSha));
    }
  }


  renderAdvancedOptions = addOn => {
    const { advancedOptions, optionDefaults, installerErr, installerErrMsg } = this.state;
    let addOnData = [];
    if (!isEmpty(optionDefaults)) {
      addOnData = optionDefaults[addOn];

      return (
        <OptionWrapper>
          {addOnData.filter(d => d.flag !== "version").map((data, i) => {
            const option = data;
            const currentOption = find(advancedOptions[addOn], (key, value) => value === data.flag);
            const doesCurrentErrExist = installerErr ? installerErrMsg.includes(data.flag) : false;

            return (
              <div className="OptionItem flex-column" key={`${data.flag}-${i}`}>
                <div className="flex flex1 alignItems--center">
                  <div className="flex">
                    {option.type !== "boolean" ?
                      <input
                        type="checkbox"
                        name={data.flag}
                        id={`${addOn}_${data.flag}`}
                        data-focus-id={`${addOn}_${data.flag}`}
                        onChange={e => this.handleOptionChange(`${addOn}.${data.flag}`, e.currentTarget, option.type)}
                        checked={currentOption ? currentOption.isChecked : false}
                      />
                      :
                      <input
                        type="checkbox"
                        name={data.flag}
                        id={`${addOn}_${data.flag}`}
                        data-focus-id={`${addOn}_${data.flag}`}
                        onChange={e => this.handleOptionChange(`${addOn}.${data.flag}`, e.currentTarget, option.type)}
                        checked={currentOption ? currentOption.isChecked : false}
                        value={currentOption && currentOption.inputValue}
                      />
                    }
                    <label
                      className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer"
                      htmlFor={`${addOn}_${data.flag}`}>
                      <span className="flex u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center">
                        {data.flag !== "version" && data.flag}
                      </span>
                    </label>
                    <ReactTooltip id={`tt_${addOn}_${data.flag}`}>
                      {option.description}
                    </ReactTooltip>
                    <span data-tip data-for={`tt_${addOn}_${data.flag}`} className="icon clickable u-questionMarkCircle u-marginLeft--normal u-marginRight--normal"></span>
                  </div>
                  {option.type === "string" || option.type === "number" ?
                    <div>
                      <input
                        id={`${addOn}_${data.flag}`}
                        className="flex2"
                        type={option.type === "string" ? "text" : "number"}
                        onChange={e => this.handleOptionChange(`${addOn}.${data.flag}`, e.currentTarget, option.type)}
                        disabled={!currentOption || (currentOption && !currentOption.isChecked)}
                        value={currentOption ? currentOption.inputValue : ""}
                      />
                    </div>
                    : null
                  }
                </div>
                {doesCurrentErrExist ?
                  <p className="u-color--chestnut u-fontSize--normal u-fontWeight--medium u-lineHeight--normal u-marginTop--10">{installerErrMsg}</p>
                  : null}
              </div>
            )
          })}
        </OptionWrapper>
      );
    }
  }


  render() {
    const { versions, selectedVersions, installerSha, showAdvancedOptions, isLoading } = this.state;
    const { isMobile } = this.props;

    const installCommand = `curl ${process.env.API_URL}/${installerSha} | sudo bash`;

    return (
      <div className={`u-minHeight--full u-width--full u-overflow--auto flex-column flex1 u-marginBottom---40 ${isMobile ? "mobile-container" : "container"}`}>
        <div className={`u-flexTabletReflow flex1 u-width--full ${isMobile && "justifyContent--center alignItems--center"}`}>
          <div className="flex u-width--full">
            <div className="left-content-wrap flex-column u-marginRight--30">
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
                      <div className="u-fontSize--small u-fontWeight--normal u-color--scorpion u-lineHeight--normal"> What version of Kubernetes are you using? </div>
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
                      <div className="u-fontSize--small u-fontWeight--normal u-color--scorpion u-lineHeight--normal"> What version of Weave are you using? </div>
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
                      <div className="u-fontSize--small u-fontWeight--normal u-color--scorpion u-lineHeight--normal"> What version of Contour are you using? </div>
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
                      <div className="u-fontSize--small u-fontWeight--normal u-color--scorpion u-lineHeight--normal"> What version of Rook are you using? </div>
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
                      <div className="u-fontSize--small u-fontWeight--normal u-color--scorpion u-lineHeight--normal"> What version of Docker are you using? </div>
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
                      <div className="u-fontSize--small u-fontWeight--normal u-color--scorpion u-lineHeight--normal"> What version of Prometheus are you using? </div>
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
                      <div className="u-fontSize--small u-fontWeight--normal u-color--scorpion u-lineHeight--normal"> What version of Registry are you using? </div>
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
                  <div className="flex u-fontSize--small u-color--royalBlue u-marginTop--small u-cursor--pointer" onClick={() => this.onToggleShowAdvancedOptions("registry")}>
                    {showAdvancedOptions["registry"] ? "Hide advanced options" : "Show advanced options"}
                  </div>
                  {showAdvancedOptions["registry"] && this.renderAdvancedOptions("registry")}
                </div>
              </div>
              <div className="flex u-marginTop--30">
                <div className="flex-column flex flex1">
                  <div className="flex flex1">
                    <div className="flex1">
                      <div className="FormLabel u-marginBottom--10"> Velero version </div>
                      <div className="u-fontSize--small u-fontWeight--normal u-color--scorpion u-lineHeight--normal"> What version of Velero are you using? </div>
                    </div>
                    <div className="flex1 u-paddingLeft--50 alignSelf--center">
                      <div className="u-width--120">
                        <Select
                          options={versions.velero}
                          getOptionLabel={this.getLabel}
                          getOptionValue={(velero) => velero}
                          value={selectedVersions.velero}
                          onChange={this.onVersionChange("velero")}
                          matchProp="value"
                          isOptionSelected={() => false}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex u-fontSize--small u-color--royalBlue u-marginTop--small u-cursor--pointer" onClick={() => this.onToggleShowAdvancedOptions("velero")}>
                    {showAdvancedOptions["velero"] ? "Hide advanced options" : "Show advanced options"}
                  </div>
                  {showAdvancedOptions["velero"] && this.renderAdvancedOptions("velero")}
                </div>
              </div>
              <div className="flex u-marginTop--30">
                <div className="flex-column flex flex1">
                  <div className="flex flex1">
                    <div className="flex1">
                      <div className="FormLabel u-marginBottom--10"> Kotsadm version </div>
                      <div className="u-fontSize--small u-fontWeight--normal u-color--scorpion u-lineHeight--normal"> What version of Kotsadm are you using? </div>
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
              <div className="u-fontSize--small u-fontWeight--normal u-color--scorpion u-lineHeight--normal">
                As you make changes to your YAML spec a new URL will be generated. To create custom URLs or make changes to this one
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
            <span className="u-fontSize--small u-fontWeight--medium u-color--scorpion u-lineHeight--normal u-marginTop--small"> Want to add a new component to kurl? <a href="https://kurl.sh/docs/add-on-author/" target="_blank" rel="noopener noreferrer" className="replicated-link">Read our contributing</a> guide.</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Kurlsh;
