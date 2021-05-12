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
      .map(edge => <Post key={edge.node.frontmatter.title} post={edge.node} link={true} />);

    return (
      <ReleaseNotesLayout location={{pathname: "/release-notes"}} title="Release Notes">
        {Posts}
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            listStyle: 'none',
            padding: 0,
          }}
        >
          {!isFirst && (
            <Link to={prevPage} rel="prev">
              ← Previous Page
            </Link>
          )}
          {Array.from({ length: numPages }, (_, i) => (
            <li
              key={`pagination-number${i + 1}`}
              style={{
                margin: 0,
              }}
            >
              <Link
                to={i === 0 ? `/release-notes` : `/release-notes/${i + 1}`}
                style={{
                  padding: .25,
                  textDecoration: 'none',
                  color: i + 1 === currentPage ? '#ffffff' : '',
                  background: i + 1 === currentPage ? '#007acc' : '',
                }}
              >
                {i + 1}
              </Link>
            </li>
          ))}
          {!isLast && (
            <Link to={nextPage} rel="next">
              Next Page →
            </Link>
          )}
        </ul>
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
      filter: { fields: { collection: { eq: "release-notes" } } }
      sort: { fields: [frontmatter___weight], order: DESC }
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
