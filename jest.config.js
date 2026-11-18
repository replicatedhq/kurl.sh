module.exports = {
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
    "^@docsearch/css$": `identity-obj-proxy`,
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `<rootDir>/__mocks__/file-mock.js`,
  },
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>.*/public`],
  transform: {
    // @docsearch/react 5 and its dependencies ship ESM only. .babelrc does not
    // apply inside node_modules, so compile those packages to CommonJS here.
    "/node_modules/.+\\.m?js$": [`babel-jest`, { babelrc: false, configFile: false, plugins: [`@babel/plugin-transform-modules-commonjs`] }],
    "\\.[jt]sx?$": `babel-jest`,
  },
  transformIgnorePatterns: [`node_modules/(?!(gatsby|gatsby-script|gatsby-link|@docsearch|@base-ui|@algolia|algoliasearch|@ai-sdk|ai|marked|zod)/)`],
  globals: {
    __PATH_PREFIX__: ``,
  },
  testEnvironmentOptions: {
    url: `http://localhost`,
  },
  setupFiles: [`<rootDir>/loadershim.js`],
}
