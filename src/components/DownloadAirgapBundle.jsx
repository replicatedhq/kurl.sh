import * as React from "react";
import autoBind from "react-autobind";
import { withRouter } from "react-router-dom";


// import CodeSnippet from "./shared/CodeSnippet.jsx";

class DownloadAirgapBundle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    autoBind(this);
  }

  render() {

    return (
      <div className="u-minHeight--full u-width--full u-overflow--auto container flex-column flex1 alignItems--center">
        <div className="u-flexTabletReflow flex-1-auto u-width--full">
          HA
        </div>
      </div>
    );
  }
}

export default withRouter(DownloadAirgapBundle);