#!/bin/bash
# Double-click to open the LDS खबर studio. Opens Claude in this folder.
# Works through a Desktop shortcut too (it follows the link back to the repo).
SELF="$0"
while [ -L "$SELF" ]; do
  L="$(readlink "$SELF")"
  case "$L" in /*) SELF="$L" ;; *) SELF="$(dirname "$SELF")/$L" ;; esac
done
cd "$(dirname "$SELF")" || exit 1
export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
clear
printf '\n  LDS खबर स्टूडियो खुल रहा है...\n\n'
# Pick up the owner's latest improvements, quietly. Never blocks if offline or if anything changed locally.
GIT_TERMINAL_PROMPT=0 GIT_SSH_COMMAND="ssh -o BatchMode=yes -o ConnectTimeout=8" \
  git -c http.lowSpeedLimit=1000 -c http.lowSpeedTime=10 pull --ff-only -q >/dev/null 2>&1 || true
exec claude "नमस्ते"
