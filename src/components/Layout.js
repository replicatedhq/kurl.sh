import React from "react";
import PropTypes from "prop-types";
import NavBar from "./shared/NavBar";
import Footer from "./shared/Footer";

import "../scss/index.scss";

const Layout = ({ children, isMobile }) => {

  return (
    <div className="flex flex1">
      <div className="suite-banner">
        <div className="flex flex-row justifyContent--spaceBetween">
          <div className="repl-logo-white"></div>
          <div>
            <a href="https://blog.replicated.com/announcing-kots/" target="_blank" rel="noopener noreferrer">Learn more about Replicated to operationalize your KOTS app <span class="banner-arrow"></span></a>
          </div>
        </div>
      </div>
      <NavBar isMobile={isMobile} />
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