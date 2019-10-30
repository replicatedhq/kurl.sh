import React from "react";
import { StaticQuery, graphql } from "gatsby";
import DocumentationLayout from "../components/shared/DocumentationLayout";

export default () => (
  <StaticQuery
    query={pageQuery}
    render={data => {
      return (
        <DocumentationLayout>
          <div className="ContentArea flex-column flex1 u-height--auto u-overflow--auto">
            <div className="container markdown-body">
              <h1>{data.markdownRemark.frontmatter.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}></div>
            </div>
          </div>
        </DocumentationLayout>
      );
    }}
  />
);

export const pageQuery = graphql`
  query {
    markdownRemark(frontmatter: { path: { eq: "/docs/README.md" } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`;
