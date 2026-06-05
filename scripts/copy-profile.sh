#!/usr/bin/env bash
set -euo pipefail

SOURCE="${HOME}/.config/google-chrome"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${ROOT}/auth/chrome-profile"
PROFILE="Profile 1"

if pgrep -x chrome >/dev/null || pgrep -f '[g]oogle-chrome' >/dev/null; then
  echo "Close Chrome before copying the profile." >&2
  exit 1
fi

mkdir -p "$DEST"

rsync -a --delete "${SOURCE}/${PROFILE}/" "${DEST}/${PROFILE}/"
cp -a "${SOURCE}/Local State" "${DEST}/Local State"

rm -f "${DEST}/SingletonLock" "${DEST}/SingletonCookie" "${DEST}/SingletonSocket"

echo "Copied ${PROFILE} and Local State to ${DEST}"
