#!/bin/bash
# One-time setup for the LDS खबर studio on an Apple Silicon Mac (M1 or newer).
# Claude runs this by itself the first time it is needed, or run it yourself:  ./setup.sh
# No password and no Homebrew needed: anything missing is downloaded into this folder (tools/bin, tools/node).
# Safe to run again: it skips what is already there. Add --shortcuts to also put shortcuts on the Desktop.
set -e
cd "$(dirname "$0")"
ROOT="$(pwd)"
BIN="$ROOT/tools/bin"
mkdir -p "$BIN"
say() { printf '\n==> %s\n' "$*"; }
ok()  { printf '    ✓ %s\n' "$*"; }
get() { curl -fL --retry 3 --connect-timeout 20 -sS -o "$2" "$1"; }

[ "$(uname -s)" = Darwin ] || { echo "This needs a Mac."; exit 1; }
[ "$(uname -m)" = arm64 ] || { echo "This needs an Apple Silicon Mac (M1 or newer): Hindi speech-to-text runs on the Apple chip."; exit 1; }
source "$ROOT/tools/env.sh"

say "Node 22"
major="$(node -v 2>/dev/null | sed 's/^v//; s/\..*//')"
if [ -z "$major" ] || [ "$major" -lt 22 ]; then
  tgz="$(curl -fsSL https://nodejs.org/dist/latest-v22.x/SHASUMS256.txt | awk '/darwin-arm64.tar.gz/{print $2}')"
  echo "    downloading $tgz"
  get "https://nodejs.org/dist/latest-v22.x/$tgz" /tmp/lds_node.tgz
  rm -rf tools/node && mkdir -p tools/node
  tar -xzf /tmp/lds_node.tgz -C tools/node --strip-components 1 && rm -f /tmp/lds_node.tgz
  source "$ROOT/tools/env.sh"
fi
ok "node $(node -v)"

say "ffmpeg, yt-dlp, uv"
if ! command -v ffmpeg >/dev/null 2>&1 || ! command -v ffprobe >/dev/null 2>&1; then
  for t in ffmpeg ffprobe; do
    echo "    downloading $t"
    get "https://ffmpeg.martin-riedl.de/redirect/latest/macos/arm64/release/$t.zip" "/tmp/lds_$t.zip"
    unzip -o -q "/tmp/lds_$t.zip" -d "$BIN" && rm -f "/tmp/lds_$t.zip" && chmod +x "$BIN/$t"
  done
fi
if ! command -v yt-dlp >/dev/null 2>&1; then
  echo "    downloading yt-dlp"
  get https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos "$BIN/yt-dlp" && chmod +x "$BIN/yt-dlp"
fi
if ! command -v uv >/dev/null 2>&1; then
  echo "    downloading uv"
  curl -LsSf https://astral.sh/uv/install.sh | env UV_INSTALL_DIR="$BIN" INSTALLER_NO_MODIFY_PATH=1 sh >/dev/null
fi
hash -r
ok "$(ffmpeg -version | head -1 | awk '{print $1, $3}'), yt-dlp $(yt-dlp --version), $(uv --version)"

say "Video engine"
( cd engine && npm ci --no-audit --no-fund --loglevel=error )
( cd engine && npx --yes remotion browser ensure >/dev/null 2>&1 ) && ok "headless browser ready" || echo "    (browser downloads on first render)"
( cd engine && npx tsc --noEmit ) && ok "engine compiles"

say "Hindi speech-to-text (Whisper large-v3-turbo, runs offline)"
[ -x tools/whisper/.venv/bin/python ] || uv venv -q --python 3.12 tools/whisper/.venv
VIRTUAL_ENV="$ROOT/tools/whisper/.venv" uv pip install -q "mlx-whisper==0.4.3" huggingface_hub
if [ ! -f tools/whisper/model/weights.safetensors ]; then
  echo "    downloading the model (about 1.6 GB, one time)"
  tools/whisper/.venv/bin/python -c "
from huggingface_hub import snapshot_download
snapshot_download('mlx-community/whisper-large-v3-turbo', local_dir='tools/whisper/model')"
fi
tools/whisper/.venv/bin/python -c "import mlx_whisper" && ok "whisper ready"

mkdir -p inbox videos
chmod +x start.command tools/*.sh tools/*.py 2>/dev/null || true

if [ "$1" = "--shortcuts" ]; then
  say "Desktop shortcuts"
  ln -sfn "$ROOT/start.command" "$HOME/Desktop/LDS खबर - शुरू करें.command"
  ln -sfn "$ROOT/videos"        "$HOME/Desktop/LDS खबर - तैयार वीडियो"
  ok "2 shortcuts on the Desktop"
fi

touch tools/.setup_done
say "Setup complete"
