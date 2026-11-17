#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd "$(dirname "$0")" && pwd)
event=$(jq -r 'if .pull_request then "pull_request" elif .workflow_run.event == "pull_request" then "workflow_run" else "other" end' "$GITHUB_EVENT_PATH")
case "$event" in
    pull_request)
        bash "$script_dir/update-pr-summary.sh" "$(jq -r '.pull_request.number' "$GITHUB_EVENT_PATH")" "$(jq -r '.pull_request.head.sha' "$GITHUB_EVENT_PATH")"
        ;;
    workflow_run)
        sha=$(jq -r '.workflow_run.head_sha' "$GITHUB_EVENT_PATH")
        [[ "$sha" =~ ^[a-f0-9]{40}$ ]] || exit 1
        prs=$(gh api "repos/$GITHUB_REPOSITORY/commits/$sha/pulls" | jq -r --arg sha "$sha" '.[] | select(.state == "open" and .head.sha == $sha) | .number')
        while IFS= read -r pr; do
            [[ -n "$pr" ]] || continue
            bash "$script_dir/update-pr-summary.sh" "$pr" "$sha"
        done <<< "$prs"
        ;;
esac