import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { Resizer } from "./Resize";
import { BreakpointConfig } from "../../services/breakpoints";

import Sidebar from "../Sidebar";
import Navbar from "./NavBar";
import { Helmet } from "react-helmet"

@Resizer(BreakpointConfig)
class DocumentationLayout extends Component {
  state = {
    isMobile: false,
  }
  
  allImagesLoaded = (hash) => {
    let counter = 0;

    const incrementCounter = () => {
      counter++;
      if (counter === document.images.length) {
        this.scrollTo(hash);
      }
    }

    [].forEach.call(document.images, (img) => {
      if (img.complete) {
        incrementCounter();
      } else {
        img.addEventListener("load", incrementCounter, false);
      }
    });
  }

  scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) return window.scrollTo(0, el.offsetTop - 100);
    return false
  }

  componentDidMount() {
    if (this.props.breakpoint) {
      this.setState({ isMobile: this.props.breakpoint === "mobile" })
    }
    if (this.props.location && this.props.location.hash) {
      if (document.images && document.images.length > 0) {
        this.allImagesLoaded(this.props.location.hash);
      } else {
        this.scrollTo(this.props.location.hash);
      }
    }
  }

  componentDidUpdate(lastProps) {
    if (this.props.breakpoint !== lastProps.breakpoint && this.props.breakpoint) {
      this.setState({ isMobile: this.props.breakpoint === "mobile" })
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
          <div className="flex-column flex1">
            {!isMobile ?
              <div className="suite-banner">
                <div className="flex flex-row justifyContent--spaceBetween">
                  <div className="repl-logo-white"></div>
                  <div>
                    <a href="https://www.replicated.com/" target="_blank" rel="noopener noreferrer">Learn more about Replicated to operationalize your application<span className="banner-arrow"></span></a>
                  </div>
                </div>
              </div>
              :
              <div className="mobile-suite-banner">
                <div className="flex flex-row justifyContent--spaceBetween">
                  <div className="flex flex1 alignItems--center">
                    <div className="repl-logo-white"></div>
                  </div>
                  <div className="u-marginLeft--normal">
                    <a href="https://www.replicated.com/" target="_blank" rel="noopener noreferrer">Learn more about how kURL works with Replicated KOTS<span className="banner-arrow"></span></a>
                  </div>
                </div>
              </div>
            }
            <Helmet>
              <meta charSet="utf-8" />
              <title>{children.props.children.props.children[0].props.children[0]}</title>
            </Helmet>
            <Navbar isMobile={isMobile} documentation={isMobile && true} title={`${children.props.children.props.children[0].props.children[0]}`} />
            <div className={`u-minHeight--full u-width--full u-overflow--auto flex1 ${isMobile ? "flex-column" : "flex u-marginBottom---40"}`}>
              <div className={`${isMobile ? "Mobile--wrapper u-marginTop--70" : "Sidebar-wrapper flex flex1"}`}>
                <Sidebar
                  isMobile={isMobile}
                  slideOpen={true}
                  pathname={this.props.location.pathname}
                />
              </div>
              <div className={`${isMobile ? "docs-mobile-container" : "docs-container u-overflow--auto"} flex-column flex1`}>
                {!isMobile ?
                  <div className="flex-column flex1 docsWidth">
                    {children}
                  </div>
                  :
                  children
                }
              </div>
            </div>
          </div>
        )}
      />
    );

  }
}

DocumentationLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DocumentationLayout;
