let activeEnv =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development"
console.log(`Using environment config: '${activeEnv}'`)
require("dotenv").config({
  path: `.env.${activeEnv}`,
})

module.exports = {
  siteMetadata: {
    title: "Kurl.sh",
    apiUrl: process.env.API_URL,
    sidebar: {
      pages: [
        {
          slug: '/docs/creating-an-installer',
          title: 'Creating An Installer',
        },
        {
          slug: '/docs/supporting-installations',
          title: 'Supporting Installations',
        },
        {
          slug: '/docs/addon-author/contributing-an-addon',
          title: 'Contributing An Addon',
        },
      ],
    }
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-netlify`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/src/markdown-pages`,
      },
    },
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        useResolveUrlLoader: true,
        cssLoaderOptions: {
          camelCase: false,
        }
      },
    },
    {
      resolve: `gatsby-plugin-env-variables`,
      options: {
        whitelist: ["KURL_INSTALLER_URL", "KURL_BUNDLE_URL"]
      },
    },
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/index/*`] },
    },
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/download/*`, `/docs/*`] },
    },
  ],
}