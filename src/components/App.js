import * as React from "react";
import CodeSnippet from "./shared/CodeSnippet";
import Loader from "./shared/Loader";
import AppVersionCard from "./AppVersionCard";
import { Utilities } from "./utilities";

import "../scss/components/App.scss";
import versionDetails from "../../static/versionDetails.json";

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
    const bundleUrl = `${process.env.KURL_BUNDLE_URL}/${sha}.tar.gz`
    // Make sure the installer sha actually exists
    const installerUrl = `${process.env.KURL_INSTALLER_URL}/${sha}`
    this.setState({ loadingBundleUrl: true });
    let mode = "same-origin"
    if (process.env.IS_DEVELOPMENT === "true") {
      mode = "cors" 
      // this is unneeded on staging/prod, as the request is to the same origin
      // for dev, it allows access to existing bundles but fails for bundles that don't exist (as we don't provide accept headers for 404s)
    }
    try {
      const response = await fetch(installerUrl, {
        method: "HEAD",
        mode: mode
      });
      this.setState({ responseStatusCode: response.status, bundleUrl: bundleUrl, loadingBundleUrl: false })
    } catch (error) {
      console.log(error);
      this.setState({ loadingBundleUrl: false });
      return;
    }
  }

  whatYouGet = (spec) => {
    this.setState({ selectedSpec: spec });
  }

  getVersionDetails = (addOn) => {
    this.setState({ versionData: versionDetails[addOn] });
  }

  getVersionData = (installerData) => {
    const { versionData } = this.state;
    return versionData.map((data, i) => {
      const existInInstallerYaml = installerData.find((d) => data.flag === d);
      return (
        <div className="InstallerRow flex alignItems--center u-borderBottom--silverChalice u-padding--normal" key={`${data}-${i}`}>
          {existInInstallerYaml ? <span className="status-dot"></span> : <span></span>}
          <div className="flex flex1 alignItems--center justifyContent--center">
            <div className="FlagDetails flex-column u-width--150">
              <span className="u-color--alabasterapprox u-fontSize--small u-fontWeight--normal"> {data.flag ? `${data.flag}` : "version"} </span>
              <span className="u-color--silverChalice u-fontSize--small u-fontWeight--normal"> {data.type} </span>
            </div>
            <div className="flex u-width--150 u-color--alabasterapprox u-fontSize--small u-fontWeight--normal u-marginLeft--normal"> {data.description} </div>
          </div>
        </div>
      )
    })
  }

  render() {
    const { loadingBundleUrl, installerData, selectedSpec, fetchingInstallerDataError } = this.state;
    const { isMobile } = this.props;
    const sha = this.props.sha;
    const installCommand = `curl -LO ${process.env.API_URL}/${sha} | sudo bash`
    const downloadUrl = `${process.env.KURL_BUNDLE_URL}/${sha}.tar.gz`
    const installBundleCommand = `
curl -LO ${process.env.KURL_BUNDLE_URL}/${sha}.tar.gz
tar xvzf ${sha}.tar.gz
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
      <div className={`u-minHeight--full u-width--full flex-column flex1 u-marginBottom---40 ${isMobile ? "mobile-container u-overflow--auto" : "container u-overflow--hidden"}`}>
        {fetchingInstallerDataError ?
          <div className="flex1 flex-column justifyContent--center alignItems--center">
            <p className="u-color--chestnut u-fontSize--normal u-fontWeight--medium u-lineHeight--normal u-marginTop--10">
              {fetchingInstallerDataError.message}
            </p>
          </div>
          :
          <div className={`u-flexTabletReflow ${!isMobile ? "flex1 justifyContent--spaceBetween" : "flex-column"}`}>
            <div className={`flex flex-column u-overflow--auto justifyContent--flexStart ${!isMobile && "Installer--wrapper"}`}>
              <p className="u-fontSize--24 u-fontWeight--bold u-color--mineShaft u-marginBottom--20">
                Your installer
              </p>
              <div className="u-fontSize--large u-fontWeight--bold u-color--tundora">
                Install online
              </div>
              <div className="flex flex-column u-marginTop--normal">
                <CodeSnippet
                  isCommand={true}
                  canCopy={true}
                  onCopyText={<span className="u-color--vidaLoca">Command has been copied to your clipboard</span>}
                >
                  {installCommand}
                </CodeSnippet>
              </div>
              <div className="u-marginTop--normal u-borderTop--gray">
                <div className="u-fontSize--large u-fontWeight--bold u-color--tundora u-marginTop--normal">
                  Install airgap
                </div>
                <div className="u-marginTop--normal u-marginBottom--normal">
                <a href={downloadUrl} type="button" className="Button primary">Download airgap bundle</a>
                </div>
                <span className="u-fontSize--small u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--more">
                  After copying the archive to your host, untar it and run the install script.
                </span>
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
              <div className="u-marginTop--30">
                <p className="u-fontSize--24 u-fontWeight--bold u-color--mineShaft u-marginBottom--10">
                  System requirements
                  </p>
                <p className="u-fontSize--normal u-color--dustyGray u-lineHeight--normal">
                  kURL is supported on the following operating systems that meet the minimum system requirements.
                </p>
                <div className="u-marginTop--20">
                  <p className="u-fontSize--large u-fontWeight--bold u-color--tundora">
                    Supported operating systems
                  </p>
                  <div className="AppList--wrapper flex flexWrap--wrap">
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal">
                      Ubuntu 18.04 (Recommended)
                    </li>
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal">
                      Ubuntu 20.04 (Docker version >= 19.03.10)
                    </li>
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal">
                      CentOS 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8.1, 8.2, 8.3 (CentOS 8.x requires Containerd)
                    </li>
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal">
                      RHEL 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8.1, 8.2, 8.3 (RHEL 8.x requires Containerd)
                    </li>
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal">
                      Oracle Linux 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8.1, 8.2, 8.3 (OL 8.x requires Containerd)
                    </li>
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal">
                      Amazon Linux 2
                    </li>
                  </div>
                </div>

                <div className="u-marginTop--20 u-borderTop--gray">
                  <p className="u-fontSize--large u-fontWeight--bold u-color--tundora">
                    Minimum system requirements
                  </p>
                  <div className="AppList--wrapper flex flexWrap--wrap">
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal">
                      4 CPUs or equivalent per machine
                    </li>
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal">
                      30 GB of Disk Space per machine
                    </li>
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal">
                      UDP ports 6783 and 6784 open
                    </li>
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal">
                      8 GB of RAM per machine
                    </li>
                    <li className="u-fontSize--small u-color--dustyGray u-fontWeight--medium u-lineHeight--normal">
                      TCP ports 6443 and 6783 open
                    </li>
                  </div>
                </div>
              </div>
            </div>
            <div className={`InstallerAddOns flex flex1 u-overflow--auto justifyContent--flexEnd ${isMobile && "u-marginTop--20"}`}>
              {installerData &&
                <div className="flex flex-column u-marginLeft--20 u-overflow--auto">
                  <p className="u-fontSize--24 u-fontWeight--bold u-color--mineShaft u-marginBottom--20">
                    What you get
                  </p>
                  {installerData.spec.kubernetes &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"kubernetes"} installerData={installerData.spec.kubernetes} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.weave &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"weave"} installerData={installerData.spec.weave} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.contour &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"contour"} installerData={installerData.spec.contour} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.rook &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"rook"} installerData={installerData.spec.rook} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.minio &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"minio"} installerData={installerData.spec.minio} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.registry &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"registry"} installerData={installerData.spec.registry} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.docker &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"docker"} installerData={installerData.spec.docker} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.prometheus &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"prometheus"} installerData={installerData.spec.prometheus} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.containerd &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"containerd"} installerData={installerData.spec.containerd} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.velero &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"velero"} installerData={installerData.spec.velero} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.kotsadm &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"kotsadm"} installerData={installerData.spec.kotsadm} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.fluentd &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"fluentd"} installerData={installerData.spec.fluentd} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.openebs &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"openebs"} installerData={installerData.spec.openebs} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.longhorn &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"longhorn"} installerData={installerData.spec.longhorn} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.ekco &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"ekco"} installerData={installerData.spec.ekco} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.collectd &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"collectd"} installerData={installerData.spec.collectd} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.metricsServer &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"metricsServer"} installerData={installerData.spec.metricsServer} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.certManager &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"certManager"} installerData={installerData.spec.certManager} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.sonobuoy &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"sonobuoy"} installerData={installerData.spec.sonobuoy} whatYouGet={this.whatYouGet} />}
                  {installerData.spec.localPathProvisioner &&
                    <AppVersionCard selectedSpec={selectedSpec} name={"sonobuoy"} installerData={installerData.spec.localPathProvisioner} whatYouGet={this.whatYouGet} />}
                </div>
              }
              {installerData &&
                <div className="DataEditor--wrapper flex flex-column u-marginLeft--20 u-overflow--auto">
                  <p className="u-fontSize--jumbo u-fontWeight--bold u-color--white u-marginTop--none">
                    {Utilities.toTitleCase(selectedSpec)} {installerData.spec[selectedSpec].version}
                  </p>
                  <p className="u-fontSize--normal u-color--silverChalice u-marginTop--none">
                    The installation script will install {Utilities.toTitleCase(selectedSpec)} version {installerData.spec[selectedSpec].version}.
                  </p>

                  <div className="u-borderTop--silverChalice u-marginTop--8">
                    <p className="u-fontSize--large u-fontWeight--bold u-color--white u-marginTop--20">
                      Override flags
                    </p>
                    <p className="u-fontSize--normal u-color--silverChalice u-marginTop--none">
                      You can run your install command with any of the following flags to override values for {Utilities.toTitleCase(selectedSpec)}.
                    </p>
                  </div>

                  <div className="flex u-borderBottom--silverChalice justifyContent--center">
                    <div className="u-width--150 u-fontSize--small u-fontWeight--medium u-color--alabasterapprox u-marginBottom--10">
                      Flag
                    </div>
                    <div className="u-width--150 u-fontSize--small u-fontWeight--medium u-color--alabasterapprox u-marginBottom--10 u-marginLeft--normal">
                      Description
                    </div>
                  </div>
                  <div className="flex flex-column u-overflow--auto">
                    {this.getVersionData(Object.keys(installerData.spec[selectedSpec]))}
                  </div>
                  <div className="flex alignItems--center justifyContent--center" style={{ marginTop: "10px" }}>
                    <span className="status-dot" />
                    <span className="u-color--alabasterapprox u-fontSize--small u-fontWeight--normal">
                      Currently defined in your install script
                    </span>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    );
  }
}

export default AppComponent;
