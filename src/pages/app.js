import React from "react"
import { Router, Location } from "@reach/router";
import Layout from "../components/Layout";
import AppComponent from "../components/App";

import { Resizer } from "../components/shared/Resize";
import { BreakpointConfig } from "../services/breakpoints";

@Resizer(BreakpointConfig)
class App extends React.Component {
  state = {
    isMobile: false
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
    return (
    <Layout isMobile={isMobile}>
      <FadeTransitionRouter>
        <AppComponent path="app/:sha" isMobile={isMobile} />
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

export default App;