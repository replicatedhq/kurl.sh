import React, { Component } from "react";
import classNames from "classnames";
import { StaticQuery, graphql } from "gatsby";
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
          filter: {fields: {collection: {eq: "markdown-pages"}}}
          sort: {frontmatter: {weight: ASC}}
        ) {
          edges {
            node {
              frontmatter {
                path
                linktitle
                title
                isAlpha
                isBeta
                isDeprecated
              }
            }
          }
        }
      }
    `}
        render={({ allMarkdownRemark: { edges: pages } }) => {
          const tree = parseLinksToTree(pages);
          return (
            <div className={classNames("flex-column flex1", {
              "Sidebar": !this.props.isMobile,

            })}>
              <div className={`${this.props.isMobile ? "u-paddingBottom--20" : "Sidebar-content u-position--relative"}`}>
                <SidebarFileTree
                  data={tree}
                  pathname={this.props.pathname}
                />
              </div>
            </div>
          );
        }}
      />
    );
  }
}
