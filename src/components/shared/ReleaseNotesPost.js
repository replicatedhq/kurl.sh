import React from "react";
import { Link } from "gatsby"

export default function Post({ post, link }) {
  const { frontmatter, html } = post;
  let title = `Release ${frontmatter.version}`;
  if (link) {
    title = <Link to={`/release-notes/${frontmatter.version}`}>{title}</Link>
  }
  return (
    <div className="flex-column flex1 u-height--auto">
      <div className="u-padding--20 markdown-body">
        <h1>{title}</h1>
        <small>Released on {frontmatter.date}</small>
        <div
          className="docs-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
};
