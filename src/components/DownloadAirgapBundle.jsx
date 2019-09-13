import * as React from "react";
import autoBind from "react-autobind";
import { withRouter } from "react-router-dom";


import CodeSnippet from "./shared/CodeSnippet.jsx";

class DownloadAirgapBundle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDownloadingBundle: false
    };
    autoBind(this);
  }

  onBundleDownload = () => {
    this.setState({ isDownloadingBundle: !this.state.isDownloadingBundle});
  }

  render() {
    const { isDownloadingBundle } = this.state;
    const { sha } = this.props.match.params;
    const bundleUrl = `curl -LO https://kurl.sh/bundle/${sha}.tar.gz`
    const installBundleCommand = `
    tar xvf ${sha}.tar.gz
cat install.sh | sudo bash
    `

    return (
      <div className="u-minHeight--full u-width--full u-overflow--auto container flex-column flex1 alignItems--center">
        <div className="flex1 u-width--full justifyContent--center alignItems--center">
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
      </div>
    );
  }
}

export default withRouter(DownloadAirgapBundle);