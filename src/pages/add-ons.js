import React from "react";
import Layout from "../components/Layout";
import CustomQueryStringComponent from "../components/CustomQueryStringComponent";
import { Resizer } from "../components/shared/Resize";
import { BreakpointConfig } from "../services/breakpoints";

@Resizer(BreakpointConfig)
class AddOns extends React.Component {
  state = {
    isMobile: false
  }

  componentDidMount() {
    if (this.props.breakpoint && this.props.breakpoint === "mobile") {
      this.setState({ isMobile: true })
    }
  }

  componentDidUpdate(lastProps) {
    if (this.props.breakpoint !== lastProps.breakpoint && this.props.breakpoint) {
      if (this.props.breakpoint === "mobile") {
        this.setState({ isMobile: true })
      } else {
        this.setState({ isMobile: false })
      }
    }
  }

  render() {
    const { isMobile } = this.state;

    return (
      <Layout isMobile={isMobile} title={"kURL - Supported Kubernetes add-ons"}>
        <CustomQueryStringComponent isMobile={isMobile} />
      </Layout>
    )
  }
};

export default AddOns;