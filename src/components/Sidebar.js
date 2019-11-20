import React, { Component } from "react";
import classNames from "classnames";
import { StaticQuery, graphql } from "gatsby";
import SidebarFileTree from "./shared/SidebarFileTree";
import { parseLinksToTree } from "../utils/parse-links-to-tree";

import "../scss/components/Sidebar.scss";

export default class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openSidebar: false
    };
  }

  render() {

    return (
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
          const { openSidebar } = this.state;
          const closeSidebar = () => {
            this.setState({
              openSidebar: false
            });
          }
          return (
            <div className={classNames("Sidebar flex-column flex1", {
              isOpen: openSidebar
            })}>
              <div className="Sidebar-content u-position--relative">
                <SidebarFileTree
                  data={tree}
                  closeSidebar={closeSidebar}
                />
                <div className="Sidebar-toggle u-position--absolute">
                  <span
                    className={classNames("icon clickable", {
                      "u-closeBlueIcon": openSidebar,
                      "u-smallHamburgerMenu": !openSidebar
                    })}
                    onClick={() => {
                      this.setState({
                        openSidebar: !openSidebar
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          );
        }}
      />
    );
  }
}
