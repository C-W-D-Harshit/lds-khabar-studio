#!/bin/zsh
# Make a fresh edition folder with the engine cloned into video/.
# usage: new_edition.sh "21 Nov 2026"      -> $LDS_EDITIONS/News Video - 21 Nov 2026/  (videos/ inside the studio, or ~/Documents)
set -e
source "$(dirname "$0")/env.sh"
[ -z "$1" ] && { echo 'usage: new_edition.sh "21 Nov 2026"'; exit 1; }
ED="$LDS_EDITIONS/News Video - $1"
if [ -e "$ED/video" ]; then echo "EXISTS: $ED (not touched)"; exit 0; fi
mkdir -p "$ED"/{audio,images,clips,sourced,transcripts,moodboard/stills,shorts/covers}
cp -c -R "$STUDIO/engine" "$ED/video"            # APFS clone: instant, no extra disk
P="$ED/video/public"
setopt nullglob
for d in img sm bg vo vid; do rm -rf "$P/$d"; mkdir -p "$P/$d"; done
mkdir -p "$P/img/wa"
echo '{}' > "$ED/video/src/shorts/captions.json"
echo '{}' > "$ED/video/src/data/dims.json"
echo "READY: $ED"
echo "The src/ folder still holds the 21 Nov 2026 edition as a worked example: rewrite content.ts, scenes/, shorts/config.ts and scripts/shorts/texts.json for the new stories."
