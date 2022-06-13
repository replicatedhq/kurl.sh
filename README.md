# kurl.sh

## Local development

Before you are able to run this locally you need to have NodeJS above v.8.12.

1. Install project dependencies
   ```bash
   yarn install
   ```

1. And then run the project
   ```bash
   make serve
   ```

1. In your browser navigate to `localhost:8072` to view the project.
2. Local Forward port in VS Code from 8072 to localhost

## Updating documentation flags 

1. When updating add-ons flags JSON should be updated (`/static/versionDetails.json`). 
2. In a markdown file those flags should be called as `flags-table`.

## Releasing the documentation

The kurl.sh website is built off of the `release` branch. Pull requests are first created and reviewed so that they can be merged into the `main` branch. Once the needed documentation updates are in `main`, you can create a pull request to merge them into `release`.

To merge `main` into `release`:
1. Click the [**Pull requests** tab](https://github.com/replicatedhq/kurl.sh/pulls) and click **New pull request**.
1. Change the base branch to `release`. The compare branch should be set to `main`.
1. Click **Create pull request**.
1. Wait for all checks to pass. View the deploy preview to ensure that the changes are correct.
1. Click **Merge pull request**.
