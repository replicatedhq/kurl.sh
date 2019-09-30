import React from "react"
import { Router, Location } from "@reach/router";
import Layout from "../components/Layout";
import DownloadAirgapBundle from "../components/DownloadAirgapBundle";

const Download = () => (
  <Layout>
    <FadeTransitionRouter>
      <DownloadAirgapBundle path="download/:sha" />
    </FadeTransitionRouter>
  </Layout>
)

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