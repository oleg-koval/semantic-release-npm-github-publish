set -x
set -e

prefix="refs/heads/"

[[ "$GITHUB_REF" =~ ^$prefix(.*)$ ]]
BRANCH=${BASH_REMATCH[1]}

npx semantic-release --dry-run --debug -b $BRANCH
