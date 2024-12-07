import React from "react";
import { Link, graphql } from "gatsby";
import ReleaseNotesLayout from "../components/shared/ReleaseNotesLayout";
import Post from "../components/shared/ReleaseNotesPost"

class ReleaseNotesIndex extends React.Component {
  render() {
    const { data } = this.props;
    const edges = data.allMarkdownRemark.edges;
    const { currentPage, numPages } = this.props.pageContext;
    const isFirst = currentPage === 1;
    const isLast = currentPage === numPages;
    const prevPage = currentPage - 1 === 1 ? '/release-notes' : `/release-notes/${currentPage - 1}`;
    const nextPage = `/release-notes/${currentPage + 1}`;

    const Posts = edges
      .map((edge, i) => <Post key={`${edge.node.frontmatter.title}-${i}`} post={edge.node} link={true} />);

    return (
      <ReleaseNotesLayout location={{pathname: "/release-notes"}} title="Release Notes">
        {Posts}
        <div className="paginator">
        <ul
          className="pagination"
        >
          {!isFirst && (
            <Link to={prevPage} rel="prev">
              <span className="icon u-backIcon" />
            </Link>
          )}
          {Array.from({ length: numPages }, (_, i) => (
            <li
              key={`pagination-number${i + 1}`}
            >
              <Link
                to={i === 0 ? `/release-notes` : `/release-notes/${i + 1}`}
                style={{
                  padding: .25,
                  textDecoration: "none",
                  color: i + 1 === currentPage ? "#4A4A4A" : "#326DE6",
                }}
              >
                {i + 1}
              </Link>
            </li>
          ))}
          {!isLast && (
            <Link to={nextPage} rel="next">
              <span className="icon u-forwardIcon" /> 
            </Link>
          )}
        </ul>
        </div>
      </ReleaseNotesLayout>
    );
  }
};

export default ReleaseNotesIndex;

export const pageQuery = graphql`
  query($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: {fields: {collection: {eq: "release-notes"}}}
      sort: {frontmatter: {weight: DESC}}
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          html
          fields {
            collection
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            version
          }
        }
      }
    }
  }
`;
