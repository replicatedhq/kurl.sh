import React from "react";
import { StaticQuery, graphql } from "gatsby";

import { parseLinksToTree } from "../utils/parse-links-to-tree";

import { NavTree } from "./NavTree";
import("../scss/components/Sidebar.scss");

const Sidebar = ({ isMobile }) => (
  <StaticQuery
    query={graphql`
      {
        allMarkdownRemark(sort: { fields: [frontmatter___path], order: ASC }) {
          edges {
            node {
              frontmatter {
                path
                title
              }
            }
          }
        }
      }
    `}
    render={({ allMarkdownRemark: { edges: pages } }) => (
      <div className={`${isMobile ? "MobileSidebar" : "Sidebar"} flex-column flex1`}>
        <NavTree tree={parseLinksToTree(pages)} />
      </div>
    )}
  />
);

export default Sidebar;
