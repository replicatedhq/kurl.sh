#!/bin/bash
set -euo pipefail

# Install Playwright browsers required by gatsby-remark-mermaid
npx playwright install --with-deps

# Determine which build to run based on the Netlify site URL.
# URL is the canonical site URL (e.g. https://staging.kurl.sh or https://kurl.sh)
# and is the same for production deploys and deploy previews on a given site.
if [[ "${URL:-}" == *"staging.kurl.sh"* ]]; then
  make build-staging
else
  make build-production
fi
