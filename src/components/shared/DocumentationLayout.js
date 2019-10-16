import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';

import Sidebar from "../Sidebar";
import Navbar from "./NavBar";

const DocumentationLayout = ({ children }) => {
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
          <Navbar />
          <div className="u-minHeight--full flex-column flex1">
            <Sidebar
              className="flex"
              sidebarPages={data.site.siteMetadata.sidebar.pages}
            />
            <div className="flex-column flex1">
              {children}
            </div>
          </div>
        </>
      )}
    />
  );
}

DocumentationLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DocumentationLayout;