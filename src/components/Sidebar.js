import React from "react";
import { StaticQuery, graphql } from "gatsby";
import SidebarFileTree from "./shared/SidebarFileTree";
import { parseLinksToTree } from "../utils/parse-links-to-tree";

import "../scss/components/Sidebar.scss";

const Sidebar = ({ isMobile }) => (
  <StaticQuery
    query={graphql`
      {
        allMarkdownRemark(sort: { fields: [frontmatter___weight], order: ASC }) {
          edges {
            node {
              frontmatter {
                path
                linktitle
                title
              }
            }
          }
        }
      }
    `}
    render={({ allMarkdownRemark: { edges: pages } }) => {
      const tree = parseLinksToTree(pages);
      return (
        <div className={`${isMobile ? "MobileSidebar" : "Sidebar"} flex-column flex1`}>
          <SidebarFileTree data={tree} />
        </div>
      );
    }}
  />
);

export default Sidebar;
