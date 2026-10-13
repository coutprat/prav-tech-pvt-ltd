#!/usr/bin/env bash
# Prepare the MENNIE cinematic for scroll-scrubbing on the web.
#
#   bash scripts/media/cinematic.sh [source.mp4] [out-dir]
#
# Defaults to assets-incoming/mennie-cinematic.mp4 -> public/media/mennie/
#
# What it does:
#   1. Removes the generator's watermark, either way:
#
#        MODE=delogo (default) interpolates the box away. Invisible when the
#        mark sits over soft-focus background — verified by eye at 3x zoom.
#
#        MODE=crop re-frames so the corner holding the mark falls outside the
#        frame, then scales back up. Costs a little framing and a little
#        sharpness, but leaves no smear. Use it when the mark sits over
#        anything with hard edges: delogo cannot reconstruct an edge, and the
#        patch reads as a blurred rectangle at 1:1.
#   2. Strips audio. The hero is muted autoplay/scrubbed, so shipping an audio
#      track is pure weight.
#   3. Encodes with a very short GOP. Scroll-scrubbing seeks constantly, and
#      with the default ~2s keyframe interval every seek decodes a long run of
#      P-frames — which is what makes scrubbed video feel like treacle. One
#      keyframe every 6 frames (0.25s at 24fps) costs size and buys smooth
#      seeking.
#
# Source is 1280x720, so there is no 1920 output: upscaling would add bytes
# without adding a single pixel of real detail.

set -euo pipefail

SRC="${1:-assets-incoming/mennie-cinematic.mp4}"
OUT="${2:-public/media/mennie}"

# Watermark box, measured from the source (see REDESIGN_OVERVIEW.md).
LOGO_X="${LOGO_X:-1128}"
LOGO_Y="${LOGO_Y:-566}"
LOGO_W="${LOGO_W:-68}"
LOGO_H="${LOGO_H:-68}"

GOP="${GOP:-6}"
CRF="${CRF:-21}"
MODE="${MODE:-delogo}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "error: ffmpeg not found on PATH" >&2
  exit 1
fi
if [ ! -f "$SRC" ]; then
  echo "error: source not found: $SRC" >&2
  exit 1
fi

mkdir -p "$OUT"

if [ "$MODE" = "crop" ]; then
  # Crop anchored top-left so the bottom-right mark falls outside, keeping
  # 16:9, then scale back to the source width.
  CW=$(( LOGO_X - 1 ))
  CH=$(( CW * 9 / 16 ))
  CH=$(( CH - CH % 2 ))
  CW=$(( CW - CW % 2 ))
  DELOGO="crop=${CW}:${CH}:0:0,scale=1280:720:flags=lanczos"
  echo "mode: crop to ${CW}x${CH} then rescale"
else
  DELOGO="delogo=x=${LOGO_X}:y=${LOGO_Y}:w=${LOGO_W}:h=${LOGO_H}"
  echo "mode: delogo"
fi

echo "removing watermark and encoding for scrubbing ..."

# desktop, native resolution
ffmpeg -loglevel error -y -i "$SRC" -an \
  -vf "$DELOGO" \
  -c:v libx264 -crf "$CRF" -preset slow -pix_fmt yuv420p \
  -g "$GOP" -keyint_min "$GOP" -sc_threshold 0 \
  -movflags +faststart "$OUT/cine-1280.mp4"

# mobile
ffmpeg -loglevel error -y -i "$SRC" -an \
  -vf "${DELOGO},scale=854:-2" \
  -c:v libx264 -crf "$((CRF + 2))" -preset slow -pix_fmt yuv420p \
  -g "$GOP" -keyint_min "$GOP" -sc_threshold 0 \
  -movflags +faststart "$OUT/cine-854.mp4"

# poster: first frame, watermark already removed
ffmpeg -loglevel error -y -i "$SRC" -vf "$DELOGO" -frames:v 1 \
  -c:v libwebp -quality 86 "$OUT/cine-poster.webp"

echo
echo "output:"
for f in cine-1280.mp4 cine-854.mp4 cine-poster.webp; do
  [ -f "$OUT/$f" ] && printf "  %-20s %6s KB\n" "$f" "$(( $(wc -c < "$OUT/$f") / 1024 ))"
done

echo
echo "verify no audio track remains:"
ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 "$OUT/cine-1280.mp4" || true
echo "(no output above = no audio)"
