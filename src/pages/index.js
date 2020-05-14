import React from "react";
import { Router, Location } from "@reach/router";
import Layout from "../components/Layout";
import Kurlsh from "../components/Kurlsh";
import AppComponent from "../components/App";
import Loader from "../components/shared/Loader";
import { Resizer } from "../components/shared/Resize";
import { BreakpointConfig } from "../services/breakpoints";

import installerData from "../../static/installer.json";

@Resizer(BreakpointConfig)
class Kurl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: false
    };
  }

  componentDidMount() {
    if (this.props.breakpoint) {
      this.setState({ isMobile: this.props.breakpoint === "mobile" })
    }
  }

  componentDidUpdate(lastProps) {
    if (this.props.breakpoint !== lastProps.breakpoint && this.props.breakpoint) {
      this.setState({ isMobile: this.props.breakpoint === "mobile" })
    }
  }



  render() {
    const { isMobile } = this.state;
    const { location } = this.props;


    return (
      <Layout isMobile={isMobile} title={"kURL - Open Source Kubernetes Installer"}>
        <FadeTransitionRouter>
          {installerData && location.pathname === "/"
            ? <Kurlsh path="/" isMobile={isMobile} installerData={installerData} />
            : <Loader path="/" size="70" />
          }
          <AppComponent path="/:sha" isMobile={isMobile} />
        </FadeTransitionRouter>
      </Layout>
    )
  }
};

const FadeTransitionRouter = props => (
  <Location>
    {({ location }) => (
      <Router location={location} className="flex-column flex1">
        {props.children}
      </Router>
    )}
  </Location>
)

export default Kurl;