import React from "react";
import { Link } from "gatsby";

import("../scss/components/Sidebar.scss");

const Sidebar = ({ sidebarPages }) => {

  return (
    <nav className="Sidebar flex-column flex1">
      {sidebarPages
        ? sidebarPages.map((sidebarPage, i) => (
          <div className="SidebarElements" key={`${sidebarPage.slug}-${i}`}>
            <div className="SidebarItem-wrapper u-position--relative is-active">
              <div className="SidebarItem">
                <Link to={sidebarPage.slug}>{sidebarPage.title}</Link>
              </div>
            </div>
          </div>
        ))
        : ""}
    </nav>
  )
}

export default Sidebar;