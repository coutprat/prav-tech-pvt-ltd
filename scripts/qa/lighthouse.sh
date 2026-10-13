#!/usr/bin/env bash
# Lighthouse mobile run across the pages the brief sets budgets for.
#
#   bash scripts/qa/lighthouse.sh            # needs a server on :3000
#   BASE=http://localhost:3000 bash scripts/qa/lighthouse.sh
#
# Budgets (mobile, 4G): LCP < 2.5 s, CLS < 0.1, JS < 200 KB gz excluding media.

set -uo pipefail

BASE="${BASE:-http://localhost:3000}"
OUT="qa"
mkdir -p "$OUT"

PAGES="home:/ photonics:/photonics mennie:/mennie pharma:/pharma enterprise-ai:/enterprise-ai company:/company"

for entry in $PAGES; do
  name="${entry%%:*}"
  route="${entry#*:}"
  echo "lighthouse (mobile): $name"
  npx --yes lighthouse@12 "${BASE}${route}" \
    --quiet \
    --chrome-flags="--headless=new --no-sandbox" \
    --output=json --output=html \
    --output-path="${OUT}/lh-${name}" \
    >/dev/null 2>&1
done

# Desktop runs for the three pages with hero media, for context: the mobile
# preset simulates slow 4G plus a 4x CPU throttle, which is a deliberately
# pessimistic floor rather than what most visitors will see.
for entry in home:/ photonics:/photonics mennie:/mennie; do
  name="${entry%%:*}"
  route="${entry#*:}"
  echo "lighthouse (desktop): $name"
  npx --yes lighthouse@12 "${BASE}${route}"     --preset=desktop     --quiet     --chrome-flags="--headless=new --no-sandbox"     --output=json --output=html     --output-path="${OUT}/lhd-${name}"     >/dev/null 2>&1
done

echo
node scripts/qa/lh-summary.mjs
