#!/usr/bin/env bash
# Turn an AI-generated clip into a seamless, web-ready hero loop.
#
#   scripts/media/make-loop.sh [source.mp4] [out-dir]
#
# Defaults to public/media/mennie/source.mp4 -> public/media/mennie/
#
# Steps:
#   1. trim to the best window (START/DUR below)
#   2. make it loop by crossfading the tail back into the head (xfade)
#   3. export hero-1920.mp4 (H.264), hero-1920.webm (VP9), hero-960.mp4
#   4. export poster.avif + poster.webp from the first frame
#
# Budgets from the brief: desktop <= 6 MB, mobile <= 2.5 MB. The script
# prints the final sizes so you can see whether you are inside them.
#
# Tuning: raise CRF to shrink, lower it for quality. FADE is how much of the
# tail is dissolved back into the head — longer hides the seam better but
# costs you that much runtime.

set -euo pipefail

SRC="${1:-public/media/mennie/source.mp4}"
OUT="${2:-public/media/mennie}"

START="${START:-0}"      # seconds into the source
DUR="${DUR:-8}"          # seconds of usable material
FADE="${FADE:-1.0}"      # crossfade length
CRF="${CRF:-23}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "error: ffmpeg not found on PATH" >&2
  echo "install: winget install Gyan.FFmpeg" >&2
  exit 1
fi

if [ ! -f "$SRC" ]; then
  echo "error: source not found: $SRC" >&2
  echo "Generate it from the prompts in docs/ASSET_BRIEFS.md and save it there." >&2
  exit 1
fi

mkdir -p "$OUT"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# The loop body is DUR - FADE long: the final FADE seconds are consumed by
# dissolving the tail back over the head.
BODY=$(awk "BEGIN{printf \"%.3f\", $DUR - $FADE}")
OFFSET=$(awk "BEGIN{printf \"%.3f\", $BODY - $FADE}")

echo "trimming ${START}s +${DUR}s, crossfading ${FADE}s ..."

# head = the loop body; tail = the piece that dissolves back over its start
ffmpeg -loglevel error -y -ss "$START" -t "$DUR" -i "$SRC" \
  -an -filter_complex "
    [0:v]split=2[a][b];
    [a]trim=0:${BODY},setpts=PTS-STARTPTS[body];
    [b]trim=${BODY}:${DUR},setpts=PTS-STARTPTS[tail];
    [body][tail]xfade=transition=fade:duration=${FADE}:offset=${OFFSET}[v]
  " -map "[v]" -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p "$TMP/loop.mp4"

echo "encoding ..."

# desktop H.264 — faststart puts the moov atom first so it starts without a
# full download
ffmpeg -loglevel error -y -i "$TMP/loop.mp4" -an \
  -vf "scale=1920:-2" -c:v libx264 -crf "$CRF" -preset slow \
  -pix_fmt yuv420p -movflags +faststart "$OUT/hero-1920.mp4"

# desktop VP9
ffmpeg -loglevel error -y -i "$TMP/loop.mp4" -an \
  -vf "scale=1920:-2" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 \
  "$OUT/hero-1920.webm"

# mobile
ffmpeg -loglevel error -y -i "$TMP/loop.mp4" -an \
  -vf "scale=960:-2" -c:v libx264 -crf $((CRF + 2)) -preset slow \
  -pix_fmt yuv420p -movflags +faststart "$OUT/hero-960.mp4"

# posters from the first frame
ffmpeg -loglevel error -y -i "$TMP/loop.mp4" -frames:v 1 \
  -vf "scale=1920:-2" -c:v libaom-av1 -crf 32 -still-picture 1 "$OUT/poster.avif" \
  || ffmpeg -loglevel error -y -i "$TMP/loop.mp4" -frames:v 1 \
       -vf "scale=1920:-2" "$OUT/poster.avif"
ffmpeg -loglevel error -y -i "$TMP/loop.mp4" -frames:v 1 \
  -vf "scale=1920:-2" -c:v libwebp -quality 84 "$OUT/poster.webp"

echo
echo "output:"
for f in hero-1920.mp4 hero-1920.webm hero-960.mp4 poster.avif poster.webp; do
  [ -f "$OUT/$f" ] && printf "  %-18s %6s KB\n" "$f" "$(( $(wc -c < "$OUT/$f") / 1024 ))"
done
echo
echo "budgets: desktop <= 6144 KB, mobile <= 2560 KB"
echo
echo "Then point the MENNIE hero at the video: see docs/ASSET_BRIEFS.md."
