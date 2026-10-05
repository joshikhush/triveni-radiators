#!/bin/sh
# Run ON THE VPS from the app checkout instead of `git pull`, then build as
# usual. Fetches the branch, scans it with the malware guard from the code
# that is already deployed (so tampered code cannot pass its own guard), and
# fast-forwards the checkout only if the scan passes.
#
# Usage: sh deploy/safe-update.sh [branch]   (default: main)
set -eu
branch=${1:-main}
app=$(git rev-parse --show-toplevel)
guard="$app/.github/scripts/malware_guard.py"

git -C "$app" fetch origin "$branch"
new=$(git -C "$app" rev-parse FETCH_HEAD)
tmp=$(mktemp -d)
trap 'git -C "$app" worktree remove --force "$tmp" >/dev/null 2>&1 || true; rm -rf "$tmp"' EXIT
git -C "$app" worktree add -q --detach "$tmp" "$new"

if [ ! -f "$guard" ]; then
  echo "No deployed malware guard yet; using the one in the new code." >&2
  guard="$tmp/.github/scripts/malware_guard.py"
fi
if ! (cd "$tmp" && python3 "$guard"); then
  echo "REFUSED: $branch ($new) failed the malware guard. The deployed code was not changed." >&2
  exit 1
fi
git -C "$app" merge --ff-only "$new"
echo "Updated to $new. Run the build/restart steps now."
