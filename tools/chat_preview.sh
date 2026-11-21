#!/bin/zsh
# Make a small copy (<25 MB) of a video so it can be attached in the chat.  usage: chat_preview.sh in.mp4 out.mp4
source "$(dirname "$0")/env.sh"
in="$1"; out="$2"
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
w=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$in"); h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$in")
# total budget 22 MB -> video kbps
kb=$(python3 -c "print(max(250,int(22*8192/$d - 96)))")
if [ "$w" -gt "$h" ]; then sc="scale=-2:540"; else sc="scale=540:-2"; fi
ffmpeg -loglevel error -y -i "$in" -vf "$sc" -c:v libx264 -preset veryfast -b:v ${kb}k -maxrate $((kb*2))k -bufsize $((kb*2))k -c:a aac -b:a 96k -movflags +faststart "$out"
ls -lh "$out" | awk '{print $5, $9}'
