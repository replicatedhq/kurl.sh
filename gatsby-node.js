const path = require('path');
const MonacoWebpackPlugin = require(`monaco-editor-webpack-plugin`);

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /bad-module/,
            use: loaders.null(),
          },
        ],
      },
      plugins: [
        new MonacoWebpackPlugin({
          languages: [
            "yaml",
            "json"
          ],
          features: [
            "coreCommands",
            "folding",
            "bracketMatching",
            "clipboard",
            "find",
            "colorDetector",
            "codelens"
          ]
        })
      ]
    });
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      version: String
      isBeta: Boolean
      isAlpha: Boolean
      isDeprecated: Boolean
    }
  `
  createTypes(typeDefs)
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal && node.internal.type === `MarkdownRemark`) {
    // Get the parent node
    const parent = getNode(node.parent);

    createNodeField({
      node,
      name: "collection",
      value: parent.sourceInstanceName,
    });
  }
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage, createRedirect } = actions
  const docsTemplate = path.resolve(__dirname, 'src/templates/DocsTemplate.js/');
  const releaseNotesTemplate = path.resolve(__dirname, 'src/templates/ReleaseNotesTemplate.js/');
  const releaseNotesListTemplate = path.resolve(__dirname, 'src/templates/ReleaseNotesListTemplate.js');
  const results = await graphql(`
    {
      allMarkdownRemark(sort: {frontmatter: {weight: DESC}}, limit: 1000) {
        edges {
          node {
            fields {
              collection
            }
            frontmatter {
              path
              linktitle
              title
              addOn
              version
              isBeta
              isAlpha
              isDeprecated
            }
          }
        }
      }
    }
  `);

  // Handle errors
  if (results.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const allEdges = results.data.allMarkdownRemark.edges;

  const docEdges = allEdges.filter(
    edge => edge.node.fields.collection === `markdown-pages`
  );
  const releaseNotesEdges = allEdges.filter(
    edge => edge.node.fields.collection === `release-notes`
  );

  createRedirect({
    isPermanant: true,
    redirectInBrowser: true,
    fromPath: "/docs/",
    toPath: "/docs/introduction/"
  });

  docEdges.forEach(({ node }) => {
    const { path, linktitle, title } = node.frontmatter;
    const { html } = node;
    createPage({
      path,
      linktitle,
      title,
      html,
      component: docsTemplate,
    })
  });

  createRedirect({
    isPermanant: true,
    redirectInBrowser: true,
    fromPath: `/release-notes`,
    toPath: `https://docs.replicated.com/release-notes/rn-kubernetes-installer`,
  })
  
  releaseNotesEdges.forEach(({ node }) => {
    const { version } = node.frontmatter;
    const versionForURL = version.replace(/\./g, "");
    createRedirect({
      isPermanant: true,
      redirectInBrowser: true,
      fromPath: `/release-notes/${version}`,
      toPath: `https://docs.replicated.com/release-notes/rn-kubernetes-installer#release-${versionForURL}`,
    })
  });
}

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions
  // Make the front page match everything client side.
  // Normally your paths should be a bit more judicious.
  if (page.path === `/`) {
    page.matchPath = `/*`
    createPage(page)
  }
  if (page.path === `/download`) {
    page.matchPath = `/download/*`
    createPage(page)
  }
  if (page.path === `/add-ons`) {
    page.matchPath = `/add-ons/*`
    createPage(page)
  }

}