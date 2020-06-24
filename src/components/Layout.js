import React from "react";
import PropTypes from "prop-types";
import NavBar from "./shared/NavBar";
import Footer from "./shared/Footer";
import { Helmet } from "react-helmet"

import "../scss/index.scss";

const Layout = ({ children, isMobile, title }) => {
  return (
    <div className="flex-column flex1">
      {!isMobile ?
        <div className="suite-banner">
          <div className="flex flex-row justifyContent--spaceBetween">
            <div className="repl-logo-white"></div>
            <div>
              <a href="https://blog.replicated.com/kurl-with-replicated-kots/" target="_blank" rel="noopener noreferrer">Learn more about how kURL works with Replicated KOTS<span className="banner-arrow"></span></a>
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
              <a href="https://blog.replicated.com/kurl-with-replicated-kots/" target="_blank" rel="noopener noreferrer">Learn more about how kURL works with Replicated KOTS<span className="banner-arrow"></span></a>
            </div>
          </div>
        </div>
      }
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
      </Helmet>
      <NavBar isMobile={isMobile} title={title} />
      <div className="u-minHeight--full flex-column flex1">
        <main className="flex-column flex1">{children}</main>
        <div className="flex-auto Footer-wrapper u-width--full">
          <Footer isMobile={isMobile} />
        </div>
      </div>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout;