import * as React from "react";
import { Link } from "@reach/router";

class DocsPage extends React.Component {

  render() {
    return (
      <div className="u-minHeight--full u-width--full flex-column flex1 u-overflow--auto">
        <div className="container u-marginBottom---40">
          <div className="flex-column">
            <Link to="/docs/create-an-installer" className="u-color--royalBlue u-lineHeight--normal u-fontSize--small u-textDecoration--underlineOnHover"> Ceate An Installer </Link>
            <Link to="/docs/supporting-installation" className="u-color--royalBlue u-lineHeight--normal u-fontSize--small u-textDecoration--underlineOnHover"> Supporting Installation </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default DocsPage;