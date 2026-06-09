#!/usr/bin/env bash
# One-command push for the dyscodia repo.
# Usage:  ./push.sh "your commit message"
# After it pushes, GitHub Actions runs the tests and redeploys the live site.
set -e
cd "$(dirname "$0")"

if [ -z "$(git status --porcelain)" ]; then
  echo "Nothing to commit — working tree clean."
  exit 0
fi

git add -A
git commit -m "${1:-Update Code Dojo}"
git push origin main
echo
echo "Pushed. GitHub Actions will run the tests and redeploy:"
echo "  https://chriswilson2020.github.io/dyscodia/"
