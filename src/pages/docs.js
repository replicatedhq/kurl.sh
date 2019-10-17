import React from "react";
import DocumentationLayout from "../components/shared/DocumentationLayout";
import DocsPage from "../components/DocsPage";
import { Resizer } from "../components/shared/Resize";
import { BreakpointConfig } from "../services/breakpoints";

@Resizer(BreakpointConfig)
class Docs extends React.Component {
  render() {
    const isMobile = this.props.breakpoint === "mobile";

    return (
      <DocumentationLayout isMobile={isMobile}>
        <DocsPage isMobile={isMobile} />
      </DocumentationLayout>
    )
  }
};

export default Docs;