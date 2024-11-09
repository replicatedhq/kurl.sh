# kurl.sh

## Local development

Before you are able to run this locally you need to have NodeJS above v.8.12.

1. Install project dependencies
   ```bash
   yarn install
   ```

1. And then run the project
   ```bash
   export GOOGLE_ANALYTICS_TRACKING_ID=dummy
   make serve
   ```

1. In your browser navigate to `localhost:8072` to view the project.
2. Local Forward port in VS Code from 8072 to localhost

## Updating documentation flags 

1. When updating add-ons flags JSON should be updated (`/static/versionDetails.json`). 
2. In a markdown file those flags should be called as `flags-table`.

## Releasing the documentation

The [deploy workflow](https://github.com/replicatedhq/kurl.sh/actions/workflows/deploy.yaml) is responsible for releasing to both staging and production.

Staging will be released on merge to main.

Releasing to the production environment requires review from the @replicatedhq/embedded-kubernetes team.
