#!/bin/zsh
# Mood-board contact sheets (3x2 grids) from moodboard/stills/*.png.  usage: contact_sheet.sh "<edition>"
source "$(dirname "$0")/env.sh"
cd "$1/moodboard" || exit 1
find . -maxdepth 1 -name 'sheet_*.jpg' -delete
ffmpeg -loglevel error -y -pattern_type glob -i 'stills/*.png' -vf "scale=640:360,tile=3x2" -q:v 3 sheet_%02d.jpg && ls sheet_*.jpg
