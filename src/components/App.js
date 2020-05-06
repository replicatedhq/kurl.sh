import * as React from "react";
import CodeSnippet from "./shared/CodeSnippet";
import Loader from "./shared/Loader";
import { Utilities } from "./utilities";
import("../scss/components/App.scss");

class AppComponent extends React.Component {
  state = {
    responseStatusCode: null,
    bundleUrl: "",
    loadingBundleUrl: false,
    fetchingInstallerDataError: "",
    installerData: null,
    selectedSpec: "kubernetes",
    versionData: {}
  };

  fetchInstallerData = async (sha) => {
    const url = `${process.env.KURL_INSTALLER_URL}/${sha}`
    try {
      const resp = await fetch(url);
      const body = await resp.json();
      if (body.error) {
        this.setState({ fetchingInstallerDataError: body.error });
      } else {
        this.setState({ installerData: body });
      }
    } catch (error) {
      this.setState({ fetchingInstallerDataError: error });
    }
  }

  componentDidUpdate(lastProps, lastState) {
    if (this.state.selectedSpec !== lastState.selectedSpec && this.state.selectedSpec) {
      this.getVersionDetails(this.state.selectedSpec)
    }
  }

  componentDidMount() {
    if (this.props.sha) {
      this.checkS3Response(this.props.sha);
      this.fetchInstallerData(this.props.sha)
    }

    if (this.state.selectedSpec) {
      this.getVersionDetails(this.state.selectedSpec)
    }
  }

  checkS3Response = async (sha) => {
    const url = `https://cors-anywhere.herokuapp.com/${process.env.KURL_BUNDLE_URL}/${sha}.tar.gz`
    this.setState({ loadingBundleUrl: true });
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/tar+gzip",
        },
        mode: "cors"
      });
      this.setState({ responseStatusCode: response.status, bundleUrl: `${process.env.KURL_BUNDLE_URL}/${sha}.tar.gz`, loadingBundleUrl: false })
    } catch (error) {
      console.log(error);
      this.setState({ loadingBundleUrl: false });
      return;
    }
  }

  handleDownloadBundle = () => {
    const hiddenIFrameID = "hiddenDownloader";
    let iframe = document.getElementById(hiddenIFrameID);
    const url = this.state.bundleUrl;
    if (iframe === null) {
      iframe = document.createElement("iframe");
      iframe.id = hiddenIFrameID;
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    }
    iframe.src = url;
  }

  whatYouGet = (spec) => {
    this.setState({ selectedSpec: spec });
  }

  getVersionDetails = async (addOn) => {
    const url = `${process.env.INTERNAL_ADD_ON_URL}/${addOn}`
    try {
      const resp = await fetch(url);
      const versionData = await resp.json();
      this.setState({
        versionData
      });
    } catch (error) {
      throw error;
    }
  }

  getVersionData = (installerData) => {
    const { versionData } = this.state;
    return Object.keys(versionData).map((key, i) => {
      const existInInstallerYaml = installerData.find((d) => key === d);
      return (
        <div className="flex alignItems--center u-borderBottom--silverChalice u-padding--normal" key={`${key}-${i}`}>
          {existInInstallerYaml ? <span className="status-dot"></span> : <span></span>}
          <div className="flex flex1 alignItems--center justifyContent--center">
            <div className="flex flex-column alignItems--center u-width--180 u-marginLeft--40">
              <div className="u-color--alabasterapprox u-fontSize--small u-fontWeight--normal u-marginRight--30"> {versionData[key].flag ? `--${versionData[key].flag}` : "--version"} </div>
              <div className="u-color--silverChalice u-fontSize--small u-fontWeight--normal u-marginRight--30"> {versionData[key].type} </div>
            </div>
            <div className="u-width--250 u-color--alabasterapprox u-fontSize--small u-fontWeight--normal"> {versionData[key].description} </div>
          </div>
        </div>
      )
    })
  }

  render() {
    const { loadingBundleUrl, installerData, selectedSpec, fetchingInstallerDataError } = this.state;
    const { isMobile } = this.props;
    const sha = this.props.sha;
    const bundleUrl = `curl -LO ${process.env.API_URL}/bundle/${sha}.tar.gz`
    const installBundleCommand = `
tar xvf ${sha}.tar.gz
cat install.sh | sudo bash -s airgap
    `

    if (loadingBundleUrl) {
      return (
        <div className="flex-column flex-1-auto u-overflow--hidden justifyContent--center alignItems--center">
          <Loader
            size="70"
          />
        </div>
      )
    }

    return (
      <div className="u-minHeight--full u-width--full u-overflow--auto flex-column flex1">
        {fetchingInstallerDataError ?
          <div className="flex1 flex-column justifyContent--center alignItems--center">
            <p className="u-color--chestnut u-fontSize--normal u-fontWeight--medium u-lineHeight--normal u-marginTop--10">{fetchingInstallerDataError.message}</p>
          </div>
          :
          <div className={`u-flexTabletReflow flex1 flex-column u-overflow--auto u-width--full u-marginBottom---40 ${isMobile ? "mobile-container" : "container"}`}>
            <div className="flex flex-column u-width--600">
              <div>
                <p className="u-fontSize--24 u-fontWeight--bold u-color--mineShaft u-marginBottom--20"> Your installer </p>
                <div className="u-fontSize--large u-fontWeight--bold u-color--tundora"> Install online </div>
                <div className="flex flex-column u-marginTop--normal">
                  <CodeSnippet
                    canCopy={true}
                    onCopyText={<span className="u-color--vidaLoca">URL has been copied to your clipboard</span>}
                  >
                    {bundleUrl}
                  </CodeSnippet>
                </div>
                <div className="u-marginTop--normal u-borderTop--gray">
                  <div className="u-fontSize--large u-fontWeight--bold u-color--tundora u-marginTop--normal"> Install airgap </div>
                  <div className="u-marginTop--normal u-marginBottom--normal">
                    <button
                      type="button"
                      className="Button secondary"
                      onClick={() => this.handleDownloadBundle()}
                    >
                      Download airgap bundle
                    </button>
                  </div>
                  <span className="u-fontSize--small u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--more"> After copying the archive to your host, untar it and run the install script. </span>
                  <div className="flex flex-column u-marginTop--small">
                    <CodeSnippet
                      canCopy={true}
                      isCommand={true}
                      onCopyText={<span className="u-color--vidaLoca">Command has been copied to your clipboard</span>}
                    >
                      {installBundleCommand}
                    </CodeSnippet>
                  </div>
                </div>
              </div>
              <div className="u-marginTop--30">
                <p className="u-fontSize--24 u-fontWeight--bold u-color--mineShaft u-marginBottom--10"> System requirements </p>
                <p className="u-fontSize--normal u-color--dustyGray u-lineHeight--normal"> kURL is supported on the following operating systems that meet the minimum system requirements. </p>
                <div className="u-marginTop--20">
                  <p className="u-fontSize--large u-fontWeight--bold u-color--tundora"> Supported operating systems </p>
                  <div className="AppList--wrapper flex flexWrap--wrap">
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> Ubuntu 16.04 (Kernel version >= 4.15) </li>
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> Ubuntu 18.04 (Recommended) </li>
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> CentOS 7.4, 7.5, 7.6, 7.7 </li>
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> RHEL 7.4, 7.5, 7.6, 7.7 </li>
                  </div>
                </div>

                <div className="u-marginTop--20 u-borderTop--gray">
                  <p className="u-fontSize--large u-fontWeight--bold u-color--tundora"> Minimum system requirements </p>
                  <div className="AppList--wrapper flex flexWrap--wrap">
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> 4 CPUs or equivalent per machine </li>
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> 30 GB of Disk Space per machine </li>
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> UDP ports 6783 and 6784 open </li>
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> 8 GB of RAM per machine </li>
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> TCP ports 6443 and 6783 open </li>
                  </div>
                </div>
              </div>
            </div>
            {installerData ?
              <div className="flex flex-column u-marginLeft--20">
                <p className="u-fontSize--24 u-fontWeight--bold u-color--mineShaft u-marginBottom--20"> What you get </p>
                {installerData.spec.kubernetes &&
                  <div className={`flex u-cursor--pointer alignItems--center u-padding--20 ${selectedSpec === "kubernetes" && "isSelected"}`} onClick={() => this.whatYouGet("kubernetes")}>
                    <div className="flex u-width--250">
                      <div className="flex icon u-kubernetes u-marginRight--normal"></div>
                      <div className="WhatYouGet--wrapper flex flex-column">
                        <p className="u-color--tuna u-fontSize--large u-fontWeight--bold u-paddingBottom--small"> Kubernetes </p>
                        <p className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> {installerData.spec.kubernetes.version === "latest" ? "Latest version" : `Version ${installerData.spec.kubernetes.version}`} </p>
                      </div>
                    </div>
                    <div className="icon u-arrow u-marginRight--normal"></div>
                  </div>}
                {installerData.spec.weave &&
                  <div className={`flex u-cursor--pointer alignItems--center u-padding--20 ${selectedSpec === "weave" && "isSelected"}`} onClick={() => this.whatYouGet("weave")}>
                    <div className="flex u-width--250">
                      <div className="flex icon u-weave u-marginRight--normal"></div>
                      <div className="WhatYouGet--wrapper flex flex-column">
                        <p className="u-color--tuna u-fontSize--large u-fontWeight--bold u-paddingBottom--small"> Weave </p>
                        <p className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> {installerData.spec.weave.version === "latest" ? "Latest version" : `Version ${installerData.spec.weave.version}`} </p>
                      </div>
                    </div>
                    <div className="icon u-arrow u-marginRight--normal"></div>
                  </div>}
                {installerData.spec.contour &&
                  <div className={`flex u-cursor--pointer alignItems--center u-padding--20 ${selectedSpec === "contour" && "isSelected"}`} onClick={() => this.whatYouGet("contour")}>
                    <div className="flex u-width--250">
                      <div className="flex icon u-contour u-marginRight--normal"></div>
                      <div className="WhatYouGet--wrapper flex flex-column">
                        <p className="u-color--tuna u-fontSize--large u-fontWeight--bold u-paddingBottom--small"> Contour </p>
                        <p className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> {installerData.spec.contour.version === "latest" ? "Latest version" : `Version ${installerData.spec.contour.version}`} </p>
                      </div>
                    </div>
                    <div className="icon u-arrow u-marginRight--normal"></div>
                  </div>}
                {installerData.spec.rook &&
                  <div className={`flex u-cursor--pointer alignItems--center u-padding--20 ${selectedSpec === "rook" && "isSelected"}`} onClick={() => this.whatYouGet("rook")}>
                    <div className="flex u-width--250">
                      <div className="flex icon u-rook u-marginRight--normal"></div>
                      <div className="WhatYouGet--wrapper flex flex-column">
                        <p className="u-color--tuna u-fontSize--large u-fontWeight--bold u-paddingBottom--small"> Rook </p>
                        <p className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> {installerData.spec.rook.version === "latest" ? "Latest version" : `Version ${installerData.spec.rook.version}`} </p>
                      </div>
                    </div>
                    <div className="icon u-arrow u-marginRight--normal"></div>
                  </div>}
                {installerData.spec.registry &&
                  <div className={`flex u-cursor--pointer alignItems--center u-padding--20 ${selectedSpec === "registry" && "isSelected"}`} onClick={() => this.whatYouGet("registry")}>
                    <div className="flex u-width--250">
                      <div className="flex icon u-dockerRegistry u-marginRight--normal"></div>
                      <div className="WhatYouGet--wrapper flex flex-column">
                        <p className="u-color--tuna u-fontSize--large u-fontWeight--bold u-paddingBottom--small"> Docker Registry </p>
                        <p className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> {installerData.spec.registry.version === "latest" ? "Latest version" : `Version ${installerData.spec.registry.version}`} </p>
                      </div>
                    </div>
                    <div className="icon u-arrow u-marginRight--normal"></div>
                  </div>}
                {installerData.spec.docker &&
                  <div className={`flex u-cursor--pointer alignItems--center u-padding--20 ${selectedSpec === "docker" && "isSelected"}`} onClick={() => this.whatYouGet("docker")}>
                    <div className="flex u-width--250">
                      <div className="flex icon u-docker u-marginRight--normal"></div>
                      <div className="WhatYouGet--wrapper flex flex-column">
                        <p className="u-color--tuna u-fontSize--large u-fontWeight--bold u-paddingBottom--small"> Docker </p>
                        <p className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> {installerData.spec.docker.version === "latest" ? "Latest version" : `Version ${installerData.spec.docker.version}`} </p>
                      </div>
                    </div>
                    <div className="icon u-arrow u-marginRight--normal"></div>
                  </div>}
                {installerData.spec.prometheus &&
                  <div className={`flex u-cursor--pointer alignItems--center u-padding--20 ${selectedSpec === "prometheus" && "isSelected"}`} onClick={() => this.whatYouGet("prometheus")}>
                    <div className="flex u-width--250">
                      <div className="flex icon u-prometheus u-marginRight--normal"></div>
                      <div className="WhatYouGet--wrapper flex flex-column">
                        <p className="u-color--tuna u-fontSize--large u-fontWeight--bold u-paddingBottom--small"> Prometheus </p>
                        <p className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> {installerData.spec.prometheus.version === "latest" ? "Latest version" : `Version ${installerData.spec.prometheus.version}`} </p>
                      </div>
                    </div>
                    <div className="icon u-arrow u-marginRight--normal"></div>
                  </div>}
                {installerData.spec.velero &&
                  <div className={`flex u-cursor--pointer alignItems--center u-padding--20 ${selectedSpec === "velero" && "isSelected"}`} onClick={() => this.whatYouGet("velero")}>
                    <div className="flex u-width--250">
                      <div className="flex icon u-velero u-marginRight--normal"></div>
                      <div className="WhatYouGet--wrapper flex flex-column">
                        <p className="u-color--tuna u-fontSize--large u-fontWeight--bold u-paddingBottom--small"> Velero </p>
                        <p className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> {installerData.spec.velero.version === "latest" ? "Latest version" : `Version ${installerData.spec.velero.version}`} </p>
                      </div>
                    </div>
                    <div className="icon u-arrow u-marginRight--normal"></div>
                  </div>}
                {installerData.spec.kotsadm &&
                  <div className={`flex u-cursor--pointer alignItems--center u-padding--20 ${selectedSpec === "kotsadm" && "isSelected"}`} onClick={() => this.whatYouGet("kotsadm")}>
                    <div className="flex u-width--250">
                      <div className="flex icon u-kots u-marginRight--normal"></div>
                      <div className="WhatYouGet--wrapper flex flex-column">
                        <p className="u-color--tuna u-fontSize--large u-fontWeight--bold u-paddingBottom--small"> Kotsadm </p>
                        <p className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal"> {installerData.spec.kotsadm.version === "latest" ? "Latest version" : `Version ${installerData.spec.kotsadm.version}`} </p>
                      </div>
                    </div>
                    <div className="icon u-arrow u-marginRight--normal"></div>
                  </div>}
              </div>
              : null}
            <div className="flex flex1 u-marginLeft--20">
              {installerData ?
                <div className="DataEditor--wrapper flex flex1 flex-column">
                  <p className="u-fontSize--jumbo u-fontWeight--bold u-color--white u-marginTop--none"> {Utilities.toTitleCase(selectedSpec)} {installerData.spec[selectedSpec].version} </p>
                  <p className="u-fontSize--normal u-color--silverChalice u-marginTop--none"> The installation script will install {Utilities.toTitleCase(selectedSpec)} version {installerData.spec[selectedSpec].version}. </p>

                  <div className="u-borderTop--silverChalice u-marginTop--8">
                    <p className="u-fontSize--large u-fontWeight--bold u-color--white u-marginTop--20"> Override flags </p>
                    <p className="u-fontSize--normal u-color--silverChalice u-marginTop--none"> You can run your install command with any of the following flags to override values for {Utilities.toTitleCase(selectedSpec)}. </p>
                  </div>

                  <div className="flex u-borderBottom--silverChalice justifyContent--center">
                    <div className="u-width--120 u-fontSize--small u-fontWeight--medium u-color--alabasterapprox u-marginBottom--10"> Flag </div>
                    <div className="u-width--120 u-fontSize--small u-fontWeight--medium u-color--alabasterapprox u-marginBottom--10"> Description </div>
                  </div>
                  <div className="flex1 flex-column">
                    {this.getVersionData(Object.keys(installerData.spec[selectedSpec]))}
                  </div>
                  <div className="flex justifyContent--center alignItems--center">
                    <span className="status-dot"></span>
                    <p className="u-color--alabasterapprox u-fontSize--small u-fontWeight--normal"> Currently defined in your install script </p>
                  </div>
                </div> : null}
            </div>
          </div>
        }
      </div>
    );
  }
}

export default AppComponent;
