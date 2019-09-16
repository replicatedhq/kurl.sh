import * as React from "react";
import { withRouter } from "react-router-dom";


import CodeSnippet from "./shared/CodeSnippet.jsx";
import Loader from "./shared/Loader.jsx";

class DownloadAirgapBundle extends React.Component {
  state = {
    isDownloadingBundle: false,
    responseStatusCode: null
  };

  onBundleDownload = () => {
    this.setState({ isDownloadingBundle: !this.state.isDownloadingBundle });
  }

  componentDidMount() {
    if (this.props.match.params.sha) {
      this.checkS3Response(this.props.match.params.sha);
    }
  }

  checkS3Response = async (sha) => {
    const url = `https://cors-anywhere.herokuapp.com/${window.env.KURL_BUNDLE_URL}/${sha}.tar.gz`
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/tar+gzip",
        },
        mode: "cors"
      });
      this.setState({ responseStatusCode: response.status })
    } catch (error) {
      console.log(error);
      return;
    }
  }

  render() {
    const { isDownloadingBundle, responseStatusCode } = this.state;
    const { sha } = this.props.match.params;
    const bundleUrl = `curl -LO https://kurl.sh/bundle/${sha}.tar.gz`
    const installBundleCommand = `
tar xvf ${sha}.tar.gz
cat install.sh | sudo bash
    `

    return (
      <div className="u-minHeight--full u-width--full u-overflow--auto container flex-column flex alignItems--center">
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
              <div className="flex-column wrapperForm u-marginTop--normal">
                <div className="flex1">
                  <div className="FormLabel u-marginBottom--small"> Download airgap installer </div>
                  <span className="u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--more"> You can get the airgap bundle a couple of ways. You can download it directly from here or via a CLI. </span>
                  <div className="u-marginTop--normal">
                    <button
                      type="button"
                      className="Button primary"
                      onClick={() => this.onBundleDownload()}
                    >
                      Download airgap bundle
                                    </button>
                  </div>
                </div>
                {isDownloadingBundle ?
                  <div>
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
                        <div className="FormLabel u-marginBottom--small"> Install airgap bundle </div>
                        <span className="u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--more"> After copying the archive to your host, untar it and run the install script. </span>
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
                  : null
                }
              </div>
              <div className="flex1">
                <span className="u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginTop--small">Need more help? <a href="https://github.com/replicatedhq/kurl#airgapped-usage" target="_blank" rel="noopener noreferrer" className="replicated-link">Check out our docs.</a> </span>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default withRouter(DownloadAirgapBundle);