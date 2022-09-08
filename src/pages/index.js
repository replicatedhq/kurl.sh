import React from "react";
import { Router, Location } from "@reach/router";
import Layout from "../components/Layout";
import Kurlsh from "../components/Kurlsh";
import AppComponent from "../components/App";
import Loader from "../components/shared/Loader";
import { Resizer } from "../components/shared/Resize";
import { BreakpointConfig } from "../services/breakpoints";
import { Utilities } from "../components/utilities";

import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'

@Resizer(BreakpointConfig)
class Kurl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
      supportedVersions: null
    };
  }

  getSupportedVersions = async () => {	
    this.setState({ supportedVersions: await Utilities.getSupportedVersions() })
  }

  componentDidMount() {
    if (this.props.breakpoint) {
      this.setState({ isMobile: this.props.breakpoint === "mobile" })
    }
    this.getSupportedVersions();	
  }

  componentDidUpdate(lastProps) {
    if (this.props.breakpoint !== lastProps.breakpoint && this.props.breakpoint) {
      this.setState({ isMobile: this.props.breakpoint === "mobile" })
    }
  }


  render() {
    const { isMobile, supportedVersions } = this.state;
    const { location } = this.props;

    // If there's no bugsnag api key, then use the ReplicatedErrorBoundary
    //const bugsnagClient = import.meta.env.VITE_BUGSNAG_API_KEY
    const bugsnagApiKey = "d9853b1ecad8ac8750308fe7ce9335b8"
    const bugsnagClient = bugsnagApiKey
      ? Bugsnag.start({
          //apiKey: import.meta.env.VITE_BUGSNAG_API_KEY,
          apiKey: bugsnagApiKey,
          //appVersion: import.meta.env.VITE_VENDOR_WEB_BUILD_VERSION,
          //releaseStage: import.meta.env.VITE_BUGSNAG_RELEASE_STAGE,
          //notifyReleaseStages: ["production", "staging"],
          plugins: [new BugsnagPluginReact()]
        })
      : null;

    const BugsnagErrorBoundary = bugsnagClient
      ? bugsnagClient.getPlugin("react").createErrorBoundary(React)
      : <div></div>;

    return (
      <Layout isMobile={isMobile} title={"kURL - Open Source Kubernetes Installer"}>
        <BugsnagErrorBoundary>
        <FadeTransitionRouter>
          {supportedVersions && location.pathname === "/"
            ? <Kurlsh path="/" isMobile={isMobile} supportedVersions={supportedVersions} />
            : <Loader className="flex flex1 justifyContent--center alignItems--center" path="/" size="70" />
          }
          <AppComponent path="/:sha" isMobile={isMobile} />
        </FadeTransitionRouter>
        </BugsnagErrorBoundary>
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