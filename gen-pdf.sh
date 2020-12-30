#!/bin/bash

DIR=./pdf-work

rm -rf $DIR && mkdir $DIR
find ./src -name "*.md" > $DIR/md-files.txt

mkdir $DIR/pdf-source
while read p; do
  p=${p#"./src/markdown-pages/"}
  p=${p%"/index.md"}
  p=${p%".md"}
  echo "https://kurl.sh/docs/$p/" >> $DIR/urls-unsorted.txt
done <$DIR/md-files.txt

cat $DIR/urls-unsorted.txt | sort | uniq > $DIR/urls.txt

echo "Take this opportunity to re-sort links in $DIR/urls.txt. Press any key to continue..."
read -n 1

while read url; do
  echo $url
  wkhtmltopdf --viewport-size 1280x1024 --orientation Landscape --dpi 144 $url $DIR/pdf-source/`date +%s`.pdf
done <$DIR/urls.txt

pdfunite $DIR/pdf-source/* kurl.pdf
rm -rf $DIR
