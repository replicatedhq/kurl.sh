import * as React from "react";
import { Link } from "@reach/router";

import CodeSnippet from "./shared/CodeSnippet";
import Loader from "./shared/Loader";


class DownloadAirgapBundle extends React.Component {
  state = {
    responseStatusCode: null,
    bundleUrl: ""
  };

  componentDidMount() {
    if (this.props.sha) {
      this.checkS3Response(this.props.sha);
    }
  }

  checkS3Response = async (sha) => {
    const url = `https://cors-anywhere.herokuapp.com/${process.env.KURL_BUNDLE_URL}/${sha}.tar.gz`
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/tar+gzip",
        },
        mode: "cors"
      });
      this.setState({ responseStatusCode: response.status, bundleUrl: `${process.env.KURL_BUNDLE_URL}/${sha}.tar.gz` })
    } catch (error) {
      console.log(error);
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

  render() {
    const { responseStatusCode } = this.state;
    const sha = this.props.sha;
    const bundleUrl = `curl -LO https://kurl.sh/bundle/${sha}.tar.gz`
    const installBundleCommand = `
tar xvf ${sha}.tar.gz
cat install.sh | sudo bash
    `


    return (
      <div className="u-minHeight--full u-width--full u-overflow--auto container flex-column flex1 u-marginBottom---40">
        <div className="flex-1-auto flex u-width--full justifyContent--center alignItems--center">
          {!responseStatusCode || responseStatusCode >= 400 ?
            <div className="flex-column flex-1-auto u-overflow--hidden justifyContent--center alignItems--center">
              <Loader
                size="70"
              />
              <div className="u-fontSize--large u-textAlign--center u-fontWeight--medium u-color--tuna u-marginTop--30"> We’re still building the airgap bundle, this could take a few minutes. You can wait here or simply comeback to this page in a little bit to check if it’s ready. </div>
            </div>
            :
            <div>
              <div className="flex1">
                <span className="u-fontSize--small u-fontWeight--medium u-color--dustyGray u-lineHeight--normal u-marginTop--small"><Link to="/" className="replicated-link">kurl.sh</Link> > {sha} > download airgap bundle </span>
              </div>
              <div className="flex-column wrapperForm u-marginTop--normal">
                <div className="flex1">
                  <div className="FormLabel u-marginBottom--5"> Download airgap installer </div>
                  <span className="u-fontSize--small u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--more"> You can get the airgap bundle a couple of ways. You can download it directly from here or via a CLI. </span>
                  <div className="u-marginTop--normal">
                    <button
                      type="button"
                      className="Button primary"
                      onClick={() => this.handleDownloadBundle()}
                    >
                      Download airgap bundle
                    </button>
                  </div>
                </div>
                <div className="u-marginTop--normal u-borderTop--gray">
                  <div className="flex flex-column u-marginTop--normal">
                    <CodeSnippet
                      canCopy={true}
                      onCopyText={<span className="u-color--vidaLoca">URL has been copied to your clipboard</span>}
                    >
                      {bundleUrl}
                    </CodeSnippet>
                  </div>
                </div>
                <div className="u-marginTop--40">
                  <div className="flex1">
                    <div className="FormLabel u-marginBottom--5"> Install airgap bundle </div>
                    <span className="u-fontSize--small u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--more"> After copying the archive to your host, untar it and run the install script. </span>
                  </div>
                  <div className="flex flex-column u-marginTop--normal">
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
              <div className="flex1">
                <span className="u-fontSize--small u-fontWeight--medium u-color--dustyGray u-lineHeight--normal u-marginTop--small">Need more help? <a href="https://github.com/replicatedhq/kurl#airgapped-usage" target="_blank" rel="noopener noreferrer" className="replicated-link">Check out our docs.</a> </span>
              </div>
              <div className="flex justifyContent--center u-marginTop--30">
                <Link to="/" className="Button secondary"> Back to install URL builder </Link>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default DownloadAirgapBundle;
