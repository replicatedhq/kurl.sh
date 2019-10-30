import React from "react";
import { Link } from "gatsby";
import GitHubButton from "react-github-button";
import MobileNavBar from "./MobileNavBar";

import "../../scss/components/shared/NavBar.scss";
require("react-github-button/assets/style.css");

export class NavBar extends React.Component {
  state = {
    mobileNavIsOpen: false
  }

  componentDidMount() {
    window.addEventListener("scroll", this.shrinkNavbarOnScroll, true);
  }

  shrinkNavbarOnScroll = () => {
    const scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
    const distanceY = scrollTop,
      shrinkOn = 100,
      headerEl = document.getElementById("nav-header"),
      kurlHeaderEl = document.getElementById("kurl-header"),
      logoEl = document.getElementById("logo-header");

    if (distanceY > shrinkOn) {
      headerEl && headerEl.classList.add("smaller");
      kurlHeaderEl && kurlHeaderEl.classList.add("smaller");
      logoEl && logoEl.classList.add("smaller");
    } else {
      headerEl && headerEl.classList.remove("smaller");
      kurlHeaderEl && kurlHeaderEl.classList.remove("smaller");
      logoEl && logoEl.classList.remove("smaller");
    }
  }

  render() {
    const { mobileNavIsOpen } = this.state;
    const { isMobile } = this.props;
    const navBarItems = [
      {linkTo: "/", label: "Kurl"},
      {linkTo: "/add-ons", label: "Supported add-ons"},
      {linkTo: "/docs/introduction", label: "Documentation"},
      {href: "https://github.com/replicatedhq/kurl.sh", label: "Github"}
    ];


    return (
      <div className="NavBarWrapper flex flex-auto" id="nav-header">
        <div className="KurlHeader flex flex1" id="kurl-header">
          {isMobile ?
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
                <div className="HeaderMobileText flex flex1">Kubernetes URL Creator</div>
              </Link>
            </div>
            :
            <div className="NavBarContainer flex flex1">
              <div className="flex1 justifyContent--flexStart">
                <div className="flex1 flex u-height--full">
                  <div className="flex flex-auto">
                    <div className="flex alignItems--center flex1 flex-verticalCenter u-position--relative u-marginRight--20">
                      <div className="HeaderLogo" id="logo-header">
                        <Link to="/" tabIndex="-1">
                          <span className="logo"></span>
                        </Link>
                      </div>
                    </div>
                    <div className="HeaderText">Kubernetes URL Creator</div>
                  </div>
                  <div className="flex flex1 justifyContent--flexEnd right-items">
                    <div className="flex-column flex-auto u-marginRight--20 justifyContent--center">
                      <Link to="/add-ons" className="u-fontWeight--medium u-color--royalBlue u-lineHeight--normal u-fontSize--normal u-textDecoration--underlineOnHover"> Supported add-ons </Link>
                    </div>
                    <div className="flex-column flex-auto u-marginRight--20 justifyContent--center">
                      <Link to="/docs/introduction" className="u-fontWeight--medium  u-color--royalBlue u-lineHeight--normal u-fontSize--normal u-textDecoration--underlineOnHover"> Docs </Link>
                    </div>
                    <div className="flex-column flex-auto justifyContent--center">
                      <GitHubButton type="stargazers" size="large" repo="kurl" namespace="replicatedhq" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
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
