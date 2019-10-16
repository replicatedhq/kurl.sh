import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';

import Sidebar from "../Sidebar";
import Navbar from "./NavBar";

export default class DocumentationLayout extends React.Component {
  state = {
    showSiderbar: false
  }

  toggleSidebar = () => {
    this.setState({
      showSiderbar: !this.state.showSiderbar
    });
  };

  render() {
    const { showSiderbar } = this.state;
    const { children, isMobile } = this.props;

    return (
      <StaticQuery
        query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
              sidebar {
                pages {
                  slug
                  title
                }
              }
            }
          }
        }
      `}
        render={data => (
          <>
            <Navbar isMobile={isMobile} />
            <div className="u-minHeight--full flex-column flex1">
              {isMobile ? (
                <div
                  className={`ToggleSidebar ${showSiderbar ? "sidebar-open" : ""}`}
                  onClick={this.toggleSidebar}
                >
                  <span
                    className={`icon clickable ${
                      showSiderbar ? "u-closeIcon" : "u-hamburgerMenu"
                      }`}
                  ></span>
                </div>
              ) : null}
              <div className={`${
                isMobile ? "TransformContainer" : ""
                } ${isMobile && this.state.showSiderbar ? "show-sidebar" : ""}`}>
                <div className="Sidebar-wrapper">
                  <Sidebar
                    className="flex"
                    sidebarPages={data.site.siteMetadata.sidebar.pages}
                    isMobile={isMobile}
                  />
                </div>
              </div>
              <div className="flex-column flex1">
                {children}
              </div>
            </div>
          </>
        )}
      />
    );

  }
}

DocumentationLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
