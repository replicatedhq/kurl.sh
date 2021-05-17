import React, { Component } from "react";
import classNames from "classnames";
import { StaticQuery, graphql, Link } from "gatsby";
import SidebarFileTree from "./shared/SidebarFileTree";
import { parseLinksToTree } from "../utils/parse-links-to-tree";

import "../scss/components/Sidebar.scss";

export default class Sidebar extends Component {
  render() {
    return (
      <StaticQuery
        query={graphql`
      {
        allMarkdownRemark(
          filter: { fields: { collection: { eq: "release-notes" } } }
          sort: { fields: [frontmatter___weight], order: DESC }
        ) {
          edges {
            node {
              frontmatter {
                version
              }
            }
          }
        }
      }
    `}
        render={({ allMarkdownRemark: { edges: pages } }) => {
          const releaseNotesPages = pages.map(page => {
            page.node.frontmatter.path = `/release-notes/${page.node.frontmatter.version}`;
            page.node.frontmatter.linktitle = page.node.frontmatter.version;
            return page;
          });
          const tree = parseLinksToTree(releaseNotesPages);
          return (
            <div className={classNames("flex-column flex1", {
              "Sidebar": !this.props.isMobile,
            })}>
              <div className={`${this.props.isMobile ? "u-paddingBottom--20" : "Sidebar-content u-position--relative"}`}>
                <h3 className="u-paddingLeft--20 u-margin-none">
                  <Link to="/release-notes">Release Notes</Link>
                </h3>
                <SidebarFileTree
                  data={tree}
                  pathname={this.props.pathname}
                  isReleaseNotes={true}
                />
              </div>
            </div>
          );
        }}
      />
    );
  }
}
