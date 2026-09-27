#!/bin/sh
# Silently fast-forwards the loaded extension folder to the latest GitHub commit.
# Run by the login agent. Uses reset --hard so the mirror never hits a conflict.
set -e
DIR="${EXTENTIONANS_DIR:-$HOME/Library/Application Support/extentionans}"
[ -d "$DIR/.git" ] || exit 0
BR="$(git -C "$DIR" rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)"
git -C "$DIR" fetch --quiet origin "$BR"
git -C "$DIR" reset --hard --quiet "origin/$BR"
