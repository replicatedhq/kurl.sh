import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';

import Sidebar from "../Sidebar";
import Navbar from "./NavBar";

export default class DocumentationLayout extends Component {
  render() {
    const { children, isMobile } = this.props;

    return (
      <StaticQuery
        query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
        render={data => (
          <>
            <Navbar isMobile={isMobile} />
            <div className="u-minHeight--full flex-column flex1">
              <div>
                <div className="Sidebar-wrapper">
                  <Sidebar
                    isMobile={isMobile}
                    slideOpen={true}
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
