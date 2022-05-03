import React from "react";
import { DocSearch } from '@docsearch/react';

import '@docsearch/css';

function Search() {
  return (
    <DocSearch
      appId="UB8IN95AB5"
      indexName="kurl-algolia-config"
      apiKey="46812184318efc4cb48cdb423ba2d498"
    />
  );
}

export default Search;