import * as React from "react";
import { Link } from "@reach/router";

import ReactTooltip from "react-tooltip";
import json2yaml from "json2yaml";
import isEmpty from "lodash/isEmpty";
import find from "lodash/find";
import semver from "semver";

import CodeSnippet from "./shared/CodeSnippet";
import Loader from "./shared/Loader";
import AddOnWrapper from "./shared/AddOnWrapper";
import OptionWrapper from "./shared/OptionWrapper";
import ConfirmSelectionModal from "./modals/ConfirmSelectionModal";
import { injectYamlOpenebsComment } from "../utils/kurl-yaml";

import "../scss/components/Kurlsh.scss";
import versionDetails from "../../static/versionDetails.json"
import _ from "lodash";

const NIL_VERSIONS = {
  kubernetes: { version: "None" },
  flannel: { version: "None" },
  weave: { version: "None" },
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
  goldpinger: { version: "None" },
}
const hasAdvancedOptions = ["kubernetes", "flannel", "weave", "contour", "rook", "registry", "docker", "velero", "kotsadm", "ekco", "fluentd", "minio", "openebs", "longhorn", "prometheus"];
function versionToState(version) {
  return {
    version
  };
}

// replace problematic versions that do not sort because of semver pre-release
const replaceVersions = {
  "rook": {"1.0.4": "1.0.4-0.0.0"},
  "weave": {"2.6.5": "2.6.5-0.0.0", "2.8.1": "2.8.1-0.0.0"},
  "prometheus": {"0.46.0": "0.46.0-0.0.0"},
};

class Kurlsh extends React.Component {
  constructor(props) {
    super(props);
    const { supportedVersions } = props;

    const kubernetesVersions = this.prepareVersions("kubernetes", supportedVersions.kubernetes);
    const contourVersions = this.prepareVersions("contour", supportedVersions.contour);
    const flannelVersions = this.prepareVersions("flannel", supportedVersions.flannel);
    const weaveVersions = this.prepareVersions("weave", supportedVersions.weave);
    const rookVersions = this.prepareVersions("rook", supportedVersions.rook);
    const dockerVersions = this.prepareVersions("docker", supportedVersions.docker);
    const prometheusVersions = this.prepareVersions("prometheus", supportedVersions.prometheus);
    const registryVersions = this.prepareVersions("registry", supportedVersions.registry);
    const containerdVersions = this.prepareVersions("containerd", supportedVersions.containerd);
    const veleroVersions = this.prepareVersions("velero", supportedVersions.velero);
    const kotsadmVersions = this.prepareVersions("kotsadm", supportedVersions.kotsadm);
    const ekcoVersions = this.prepareVersions("ekco", supportedVersions.ekco);
    const fluentdVersions = this.prepareVersions("fluentd", supportedVersions.fluentd);
    const minioVersions = this.prepareVersions("minio", supportedVersions.minio);
    const openebsVersions = this.prepareVersions("openebs", supportedVersions.openebs);
    const longhornVersions = this.prepareVersions("longhorn", supportedVersions.longhorn);
    const collectdVersions = this.prepareVersions("collectd", supportedVersions.collectd);
    const metricsServerVersions = this.prepareVersions("metrics-server", supportedVersions["metrics-server"]);
    const certManagerVersions = this.prepareVersions("cert-manager", supportedVersions["cert-manager"]);
    const sonobuoyVersions = this.prepareVersions("sonobuoy", supportedVersions.sonobuoy);
    const goldpingerVersions = this.prepareVersions("goldpinger", supportedVersions.goldpinger);

    this.state = {
      versions: {
        kubernetes: kubernetesVersions,
        flannel: flannelVersions,
        weave: weaveVersions,
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
        goldpinger: goldpingerVersions,
      },
      selectedVersions: NIL_VERSIONS,
      installerSha: "",
      showAdvancedOptions: {
        "kubernetes": false,
        "flannel": false,
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
        "openebs": false,
        "longhorn": false,
        "metricsServer": false,
        "certManager": false,
        "sonobuoy": false,
        "goldpinger": false,
      },
      advancedOptions: {
        kubernetes: {},
        flannel: {},
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
        flannel: false, 
        weave: false,
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
      optionDefaults: {},
      installerErrMsg: "",
      displayConfirmSelectionModal: false,
      currentSelection: {}
    };
  }

  prepareVersions = (addon, versions) => {
    const stateVersions = versions ? versions.map(versionToState) : [];
    const replacedVersions = this.replaceVersions(addon, stateVersions);
    const latest = this.findLatestVersion(replacedVersions);
    const dotXVersions = this.addDotXVersions(replacedVersions);
    const sortedVersions = this.sortVersions(dotXVersions, latest);
    return this.unreplaceVersions(addon, sortedVersions);
  }

  replaceVersions = (addon, versions) => {
    let next = _.cloneDeep(versions);
    if (addon in replaceVersions) {
      Object.keys(replaceVersions[addon]).forEach((k) => {
        next = next.map(function(version) {
          if (version.version === k) {
            version.version = replaceVersions[addon][k];
          }
          return version;
        });
      });
    }
    return next;
  }

  unreplaceVersions = (addon, versions) => {
    let next = _.cloneDeep(versions);
    if (addon in replaceVersions) {
      Object.keys(replaceVersions[addon]).forEach((k) => {
        next = next.map(function(version) {
          if (version.version === replaceVersions[addon][k]) {
            version.version = k;
          }
          return version;
        });
      });
    }
    return next;
  }

  sortVersions = (versions, latest) => {
    // remove the "latest" version from the list and sort the resulting array. we will
    // re-insert "latest" after sorting the array as it has to be the option just before
    // the "actual" latest version.
    const sorted = versions.filter(obj => {
        return obj.version !== "latest";
    }).sort(this.compareVersions);

    let result = []
    for (let i=0; i < sorted.length; i++) {
      if (sorted[i].version === latest) {
        result.push({version: "latest"});
      }
      result.push(sorted[i]);
    }

    result.push({ version: "None" });
    return result;
  }

  findLatestVersion = versions => {
    // the list of versions returned by the api has, as it first item, a version called
    // "latest", the item immediately after it is the actual version we consider to be
    // the latest. we save it here so we can remember where we need to insert it after.
    return versions && versions.length > 1 ? versions[1].version : undefined;
  }

  // compareVersions do the best to sort out versions returned by the api. this function
  // only considers versions that ressembles the semantic version format, if the version
  // does not look like a semantic version this function simply returns 0.
  compareVersions = (x, y) => {
    let xver = x.version
    if (xver.endsWith(".x")) {
      xver = xver.replace(".x", ".99999");
    }

    let yver = y.version
    if (yver.endsWith(".x")) {
      yver = yver.replace(".x", ".99999");
    }

    if (!semver.valid(xver) || !semver.valid(yver)) {
      return 0;
    }
    if (!xver.includes("-")) {
      xver = `${xver}-0`;
    }
    if (!yver.includes("-")) {
      yver = `${yver}-0`;
    }
    return semver.gt(yver, xver) ? 1 : -1;
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
      optionDefaults,
      isAddOnChecked,
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

    if (isAddOnChecked.kubernetes) {
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

    if (isAddOnChecked.flannel) {
      const diff = getDiff(optionDefaults["flannel"], options.flannel);

      generatedInstaller.spec.flannel = {
        version: selectedVersions.flannel.version
      };

      if (Object.keys(diff).length) {
        generatedInstaller.spec.flannel = {
          ...generatedInstaller.spec.flannel,
          ...diff
        };
      }
    }

    if (isAddOnChecked.weave) {
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

    if (isAddOnChecked.rook) {
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

    if (isAddOnChecked.contour) {
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

    if (isAddOnChecked.docker) {
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

    if (isAddOnChecked.prometheus) {
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

    if (isAddOnChecked.registry) {
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

    if (isAddOnChecked.containerd) {
      generatedInstaller.spec.containerd = {
        version: selectedVersions.containerd.version
      };
    }

    if (isAddOnChecked.velero) {
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

    if (isAddOnChecked.kotsadm) {
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

    if (isAddOnChecked.ekco) {
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

    if (isAddOnChecked.fluentd) {
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

    if (isAddOnChecked.minio) {
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

    if (isAddOnChecked.openebs) {
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

    if (isAddOnChecked.longhorn) {
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

    if (isAddOnChecked.collectd) {
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

    if (isAddOnChecked.metricsServer) {
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

    if (isAddOnChecked.certManager) {
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

    if (isAddOnChecked.sonobuoy) {
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

    if (isAddOnChecked.goldpinger) {
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

    let renderedYaml = json2yaml.stringify(generatedInstaller).replace("---\n", "").replace(/^ {2}/gm, "");

    if (sha === "latest") {
      renderedYaml = injectYamlOpenebsComment(renderedYaml);
    }

    return renderedYaml;
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
    if (name === "kubernetes") {
      if (value.version === "None") {
        // can't be deselected, deselection happens when changing between them
        return;
      }
    }
    if (name === "containerd" && value.version !== "None" && this.state.isAddOnChecked.docker) {
      this.checkIncompatibleSelection({ containerd: value });
    } else if (name === "docker" && value.version !== "None" && this.state.isAddOnChecked.containerd) {
      this.checkIncompatibleSelection({ docker: value });
    } else if (name === "flannel" && value.version !== "None" && this.state.isAddOnChecked.weave) {
      this.checkIncompatibleSelection({ flannel: value });
    } else if (name === "weave" && value.version !== "None" && this.state.isAddOnChecked.flannel) {
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
      if (name === "kubernetes") {
        if (this.state.isAddOnChecked[name]) {
          // can't be deselected, deselection happens when changing between them
          return;
        }
      }
      let nextIsAddOnChecked = {
        ...this.state.isAddOnChecked,
      };
      if (name === "kubernetes") {
        nextIsAddOnChecked = {
          ...nextIsAddOnChecked,
          kubernetes: false,
        };
      }
      this.setState({
        isAddOnChecked: {
          ...nextIsAddOnChecked,
          [name]: !this.state.isAddOnChecked[name],
        },
      }, () => {
        if (this.state.isAddOnChecked[name]) {
          let nextSelectedVersions = {
            ...this.state.selectedVersions,
          };
          if (name === "kubernetes") {
            return; // cannot be deselected, it is the only option
          }

          let selectedVersion = this.state.versions[name][0].version;
          if (selectedVersion === "latest" && name !== "ekco") {
            selectedVersion = this.state.versions[name][1].version;
          }

          if (name === "containerd" && this.state.isAddOnChecked.docker) {
            this.checkIncompatibleSelection({ containerd: { version: selectedVersion } });
          } else if (name === "docker" && this.state.isAddOnChecked.containerd) {
            this.checkIncompatibleSelection({ docker: { version: selectedVersion } });
          } else if (name === "flannel" && this.state.isAddOnChecked.weave) {
            this.checkIncompatibleSelection({ flannel: { version: selectedVersion } });
          } else if (name === "weave" && this.state.isAddOnChecked.flannel) {
            this.checkIncompatibleSelection({ weave: { version: selectedVersion } });
          } else {
            this.setState({ selectedVersions: { ...nextSelectedVersions, [name]: { version: selectedVersion } } }, () => {
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
      let idx = this.state.versions[name].findIndex(val => { return val.version === "latest" })
      let latest = this.state.versions[name][idx + 1];
      if (latest.version.indexOf(".x") !== -1) {
        latest = this.state.versions[name][idx+2]; // the latest version is a ".x" version
      }
      version = `latest (${latest.version})`;
    } else if (version.endsWith(".x")) {
      const versionIndex = this.state.versions[name].findIndex((element) => element.version === version);
      if (this.state.versions[name].length > versionIndex) { // if there is a member of the array after the one specified
        let next = this.state.versions[name][versionIndex+1];
        if (next.version === "latest") { // if the next version is "latest"
          next = this.state.versions[name][versionIndex+2];
        }
        version = `${version} (${next.version})`;
      }
    }
    return version;
  }

  postToKurlInstaller = async (yaml) => {
    this.setState({ installerErrMsg: "" })
    let parsedURL = new URL(process.env.KURL_INSTALLER_URL);
    parsedURL.searchParams.append('austere', true);
    const url = parsedURL.toString();
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
        this.setState({ installerErrMsg: "", installerSha });
      } else {
        const body = await response.json();
        if (Array.isArray(body)) {
          this.setState({ installerErrMsg: body[0].message || "something went wrong" });
        } else {
          this.setState({ installerErrMsg: body.error.message || "something went wrong" });
        }
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
          const addOnDefaults = this.state.optionDefaults[addonName];
          for (const flag in addOnFlags) {
            const flagDefault = _.find(addOnDefaults, { 'flag': flag });
            addOnFlags[flag] = {
              inputValue: addOnFlags[flag],
              isChecked: _.get(flagDefault, "type") === "boolean" ? addOnFlags[flag] : true,
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
    let elementToFocus;
    const [field, key] = path.split('.');
    const addOnData = this.addOnDataFromInput(currentTarget, type);

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

  addOnDataFromInput(targetInput, fieldType) {
    let addOnData = {}

    if (targetInput.type === "checkbox") {
      if (fieldType === "boolean") {
        addOnData = {
          inputValue: targetInput.checked ? true : false,
          isChecked: targetInput.checked
        }
      } else {
        if (fieldType === "string") {
          addOnData = {
            inputValue: "",
            isChecked: targetInput.checked,
          }
        } else if (fieldType === "array[string]") {
          addOnData = {
            inputValue: [],
            isChecked: targetInput.checked,
          }
        } else {
          addOnData = {
            inputValue: 0,
            isChecked: targetInput.checked,
          }
        }
      }
    } else if (targetInput.type === "number") {
      addOnData = {
        inputValue: parseInt(targetInput.value, 10) || 0
      }
    } else if (targetInput.type === "text") {
      if (fieldType === "array[string]") {
        addOnData = {
          inputValue: targetInput.value.split(",")
        }
      } else {
        addOnData = {
          inputValue: targetInput.value
        }
      }
    } else {
      addOnData = {
        inputValue: targetInput.value
      }
    }

    return addOnData;
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

            if (option.hidden) {
              return null;
            }

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
                  {option.type === "string" || option.type === "array[string]" || option.type === "number" ?
                    <div>
                      <input
                        id={`${addOn}_${data.flag}`}
                        className="flex2 addOnOption"
                        type={option.type === "string" || option.type === "array[string]" ? "text" : "number"}
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
    let versions = _.cloneDeep(actualVersions); // make a copy
    // get a list of the distinct minor versions
    const minorVersionsRegex = /(^[0-9]+\.[0-9]+)\.[0-9]+/;
    let minorVersions = [];
    versions.forEach(v => {
      const matches = v.version.match(minorVersionsRegex);
      if (matches && matches.length > 1 && !minorVersions.includes(matches[1])) {
        minorVersions.push(matches[1]);
      }
    })
    // for each minor version, find the first version in the versions array that matches
    // and insert `1.minor.x` before it
    minorVersions.forEach(mv => {
      const isMatch = versions.find(av => av.version.startsWith(mv+"."));
      if (!!isMatch) {
        versions.splice(versions.indexOf(isMatch), 0, {version: mv+".x"});
      }
    })
    return versions;
  }

  render() {
    const { versions, selectedVersions, installerSha, showAdvancedOptions, isEditorLoading, installerErrMsg, isAddOnChecked } = this.state;
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
                <AddOnWrapper
                  addOnId="kubernetes"
                  addOnTitle="Kubernetes (Kubeadm)"
                  isAddOnChecked={isAddOnChecked["kubernetes"]}
                  options={versions.kubernetes}
                  getOptionLabel={this.getLabel("kubernetes")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.kubernetes}
                  onVersionChange={this.onVersionChange("kubernetes")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("kubernetes", e)}
                  showAdvancedOptions={showAdvancedOptions["kubernetes"]}
                  onToggleShowAdvancedOptions={() => this.onToggleShowAdvancedOptions("kubernetes")}
                  renderAdvancedOptions={() => this.renderAdvancedOptions("kubernetes")}
                  />
              </div>
              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> CRI </span>
                <AddOnWrapper
                  addOnId="docker"
                  addOnTitle="Docker"
                  isDeprecated={true}
                  isAddOnChecked={isAddOnChecked["docker"]}
                  options={versions.docker}
                  getOptionLabel={this.getLabel("docker")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.docker}
                  onVersionChange={this.onVersionChange("docker")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("docker", e)}
                  showAdvancedOptions={showAdvancedOptions["docker"]}
                  onToggleShowAdvancedOptions={() => this.onToggleShowAdvancedOptions("docker")}
                  renderAdvancedOptions={() => this.renderAdvancedOptions("docker")}
                  />
                <AddOnWrapper
                  addOnId="containerd"
                  addOnTitle="Containerd"
                  isAddOnChecked={isAddOnChecked["containerd"]}
                  options={versions.containerd}
                  getOptionLabel={this.getLabel("containerd")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.containerd}
                  onVersionChange={this.onVersionChange("containerd")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("containerd", e)}
                  disableAdvancedOptions={true}
                  />
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> CNI plugin </span>
                { versions.flannel.length > 1 &&
                <AddOnWrapper
                  addOnId="flannel"
                  addOnTitle="Flannel"
                  addOnIcon="u-kubernetes"
                  isAddOnChecked={isAddOnChecked["flannel"]}
                  options={versions.flannel}
                  getOptionLabel={this.getLabel("flannel")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.flannel}
                  onVersionChange={this.onVersionChange("flannel")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("flannel", e)}
                  showAdvancedOptions={showAdvancedOptions["flannel"]}
                  onToggleShowAdvancedOptions={() => this.onToggleShowAdvancedOptions("flannel")}
                  renderAdvancedOptions={() => this.renderAdvancedOptions("flannel")}
                  /> }
                <AddOnWrapper
                  addOnId="weave"
                  addOnTitle="Weave"
                  isDeprecated={true}
                  isAddOnChecked={isAddOnChecked["weave"]}
                  options={versions.weave}
                  getOptionLabel={this.getLabel("weave")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.weave}
                  onVersionChange={this.onVersionChange("weave")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("weave", e)}
                  showAdvancedOptions={showAdvancedOptions["weave"]}
                  onToggleShowAdvancedOptions={() => this.onToggleShowAdvancedOptions("weave")}
                  renderAdvancedOptions={() => this.renderAdvancedOptions("weave")}
                  />
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> Ingress </span>
                <AddOnWrapper
                  addOnId="contour"
                  addOnTitle="Contour"
                  isAddOnChecked={isAddOnChecked["contour"]}
                  options={versions.contour}
                  getOptionLabel={this.getLabel("contour")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.contour}
                  onVersionChange={this.onVersionChange("contour")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("contour", e)}
                  showAdvancedOptions={showAdvancedOptions["contour"]}
                  onToggleShowAdvancedOptions={() => this.onToggleShowAdvancedOptions("contour")}
                  renderAdvancedOptions={() => this.renderAdvancedOptions("contour")}
                  />
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> Cluster Administration </span>
                <AddOnWrapper
                  addOnId="ekco"
                  addOnTitle="EKCO"
                  addOnIcon="u-kubernetes"
                  isAddOnChecked={isAddOnChecked["ekco"]}
                  options={versions.ekco}
                  getOptionLabel={this.getLabel("ekco")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.ekco}
                  onVersionChange={this.onVersionChange("ekco")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("ekco", e)}
                  showAdvancedOptions={showAdvancedOptions["ekco"]}
                  onToggleShowAdvancedOptions={() => this.onToggleShowAdvancedOptions("ekco")}
                  renderAdvancedOptions={() => this.renderAdvancedOptions("ekco")}
                  />
                <AddOnWrapper
                  addOnId="sonobuoy"
                  addOnTitle="Sonobuoy"
                  isAddOnChecked={isAddOnChecked["sonobuoy"]}
                  options={versions.sonobuoy}
                  getOptionLabel={this.getLabel("sonobuoy")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.sonobuoy}
                  onVersionChange={this.onVersionChange("sonobuoy")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("sonobuoy", e)}
                  disableAdvancedOptions={true}
                  />
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> Logs </span>
                <AddOnWrapper
                  addOnId="fluentd"
                  addOnTitle="Fluentd"
                  isAddOnChecked={isAddOnChecked["fluentd"]}
                  options={versions.fluentd}
                  getOptionLabel={this.getLabel("fluentd")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.fluentd}
                  onVersionChange={this.onVersionChange("fluentd")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("fluentd", e)}
                  showAdvancedOptions={showAdvancedOptions["fluentd"]}
                  onToggleShowAdvancedOptions={() => this.onToggleShowAdvancedOptions("fluentd")}
                  renderAdvancedOptions={() => this.renderAdvancedOptions("fluentd")}
                  />
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> Application Management </span>
                <AddOnWrapper
                  addOnId="kotsadm"
                  addOnTitle="KOTS"
                  isAddOnChecked={isAddOnChecked["kotsadm"]}
                  options={versions.kotsadm}
                  getOptionLabel={this.getLabel("kotsadm")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.kotsadm}
                  onVersionChange={this.onVersionChange("kotsadm")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("kotsadm", e)}
                  showAdvancedOptions={showAdvancedOptions["kotsadm"]}
                  onToggleShowAdvancedOptions={() => this.onToggleShowAdvancedOptions("kotsadm")}
                  renderAdvancedOptions={() => this.renderAdvancedOptions("kotsadm")}
                  />
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> Object Store </span>
                <AddOnWrapper
                  addOnId="minio"
                  addOnTitle="Minio"
                  isAddOnChecked={isAddOnChecked["minio"]}
                  options={versions.minio}
                  getOptionLabel={this.getLabel("minio")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.minio}
                  onVersionChange={this.onVersionChange("minio")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("minio", e)}
                  showAdvancedOptions={showAdvancedOptions["minio"]}
                  onToggleShowAdvancedOptions={() => this.onToggleShowAdvancedOptions("minio")}
                  renderAdvancedOptions={() => this.renderAdvancedOptions("minio")}
                  />
                <AddOnWrapper
                  addOnId="rook"
                  addOnTitle="Rook"
                  isAddOnChecked={isAddOnChecked["rook"]}
                  options={versions.rook}
                  getOptionLabel={this.getLabel("rook")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.rook}
                  onVersionChange={this.onVersionChange("rook")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("rook", e)}
                  showAdvancedOptions={showAdvancedOptions["rook"]}
                  onToggleShowAdvancedOptions={() => this.onToggleShowAdvancedOptions("rook")}
                  renderAdvancedOptions={() => this.renderAdvancedOptions("rook")}
                  />
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> PVC Provisioner </span>
                <AddOnWrapper
                  addOnId="longhorn"
                  addOnTitle="Longhorn"
                  isDeprecated={true}
                  isAddOnChecked={isAddOnChecked["longhorn"]}
                  options={versions.longhorn}
                  getOptionLabel={this.getLabel("longhorn")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.longhorn}
                  onVersionChange={this.onVersionChange("longhorn")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("longhorn", e)}
                  showAdvancedOptions={showAdvancedOptions["longhorn"]}
                  onToggleShowAdvancedOptions={() => this.onToggleShowAdvancedOptions("longhorn")}
                  renderAdvancedOptions={() => this.renderAdvancedOptions("longhorn")}
                  />
                <AddOnWrapper
                  addOnId="openebs"
                  addOnTitle="OpenEBS"
                  isAddOnChecked={isAddOnChecked["openebs"]}
                  options={versions.openebs}
                  getOptionLabel={this.getLabel("openebs")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.openebs}
                  onVersionChange={this.onVersionChange("openebs")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("openebs", e)}
                  showAdvancedOptions={showAdvancedOptions["openebs"]}
                  onToggleShowAdvancedOptions={() => this.onToggleShowAdvancedOptions("openebs")}
                  renderAdvancedOptions={() => this.renderAdvancedOptions("openebs")}
                  />
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> Metrics & Monitoring </span>
                <AddOnWrapper
                  addOnId="prometheus"
                  addOnTitle="Prometheus"
                  isAddOnChecked={isAddOnChecked["prometheus"]}
                  options={versions.prometheus}
                  getOptionLabel={this.getLabel("prometheus")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.prometheus}
                  onVersionChange={this.onVersionChange("prometheus")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("prometheus", e)}
                  showAdvancedOptions={showAdvancedOptions["prometheus"]}
                  onToggleShowAdvancedOptions={() => this.onToggleShowAdvancedOptions("prometheus")}
                  renderAdvancedOptions={() => this.renderAdvancedOptions("prometheus")}
                  />
                <AddOnWrapper
                  addOnId="collectd"
                  addOnTitle="Collectd"
                  isAddOnChecked={isAddOnChecked["collectd"]}
                  options={versions.collectd}
                  getOptionLabel={this.getLabel("collectd")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.collectd}
                  onVersionChange={this.onVersionChange("collectd")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("collectd", e)}
                  disableAdvancedOptions={true}
                  />
                <AddOnWrapper
                  addOnId="metricsServer"
                  addOnTitle="Metrics Server"
                  addOnIcon="u-kubernetes"
                  isAddOnChecked={isAddOnChecked["metricsServer"]}
                  options={versions.metricsServer}
                  getOptionLabel={this.getLabel("metricsServer")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.metricsServer}
                  onVersionChange={this.onVersionChange("metricsServer")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("metricsServer", e)}
                  disableAdvancedOptions={true}
                  />
                <AddOnWrapper
                  addOnId="goldpinger"
                  addOnTitle="Goldpinger"
                  addOnIcon="u-kubernetes"
                  isAddOnChecked={isAddOnChecked["goldpinger"]}
                  options={versions.goldpinger}
                  getOptionLabel={this.getLabel("goldpinger")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.goldpinger}
                  onVersionChange={this.onVersionChange("goldpinger")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("goldpinger", e)}
                  disableAdvancedOptions={true}
                  />
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> x509 Certificates </span>
                <AddOnWrapper
                  addOnId="certManager"
                  addOnTitle="Cert-manager"
                  isAddOnChecked={isAddOnChecked["certManager"]}
                  options={versions.certManager}
                  getOptionLabel={this.getLabel("certManager")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.certManager}
                  onVersionChange={this.onVersionChange("certManager")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("certManager", e)}
                  disableAdvancedOptions={true}
                  />
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> Registry </span>
                <AddOnWrapper
                  addOnId="registry"
                  addOnTitle="Docker Registry"
                  isAddOnChecked={isAddOnChecked["registry"]}
                  options={versions.registry}
                  getOptionLabel={this.getLabel("registry")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.registry}
                  onVersionChange={this.onVersionChange("registry")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("registry", e)}
                  showAdvancedOptions={showAdvancedOptions["registry"]}
                  onToggleShowAdvancedOptions={() => this.onToggleShowAdvancedOptions("registry")}
                  renderAdvancedOptions={() => this.renderAdvancedOptions("registry")}
                  />
              </div>

              <div className="flex flex-column u-marginTop--40">
                <span className="u-fontSize--normal u-fontWeight--medium u-color--bermudaGray"> Snapshots </span>
                <AddOnWrapper
                  addOnId="velero"
                  addOnTitle="Velero"
                  isAddOnChecked={isAddOnChecked["velero"]}
                  options={versions.velero}
                  getOptionLabel={this.getLabel("velero")}
                  getOptionValue={(selected) => selected}
                  value={selectedVersions.velero}
                  onVersionChange={this.onVersionChange("velero")}
                  handleIsAddOnSelected={(e) => this.handleIsAddOnSelected("velero", e)}
                  showAdvancedOptions={showAdvancedOptions["velero"]}
                  onToggleShowAdvancedOptions={() => this.onToggleShowAdvancedOptions("velero")}
                  renderAdvancedOptions={() => this.renderAdvancedOptions("velero")}
                  />
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
