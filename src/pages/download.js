import React from "react"
import { Router, Location } from "@reach/router";
import Layout from "../components/Layout";
import DownloadAirgapBundle from "../components/DownloadAirgapBundle";

import { Resizer } from "../components/shared/Resize";
import { BreakpointConfig } from "../services/breakpoints";

@Resizer(BreakpointConfig)
class Download extends React.Component {
  render() {
    const isMobile = this.props.breakpoint === "mobile";
    return (
    <Layout isMobile={isMobile} title={"kURL - Download airgap installer"}>
      <FadeTransitionRouter>
        <DownloadAirgapBundle path="download/:sha" isMobile={isMobile} />
      </FadeTransitionRouter>
    </Layout>
    )
  }
}

const FadeTransitionRouter = props => (
  <Location>
    {({ location }) => (
      <Router location={location} className="flex-column flex1">
        {props.children}
      </Router>
    )}
  </Location>
)

export default Download;