const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---src-pages-add-ons-js": hot(preferDefault(require("/home/jelena/go/src/github.com/replicatedhq/kurl.sh/src/pages/add-ons.js"))),
  "component---src-pages-download-js": hot(preferDefault(require("/home/jelena/go/src/github.com/replicatedhq/kurl.sh/src/pages/download.js"))),
  "component---src-pages-index-js": hot(preferDefault(require("/home/jelena/go/src/github.com/replicatedhq/kurl.sh/src/pages/index.js")))
}

