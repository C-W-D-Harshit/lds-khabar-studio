# Source this first in every shell call:  source <studio>/tools/env.sh
# Works from bash and zsh, wherever the studio folder lives.
_lds_self="${BASH_SOURCE[0]:-${(%):-%x}}"
export STUDIO="$(cd "$(dirname "$_lds_self")/.." && pwd)"
unset _lds_self
# Node 22: prefer nvm's, then Homebrew's node@22, then whatever node is on PATH
_lds_nvm="$(ls "$HOME/.nvm/versions/node" 2>/dev/null | grep '^v22\.' | sort -V | tail -1)"
[ -n "$_lds_nvm" ] && _lds_nvm="$HOME/.nvm/versions/node/$_lds_nvm"
[ -n "$_lds_nvm" ] && export PATH="$_lds_nvm/bin:$PATH"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
[ -d /opt/homebrew/opt/node@22/bin ] && export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
[ -n "$_lds_nvm" ] && export PATH="$_lds_nvm/bin:$PATH"
unset _lds_nvm
# Tools setup.sh downloaded into the repo (only when the Mac had none of its own)
[ -d "$STUDIO/tools/node/bin" ] && export PATH="$STUDIO/tools/node/bin:$PATH"
[ -d "$STUDIO/tools/bin" ] && export PATH="$STUDIO/tools/bin:$PATH"
# python3 = the studio's Python 3.12 once setup has made it
[ -x "$STUDIO/tools/whisper/.venv/bin/python3" ] && export PATH="$STUDIO/tools/whisper/.venv/bin:$PATH"
export WHISPER_PY="$STUDIO/tools/whisper/.venv/bin/python"
export WHISPER_MODEL="$STUDIO/tools/whisper/model"
# Where edition folders go: <studio>/videos when it exists (repo setup), else ~/Documents
# Optional per-Mac overrides (not in git), e.g. export LDS_EDITIONS="$HOME/Documents"
[ -f "$STUDIO/tools/env.local.sh" ] && source "$STUDIO/tools/env.local.sh"
if [ -z "$LDS_EDITIONS" ]; then
  if [ -d "$STUDIO/videos" ]; then export LDS_EDITIONS="$STUDIO/videos"; else export LDS_EDITIONS="$HOME/Documents"; fi
fi
