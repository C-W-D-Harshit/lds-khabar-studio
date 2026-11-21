#!/bin/zsh
# Size, length, resolution and loudness of finished videos.  usage: check_media.sh file1.mp4 [file2.mp4 ...]
source "$(dirname "$0")/env.sh"
for f in "$@"; do
  r=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "$f")
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  a=$(ffprobe -v error -select_streams a -show_entries stream=codec_name -of csv=p=0 "$f")
  v=$(ffmpeg -hide_banner -i "$f" -af volumedetect -vn -f null - 2>&1 | grep -E 'mean_volume|max_volume' | sed 's/.*\] //' | tr '\n' ' ')
  printf "%s | %s | %.1fs | audio:%s | %s | %s\n" "${f:t}" "$r" "$d" "${a:-NONE}" "$v" "$(du -h "$f" | cut -f1)"
done
