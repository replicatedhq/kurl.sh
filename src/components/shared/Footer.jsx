import React from "react";
import { Link, withRouter } from "react-router-dom";
import "../../scss/components/shared/Footer.scss";

export class Footer extends React.Component {

  getItems() {
    return [
      {
        label: "View on GitHub",
        icon: true,
        href: "http://replicated.com/terms",
      },
      {
        label: "Documentation",
        icon: false,
        href: "https://kurl.sh/docs",
      },
    ];
  }

  render() {
    const footerItems = this.getItems();
    return (
      <div className={`FooterContent-wrapper flex flex-auto justifyContent--center ${this.props.className || ""}`}>
        <div className="Footer-container flex1 flex">
          <div className="KurlFooter flex flex1">
            <div className="flex flex-auto alignItems--center">
              <div className="FooterItem-wrapper flex justifyContent--center alignItems--center">
                <span className="icon u-kurl u-marginRight--normal"></span>
                <span className="FooterItem">Contributed by <a href="https://replicated.com/" target="_blank" rel="noopener noreferrer">Replicated </a></span>
              </div>
            </div>
            <div className="flex flex1 justifyContent--flexEnd alignItems--center alignSelf--center">
              {footerItems.filter(item => item).map((item, i) => {
                let node = (
                  <span className="FooterItem">{item.label}</span>
                );
                if (item.icon) {
                  node = (
                    <div className="flex flex-auto">
                      <span className="github u-marginRight--small"> </span>
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="FooterItem u-marginTop--4">{item.label}</a>
                    </div>
                  );
                } else {
                  node = (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="FooterItem">{item.label}</a>
                  )
                }

                return (
                  <div key={i} className="FooterItem-wrapper">
                    {node}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Footer);
