import React from "react";
import Layout from "../components/Layout";
import SupportedAddOns from "../components/SupportedAddOns";
import { Resizer } from "../components/shared/Resize";
import { BreakpointConfig } from "../services/breakpoints";

@Resizer(BreakpointConfig)
class AddOns extends React.Component {
  render() {
    const isMobile = this.props.breakpoint === "mobile";

    return (
      <Layout isMobile={isMobile} title={"kURL - Supported Kubernetes add-ons"}>
        <SupportedAddOns isMobile={isMobile} />
      </Layout>
    )
  }
};

export default AddOns;