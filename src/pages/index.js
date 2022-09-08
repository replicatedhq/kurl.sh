import React from "react";
import { Router, Location } from "@reach/router";
import Layout from "../components/Layout";
import Kurlsh from "../components/Kurlsh";
import AppComponent from "../components/App";
import Loader from "../components/shared/Loader";
import { Resizer } from "../components/shared/Resize";
import { BreakpointConfig } from "../services/breakpoints";
import { Utilities } from "../components/utilities";


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


    return (
      <Layout isMobile={isMobile} title={"kURL - Open Source Kubernetes Installer"}>
        <FadeTransitionRouter>
          {supportedVersions && location.pathname === "/"
            ? <Kurlsh path="/" isMobile={isMobile} supportedVersions={supportedVersions} />
            : <Loader className="flex flex1 justifyContent--center alignItems--center" path="/" size="70" />
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