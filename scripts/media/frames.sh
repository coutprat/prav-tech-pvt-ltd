#!/usr/bin/env bash
# Convert a Blender PNG frame sequence to WebP and report the total weight.
#
#   scripts/media/frames.sh <src-png-dir> <dest-dir> [quality]
#
# Uses cwebp when available, otherwise ffmpeg. Both are fine; cwebp is a
# little smaller at the same visual quality.
#
# Budgets from the brief:
#   desktop  <= 120 frames @ 1600x900,  target <= 45 KB/frame
#   mobile   <=  60 frames @  900x506,  target <= 25 KB/frame

set -euo pipefail

SRC="${1:?usage: frames.sh <src-png-dir> <dest-dir> [quality]}"
DEST="${2:?usage: frames.sh <src-png-dir> <dest-dir> [quality]}"
Q="${3:-82}"

mkdir -p "$DEST"

if command -v cwebp >/dev/null 2>&1; then
  ENCODER="cwebp"
elif command -v ffmpeg >/dev/null 2>&1; then
  ENCODER="ffmpeg"
else
  echo "error: neither cwebp nor ffmpeg found on PATH" >&2
  exit 1
fi

count=0
for png in "$SRC"/frame-*.png; do
  [ -e "$png" ] || { echo "error: no frame-*.png in $SRC" >&2; exit 1; }
  base="$(basename "$png" .png)"
  out="$DEST/$base.webp"
  if [ "$ENCODER" = "cwebp" ]; then
    cwebp -quiet -q "$Q" -m 6 "$png" -o "$out"
  else
    ffmpeg -loglevel error -y -i "$png" -c:v libwebp -quality "$Q" -compression_level 6 "$out"
  fi
  count=$((count + 1))
done

total_kb=$(du -sk "$DEST" | cut -f1)
avg_kb=$(( total_kb / (count > 0 ? count : 1) ))

echo "encoder : $ENCODER (q=$Q)"
echo "frames  : $count"
echo "total   : ${total_kb} KB"
echo "average : ${avg_kb} KB/frame"
