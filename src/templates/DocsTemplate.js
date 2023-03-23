import React from "react"
import { graphql } from "gatsby"
import DocumentationLayout from "../components/shared/DocumentationLayout";
import versionDetails from "../../static/versionDetails.json";

function buildHtmlTableFromJson(addOn) {
  if (addOn) {
    const data = versionDetails && versionDetails[addOn] && versionDetails[addOn].map((detail) => {
      return (
        `<tr>
          <td>${detail.flag}</td>
          <td>${detail.description}</td>
        </tr>`
      )
    }).join("");

    return (
      `<table>
        <thead>
          <tr>
            <th>Flag</th>
            <th>Usage</th>
          </tr>
        </thead>
        <tbody>
          ${data}
        </tbody>
      </table>`
    )
  }
}
export default function Template({
  data, // this prop will be injected by the GraphQL query below.
  location
}) {
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark

  return (
    <DocumentationLayout location={location}>
      <div className="flex-column flex1 u-height--auto">
        <div className="u-padding--20 markdown-body">
          <h1>{frontmatter.title} {frontmatter.isAlpha && <span className="prerelease-tag alpha">alpha</span>} {frontmatter.isBeta && <span className="prerelease-tag beta">beta</span>} {frontmatter.isDeprecated && <span className="prerelease-tag deprecated">beta</span>}</h1>
          <div
            className="docs-content"
            dangerouslySetInnerHTML={{ __html: html && html.replace("flags-table", buildHtmlTableFromJson(frontmatter.addOn)) }}
          />
        </div>
      </div>
    </DocumentationLayout>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        addOn
        isBeta
        isAlpha
        isDeprecated
      }
    }
  }
`;
