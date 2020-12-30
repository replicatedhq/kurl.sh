#!/bin/bash

find ./src -name "*.md" > md-files.txt

mkdir pdf-source
while read p; do
  p=${p#"./src/markdown-pages/"}
  p=${p%"/index.md"}
  p=${p%".md"}
  echo "https://kurl.sh/docs/$p/"
  wkhtmltopdf --viewport-size 1280x1024 --orientation Landscape --dpi 144 "https://kurl.sh/docs/$p/" pdf-source/`date +%s`.pdf
done <md-files.txt

pdfunite source/* kurl.pdf
rm -rf md-files.txt pdf-source/
