import React from "react"
import { graphql, Link } from "gatsby"
import ReleaseNotesLayout from "../components/shared/ReleaseNotesLayout";
import Post from "../components/shared/ReleaseNotesPost";

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
  location
}) {
  const { markdownRemark } = data;
  const { frontmatter } = markdownRemark;

  return (
    <ReleaseNotesLayout location={location} title={"Release " + frontmatter.version}>
      <div><Link to="/release-notes">&lt;- Release Notes</Link></div>
      <Post post={markdownRemark} />
    </ReleaseNotesLayout>
  )
}

export const pageQuery = graphql`
  query($version: String!) {
    markdownRemark(frontmatter: { version: { eq: $version } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        version
      }
    }
  }
`;
