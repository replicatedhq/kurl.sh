import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import GitHubButton from "react-github-button";

import "../../scss/components/shared/NavBar.scss";

export class NavBar extends PureComponent {

  componentDidMount() {
    window.addEventListener("scroll", this.shrinkNavbarOnScroll, true);
  }

  shrinkNavbarOnScroll = () => {
    const scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
    const distanceY = scrollTop,
      shrinkOn = 100,
      headerEl = document.getElementById("nav-header");

    if (distanceY > shrinkOn) {
      headerEl.classList.add("smaller");
    } else {
      headerEl.classList.remove("smaller");
    }
  }

  
  render() {
    return (
      <div className="NavBarWrapper flex flex-auto" id="nav-header">
        <div className="KurlHeader flex flex1">
          <div className="NavBarContainer flex flex1">
            <div className="flex1 justifyContent--flexStart">
              <div className="flex1 flex u-height--full">
                <div className="flex flex-auto">
                  <div className="flex alignItems--center flex1 flex-verticalCenter u-position--relative u-marginRight--20">
                    <div className="HeaderLogo">
                      <Link to="/" tabIndex="-1">
                        <span className="logo"></span>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex flex1 justifyContent--flexEnd right-items">
                <div className="flex-column flex-auto u-marginRight--20 justifyContent--center">
                    <Link to="/add-ons" className="u-fontWeight--medium u-color--royalBlue u-lineHeight--normal u-fontSize--normal u-textDecoration--underlineOnHover"> Supported add-ons </Link>
                  </div>
                  <div className="flex-column flex-auto u-marginRight--20 justifyContent--center">
                    <a href="https://kurl.sh/docs" target="_blank" rel="noopener noreferrer" className="u-fontWeight--medium  u-color--royalBlue u-lineHeight--normal u-fontSize--normal u-textDecoration--underlineOnHover"> Docs </a>
                  </div>
                  <div className="flex-column flex-auto justifyContent--center u-marginLeft--10">
                    <GitHubButton href="https://github.com/replicatedhq/kurl" data-icon="octicon-star" data-show-count="true" aria-label="Star replicatedhq/kurl on GitHub">Star</GitHubButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NavBar;
