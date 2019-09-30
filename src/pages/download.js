import React from "react"
import { Router, Location } from "@reach/router"
import NavBar from "../components/shared/NavBar";
import DownloadAirgapBundle from "../components/DownloadAirgapBundle";
import Footer from "../components/shared/Footer"

const Download = () => (
  <div className="u-minHeight--full flex-column flex1">
    <div className="flex-column flex1">
      <NavBar />

      <FadeTransitionRouter>
        <DownloadAirgapBundle path="download/:sha" />
      </FadeTransitionRouter>
      <div className="flex-auto Footer-wrapper u-width--full">
        <Footer />
      </div>
    </div>
  </div>
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