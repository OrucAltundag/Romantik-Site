#!/usr/bin/env bash
# Claude ana orkestrator icin guvenli Codex CLI wrapper'i (macOS/Linux).
# - Calisma dizinini acikca mevcut projeye sinirlar (-C).
# - Varsayilan olarak SALT OKUNUR sandbox kullanir (-s read-only).
# - Tehlikeli bypass secenekleri (--yolo, --dangerously-*) EKLENMEZ.
# - Prompt eval edilmez; dogrudan arguman olarak gecirilir.
#
# Kullanim:
#   ./scripts/ask-codex.sh "gorev" [calisma-dizini] [sandbox]
#   sandbox: read-only (varsayilan) | workspace-write
set -euo pipefail

TASK="${1:-}"
WORKING_DIRECTORY="${2:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
SANDBOX="${3:-read-only}"

if [[ -z "$TASK" ]]; then
  echo "Kullanim: ./scripts/ask-codex.sh \"gorev\" [calisma-dizini] [sandbox]"
  exit 1
fi

if [[ "$SANDBOX" != "read-only" && "$SANDBOX" != "workspace-write" ]]; then
  echo "Gecersiz sandbox: $SANDBOX (read-only veya workspace-write olmali)"
  exit 1
fi

if ! command -v codex >/dev/null 2>&1; then
  echo "Codex CLI bulunamadi. Once 'npm install -g @openai/codex' calistirin."
  exit 1
fi

if [[ ! -d "$WORKING_DIRECTORY" ]]; then
  echo "Calisma dizini bulunamadi: $WORKING_DIRECTORY"
  exit 1
fi

echo "Codex calisma dizini : $WORKING_DIRECTORY"
echo "Sandbox politikasi   : $SANDBOX"
echo "Gorev                : $TASK"
echo ""

# codex exec (non-interactive):
#   -s / --sandbox : sandbox politikasi (varsayilan read-only)
#   -C / --cd      : calisma dizinini acikca sinirla
# Bos stdin, "read from stdin" beklemesini engeller.
printf '' | codex exec -s "$SANDBOX" -C "$WORKING_DIRECTORY" "$TASK"
