import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';

import { BreakpointConfig } from "../../services/breakpoints";

import Sidebar from "../Sidebar";
import Navbar from "./NavBar";
import { Helmet } from "react-helmet"

export default class DocumentationLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: false
    };
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
  }

  onResize = () => {
    const { isMobile } = this.state;
    const width = window.innerWidth;
    const { breakpoints } = BreakpointConfig;

    if (isMobile && width > breakpoints.desktopSmall) {
      this.setState({
        isMobile: false
      });
      return;
    }

    if (!isMobile && width < breakpoints.desktopSmall) {
      this.setState({
        isMobile: true
      });

    }
  }

  render() {
    const { children } = this.props;
    const { isMobile } = this.state;

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
            <div className="suite-banner">
              <div className="flex flex-row justifyContent--spaceBetween">
                <div className="repl-logo-white"></div>
                <div>
                  <a href="https://blog.replicated.com/kurl-with-replicated-kots/" target="_blank" rel="noopener noreferrer">Learn more about how kURL works with Replicated KOTS <span className="banner-arrow"></span></a>
                </div>
              </div>
            </div>
            <Helmet>
              <meta charSet="utf-8" />
              <title>{children.props.children.props.children[0].props.children}</title>
            </Helmet>
            <Navbar isMobile={isMobile} title={`${children.props.children.props.children[0].props.children}`} />
            <div className={`u-minHeight--full u-width--full u-overflow--auto flex-column flex1 ${isMobile ? "" : "u-marginBottom---40"}`}>
              <div className={`${isMobile ? "Mobile--wrapper u-marginTop--150" : "Sidebar-wrapper"}`}>
                <Sidebar
                  isMobile={isMobile}
                  slideOpen={true}
                  pathname={this.props.location.pathname}
                />
              </div>
              <div className={`${isMobile ? "docs-mobile-container" : "docs-container"} flex-column flex1`}>
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
