import React from "react";
import { DocSearch } from '@docsearch/react';

import '@docsearch/css';

function Search() {
  return (
    <DocSearch
      appId={process.env.GATSBY_ALGOLIA_APP_ID}
      indexName="kurl-algolia-config"
      apiKey={process.env.GATSBY_ALGOLIA_API_KEY}
  />
  );
}

export default Search;