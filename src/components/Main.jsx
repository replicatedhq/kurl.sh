import * as React from "react";
import autoBind from "react-autobind";
import { withRouter } from "react-router-dom";

import MonacoEditor from "react-monaco-editor";

import "../scss/components/Main";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kubernetesYaml: `apiVersion: kurl.sh/v1beta1
      kind: Installer
      metadata:
        name: ""
      spec:
        kubernetes:
          version: "1.15.1"
        weave:
          version: "2.5.2"
        rook:
          version: "1.0.4"
        contour:
          version: "0.14.0"`

    };
    autoBind(this);
  }

  render() {
    return (
      <div className="u-minHeight--full u-width--full u-overflow--auto container flex-column flex1 alignItems--center">
        <div className="flex-auto u-width--full">
          <span className="u-fontSize--header2 u-fontWeight--bold u-color--tarawera">kurl</span>
          <span className="u-fontSize--header2 u-fontWeight--bold u-color--dustyGray">.sh</span>
        </div>
        <div className="u-flexTabletReflow flex-1-auto u-width--full">
          <div className="flex1 flex-column">
            <div className="left-content-wrap flex-column justifyContent--center alignItems--center">
              <div className="u-marginTop--more u-fontSize--larger u-fontWeight--medium u-lineHeight--more u-color--tuna">
                Kurl is a Kubernetes installer for airgapped and online clusters. 
                This form allows you to quickly build an installer and will provide you with a URL that it can be installed at.
                  </div>
              </div>
            </div>
          <div className="u-paddingLeft--60 flex-1-auto flex-column">
            <div className="MonacoEditor--wrapper helm-values flex1 flex u-height--full u-width--full u-marginTop--20">
                <div className="flex-column u-width--half u-overflow--hidden">
                  <MonacoEditor
                    ref={(editor) => { this.monacoEditor = editor }}
                    language="yaml"
                    onChange={this.onYamlChange}
                    value={this.state.kubernetesYaml}
                    height="100%"
                    width="100%"
                    options={{
                      readOnly: true,
                      minimap: {
                        enabled: false
                      }, 
                    scrollBeyondLastLine: false,
                    lineNumbers:"off"
                  }}
                  />
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Main);