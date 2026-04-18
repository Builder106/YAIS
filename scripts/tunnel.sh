#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-5173}"

if ! command -v cloudflared >/dev/null 2>&1; then
  echo "cloudflared not found. Install with: brew install cloudflared" >&2
  exit 1
fi

print_qr() {
  local url="$1"
  if command -v qrencode >/dev/null 2>&1; then
    echo
    qrencode -t ANSIUTF8 "$url"
    echo
  else
    echo "(install 'qrencode' via brew to print a QR here; opening QR in browser instead)"
    open "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$url")"
  fi
}

LOG="$(mktemp)"
echo "Starting Cloudflare tunnel → http://localhost:${PORT}"
cloudflared tunnel --url "http://localhost:${PORT}" 2>&1 | tee "$LOG" &
PID=$!
trap 'kill $PID 2>/dev/null || true; rm -f "$LOG"' EXIT INT TERM

URL=""
for _ in $(seq 1 30); do
  URL="$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG" | head -n1 || true)"
  [ -n "$URL" ] && break
  sleep 1
done

if [ -z "$URL" ]; then
  echo "Could not detect tunnel URL within 30s. See log above." >&2
  wait $PID
  exit 1
fi

echo
echo "╔══════════════════════════════════════════════════════╗"
echo "  MedCore demo URL: $URL"
echo "╚══════════════════════════════════════════════════════╝"
print_qr "$URL"
echo "Scan with your phone camera, or AirDrop the URL."
echo "Ctrl-C to stop the tunnel."
wait $PID
