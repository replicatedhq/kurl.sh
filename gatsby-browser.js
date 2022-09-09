const React = require('react')
const Bugsnag = require('@bugsnag/js').default
const BugsnagPluginReact = require('@bugsnag/plugin-react').default

Bugsnag.start({
    apiKey: `${process.env.BUGSNAG_API_KEY}`,
    releaseStage: `${process.env.BUGSNAG_RELEASE_STAGE}`,
    notifyReleaseStages: ["production", "staging"],
    plugins: [new BugsnagPluginReact()],
})

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)

exports.wrapRootElement = ({ element }) => (
  <ErrorBoundary>{element}</ErrorBoundary>
)
