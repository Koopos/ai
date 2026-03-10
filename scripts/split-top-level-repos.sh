#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

REMOTE_BASE="${REMOTE_BASE:-}"
GITHUB_OWNER="${GITHUB_OWNER:-}"
CREATE_REMOTE="${CREATE_REMOTE:-0}"
PUSH_REMOTE="${PUSH_REMOTE:-0}"
DRY_RUN="${DRY_RUN:-1}"
EXCLUDE_DIRS="${EXCLUDE_DIRS:-.git,scripts}"

usage() {
  cat <<USAGE
Usage:
  ./scripts/split-top-level-repos.sh [options]

Options:
  --owner <github_owner>         GitHub owner/user/org name.
  --remote-base <base_url>       Remote URL base (e.g. git@github.com:my-org).
  --create-remote                Create GitHub repos via gh CLI before pushing.
  --push                         Push split branches to remote repositories.
  --exclude <a,b,c>              Comma-separated top-level directories to skip.
  --execute                      Disable dry-run mode (default: dry-run).
  -h, --help                     Show this help.

Examples:
  # Preview commands only
  ./scripts/split-top-level-repos.sh --owner my-org

  # Actually split + create repos + push
  ./scripts/split-top-level-repos.sh --owner my-org --create-remote --push --execute
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --owner)
      GITHUB_OWNER="$2"
      shift 2
      ;;
    --remote-base)
      REMOTE_BASE="$2"
      shift 2
      ;;
    --create-remote)
      CREATE_REMOTE=1
      shift
      ;;
    --push)
      PUSH_REMOTE=1
      shift
      ;;
    --exclude)
      EXCLUDE_DIRS="$2"
      shift 2
      ;;
    --execute)
      DRY_RUN=0
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$GITHUB_OWNER" ]]; then
  echo "Error: --owner is required." >&2
  exit 1
fi

if [[ -z "$REMOTE_BASE" ]]; then
  REMOTE_BASE="git@github.com:${GITHUB_OWNER}"
fi

if [[ "$CREATE_REMOTE" -eq 1 ]] && ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI is required when --create-remote is enabled." >&2
  exit 1
fi

run_cmd() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "[dry-run] $*"
  else
    echo "+ $*"
    eval "$@"
  fi
}

echo "Root: $ROOT_DIR"
echo "Owner: $GITHUB_OWNER"
echo "Remote base: $REMOTE_BASE"
echo "Create remote repos: $CREATE_REMOTE"
echo "Push to remotes: $PUSH_REMOTE"
echo "Dry run: $DRY_RUN"
echo "Exclude dirs: $EXCLUDE_DIRS"

IFS=',' read -r -a excluded <<< "$EXCLUDE_DIRS"
declare -a find_args=("$ROOT_DIR" -mindepth 1 -maxdepth 1 -type d)
for item in "${excluded[@]}"; do
  trimmed="$(echo "$item" | xargs)"
  [[ -z "$trimmed" ]] && continue
  find_args+=( ! -name "$trimmed" )
done
find_args+=( -printf '%f\n' )

declare -a dirs=()
while IFS= read -r dir; do
  dirs+=("$dir")
done < <(find "${find_args[@]}" | sort)

if [[ ${#dirs[@]} -eq 0 ]]; then
  echo "No top-level directories found."
  exit 0
fi

for dir in "${dirs[@]}"; do
  split_branch="split/${dir}"
  remote_name="repo-${dir}"
  remote_url="${REMOTE_BASE}/${dir}.git"

  echo
  echo "=== Processing: ${dir} ==="

  run_cmd "git branch -D '${split_branch}' >/dev/null 2>&1 || true"
  run_cmd "git subtree split --prefix='${dir}' -b '${split_branch}'"

  if [[ "$CREATE_REMOTE" -eq 1 ]]; then
    run_cmd "gh repo create '${GITHUB_OWNER}/${dir}' --private --source='.' --disable-issues --disable-wiki --confirm"
  fi

  if [[ "$PUSH_REMOTE" -eq 1 ]]; then
    run_cmd "git remote remove '${remote_name}' >/dev/null 2>&1 || true"
    run_cmd "git remote add '${remote_name}' '${remote_url}'"
    run_cmd "git push '${remote_name}' '${split_branch}:main' --force"
  fi
done

echo
if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "Dry run complete. Re-run with --execute to actually run commands."
else
  echo "Done."
fi
