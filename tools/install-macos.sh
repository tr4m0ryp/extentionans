#!/bin/sh
# One-time setup: clones the extension to a stable folder and installs a login
# agent that pulls the latest version on every login. Loading the extension
# unpacked from $DIR then tracks GitHub; Chrome picks up changes on restart.
set -e
REPO="https://github.com/tr4m0ryp/uva-tweaks.git"
DIR="$HOME/Library/Application Support/pdfextractor"
LABEL="com.pdfextractor.update"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"

mkdir -p "$(dirname "$DIR")" "$HOME/Library/LaunchAgents"
if [ -d "$DIR/.git" ]; then
  git -C "$DIR" fetch --quiet origin main
  git -C "$DIR" reset --hard --quiet origin/main
else
  git clone --quiet "$REPO" "$DIR"
fi

cat > "$PLIST" <<PL
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key>
  <array><string>/bin/sh</string><string>$DIR/tools/update.sh</string></array>
  <key>EnvironmentVariables</key><dict><key>PDFEXTRACTOR_DIR</key><string>$DIR</string></dict>
  <key>RunAtLoad</key><true/>
  <key>StartInterval</key><integer>1800</integer>
</dict></plist>
PL

launchctl unload "$PLIST" 2>/dev/null || true
launchctl load "$PLIST"
echo "Installed. In chrome://extensions -> Load unpacked, choose:"
echo "  $DIR"
