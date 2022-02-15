import * as React from "react";
import { Link } from "@reach/router";

import ReactTooltip from "react-tooltip";
import json2yaml from "json2yaml";
import Select from "react-select";
import isEmpty from "lodash/isEmpty";
import find from "lodash/find";
import semver from "semver";

import CodeSnippet from "./shared/CodeSnippet";
import Loader from "./shared/Loader";
import OptionWrapper from "./shared/OptionWrapper";
import ConfirmSelectionModal from "./modals/ConfirmSelectionModal";

import "../scss/components/Kurlsh.scss";
import versionDetails from "../../static/versionDetails.json"
import _ from "lodash";

const NIL_VERSIONS = {
  kubernetes: { version: "None" },
  rke2: { version: "None" },
  k3s: { version: "None" },
  weave: { version: "None" },
  antrea: { version: "None" },
  contour: { version: "None" },
  rook: { version: "None" },
  docker: { version: "None" },
  prometheus: { version: "None" },
  registry: { version: "None" },
  containerd: { version: "None" },
  velero: { version: "None" },
  kotsadm: { version: "None" },
  ekco: { version: "None" },
  fluentd: { version: "None" },
  minio: { version: "None" },
  openebs: { version: "None" },
  longhorn: { version: "None" },
  collectd: { version: "None" },
  metricsServer: { version: "None" },
  certManager: { version: "None" },
  sonobuoy: { version: "None" },
  goldpinger: { version: "None" }
}
const hasAdvancedOptions = ["kubernetes", "weave", "antrea", "contour", "rook", "registry", "docker", "velero", "kotsadm", "ekco", "fluentd", "minio", "openebs", "longhorn", "prometheus"];
function versionToState(version) {
  return {
    version
  };
}

class Kurlsh extends React.Component {
  constructor(props) {
    super(props);
    const { supportedVersions } = props;

    const kubernetesVersions = this.addDotXVersions(supportedVersions.kubernetes.map(versionToState));
    kubernetesVersions.push({version: "None"});

    const rke2Versions = this.addDotXVersions(supportedVersions.rke2.map(versionToState));
    rke2Versions.push({version: "None"});

    const k3sVersions = this.addDotXVersions(supportedVersions.k3s.map(versionToState));
    k3sVersions.push({version: "None"});

    const contourVersions = this.addDotXVersions(supportedVersions.contour.map(versionToState));
    contourVersions.push({ version: "None" });

    const weaveVersions = this.addDotXVersions(supportedVersions.weave.map(versionToState));
    weaveVersions.push({ version: "None" });

    const antreaVersions = this.addDotXVersions(supportedVersions.antrea.map(versionToState));
    antreaVersions.push({ version: "None" });

    const rookVersions = this.addDotXVersions(supportedVersions.rook.map(versionToState));
    rookVersions.push({ version: "None" });

    const dockerVersions = this.addDotXVersions(supportedVersions.docker.map(versionToState));
    dockerVersions.push({ version: "None" });

    const prometheusVersions = this.addDotXVersions(supportedVersions.prometheus.map(versionToState));
    prometheusVersions.push({ version: "None" });

    const registryVersions = this.addDotXVersions(supportedVersions.registry.map(versionToState));
    registryVersions.push({ version: "None" });

    const containerdVersions = this.addDotXVersions(supportedVersions.containerd.map(versionToState));
    containerdVersions.push({ version: "None" });

    const veleroVersions = this.addDotXVersions(supportedVersions.velero.map(versionToState));
    veleroVersions.push({ version: "None" });

    const kotsadmVersions = this.addDotXVersions(supportedVersions.kotsadm.map(versionToState));
    kotsadmVersions.push({ version: "None" });

    const ekcoVersions = this.addDotXVersions(supportedVersions.ekco.map(versionToState));
    ekcoVersions.push({ version: "None" });

    const fluentdVersions = this.addDotXVersions(supportedVersions.fluentd.map(versionToState));
    fluentdVersions.push({ version: "None" });

    const minioVersions = this.addDotXVersions(supportedVersions.minio.map(versionToState));
    minioVersions.push({ version: "None" });

    const openebsVersions = this.addDotXVersions(supportedVersions.openebs.map(versionToState));
    openebsVersions.push({ version: "None" });

    const longhornVersions = this.addDotXVersions(supportedVersions.longhorn.map(versionToState));
    longhornVersions.push({ version: "None" });

    const collectdVersions = this.addDotXVersions(supportedVersions.collectd.map(versionToState));
    collectdVersions.push({ version: "None" });

    const metricsServerVersions = this.addDotXVersions(supportedVersions["metrics-server"].map(versionToState));
    metricsServerVersions.push({ version: "None" });

    const certManagerVersions = this.addDotXVersions(supportedVersions["cert-manager"].map(versionToState));
    certManagerVersions.push({ version: "None" });

    const sonobuoyVersions = this.addDotXVersions(supportedVersions["sonobuoy"].map(versionToState));
    sonobuoyVersions.push({ version: "None" });

    const goldpingerVersions = this.addDotXVersions(supportedVersions["goldpinger"].map(versionToState));
    goldpingerVersions.push({ version: "None" });

    this.state = {
      versions: {
        kubernetes: kubernetesVersions,
        rke2: rke2Versions,
        k3s: k3sVersions,
        weave: weaveVersions,
        antrea: antreaVersions,
        contour: contourVersions,
        rook: rookVersions,
        docker: dockerVersions,
        prometheus: prometheusVersions,
        registry: registryVersions,
        containerd: containerdVersions,
        velero: veleroVersions,
        kotsadm: kotsadmVersions,
        ekco: ekcoVersions,
        fluentd: fluentdVersions,
        minio: minioVersions,
        openebs: openebsVersions,
        longhorn: longhornVersions,
        collectd: collectdVersions,
        metricsServer: metricsServerVersions,
        certManager: certManagerVersions,
        sonobuoy: sonobuoyVersions,
        goldpinger: goldpingerVersions
      },
      selectedVersions: NIL_VERSIONS,
      installerSha: "",
      showAdvancedOptions: {
        "kubernetes": false,
        "rke2": false,
        "k3s": false,
        "weave": false,
        "antrea": false,
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
        "openebs": false,
        "longhorn": false,
        "metricsServer": false,
        "certManager": false,
        "sonobuoy": false,
        "goldpinger": false
      },
      advancedOptions: {
        kubernetes: {},
        rke2: {},
        k3s: {},
        weave: {},
        antrea: {},
        contour: {},
        rook: {},
        registry: {},
        docker: {},
        velero: {},
        kotsadm: {},
        ekco: {},
        fluentd: {},
        minio: {},
        openebs: {},
        longhorn: {},
        collectd: {},
        metricsServer: {},
        certManager: {},
        sonobuoy: {},
        goldpinger: {},
        prometheus: {},
      },
      isAddOnChecked: {
        kubernetes: false,
        rke2: false,
        k3s: false,  
        weave: false,
        antrea: false,
        contour: false,
        rook: false,
        docker: false,
        prometheus: false,
        registry: false,
        containerd: false,
        velero: false,
        kotsadm: false,
        ekco: false,
        fluentd: false,
        minio: false,
        openebs: false,
        longhorn: false,
        collectd: false,
        metricsServer: false,
        certManager: false,
        sonobuoy: false,
        goldpinger: false,
      },
      isEditorLoading: false,
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

  toggleConfirmSelection = (currentSelection) => {
    if (currentSelection) {
      this.setState({
        displayConfirmSelectionModal: !this.state.displayConfirmSelectionModal,
        isAddOnChecked: { ...this.state.isAddOnChecked, [Object.keys(currentSelection)[0]]: false }
      });
    } else {
      this.setState({
        displayConfirmSelectionModal: !this.state.displayConfirmSelectionModal
      });
    }
  }

  checkIncompatibleSelection = (current) => {
    this.setState({ displayConfirmSelectionModal: true, currentSelection: current });
  }

  helperToGenerateOptionsForYaml = (advancedOptionSelections, addonVersionDetails) => {
    let result = {};

    const defaultObj = {}
    if (addonVersionDetails) {
        addonVersionDetails.forEach(attribute => {
            defaultObj[attribute.flag] = attribute;
        })
    }

    for (let i = 0; i < Object.keys(advancedOptionSelections).length; ++i) {
      const addonPropertyName = Object.keys(advancedOptionSelections)[i];

      const checkedAndDoesntHaveDefault = advancedOptionSelections[addonPropertyName].isChecked && defaultObj[addonPropertyName].defaultValue === undefined
      const checkedAndHasFalseDefault = advancedOptionSelections[addonPropertyName].isChecked && !defaultObj[addonPropertyName].defaultValue
      const uncheckedAndHasTrueDefault = !advancedOptionSelections[addonPropertyName].isChecked && defaultObj[addonPropertyName].defaultValue

      if ( checkedAndDoesntHaveDefault || checkedAndHasFalseDefault || uncheckedAndHasTrueDefault ) {
        result[addonPropertyName] = advancedOptionSelections[addonPropertyName].inputValue
      }
    }
    return result;
  }

  generateAdvancedOptionsForYaml = (advancedOptions, optionDefaults) => {
    let result = {};
    for (let i = 0; i < Object.keys(advancedOptions).length; ++i) {
      const objX = Object.keys(advancedOptions)[i];
      result[objX] = this.helperToGenerateOptionsForYaml(advancedOptions[objX], optionDefaults[objX])
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

    const options = this.generateAdvancedOptionsForYaml(advancedOptions, optionDefaults);

    if (selectedVersions.kubernetes.version !== "None") {
      const diff = getDiff(optionDefaults["kubernetes"], options.kubernetes);

      generatedInstaller.spec.kubernetes = {
        version: selectedVersions.kubernetes.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.kubernetes = {
          ...generatedInstaller.spec.kubernetes,
          ...diff
        };
      }
    }

    if (selectedVersions.rke2.version !== "None") {
      const diff = getDiff(optionDefaults["rke2"], options.rke2);

      generatedInstaller.spec.rke2 = {
        version: selectedVersions.rke2.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.rke2 = {
          ...generatedInstaller.spec.rke2,
          ...diff
        };
      }
    }

    if (selectedVersions.k3s.version !== "None") {
      const diff = getDiff(optionDefaults["k3s"], options.k3s);

      generatedInstaller.spec.k3s = {
        version: selectedVersions.k3s.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.k3s = {
          ...generatedInstaller.spec.k3s,
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

    if (selectedVersions.antrea.version !== "None") {
      const diff = getDiff(optionDefaults["antrea"], options.antrea);
      generatedInstaller.spec.antrea = {
        version: selectedVersions.antrea.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.antrea = {
          ...generatedInstaller.spec.antrea,
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
      const diff = getDiff(optionDefaults["prometheus"], options.prometheus);
      generatedInstaller.spec.prometheus = {
        version: selectedVersions.prometheus.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.prometheus = {
          ...generatedInstaller.spec.prometheus,
          ...diff
        };
      }
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

    if (selectedVersions.longhorn.version !== "None") {
      const diff = getDiff(optionDefaults["longhorn"], options.longhorn);
      generatedInstaller.spec.longhorn = {
        version: selectedVersions.longhorn.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.longhorn = {
          ...generatedInstaller.spec.longhorn,
          ...diff
        };
      }
    }

    if (selectedVersions.collectd.version !== "None") {
      const diff = getDiff(optionDefaults["collectd"], options.collectd);
      generatedInstaller.spec.collectd = {
        version: selectedVersions.collectd.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.collectd = {
          ...generatedInstaller.spec.collectd,
          ...diff
        };
      }
    }

    if (selectedVersions.metricsServer.version !== "None") {
      const diff = getDiff(optionDefaults["metricsServer"], options.metricsServer);
      generatedInstaller.spec.metricsServer = {
        version: selectedVersions.metricsServer.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.metricsServer = {
          ...generatedInstaller.spec.metricsServer,
          ...diff
        };
      }
    }

    if (selectedVersions.certManager.version !== "None") {
      const diff = getDiff(optionDefaults["certManager"], options.certManager);
      generatedInstaller.spec.certManager = {
        version: selectedVersions.certManager.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.certManager = {
          ...generatedInstaller.spec.certManager,
          ...diff
        };
      }
    }

    if (selectedVersions.sonobuoy.version !== "None") {
      const diff = getDiff(optionDefaults["sonobuoy"], options.sonobuoy);
      generatedInstaller.spec.sonobuoy = {
        version: selectedVersions.sonobuoy.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.sonobuoy = {
          ...generatedInstaller.spec.sonobuoy,
          ...diff
        };
      }
    }

    if (selectedVersions.goldpinger.version !== "None") {
      const diff = getDiff(optionDefaults["goldpinger"], options.goldpinger);
      generatedInstaller.spec.goldpinger = {
        version: selectedVersions.goldpinger.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.goldpinger = {
          ...generatedInstaller.spec.goldpinger,
          ...diff
        };
      }
    }

    return json2yaml.stringify(generatedInstaller).replace("---\n", "").replace(/^ {2}/gm, "");
  }

  onConfirmSelection = (currentSelection, addOnToRemove) => {
    this.setState({
      selectedVersions: { ...this.state.selectedVersions, [Object.entries(currentSelection)[0][0]]: Object.entries(currentSelection)[0][1], [Object.entries(addOnToRemove)[0][0]]: { version: "None" } },
      isAddOnChecked: { ...this.state.isAddOnChecked, [Object.keys(addOnToRemove)[0]]: false }
    }, () => {
      this.postToKurlInstaller(this.getYaml(this.state.installerSha));
      this.toggleConfirmSelection();
    })
  }

  onVersionChange = name => value => {
    if (name === "kubernetes" || name === "rke2" || name === "k3s") {
      if (value.version === "None") {
        // can't be deselected, deselection happens when changing between them
        return;
      }
    }
    if (name === "containerd" && value.version !== "None" && this.state.selectedVersions.docker.version !== "None") {
      this.checkIncompatibleSelection({ containerd: value });
    } else if (name === "docker" && value.version !== "None" && this.state.selectedVersions.containerd.version !== "None") {
      this.checkIncompatibleSelection({ docker: value });
    } else if (name === "antrea" && value.version !== "None" && this.state.selectedVersions.weave.version !== "None") {
      this.checkIncompatibleSelection({ antrea: value });
    } else if (name === "weave" && value.version !== "None" && this.state.selectedVersions.antrea.version !== "None") {
      this.checkIncompatibleSelection({ weave: value });
    } else {
      this.setState({ selectedVersions: { ...this.state.selectedVersions, [name]: value } }, () => {
        if (value.version === "None") {
          this.setState({ isAddOnChecked: { ...this.state.isAddOnChecked, [name]: !this.state.isAddOnChecked[name] } })
        }
        this.postToKurlInstaller(this.getYaml(this.state.installerSha));
      })
    }
  }

  handleIsAddOnSelected = (name, e) => {
    if (!e.target.classList.contains("configDiv") && !e.target.classList.contains("addOnOption") && !e.target.classList.contains("versionLabel") &&
      !e.target.classList.contains("css-19bqh2r") && !e.target.classList.contains("css-tj5bde-Svg") && !e.target.classList.contains("css-9gakcf-option") && !e.target.classList.contains("css-1n7v3ny-option") &&
      !e.target.classList.contains("versionLabel--wrapper") && !e.target.classList.contains("css-1hwfws3") && e.target.localName !== "path" && !e.target.classList.contains("SelectVersion") &&
      !e.target.classList.contains("css-tlfecz-indicatorContainer") && !e.target.classList.contains("css-1gtu0rj-indicatorContainer") && !e.target.classList.contains("css-1g48xl4-IndicatorsContainer") && 
      !e.target.classList.contains("AdvancedOptions--wrapper") &&  !e.target.classList.contains("Option--wrapper"))
    {
      if (name === "kubernetes" || name === "rke2" || name === "k3s") {
        if (this.state.isAddOnChecked[name]) {
          // can't be deselected, deselection happens when changing between them
          return;
        }
      }
      this.setState({ isAddOnChecked: { ...this.state.isAddOnChecked, [name]: !this.state.isAddOnChecked[name] } }, () => {
        if (this.state.isAddOnChecked[name]) {
          if (name === "kubernetes") {
            const selectedVersions = {...this.state.selectedVersions, kubernetes: { version: "latest" }};
            selectedVersions["k3s"] = { version: "None" };
            selectedVersions["rke2"] = { version: "None" };
            this.setState({ selectedVersions }, () => this.postToKurlInstaller(this.getYaml(this.state.installerSha)));
          } else if (name === "rke2") {
            this.setState({ selectedVersions: NIL_VERSIONS}, () => this.getKurlInstaller("rke2"));
          } else if (name === "k3s") {
            this.setState({ selectedVersions: NIL_VERSIONS}, () => this.getKurlInstaller("k3s"));
          } else if (name === "containerd" && this.state.selectedVersions.docker.version !== "None") {
            this.checkIncompatibleSelection({ containerd: { version: "latest" } });
          } else if (name === "docker" && this.state.selectedVersions.containerd.version !== "None") {
            this.checkIncompatibleSelection({ docker: { version: "latest" } });
          } else if (name === "weave" && this.state.selectedVersions.antrea.version !== "None") {
            this.checkIncompatibleSelection({ weave: { version: "latest" } });
          } else if (name === "antrea" && this.state.selectedVersions.weave.version !== "None") {
            this.checkIncompatibleSelection({ antrea: { version: "latest" } });
          } else {
            this.setState({ selectedVersions: { ...this.state.selectedVersions, [name]: { version: "latest" } } }, () => {
              this.postToKurlInstaller(this.getYaml(this.state.installerSha));
            });
          }
        } else {
          this.setState({ selectedVersions: { ...this.state.selectedVersions, [name]: { version: "None" } } }, () => {
            this.postToKurlInstaller(this.getYaml(this.state.installerSha));
          });
        }
      });
    }
  }

  getLabel = name => ({ version }) => {
    const generatedVersion = this.generateVersionLabel(name, version);
    return (
      <div className="versionLabel--wrapper">
        <span className="versionLabel" style={{ fontSize: 14 }}>{generatedVersion}</span>
      </div>
    );
  }

  generateVersionLabel = (name, version) => {
    if (version === "latest") {
      let latest = this.state.versions[name][1];
      if (latest.version.indexOf(".x") !== -1) {
        latest = this.state.versions[name][2]; // the first version is a ".x" version
      }
      version = `latest (${latest.version})`;
    } else if (version.endsWith(".x")) {
      const versionIndex = this.state.versions[name].findIndex((element) => element.version === version);
      if (this.state.versions[name].length > versionIndex) { // if there is a member of the array after the one specified
        const next = this.state.versions[name][versionIndex+1]
        version = `${version} (${next.version})`
      }
    }
    return version;
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
        this.setState({ installerErrMsg: body.error.message || "something went wrong" });
      }
    } catch (err) {
      this.setState({ installerErrMsg: `${err}` });
    }
  }

  getKurlInstaller = async (installerSha) => {
    this.setState({ installerErrMsg: "" })
    const url = `${process.env.KURL_INSTALLER_URL}/${installerSha || "latest"}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });
      if (response.ok) {
        const res = await response.json();

        const advancedOptions = _.defaults(_.mapValues(res.spec, (value) => _.omit(value, ["version"])), _.mapValues(this.state.advancedOptions, () => { return {} }));
        for (const addonName in advancedOptions) {
          const addOnFlags = advancedOptions[addonName];
          for (const flag in addOnFlags) {
            addOnFlags[flag] = {
              inputValue: addOnFlags[flag],
              isChecked: true
            };
          }
        }

        const state = {
          installerSha: installerSha || "latest",
          isAddOnChecked: _.defaults(_.mapValues(res.spec, (value) => (_.get(value, "version") || "None") !== "None"), _.mapValues(this.state.isAddOnChecked, () => false)),
          selectedVersions: _.defaults(_.mapValues(res.spec, (value) => _.pick(value, ["version"])), _.mapValues(this.state.selectedVersions, () => { return { version: "None" } })),
          showAdvancedOptions: _.defaults(_.mapValues(res.spec, (value) => !_.isEmpty(_.omit(value, ["version"]))), _.mapValues(this.state.showAdvancedOptions, () => false)),
          advancedOptions: advancedOptions,
        };
        this.setState(state);
      } else {
        const body = await response.json();
        this.setState({ installerErrMsg: body.error.message || "something went wrong" });
      }
    } catch (err) {
      this.setState({ installerErrMsg: `${err}` });
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
      if (this.state.installerSha && window.monacoEditor) {
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
      this.setState({ isEditorLoading: false });
    });
  }

  componentDidMount() {
    this.setState({
      isEditorLoading: true
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

    this.getKurlInstaller("latest");
  }


  componentDidUpdate(lastProps, lastState) {
    if (typeof window !== "undefined") {
      if (this.state.selectedVersions !== lastState.selectedVersions && this.state.installerSha && window.monacoEditor) {
        window.monacoEditor.setValue(this.getYaml(this.state.installerSha));
      }
    }
    if (this.state.installerSha !== lastState.installerSha && this.state.installerSha && window.monacoEditor) {
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
                <div className="Option--wrapper flex flex1 alignItems--center">
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
                        checked={currentOption ? currentOption.isChecked : option.defaultValue ? true : false }     // Need the literals here to keep component controlled
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

  renderVersionError = (errorMsg) => {
    return (
      <div className="AbsoluteErrorWrapper">
        <p> {errorMsg} </p>
      </div>
    )
  }

  checkKotsVeleroIncompatibility = (veleroVersion, kotsVersion) => {
    if (veleroVersion !== "None" && kotsVersion !== "None") {
      if (kotsVersion === "latest") {
        kotsVersion = this.state.versions.kotsadm[1].version;
      }
      if (veleroVersion === "1.2.0" && semver.gt(kotsVersion, "1.20.2")) {
        return true;
      }
    }
  }

  // add versions like "1.19.x" to the list of installable versions
  addDotXVersions = (actualVersions) => {
    // get a list of the distinct minor versions
    const minorVersionsRegex = /(^[0-9]+\.[0-9]+)\.[0-9]+/;
    let minorVersions = [];
    actualVersions.forEach(v => {
      const matches = v.version.match(minorVersionsRegex);
      if (matches && matches.length > 1 && !minorVersions.includes(matches[1])) {
        minorVersions.push(matches[1]);
      }
    })
    // for each minor version, find the first version in the actualVersions array that matches
    // and insert `1.minor.x` before it
    minorVersions.forEach(mv => {
      const isMatch = actualVersions.find(av => av.version.startsWith(mv+"."));
      if (!!isMatch) {
        actualVersions.splice(actualVersions.indexOf(isMatch), 0, {version: mv+".x"});
      }
    })
    return actualVersions
  }

  render() {
    const { versions, selectedVersions, installerSha, showAdvancedOptions, isEditorLoading, installerErrMsg } = this.state;
    const { isMobile } = this.props;

    const installCommand = `curl ${process.env.API_URL}/${installerSha} | sudo bash`;

    return (
      <div className="u-minHeight--full u-width--full u-overflow--auto flex-column flex1 u-marginBottom---40 kurlContainer" id="kurl-container">
        <div className="KurlHeader u-borderBottom--gray">
          <div className="flex flex-column alignItems--center">
            {isMobile ? null : <p className="u-fontSize--32 u-fontWeight--bold u-color--downriver u-lineHeight--more u-marginTop--30"> kURL - Open Source Kubernetes Installer </p>}
            <span className={`${isMobile ? "u-fontSize--normal u-marginTop--10" : "u-fontSize--large"} u-fontWeight--medium u-lineHeight--more u-color--fiord u-lineHeight--more u-textAlign--center u-width--half`}>
              kURL is a custom Kubernetes distro creator. Think of kURL as a link shortener for your favorite Kubernetes base components (aka add-ons).
                It creates a unique URL for your specific components that can be installed with <code>cURL</code> on a modern Linux server.
                kURL installation packages can be run online or downloaded and executed in a completely airgapped environment.
                kURL is <a href="https://github.com/replicatedhq/kurl/" target="_blank" rel="noopener noreferrer" className="replicated-link">open source</a> and easily extensible by contributing additional add-ons as Kustomization overlays.
              </span>
          </div>
          <div className="flex flex1 u-marginBottom--50 u-marginTop--20 alignItems--center justifyContent--center">
            <button type="button" className="Button primary" onClick={() => this.scrollToAddOns("addOnsWrapper")}>Build your installer</button>
            <Link to="/docs/introduction/" className="u-fontWeight--medium u-color--royalBlue u-lineHeight--normal u-marginLeft--20 u-fontSize--normal u-textDecoration--underlineOnHover"> View the docs </Link>
          </div>
        </div>
        <div className={`u-display--block u-width--full u-position--relative ${isMobile ? "mobile-container" : "container flex1"}`} id="addOnsWrapper">
          <div className={`${!isMobile && "u-marginRight--30"} flex1 flex-column`}>
            <div className={`${!isMobile && "left-content-wrap"}`}>
              <span className="u-fontSize--24 u-fontWeight--bold u-color--mineShaft"> Select add-ons </span>
              <div className="flex flex-column u-marginTop--5">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray flex flex-column u-marginTop--40"> Distribution </span>
                <div className={`AddOn--wrapper ${selectedVersions.kubernetes.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("kubernetes", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="radio"
                        className="u-marginRight--normal"
                        checked={selectedVersions.kubernetes.version !== "None"}
                        readOnly
                      />
                      <span className="icon u-kubernetes u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel "> Kubernetes (Kubeadm) </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["kubernetes"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["kubernetes"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions.kubernetes.filter(v => v.version !== "None")}
                            getOptionLabel={this.getLabel("kubernetes")}
                            getOptionValue={(kubernetes) => kubernetes}
                            value={selectedVersions.kubernetes}
                            onChange={this.onVersionChange("kubernetes")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["kubernetes"]}
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
                <div className={`AddOn--wrapper ${selectedVersions.rke2.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("rke2", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="radio"
                        className="u-marginRight--normal"
                        checked={selectedVersions.rke2.version !== "None"}
                        readOnly
                      />
                      <span className="icon u-kubernetes u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel "> RKE2 </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["rke2"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["rke2"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions.rke2.filter(v => v.version !== "None")}
                            getOptionLabel={this.getLabel("rke2")}
                            getOptionValue={(rke2) => rke2}
                            value={selectedVersions.rke2}
                            onChange={this.onVersionChange("rke2")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["rke2"]}
                            isOptionSelected={() => false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`AddOn--wrapper ${selectedVersions.k3s.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("k3s", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="radio"
                        className="u-marginRight--normal"
                        checked={selectedVersions.k3s.version !== "None"}
                        readOnly
                      />
                      <span className="icon u-kubernetes u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel "> K3s </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["k3s"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["k3s"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions.k3s.filter(v => v.version !== "None")}
                            getOptionLabel={this.getLabel("k3s")}
                            getOptionValue={(k3s) => k3s}
                            value={selectedVersions.k3s}
                            onChange={this.onVersionChange("k3s")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["k3s"]}
                            isOptionSelected={() => false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                        readOnly
                      />
                      <span className="icon u-docker u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel "> Docker </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["docker"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["docker"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions.docker}
                            getOptionLabel={this.getLabel("docker")}
                            getOptionValue={(docker) => docker}
                            value={selectedVersions.docker}
                            onChange={this.onVersionChange("docker")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["docker"]}
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
                <div className={`AddOn--wrapper ${selectedVersions.containerd.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("containerd", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.containerd.version !== "None"}
                        readOnly
                      />
                      <span className="icon u-containerd u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> Containerd </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["containerd"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["containerd"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions.containerd}
                            getOptionLabel={this.getLabel("containerd")}
                            getOptionValue={(containerd) => containerd}
                            value={selectedVersions.containerd}
                            onChange={this.onVersionChange("containerd")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["containerd"]}
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> CNI plugin </span>
                <div className={`AddOn--wrapper ${selectedVersions.antrea.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("antrea", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.antrea.version !== "None"}
                        readOnly
                      />
                      <span className="icon u-antrea u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> Antrea </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["antrea"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["antrea"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions.antrea}
                            getOptionLabel={this.getLabel("antrea")}
                            getOptionValue={(antrea) => antrea}
                            value={selectedVersions.antrea}
                            onChange={this.onVersionChange("antrea")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["antrea"]}
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex1 justifyContent--flexEnd alignItems--center">
                      <div className="flex u-fontSize--small u-fontWeight--medium u-color--royalBlue u-marginTop--small u-cursor--pointer configDiv" onClick={() => this.onToggleShowAdvancedOptions("antrea")}>
                        {showAdvancedOptions["antrea"] ? "Hide config" : "Show config"}
                      </div>
                    </div>
                  </div>
                  {showAdvancedOptions["antrea"] && this.renderAdvancedOptions("antrea")}
                </div>
                <div className={`AddOn--wrapper ${selectedVersions.weave.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("weave", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.weave.version !== "None"}
                        readOnly
                      />
                      <span className="icon u-weave u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> Weave </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["weave"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["weave"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions.weave}
                            getOptionLabel={this.getLabel("weave")}
                            getOptionValue={(weave) => weave}
                            value={selectedVersions.weave}
                            onChange={this.onVersionChange("weave")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["weave"]}
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
                        readOnly
                      />
                      <span className="icon u-contour u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> Contour </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["contour"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["contour"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions.contour}
                            getOptionLabel={this.getLabel("contour")}
                            getOptionValue={(contour) => contour}
                            value={selectedVersions.contour}
                            onChange={this.onVersionChange("contour")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["contour"]}
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
                        readOnly
                      />
                      <span className="icon u-kubernetes u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> EKCO </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["ekco"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["ekco"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions.ekco}
                            getOptionLabel={this.getLabel("ekco")}
                            getOptionValue={(ekco) => ekco}
                            value={selectedVersions.ekco}
                            onChange={this.onVersionChange("ekco")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["ekco"]}
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

                <div className={`AddOn--wrapper ${selectedVersions.sonobuoy.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("sonobuoy", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.sonobuoy.version !== "None"}
                        readOnly
                      />
                      <span className="icon u-sonobuoy u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> Sonobuoy </div>
                        <div className="flex flex1 alignItems--center">
                          <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["sonobuoy"] && "disabled"}`}>
                            <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["sonobuoy"] ? "Version None" : "Version"} </span>
                            <Select
                              isSearchable={false}
                              options={versions.sonobuoy}
                              getOptionLabel={this.getLabel("sonobuoy")}
                              getOptionValue={(sonobuoy) => sonobuoy}
                              value={selectedVersions.sonobuoy}
                              onChange={this.onVersionChange("sonobuoy")}
                              matchProp="value"
                              isDisabled={!this.state.isAddOnChecked["sonobuoy"]}
                              isOptionSelected={() => false} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                        readOnly
                      />
                      <span className="icon u-fluentd u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> Fluentd </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["fluentd"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["fluentd"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions.fluentd}
                            getOptionLabel={this.getLabel("fluentd")}
                            getOptionValue={(fluentd) => fluentd}
                            value={selectedVersions.fluentd}
                            onChange={this.onVersionChange("fluentd")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["fluentd"]}
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
                        readOnly
                      />
                      <span className="icon u-kotsadm u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> KOTS </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["kotsadm"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["kotsadm"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions.kotsadm}
                            getOptionLabel={this.getLabel("kotsadm")}
                            getOptionValue={(kotsadm) => kotsadm}
                            value={selectedVersions.kotsadm}
                            onChange={this.onVersionChange("kotsadm")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["kotsadm"]}
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
                        readOnly
                      />
                      <span className="icon u-minio u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> Minio </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["minio"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["minio"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions.minio}
                            getOptionLabel={this.getLabel("minio")}
                            getOptionValue={(minio) => minio}
                            value={selectedVersions.minio}
                            onChange={this.onVersionChange("minio")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["minio"]}
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
                        readOnly
                      />
                      <span className="icon u-rook u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> Rook </div>
                        <div className="flex flex1 alignItems--center">
                          <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["rook"] && "disabled"}`}>
                            <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["rook"] ? "Version None" : "Version"} </span>
                            <Select
                              isSearchable={false}
                              options={versions.rook}
                              getOptionLabel={this.getLabel("rook")}
                              getOptionValue={(rook) => rook}
                              value={selectedVersions.rook}
                              onChange={this.onVersionChange("rook")}
                              matchProp="value"
                              isDisabled={!this.state.isAddOnChecked["rook"]}
                              isOptionSelected={() => false} />
                          </div>
                          {selectedVersions.rook.version !== "None" && selectedVersions.ekco.version === "None" &&
                            <span className="u-fontSize--small u-fontWeight--medium u-color--fiord flex alignItems--center" style={{ lineHeight: "12px" }}> <span className="icon u-blueExclamationMark" style={{ marginRight: "6px" }} /> The EKCO add-on is recommended when installing Rook. </span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex justifyContent--flexEnd alignItems--center">
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
                <div className={`AddOn--wrapper ${selectedVersions.longhorn.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("longhorn", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.longhorn.version !== "None"}
                        readOnly
                      />
                      <span className="icon u-longhorn u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> Longhorn </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["longhorn"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["longhorn"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions.longhorn}
                            getOptionLabel={this.getLabel("longhorn")}
                            getOptionValue={(longhorn) => longhorn}
                            value={selectedVersions.longhorn}
                            onChange={this.onVersionChange("longhorn")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["longhorn"]}
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex1 justifyContent--flexEnd alignItems--center">
                      <div className="flex u-fontSize--small u-fontWeight--medium u-color--royalBlue u-marginTop--small u-cursor--pointer configDiv" onClick={() => this.onToggleShowAdvancedOptions("longhorn")}>
                        {showAdvancedOptions["longhorn"] ? "Hide config" : "Show config"}
                      </div>
                    </div>
                  </div>
                  {showAdvancedOptions["longhorn"] && this.renderAdvancedOptions("longhorn")}
                </div>

                <div className={`AddOn--wrapper ${selectedVersions.openebs.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("openebs", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.openebs.version !== "None"}
                        readOnly
                      />
                      <span className="icon u-openebs u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> openEBS </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["openebs"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["openebs"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions.openebs}
                            getOptionLabel={this.getLabel("openebs")}
                            getOptionValue={(openebs) => openebs}
                            value={selectedVersions.openebs}
                            onChange={this.onVersionChange("openebs")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["openebs"]}
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
                        readOnly
                      />
                      <span className="icon u-prometheus u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> Prometheus </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["prometheus"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["prometheus"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions.prometheus}
                            getOptionLabel={this.getLabel("prometheus")}
                            getOptionValue={(prometheus) => prometheus}
                            value={selectedVersions.prometheus}
                            onChange={this.onVersionChange("prometheus")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["prometheus"]}
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex1 justifyContent--flexEnd alignItems--center">
                      <div className="flex u-fontSize--small u-fontWeight--medium u-color--royalBlue u-marginTop--small u-cursor--pointer configDiv" onClick={() => this.onToggleShowAdvancedOptions("prometheus")}>
                        {showAdvancedOptions["prometheus"] ? "Hide config" : "Show config"}
                      </div>
                    </div>
                  </div>
                  {showAdvancedOptions["prometheus"] && this.renderAdvancedOptions("prometheus")}
                </div>
                <div className={`AddOn--wrapper ${selectedVersions.collectd.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("collectd", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.collectd.version !== "None"}
                        readOnly
                      />
                      <span className="icon u-collectd u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> Collectd </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["collectd"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["collectd"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions.collectd}
                            getOptionLabel={this.getLabel("collectd")}
                            getOptionValue={(collectd) => collectd}
                            value={selectedVersions.collectd}
                            onChange={this.onVersionChange("collectd")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["collectd"]}
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`AddOn--wrapper ${selectedVersions.metricsServer.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("metricsServer", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.metricsServer.version !== "None"}
                        readOnly
                      />
                      <span className="icon u-kubernetes u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> Metrics-server </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["metricsServer"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["metricsServer"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions["metricsServer"]}
                            getOptionLabel={this.getLabel("metricsServer")}
                            getOptionValue={(metricsServer) => metricsServer}
                            value={selectedVersions.metricsServer}
                            onChange={this.onVersionChange("metricsServer")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["metricsServer"]}
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`AddOn--wrapper ${selectedVersions.goldpinger.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("goldpinger", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.goldpinger.version !== "None"}
                        readOnly
                      />
                      <span className="icon u-kubernetes u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> Goldpinger </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["goldpinger"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["goldpinger"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions["goldpinger"]}
                            getOptionLabel={this.getLabel("goldpinger")}
                            getOptionValue={(goldpinger) => goldpinger}
                            value={selectedVersions.goldpinger}
                            onChange={this.onVersionChange("goldpinger")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["goldpinger"]}
                            isOptionSelected={() => false} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> x509 Certificates </span>
                <div className={`AddOn--wrapper ${selectedVersions.certManager.version !== "None" && "selected"} flex flex-column u-marginTop--15`} onClick={(e) => this.handleIsAddOnSelected("certManager", e)}>
                  <div className="flex flex1">
                    <div className="flex flex1 alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.certManager.version !== "None"}
                        readOnly
                      />
                      <span className="icon u-certManager u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> Cert manager </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["certManager"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["certManager"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions.certManager}
                            getOptionLabel={this.getLabel("certManager")}
                            getOptionValue={(certManager) => certManager}
                            value={selectedVersions.certManager}
                            onChange={this.onVersionChange("certManager")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["certManager"]}
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
                        readOnly
                      />
                      <span className="icon u-registry u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> Docker Registry </div>
                        <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["registry"] && "disabled"}`} style={{ width: "200px" }}>
                          <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["registry"] ? "Version None" : "Version"} </span>
                          <Select
                            isSearchable={false}
                            options={versions.registry}
                            getOptionLabel={this.getLabel("registry")}
                            getOptionValue={(registry) => registry}
                            value={selectedVersions.registry}
                            onChange={this.onVersionChange("registry")}
                            matchProp="value"
                            isDisabled={!this.state.isAddOnChecked["registry"]}
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
                    <div className="flex flex-auto alignItems--center">
                      <input
                        type="checkbox"
                        className="u-marginRight--normal"
                        checked={selectedVersions.velero.version !== "None"}
                        readOnly
                      />
                      <span className="icon u-velero u-marginBottom--small" />
                      <div className="flex flex-column u-marginLeft--15 u-marginTop--small">
                        <div className="FormLabel"> Velero </div>
                        <div className="flex flex1 alignItems--center">
                          <div className={`SelectVersion flex flex1 ${!this.state.isAddOnChecked["velero"] && "disabled"}`} style={{ width: "200px" }}>
                            <span className="flex alignItems--center u-color--fiord u-fontSize--normal versionLabel"> {!this.state.isAddOnChecked["velero"] ? "Version None" : "Version"} </span>
                            <Select
                              isSearchable={false}
                              options={versions.velero}
                              getOptionLabel={this.getLabel("velero")}
                              getOptionValue={(velero) => velero}
                              value={selectedVersions.velero}
                              onChange={this.onVersionChange("velero")}
                              matchProp="value"
                              isDisabled={!this.state.isAddOnChecked["velero"]}
                              isOptionSelected={() => false} />
                          </div>
                          {this.checkKotsVeleroIncompatibility(selectedVersions.velero.version, selectedVersions.kotsadm.version) &&
                            <span className="u-fontSize--small u-fontWeight--medium u-color--fiord flex alignItems--center" style={{ lineHeight: "12px" }}> <span className="icon u-blueExclamationMark" style={{ marginRight: "6px" }} /> Version {selectedVersions.velero.version} is not compatible with KOTS {selectedVersions.kotsadm.version} </span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex1 justifyContent--flexEnd alignItems--center">
                      <div className="flex u-fontSize--small u-fontWeight--medium u-fontWeight--medium u-color--royalBlue u-marginTop--small u-cursor--pointer configDiv" onClick={() => this.onToggleShowAdvancedOptions("velero")}>
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
          <div className={`${isMobile ? "u-marginTop--30 u-display--block " : "AbsoluteFixedWrapper flex flex-column"}`} id="fixed-wrapper">
            <span className="u-fontSize--24 u-fontWeight--bold u-color--mineShaft"> Installer YAML </span>
            <div className="MonacoEditor--wrapper flex u-width--full u-marginTop--20 u-position--relative">
              {installerErrMsg && this.renderVersionError(installerErrMsg)}
              <div className="flex u-width--full u-overflow--auto" id="monaco">
                {isEditorLoading &&
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
