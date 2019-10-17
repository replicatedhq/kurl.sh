import React from "react";
import Layout from "../components/Layout";
import Kurlsh from "../components/Kurlsh";
import { Resizer } from "../components/shared/Resize";
import { BreakpointConfig } from "../services/breakpoints";

@Resizer(BreakpointConfig)
class Kurl extends React.Component {
  render() {
    const isMobile = this.props.breakpoint === "mobile";

    return (
      <Layout isMobile={isMobile}>
        <Kurlsh isMobile={isMobile} />
      </Layout>
    )
  }
};

export default Kurl;