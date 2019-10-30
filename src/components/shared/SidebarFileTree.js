import React, { Component } from "react";
import classNames from "classnames";
import { Link } from "@reach/router";
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
    // console.log(data);
    let dataToRender = data;

    if (depth === 0) {
      // Extract out the root!
      dataToRender = data[0]
        .links[0] // /
        .links; // docs
    }
    // console.log(dataToRender);
    return (
      <div
        className={classNames(`SidebarFileTree depth-${depth}`, className)}
        onClick={type === "directory" ? this.onItemClick : null}
        data-type={type}
      >
        { children }
        {(open || depth === 0) && dataToRender.map( (entry, idx) => {
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
                data-type={type}
              >
                <Link to={entry.path}>
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