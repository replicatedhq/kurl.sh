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
import ConfirmSelectionModal from "./modals/ConfirmSelectionModal";

import "../scss/components/Kurlsh.scss";
import versionDetails from "../../static/versionDetails.json"

const hasAdvancedOptions = ["kubernetes", "weave", "contour", "rook", "registry", "docker", "velero", "kotsadm", "ekco", "fluentd", "minio", "openebs"];
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

    const containerdVersions = supportedVersions.containerd.map(versionToState);
    containerdVersions.push({ version: "None" });

    const veleroVersions = supportedVersions.velero.map(versionToState);
    veleroVersions.push({ version: "None" });

    const kotsadmVersions = supportedVersions.kotsadm.map(versionToState);
    kotsadmVersions.push({ version: "None" });

    const calicoVersions = supportedVersions.calico.map(versionToState);
    calicoVersions.push({ version: "None" });

    const ekcoVersions = supportedVersions.ekco.map(versionToState);
    ekcoVersions.push({ version: "None" });

    const fluentdVersions = supportedVersions.fluentd.map(versionToState);
    fluentdVersions.push({ version: "None" });

    const minioVersions = supportedVersions.minio.map(versionToState);
    minioVersions.push({ version: "None" });

    const openebsVersions = supportedVersions.openebs.map(versionToState);
    openebsVersions.push({ version: "None" });

    this.state = {
      versions: {
        kubernetes: kubernetesVersions,
        weave: weaveVersions,
        contour: contourVersions,
        rook: rookVersions,
        docker: dockerVersions,
        prometheus: prometheusVersions,
        registry: registryVersions,
        containerd: containerdVersions,
        velero: veleroVersions,
        kotsadm: kotsadmVersions,
        calico: calicoVersions,
        ekco: ekcoVersions,
        fluentd: fluentdVersions,
        minio: minioVersions,
        openebs: openebsVersions
      },
      selectedVersions: {
        kubernetes: { version: "latest" },
        weave: { version: "latest" },
        contour: { version: "latest" },
        rook: { version: "latest" },
        docker: { version: "latest" },
        prometheus: { version: "latest" },
        registry: { version: "latest" },
        containerd: { version: "None" },
        velero: { version: "None" },
        kotsadm: { version: "None" },
        calico: { version: "None" },
        ekco: { version: "None" },
        fluentd: { version: "None" },
        minio: { version: "None" },
        openebs: { version: "None" }
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
        "kotsadm": false,
        "ekco": false,
        "fluentd": false,
        "minio": false,
        "openebs": false
      },
      advancedOptions: {
        kubernetes: {},
        weave: {},
        contour: {},
        rook: {},
        registry: {},
        docker: {},
        velero: {},
        kotsadm: {},
        ekco: {},
        fluentd: {},
        minio: {},
        openebs: {}
      },
      isAddOnChecked: {
        weave:  true,
        contour: true,
        rook: true,
        docker: true,
        prometheus: true,
        registry: true,
        containerd: false,
        velero: false,
        kotsadm: false,
        calico: false,
        ekco: false,
        fluentd: false,
        minio: false,
        openebs: false
      },
      isLoading: false,
      optionDefaults: {},
      installerErrMsg: "",
      displayConfirmSelectionModal: false,
      currentSelection: {}
    };
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll, true);
  }

  handleScroll = () => {
    const container = document.getElementById("kurl-container");
    const scrollTop = container.scrollTop;
    const wrapper = document.getElementById("fixed-wrapper");
    if (scrollTop > 370 && !this.props.isMobile) {
      wrapper && wrapper.classList.add("FixedWrapper");
    } else {
      wrapper && wrapper.classList.remove("FixedWrapper");
    }
  }

  toggleConfirmSelection = () => {
    this.setState({ displayConfirmSelectionModal: !this.state.displayConfirmSelectionModal });
  }

  checkIncompatibleSelection = (current) => {
    this.setState({ displayConfirmSelectionModal: true, currentSelection: current });
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
      advancedOptions,
      optionDefaults
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
      const diff = getDiff(optionDefaults["contour"], options.contour);
      generatedInstaller.spec.contour = {
        version: selectedVersions.contour.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.contour = {
          ...generatedInstaller.spec.contour,
          ...diff
        };
      }
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

    if (selectedVersions.containerd.version !== "None") {
      generatedInstaller.spec.containerd = {
        version: selectedVersions.containerd.version
      };
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

    if (selectedVersions.calico.version !== "None") {
      generatedInstaller.spec.calico = {
        version: selectedVersions.calico.version
      };
    }

    if (selectedVersions.ekco.version !== "None") {
      const diff = getDiff(optionDefaults["ekco"], options.ekco);
      generatedInstaller.spec.ekco = {
        version: selectedVersions.ekco.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.ekco = {
          ...generatedInstaller.spec.ekco,
          ...diff
        };
      }
    }

    if (selectedVersions.fluentd.version !== "None") {
      const diff = getDiff(optionDefaults["fluentd"], options.fluentd);
      generatedInstaller.spec.fluentd = {
        version: selectedVersions.fluentd.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.fluentd = {
          ...generatedInstaller.spec.fluentd,
          ...diff
        };
      }
    }

    if (selectedVersions.minio.version !== "None") {
      const diff = getDiff(optionDefaults["minio"], options.minio);
      generatedInstaller.spec.minio = {
        version: selectedVersions.minio.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.minio = {
          ...generatedInstaller.spec.minio,
          ...diff
        };
      }
    }

    if (selectedVersions.openebs.version !== "None") {
      const diff = getDiff(optionDefaults["openebs"], options.openebs);
      generatedInstaller.spec.openebs = {
        version: selectedVersions.openebs.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.openebs = {
          ...generatedInstaller.spec.openebs,
          ...diff
        };
      }
    }

    return json2yaml.stringify(generatedInstaller).replace("---\n", "").replace(/^ {2}/gm, "");
  }

  onConfirmSelection = (currentSelection, addOnToRemove) => {
    this.setState({ selectedVersions: { ...this.state.selectedVersions, [Object.entries(currentSelection)[0][0]]: Object.entries(currentSelection)[0][1], [Object.entries(addOnToRemove)[0][0]]: { version: "None" } } }, () => {
      this.postToKurlInstaller(this.getYaml(this.state.installerSha));
      this.toggleConfirmSelection();
    })
  }

  onVersionChange = name => value => {
    if (name === "containerd" && value.version !== "None" && this.state.selectedVersions.docker.version !== "None") {
      this.checkIncompatibleSelection({ containerd: value });
    } else if (name === "docker" && value.version !== "None" && this.state.selectedVersions.containerd.version !== "None") {
      this.checkIncompatibleSelection({ docker: value });
    } else if (name === "calico" && value.version !== "None" && this.state.selectedVersions.weave.version !== "None") {
      this.checkIncompatibleSelection({ calico: value });
    } else if (name === "weave" && value.version !== "None" && this.state.selectedVersions.calico.version !== "None") {
      this.checkIncompatibleSelection({ weave: value });
    }
    else {
      this.setState({ selectedVersions: { ...this.state.selectedVersions, [name]: value } }, () => {
        this.postToKurlInstaller(this.getYaml(this.state.installerSha));
      })
    }
  }

  handleIsAddOnSelected = (name, e) => {
    if (!e.target.classList.contains("configDiv") && !e.target.classList.contains("addOnOption") && !e.target.classList.contains("versionLabel") && 
    !e.target.classList.contains("css-tj5bde-Svg") && !e.target.classList.contains("css-9gakcf-option") && !e.target.classList.contains(" css-1n7v3ny-option") &&
    !e.target.classList.contains("versionLabel--wrapper") && !e.target.classList.contains("css-1hwfws3")) {
      this.setState({ isAddOnChecked: {...this.state.isAddOnChecked, [name]: !this.state.isAddOnChecked[name] }}, () => {
        if (this.state.isAddOnChecked[name]) {
          if (name === "containerd" && this.state.selectedVersions.docker.version !== "None") {
            if (this.state.isAddOnChecked["docker"]) {
              this.setState({ isAddOnChecked: {...this.state.isAddOnChecked, docker: false }})
            }
            this.checkIncompatibleSelection({ containerd: { version: "latest" } });
          } else if (name === "docker" && this.state.selectedVersions.containerd.version !== "None") {
            if (this.state.isAddOnChecked["containerd"]) {
              this.setState({ isAddOnChecked: {...this.state.isAddOnChecked, containerd: false }})
            }
            this.checkIncompatibleSelection({ docker: { version: "latest" } });
          } else if (name === "calico" && this.state.selectedVersions.weave.version !== "None") {
            if (this.state.isAddOnChecked["weave"]) {
              this.setState({ isAddOnChecked: {...this.state.isAddOnChecked, weave: false }})
            }
            this.checkIncompatibleSelection({ calico: { version: "latest" } });
          } else if (name === "weave" && this.state.selectedVersions.calico.version !== "None") {
            if (this.state.isAddOnChecked["calico"]) {
              this.setState({ isAddOnChecked: {...this.state.isAddOnChecked, calico: false }})
            }
            this.checkIncompatibleSelection({ weave: { version: "latest" } });
          } else {
            this.setState({ selectedVersions: { ...this.state.selectedVersions, [name]: { version: "latest" } } }, () => {
              this.postToKurlInstaller(this.getYaml(this.state.installerSha));
            })
          }
        } else {
          this.setState({ selectedVersions: { ...this.state.selectedVersions, [name]: { version: "None" } } }, () => {
            this.postToKurlInstaller(this.getYaml(this.state.installerSha));
          })
        }
      })
    }
  }

  getLabel = ({ version }) => {
    return (
      <div className="versionLabel--wrapper">
        <span className="versionLabel" style={{ fontSize: 14 }}>{version}</span>
      </div>
    );
  }

  postToKurlInstaller = async (yaml) => {
    this.setState({ installerErrMsg: "" })
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
        this.setState({ installerErrMsg: body.error.message })
      }
    } catch (err) {
      this.setState({ installerErrMsg: err })
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
    hasAdvancedOptions.forEach(version => {
      options = {
        ...options,
        [version]: versionDetails[version]
      }
    })
    this.setState({ optionDefaults: options });
    window.addEventListener("scroll", this.handleScroll, true);
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
    const { advancedOptions, optionDefaults, installerErrMsg } = this.state;
    let addOnData = [];
    if (!isEmpty(optionDefaults)) {
      addOnData = optionDefaults[addOn];

      return (
        <OptionWrapper>
          {addOnData.filter(d => d.flag !== "version").map((data, i) => {
            const option = data;
            const currentOption = find(advancedOptions[addOn], (key, value) => value === data.flag);
            const doesCurrentErrExist = installerErrMsg ? installerErrMsg.includes(data.flag) : false;

            return (
              <div className="OptionItem flex-column" key={`${data.flag}-${i}`}>
                <div className="flex flex1 alignItems--center">
                  <div className="flex">
                    {option.type !== "boolean" ?
                      <input
                        type="checkbox"
                        className="addOnOption"
                        name={data.flag}
                        id={`${addOn}_${data.flag}`}
                        data-focus-id={`${addOn}_${data.flag}`}
                        onChange={e => this.handleOptionChange(`${addOn}.${data.flag}`, e.currentTarget, option.type)}
                        checked={currentOption ? currentOption.isChecked : false}
                      />
                      :
                      <input
                        type="checkbox"
                        className="addOnOption"
                        name={data.flag}
                        id={`${addOn}_${data.flag}`}
                        data-focus-id={`${addOn}_${data.flag}`}
                        onChange={e => this.handleOptionChange(`${addOn}.${data.flag}`, e.currentTarget, option.type)}
                        checked={currentOption ? currentOption.isChecked : false}
                        value={currentOption && currentOption.inputValue}
                      />
                    }
                    <label
                      className="flex1 u-width--full u-position--relative u-marginLeft--small u-cursor--pointer addOnOption"
                      htmlFor={`${addOn}_${data.flag}`}>
                      <span className="flex u-fontWeight--medium u-color--tuna u-fontSize--small u-lineHeight--normal alignSelf--center alignItems--center addOnOption">
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
                        className="flex2 addOnOption"
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

  scrollToAddOns = (id) => {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: "smooth" });
  }


  render() {
    const { versions, selectedVersions, installerSha, showAdvancedOptions, isLoading } = this.state;
    const { isMobile } = this.props;

    const installCommand = `curl ${process.env.API_URL}/${installerSha} | sudo bash`;


    return (
      <div className="u-minHeight--full u-width--full u-overflow--auto flex-column flex1 u-marginBottom---40 kurlContainer" id="kurl-container">
        <div className="KurlHeader flex flex-column u-borderBottom--gray">
          <div className="flex flex-column alignItems--center">
            {isMobile ? null : <p className="u-fontSize--32 u-fontWeight--bold u-color--downriver u-lineHeight--more u-marginTop--30"> kURL - Open Source Kubernetes Installer </p>}
            <span className={`${isMobile ? "u-fontSize--normal u-marginTop--10" : "u-fontSize--large"} u-fontWeight--medium u-lineHeight--more u-color--fiord u-lineHeight--more u-textAlign--center u-width--half`}>
              kURL is a custom Kubernetes distro creator. Think of kURL as a link shortener for your favorite Kubernetes base components (aka add-ons).
                It creates a unique URL for your specific components that can be installed with <code>cURL</code> on a modern Linux server.
                kURL installation packages can be run online or download and executed in a completely airgapped environment.
                kURL is <a href="https://github.com/replicatedhq/kurl/" target="_blank" rel="noopener noreferrer" className="replicated-link">open source</a> and easily extensible by contributing additional add-ons as Kustomization overlays.
              </span>
          </div>
          <div className="flex flex1 u-marginBottom--50 u-marginTop--20 alignItems--center justifyContent--center">
            <button type="button" className="Button primary" onClick={() => this.scrollToAddOns("addOnsWrapper")}>Build your installer</button>
            <Link to="/docs/introduction/" className="u-fontWeight--medium u-color--royalBlue u-lineHeight--normal u-marginLeft--20 u-fontSize--normal u-textDecoration--underlineOnHover"> View the docs </Link>
          </div>
        </div>
        <div className={`u-flexTabletReflow u-width--full u-position--relative ${isMobile ? "mobile-container flex flex-column" : "container flex1"}`} id="addOnsWrapper">
          <div className="flex flex1">
            <div className="left-content-wrap flex-column u-marginRight--30 u-width--full">
              <span className="u-fontSize--24 u-fontWeight--bold u-color--mineShaft"> Select add-ons </span>

              <div className="AddOn--wrapper selected flex flex-column u-marginTop--20">
                <div className="flex flex1">
                  <div className="flex flex1 alignItems--center">
                    <span className="icon u-kubernetes u-marginBottom--small" />
                    <div className="flex flex-column u-marginLeft--15">
                      <div className="FormLabel "> Kubernetes </div>
                      <div className="SelectVersion flex flex1" style={{ width: "200px" }}>
                        <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> Version </span>
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
                  <div className="flex flex1 justifyContent--flexEnd alignItems--center">
                    <div className="flex u-fontSize--small u-fontWeight--medium u-color--royalBlue u-marginTop--small u-cursor--pointer configDiv" onClick={() => this.onToggleShowAdvancedOptions("kubernetes")}>
                      {showAdvancedOptions["kubernetes"] ? "Hide config" : "Show config"}
                    </div>
                  </div>
                </div>
                {showAdvancedOptions["kubernetes"] && this.renderAdvancedOptions("kubernetes")}
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> CRI </span>
                <div className={`AddOn--wrapper ${selectedVersions.docker.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("docker", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.docker.version !== "None"}
                      />
                      <span className="icon u-docker u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15">
                        <div className="FormLabel "> Docker </div>
                        <div className="SelectVersion flex flex1" style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> Version </span>
                          <Select
                            options={versions.docker}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(docker) => docker}
                            value={selectedVersions.docker}
                            onChange={this.onVersionChange("docker")}
                            matchProp="value"
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex1 justifyContent--flexEnd alignItems--center">
                      <div className="flex u-fontSize--small u-fontWeight--medium u-color--royalBlue u-marginTop--small u-cursor--pointer configDiv" onClick={() => this.onToggleShowAdvancedOptions("docker")}>
                        {showAdvancedOptions["docker"] ? "Hide config" : "Show config"}
                      </div>
                    </div>
                  </div>
                  {showAdvancedOptions["docker"] && this.renderAdvancedOptions("docker")}
                </div>
                <div className={`AddOn--wrapper ${selectedVersions.containerd.version !== "None" && "selected"} flex flex-column u-marginTop--15`}  onClick={(e) => this.handleIsAddOnSelected("containerd", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.containerd.version !== "None"}
                      />
                      <span className="icon u-containerd u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15">
                        <div className="FormLabel"> Containerd </div>
                        <div className="SelectVersion flex flex1" style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> Version </span>
                          <Select
                            options={versions.containerd}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(containerd) => containerd}
                            value={selectedVersions.containerd}
                            onChange={this.onVersionChange("containerd")}
                            matchProp="value"
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> CNI plugin </span>
                <div className={`AddOn--wrapper ${selectedVersions.calico.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("calico", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.calico.version !== "None"}
                      />
                      <span className="icon u-calico u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15">
                        <div className="FormLabel"> Calico </div>
                        <div className="SelectVersion flex flex1" style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> Version </span>
                          <Select
                            options={versions.calico}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(calico) => calico}
                            value={selectedVersions.calico}
                            onChange={this.onVersionChange("calico")}
                            matchProp="value"
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`AddOn--wrapper ${selectedVersions.weave.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("weave", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.weave.version !== "None"}
                      />
                      <span className="icon u-weave u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15">
                        <div className="FormLabel"> Weave </div>
                        <div className="SelectVersion flex flex1" style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> Version </span>
                          <Select
                            options={versions.weave}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(weave) => weave}
                            value={selectedVersions.weave}
                            onChange={this.onVersionChange("weave")}
                            matchProp="value"
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex1 justifyContent--flexEnd alignItems--center">
                      <div className="flex u-fontSize--small u-fontWeight--medium u-color--royalBlue u-marginTop--small u-cursor--pointer configDiv" onClick={() => this.onToggleShowAdvancedOptions("weave")}>
                        {showAdvancedOptions["weave"] ? "Hide config" : "Show config"}
                      </div>
                    </div>
                  </div>
                  {showAdvancedOptions["weave"] && this.renderAdvancedOptions("weave")}
                </div>
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> Ingress </span>
                <div className={`AddOn--wrapper ${selectedVersions.contour.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("contour", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.contour.version !== "None"}
                      />
                      <span className="icon u-contour u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15">
                        <div className="FormLabel"> Contour </div>
                        <div className="SelectVersion flex flex1" style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> Version </span>
                          <Select
                            options={versions.contour}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(contour) => contour}
                            value={selectedVersions.contour}
                            onChange={this.onVersionChange("contour")}
                            matchProp="value"
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex1 justifyContent--flexEnd alignItems--center">
                      <div className="flex u-fontSize--small u-fontWeight--medium u-color--royalBlue u-marginTop--small u-cursor--pointer configDiv" onClick={() => this.onToggleShowAdvancedOptions("contour")}>
                        {showAdvancedOptions["contour"] ? "Hide config" : "Show config"}
                      </div>
                    </div>
                  </div>
                  {showAdvancedOptions["contour"] && this.renderAdvancedOptions("contour")}
                </div>
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> Cluster Administration </span>
                <div className={`AddOn--wrapper ${selectedVersions.ekco.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("ekco", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.ekco.version !== "None"}
                      />
                      <span className="icon u-kubernetes u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15">
                        <div className="FormLabel"> EKCO </div>
                        <div className="SelectVersion flex flex1" style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> Version </span>
                          <Select
                            options={versions.ekco}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(ekco) => ekco}
                            value={selectedVersions.ekco}
                            onChange={this.onVersionChange("ekco")}
                            matchProp="value"
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex1 justifyContent--flexEnd alignItems--center">
                      <div className="flex u-fontSize--small u-fontWeight--medium u-color--royalBlue u-marginTop--small u-cursor--pointer configDiv" onClick={() => this.onToggleShowAdvancedOptions("ekco")}>
                        {showAdvancedOptions["ekco"] ? "Hide config" : "Show config"}
                      </div>
                    </div>
                  </div>
                  {showAdvancedOptions["ekco"] && this.renderAdvancedOptions("ekco")}
                </div>
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> Logs </span>
                <div className={`AddOn--wrapper ${selectedVersions.fluentd.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("fluentd", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.fluentd.version !== "None"}
                      />
                      <span className="icon u-fluentd u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15">
                        <div className="FormLabel"> Fluentd </div>
                        <div className="SelectVersion flex flex1" style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> Version </span>
                          <Select
                            options={versions.fluentd}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(fluentd) => fluentd}
                            value={selectedVersions.fluentd}
                            onChange={this.onVersionChange("fluentd")}
                            matchProp="value"
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex1 justifyContent--flexEnd alignItems--center">
                      <div className="flex u-fontSize--small u-fontWeight--medium u-color--royalBlue u-marginTop--small u-cursor--pointer configDiv" onClick={() => this.onToggleShowAdvancedOptions("fluentd")}>
                        {showAdvancedOptions["fluentd"] ? "Hide config" : "Show config"}
                      </div>
                    </div>
                  </div>
                  {showAdvancedOptions["fluentd"] && this.renderAdvancedOptions("fluentd")}
                </div>
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> Application Management </span>
                <div className={`AddOn--wrapper ${selectedVersions.kotsadm.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("kotsadm", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.kotsadm.version !== "None"}
                      />
                      <span className="icon u-kotsadm u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15">
                        <div className="FormLabel"> KOTS </div>
                        <div className="SelectVersion flex flex1" style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> Version </span>
                          <Select
                            options={versions.kotsadm}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(kotsadm) => kotsadm}
                            value={selectedVersions.kotsadm}
                            onChange={this.onVersionChange("kotsadm")}
                            matchProp="value"
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex1 justifyContent--flexEnd alignItems--center">
                      <div className="flex u-fontSize--small u-fontWeight--medium u-color--royalBlue u-marginTop--small u-cursor--pointer configDiv" onClick={() => this.onToggleShowAdvancedOptions("kotsadm")}>
                        {showAdvancedOptions["kotsadm"] ? "Hide config" : "Show config"}
                      </div>
                    </div>
                  </div>
                  {showAdvancedOptions["kotsadm"] && this.renderAdvancedOptions("kotsadm")}
                </div>
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> Object Store </span>
                <div className={`AddOn--wrapper ${selectedVersions.minio.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("minio", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.minio.version !== "None"}
                      />
                      <span className="icon u-minio u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15">
                        <div className="FormLabel"> Minio </div>
                        <div className="SelectVersion flex flex1" style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> Version </span>
                          <Select
                            options={versions.minio}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(minio) => minio}
                            value={selectedVersions.minio}
                            onChange={this.onVersionChange("minio")}
                            matchProp="value"
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex1 justifyContent--flexEnd alignItems--center">
                      <div className="flex u-fontSize--small u-fontWeight--medium u-color--royalBlue u-marginTop--small u-cursor--pointer configDiv" onClick={() => this.onToggleShowAdvancedOptions("minio")}>
                        {showAdvancedOptions["minio"] ? "Hide config" : "Show config"}
                      </div>
                    </div>
                  </div>
                  {showAdvancedOptions["minio"] && this.renderAdvancedOptions("minio")}
                </div>

                <div className={`AddOn--wrapper ${selectedVersions.rook.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("rook", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.rook.version !== "None"}
                      />
                      <span className="icon u-rook u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15">
                        <div className="FormLabel"> Rook </div>
                        <div className="SelectVersion flex flex1" style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> Version </span>
                          <Select
                            options={versions.rook}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(rook) => rook}
                            value={selectedVersions.rook}
                            onChange={this.onVersionChange("rook")}
                            matchProp="value"
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex1 justifyContent--flexEnd alignItems--center">
                      <div className="flex u-fontSize--small u-fontWeight--medium u-color--royalBlue u-marginTop--small u-cursor--pointer configDiv" onClick={() => this.onToggleShowAdvancedOptions("rook")}>
                        {showAdvancedOptions["rook"] ? "Hide config" : "Show config"}
                      </div>
                    </div>
                  </div>
                  {showAdvancedOptions["rook"] && this.renderAdvancedOptions("rook")}
                </div>
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> PVC Provisioner </span>
                <div className={`AddOn--wrapper ${selectedVersions.openebs.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("openebs", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.openebs.version !== "None"}
                      />
                      <span className="icon u-openebs u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15">
                        <div className="FormLabel"> openEBS </div>
                        <div className="SelectVersion flex flex1" style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> Version </span>
                          <Select
                            options={versions.openebs}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(openebs) => openebs}
                            value={selectedVersions.openebs}
                            onChange={this.onVersionChange("openebs")}
                            matchProp="value"
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex1 justifyContent--flexEnd alignItems--center">
                      <div className="flex u-fontSize--small u-fontWeight--medium u-color--royalBlue u-marginTop--small u-cursor--pointer configDiv" onClick={() => this.onToggleShowAdvancedOptions("openebs")}>
                        {showAdvancedOptions["openebs"] ? "Hide config" : "Show config"}
                      </div>
                    </div>
                  </div>
                  {showAdvancedOptions["openebs"] && this.renderAdvancedOptions("openebs")}
                </div>
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> Metrics & Monitoring </span>
                <div className={`AddOn--wrapper ${selectedVersions.prometheus.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("prometheus", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.prometheus.version !== "None"}
                      />
                      <span className="icon u-prometheus u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15">
                        <div className="FormLabel"> Prometheus </div>
                        <div className="SelectVersion flex flex1" style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> Version </span>
                          <Select
                            options={versions.prometheus}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(prometheus) => prometheus}
                            value={selectedVersions.prometheus}
                            onChange={this.onVersionChange("prometheus")}
                            matchProp="value"
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> Registry </span>
                <div className={`AddOn--wrapper ${selectedVersions.registry.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("registry", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.registry.version !== "None"}
                      />
                      <span className="icon u-registry u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15">
                        <div className="FormLabel"> Docker Registry </div>
                        <div className="SelectVersion flex flex1" style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> Version </span>
                          <Select
                            options={versions.registry}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(registry) => registry}
                            value={selectedVersions.registry}
                            onChange={this.onVersionChange("registry")}
                            matchProp="value"
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex1 justifyContent--flexEnd alignItems--center">
                      <div className="flex u-fontSize--small u-fontWeight--medium u-color--royalBlue u-marginTop--small u-cursor--pointer configDiv" onClick={() => this.onToggleShowAdvancedOptions("registry")}>
                        {showAdvancedOptions["registry"] ? "Hide config" : "Show config"}
                      </div>
                    </div>
                  </div>
                  {showAdvancedOptions["registry"] && this.renderAdvancedOptions("registry")}
                </div>
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> Snapshots </span>
                <div className={`AddOn--wrapper ${selectedVersions.velero.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("velero", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.velero.version !== "None"}
                      />
                      <span className="icon u-velero u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15">
                        <div className="FormLabel"> Velero </div>
                        <div className="SelectVersion flex flex1" style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> Version </span>
                          <Select
                            options={versions.velero}
                            getOptionLabel={this.getLabel}
                            getOptionValue={(velero) => velero}
                            value={selectedVersions.velero}
                            onChange={this.onVersionChange("velero")}
                            matchProp="value"
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex1 justifyContent--flexEnd alignItems--center">
                      <div className="flex u-fontSize--small u-fontWeight--medium u-fontWeight--medium u-color--royalBlue u-marginTop--small u-cursor--pointer" onClick={() => this.onToggleShowAdvancedOptions("velero")}>
                        {showAdvancedOptions["velero"] ? "Hide config" : "Show config"}
                      </div>
                    </div>
                  </div>
                  {showAdvancedOptions["velero"] && this.renderAdvancedOptions("velero")}
                </div>
              </div>

            </div>
          </div>

          {/* Spacer div the same width as the sidebar where the editor lives */}
          <div className="flex-column flex1" style={{ maxWidth: "400px" }} />

          <div className={`flex-column flex1 ${isMobile ? "u-marginTop--30" : "AbsoulteFixedWrapper"}`} id="fixed-wrapper">
            <span className="u-fontSize--24 u-fontWeight--bold u-color--mineShaft"> Installer YAML </span>
            <div className="MonacoEditor--wrapper flex u-width--full u-marginTop--20">
              <div className="flex u-width--full u-overflow--hidden" id="monaco">
                {isLoading &&
                  <div className="flex-column flex-1-auto u-overflow--hidden justifyContent--center alignItems--center">
                    <Loader
                      size="70"
                    />
                  </div>}
              </div>
            </div>
            <div className="flex-column installationForm u-marginTop--30">
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
        {this.state.displayConfirmSelectionModal &&
          <ConfirmSelectionModal
            displayConfirmSelectionModal={this.state.displayConfirmSelectionModal}
            toggleConfirmSelection={this.toggleConfirmSelection}
            currentSelection={this.state.currentSelection}
            selectedVersions={this.state.selectedVersions}
            onConfirmSelection={this.onConfirmSelection}
          />}
      </div>
    );
  }
}

export default Kurlsh;