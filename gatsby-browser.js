const React = require('react')
const Bugsnag = require('@bugsnag/js').default
const BugsnagPluginReact = require('@bugsnag/plugin-react').default

Bugsnag.start({
  apiKey: 'd9853b1ecad8ac8750308fe7ce9335b8',
  plugins: [new BugsnagPluginReact()],
})

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)

exports.wrapRootElement = ({ element }) => (
  <ErrorBoundary>{element}</ErrorBoundary>
)
