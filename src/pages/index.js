import React from "react";
import Layout from "../components/Layout";
import Kurlsh from "../components/Kurlsh";
import Loader from "../components/shared/Loader";
import { Resizer } from "../components/shared/Resize";
import { BreakpointConfig } from "../services/breakpoints";

@Resizer(BreakpointConfig)
class Kurl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      installerData: null,
      isMobile: false
    };
  }
  
  fetchInstallerData = async () => {
    try {
      const resp = await fetch("https://kurl.sh/installer");  
      const installerData = await resp.json();
      this.setState({
        installerData
      });
    } catch (error) {
      throw error;
    }
  }
  
  componentDidMount() {
    if (!this.props.data) {
      this.fetchInstallerData();
    }
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
    const { installerData } = this.state;

    return (
      <Layout isMobile={isMobile} title={"kURL - Open Source Kubernetes Installer"}> 
        { installerData 
          ? <Kurlsh isMobile={isMobile} installerData={installerData} />
          : <Loader size="70" />
        }
      </Layout>
    )
  }
};

export default Kurl;