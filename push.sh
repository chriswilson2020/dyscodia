#!/usr/bin/env bash
# One-command push for the dyscodia repo.
# Usage:  ./push.sh "your commit message"
# After it pushes, GitHub Actions runs the tests and redeploys the live site.
set -e
cd "$(dirname "$0")"

# Commit local changes if there are any; otherwise just push pending commits.
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "${1:-Update Dyscodia}"
else
  echo "Working tree clean — pushing any commits not yet on the remote."
fi

git push origin main
echo
echo "Pushed. GitHub Actions runs the tests and redeploys:  https://dyscodia.com"
