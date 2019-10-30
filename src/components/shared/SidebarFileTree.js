import React, { Component } from "react";
import classNames from "classnames";
import { Link } from "gatsby";
import "../../scss/components/shared/SidebarFileTree.scss";

function titleize(string) {
  return string
    .split("-")
    .map( s => s[0].toUpperCase() + s.slice(1))
    .join(" ");
}
export default class SidebarFileTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  onItemClick = event => {
    event.stopPropagation();
    const { open } = this.state;
    const isDirectory = event.target.dataset.type === "directory";

    if (isDirectory) {
      this.setState({
        open: !open
      });
    }
  }

  render() {
    const { depth = 0, data, type, className, children } = this.props;
    const { open } = this.state;

    let dataToRender = data;

    if (depth === 0) {
      // Extract out the root!
      dataToRender = data[0]
        .links[0] // /
        .links; // docs
    }

    return (
      <div
        className={classNames(`SidebarFileTree depth-${depth}`, className)}
        onClick={type === "directory" ? this.onItemClick : null}
        data-type={type}
      >
        { children }
        {(open || depth === 0) && dataToRender && dataToRender.map( (entry, idx) => {
          if (entry.directory) {
            return (
              <SidebarFileTree
                key={`${depth}-${idx}`}
                depth={depth + 1}
                type="directory"
                data={entry.links}
              >
                {titleize(entry.directory)}
              </SidebarFileTree>
            );
          } else {
            return (
              <SidebarFileTree
                key={`${depth}-${idx}`}
                depth={depth + 1}
                type="file"
              >
                <Link to={entry.path} activeClassName="active">
                  {entry.linktitle || entry.title}
                </Link>
              </SidebarFileTree>
            );
          }
        })}
      </div>
    );
  }
}