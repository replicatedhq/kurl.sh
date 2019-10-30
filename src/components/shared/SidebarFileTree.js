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
function untitleize(string) {
  return string
    .split(" ")
    .map( s => s[0].toLowerCase() + s.slice(1))
    .join("-");
}

export default class SidebarFileTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      treeState: []
    };

  }

  onDirectoryClick = event => {
    event.stopPropagation();
    const { treeState } = this.state;
    const isDirectory = event.currentTarget.dataset.type === "directory";
    const path = event.currentTarget.dataset.path;
    if (this.props.onDirectoryClick && isDirectory) {
      const mockEvent = {
        stopPropagation: () => {},
        currentTarget: {
          dataset: {
            type: "directory",
            path
          }
        }
      }
      console.log("Goin up!", this.props.depth);
      this.props.onDirectoryClick(mockEvent);
    } else {
      const dirpath = untitleize(path);
      const mapLinks = entry => {
        const copy = {
          ...entry,
          open: entry.directory
            ? entry.directory.includes(dirpath)
            : entry.path.includes(dirpath),
        };

        if (entry.directory) {
          copy.links = entry.links.map(mapLinks);
        }
        return copy;
      };

      this.setState({
        treeState: treeState.map(mapLinks)
      });
    }
  }

  close = () => {
    const { type } = this.props;
    if (type === "directory") {
      this.setState({ open: false });
    }
  }

  onLinkClick = event => {
    const path = event.currentTarget.dataset.path;
    if (this.props.onLinkClick) {
      const mockEvent = {
        currentTarget: {
          dataset: {
            path
          }
        }
      };
      this.props.onLinkClick(mockEvent);
    }
  }

  componentDidMount() {
    // Only runs for the root
    if (!this.props.depth) {
      const { data } = this.props;
      let dataToRender = data;

      // Extract out the children to control them
      dataToRender = data[0]
        .links[0] // /
        .links; // docs

      const mapData = item => {
        if (!item.directory) {
          return item;
        }

        return {
          ...item,
          // this can be changed to match the URL
          open: false,
          links: item.links.map(mapData)
        };
      };
      // Inject state properties to children:
      const stateData = dataToRender.map(mapData);
      // console.log(stateData);
      this.setState({
        treeState: stateData
      });
    }

  }

  render() {
    const { depth = 0, data, type, className, open, children } = this.props;
    const { treeState } = this.state;

    if (treeState.length === 0 && depth === 0) {
      // If root and there's no tree state, don't render anything
      return null;
    }

    const dataToRender = depth === 0
      ? treeState
      : data;

    return (
      <div
        className={classNames(`SidebarFileTree depth-${depth}`, className)}
        onClick={type === "directory" ? this.onDirectoryClick : null}
        data-type={type}
        data-path={children && children.toString()}
      >
        { children }
        {(open || depth === 0) && dataToRender && dataToRender.map( (entry, idx) => {
          if (entry.directory) {
            return (
              <SidebarFileTree
                key={`${depth}-${idx}`}
                depth={depth + 1}
                type="directory"
                open={entry.open}
                onDirectoryClick={this.onDirectoryClick}
                onLinkClick={this.onLinkClick}
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
                open={entry.open}
                type="file"
              >
                <Link
                  to={entry.path}
                  activeClassName="active"
                  onClick={this.onLinkClick}
                  data-path={entry.path}
                >
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