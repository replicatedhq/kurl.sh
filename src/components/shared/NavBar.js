import React from "react";
import { Link } from "gatsby";
import MobileNavBar from "./MobileNavBar";
import Search from "../Search";

import "../../scss/components/shared/NavBar.scss";
require("react-github-button/assets/style.css");

export class NavBar extends React.Component {
  state = {
    mobileNavIsOpen: false
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleNavScroll, true);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleNavScroll, true);
  }

  handleNavScroll = () => {
    const scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
    const headerEl = document.getElementById("nav-header");
    if (scrollTop > 100) {
      headerEl && headerEl.classList.add("scrolled");
    } else {
      headerEl && headerEl.classList.remove("scrolled");
    }
  }

  render() {
    const { mobileNavIsOpen } = this.state;
    const { isMobile, documentation } = this.props;
    const navBarItems = [
      { linkTo: "/", label: "Kurl" },
      { linkTo: "/add-ons", label: "Supported add-ons" },
      { linkTo: "/docs/introduction/", label: "Documentation" },
      { href: "https://github.com/replicatedhq/kURL/releases", label: "kURL Changelog" },
    ];

    return (
      <div className="flex flex-auto">
        <div className={`flex flex-auto ${documentation ? "MobileDocNavBarWrapper" : isMobile ? "MobileNavBarWrapper" : "NavBarWrapper"}`} id="nav-header">
          <div className={`${documentation ? "MobileDocKurlHeader" : isMobile ? "MobileKurlHeader" : "KurlHeader"} flex flex1`} id="kurl-header">
            {isMobile ?
            <div className="flex alignItems--center justifyContent--spaceBetween" style={{width:"100%"}}>
              <div className="flex flex1 alignItems--center">
                <span
                  className={`icon clickable ${mobileNavIsOpen ? "u-closeIcon" : "u-hamburgerMenu"} u-marginLeft--20`}
                  onClick={() => {
                    this.setState({
                      mobileNavIsOpen: !this.state.mobileNavIsOpen
                    });
                  }}
                ></span>
                <Link to="/" tabIndex="-1">
                  <div className="HeaderMobileText flex flex1">{this.props.title}</div>
                </Link>
              </div>
                <Search />
            </div>
              :
              <div className="NavBarContainer flex flex1 alignItems--center">
                <div className="flex1 justifyContent--spaceBetween u-marginTop--10 u-marginBottom--10">
                  <div className="flex1 flex u-height--full">
                    <div className="flex flex1">
                      <div className="flex-column flex-auto u-marginRight--20 justifyContent--center">
                        <Link to="/add-ons" className="u-fontWeight--medium u-color--royalBlue u-lineHeight--normal u-fontSize--normal u-textDecoration--underlineOnHover"> Supported add-ons </Link>
                      </div>
                      <div className="flex-column flex-auto u-marginRight--20 justifyContent--center">
                        <Link to="/docs/introduction/" className="u-fontWeight--medium  u-color--royalBlue u-lineHeight--normal u-fontSize--normal u-textDecoration--underlineOnHover"> Docs </Link>
                      </div>
                      <div className="flex-column flex-auto u-marginRight--20 justifyContent--center">
                        <a href="https://github.com/replicatedhq/kURL/releases" target="_blank" rel="noopener noreferrer" className="u-fontWeight--medium  u-color--royalBlue u-lineHeight--normal u-fontSize--normal u-textDecoration--underlineOnHover"> kURL Changelog </a>
                      </div>
                    </div>
                    <div className="flex flex-auto">
                      <div className="flex alignItems--center flex1 flex-verticalCenter u-position--relative u-marginRight--20">
                        <div className="HeaderLogo" id="logo-header">
                          <Link to="/" tabIndex="-1">
                            <span className="logo"></span>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex1 justifyContent--flexEnd">
                      <div className="flex flex-auto justifyContent--center alignItems--center">
                        <Search />
                        <a href="https://github.com/replicatedhq/kurl/" target="_blank" rel="noopener noreferrer" className="github-btn flex justifyContent--center alignItems--center">
                          <span className="icon github-icon" />
                          View on GitHub
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
        {isMobile ? (
          <MobileNavBar
            className="MobileNavBar"
            items={navBarItems}
            isOpen={mobileNavIsOpen}
            onClose={() => {
              this.setState({
                mobileNavIsOpen: false
              });
            }}
          />
        ) : null}
      </div>
    );
  }
}

export default NavBar;