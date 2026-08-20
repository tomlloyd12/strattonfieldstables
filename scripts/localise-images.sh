#!/usr/bin/env bash
#
# Pull every image still served from the Webflow CDN into ./images and rewrite
# the references in index.html and js/main.js to point at the local copies.
#
# The Webflow code export only localised some of the site's images; the rest are
# still hot-linked to cdn.prod.website-files.com. Run this once, from a machine
# with internet access, BEFORE you cancel Webflow hosting — otherwise those
# images disappear when the Webflow site goes away.
#
# Usage:  bash scripts/localise-images.sh
#
set -euo pipefail

cd "$(dirname "$0")/.."

command -v curl >/dev/null || { echo "curl is required" >&2; exit 1; }

mkdir -p images

# Every distinct CDN URL referenced by the site, responsive variants included.
# Stops at whitespace, quotes, commas and parens — the delimiters used in
# href/src/srcset attributes and in the JS array.
# The trailing extension filter skips the bare CDN base string in main.js.
urls=$(grep -ohE "https://cdn\.prod\.website-files\.com/[^\"'), ]+\.(jpg|jpeg|png|svg|gif|webp)" \
         index.html js/main.js | sort -u)

if [ -z "$urls" ]; then
  echo "No CDN URLs left — everything is already local."
  exit 0
fi

count=0
while IFS= read -r url; do
  [ -n "$url" ] || continue

  # 62af1ce3d95a84764d3dd58f_turn%20out.jpg -> turn-out.jpg
  raw=${url##*/}
  raw=$(printf '%b' "${raw//%/\\x}")   # percent-decode
  name=${raw#*_}                       # drop the Webflow asset-id prefix
  name=${name// /-}                    # spaces -> hyphens
  name=$(echo "$name" | tr '[:upper:]' '[:lower:]')

  if [ ! -f "images/$name" ]; then
    echo "  fetching $name"
    curl -fsSL "$url" -o "images/$name"
  fi

  # Rewrite this URL wherever it appears.
  esc=$(printf '%s' "$url" | sed 's/[&/\]/\\&/g')
  sed -i.bak "s|$esc|images/$name|g" index.html js/main.js
  rm -f index.html.bak js/main.js.bak

  count=$((count + 1))
done <<< "$urls"

echo
echo "Localised $count URL(s). The site no longer depends on Webflow's CDN."
echo "Check the page renders, then commit the new files in images/."
