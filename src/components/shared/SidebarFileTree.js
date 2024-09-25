import React, { Component } from "react";
import classNames from "classnames";
import { Link, navigate } from "gatsby";
import "../../scss/components/shared/SidebarFileTree.scss";

function titleize(string) {
  const title = string
    .split("-")
    .map(s => s[0].toUpperCase() + s.slice(1))
    .join(" ");
  if (title === "Add Ons") {
    return "Add-Ons";
  }
  if (title === "Add On Author") {
    return "Add-On Author";
  }
  return title;
}

export default class SidebarFileTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      treeState: []
    };
  }

  onDirectoryClick = (e, dirPath) => {
    e.stopPropagation();
    const { treeState } = this.state;
    const linkingToFirstSubItem = this.DFS(treeState, null, dirPath);
    if (linkingToFirstSubItem) {
      navigate(linkingToFirstSubItem.path);
    }
    const mapLinks = entry => {
      const copy = {
        ...entry,
        open: dirPath.includes(entry.path)
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

  onLinkClick = event => {
    event.stopPropagation();
    navigate(event.currentTarget.dataset.path);
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
          open: item.directory.includes(this.props.pathname.split("/")[2]),
          links: item.links.map(mapData)
        };
      };
      // Inject state properties to children:
      const stateData = dataToRender.map(mapData);
      this.setState({
        treeState: stateData
      });
    }
  }

  DFS = (links, dirPath, targetPath) => {
    if (targetPath === dirPath) {
      return links[0]
    } else {
      for (let i = 0; i < links.length; ++i) {
        let subPath = links[i];
        if (subPath.directory) {
          let subPathObject = this.DFS(subPath.links, subPath.path, targetPath);
          if (subPathObject) {
            return subPathObject;
          }
        }
      }
    }
  }

  render() {
    const { depth = 0, data, type, className, open, children, path, isReleaseNotes } = this.props;
    const { treeState } = this.state;

    if (treeState.length === 0 && depth === 0) {
      // If root and there's no tree state, don't render anything
      return null;
    }

    const dataToRender = depth === 0
      ? treeState
      : data;

    const onDirectoryClick = this.props.onDirectoryClick || this.onDirectoryClick; // always call the top level function because it has the right state

    return (
      <div
        className={classNames(`SidebarFileTree flex1 flex-column ${isReleaseNotes ? "u-marginLeft--20" :  `depth-${depth}`}`, className)}
        onClick={type === "directory" ? (e) => onDirectoryClick(e, path) : null}
      >
        {children}
        {(open || depth === 0) && dataToRender && dataToRender.map((entry, idx) => {
          if (entry.directory) {
            return (
              <SidebarFileTree
                key={`${depth}-${idx}`}
                depth={depth + 1}
                type="directory"
                open={entry.open}
                path={entry.path}
                onDirectoryClick={onDirectoryClick}
                data={entry.links}
              >
                <span className={classNames({ "sub-directory": depth > 0 })}>
                  {titleize(entry.directory)}
                </span>
              </SidebarFileTree>
            );
          } else {
            const key = isReleaseNotes ? `${depth}-${idx}-${entry.path}` : `${depth}-${idx}`;
            const isInSubdirectory = depth > 1;
            const isFirstElement = idx === 0;
            return (
              <SidebarFileTree
                key={key}
                depth={depth + 1}
                open={entry.open}
                type="file"
                isReleaseNotes={isReleaseNotes}
              >
                <Link
                  className={classNames({ "u-marginTop--12": isFirstElement && !isInSubdirectory })}
                  to={entry.path}
                  activeClassName="active"
                  onClick={this.onLinkClick}
                  data-path={entry.path}
                >
                  {entry.linktitle || entry.title} {entry.isAlpha && <span className="prerelease-tag sidebar alpha">alpha</span>} {entry.isBeta && <span className="prerelease-tag sidebar beta">beta</span>} {entry.isDeprecated && <span className="prerelease-tag sidebar deprecated">deprecated</span>}
                </Link>
              </SidebarFileTree>
            );
          }
        })}
      </div>
    );
  }
}