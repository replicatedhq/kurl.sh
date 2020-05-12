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

1. When updating add ons flaga JSON should be updated (`/static/versionDetails.json`). 
2. In a markdown file those flags should be called as `flags-table`.