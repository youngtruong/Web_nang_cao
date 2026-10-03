#!/usr/bin/env bash
set -euo pipefail
# Chạy npm run build và npm run preview -- --host 127.0.0.1 --port 4173 trước.
base_url="${1:-http://127.0.0.1:4173}"
mkdir -p reports/lighthouse
for mode in before after; do
  for run in 1 2 3; do
    npx --yes lighthouse@12.8.2 "$base_url/performance.html?mode=$mode" \
      --chrome-flags="--headless --no-sandbox" --only-categories=performance \
      --output=json --output=html --output-path="reports/lighthouse/$mode-$run" --quiet
  done
done
node scripts/summarize-performance.mjs
