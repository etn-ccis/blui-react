#!/usr/bin/env bash
set -euo pipefail

pr_number=${1:?Expected PR number}
expected_sha=${2:-}
[[ "$pr_number" =~ ^[0-9]+$ ]] || exit 1
script_dir=$(cd "$(dirname "$0")" && pwd)
work_dir=$(mktemp -d)
trap 'rm -rf "$work_dir"' EXIT

pr=$(gh api "repos/$GITHUB_REPOSITORY/pulls/$pr_number")
head_sha=$(jq -r '.head.sha' <<< "$pr")
head_repo=$(jq -r '.head.repo.full_name // ""' <<< "$pr")
head_branch=$(jq -r '.head.ref' <<< "$pr")
[[ $(jq -r '.state' <<< "$pr") == open ]] || exit 0
[[ "$head_sha" =~ ^[a-f0-9]{40}$ && "$head_repo" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]] || exit 1
[[ -z "$expected_sha" || "$head_sha" == "$expected_sha" ]] || exit 0

jira=$(jq -c '[((.title // "") + " " + (.head.ref // "") + " " + ((.body // "") | sub("(?s)<!-- blui-pr-summary:start -->.*?<!-- blui-pr-summary:end -->"; "")) | ascii_upcase | scan("[A-Z][A-Z0-9]+-[0-9]+"))] | unique | .[:10]' <<< "$pr")
epic_unavailable=false
if [[ "$jira" != '[]' ]]; then
    if [[ "$head_repo" != "$GITHUB_REPOSITORY" || -z "${JIRA_EMAIL:-}" || -z "${JIRA_API_TOKEN:-}" ]]; then
        epic_unavailable=true
    else
        while IFS= read -r issue; do
            for depth in 1 2 3; do
                if response=$(curl -fsS --max-time 10 --user "$JIRA_EMAIL:$JIRA_API_TOKEN" "https://eaton-corp.atlassian.net/rest/api/3/issue/$issue?fields=parent" 2>/dev/null); then
                    if ! parent=$(jq -er '.fields | objects | .parent.key // "" | strings | select(. == "" or test("^[A-Z][A-Z0-9]+-[0-9]+$"))' <<< "$response"); then
                        epic_unavailable=true
                        break
                    fi
                    [[ -n "$parent" ]] || break
                    jira=$(jq -c --arg parent "$parent" '. + [$parent] | unique' <<< "$jira")
                    issue=$parent
                else
                    epic_unavailable=true
                    break
                fi
            done
        done < <(jq -r '.[]' <<< "$jira")
    fi
fi

files=$(gh api --paginate --slurp "repos/$GITHUB_REPOSITORY/pulls/$pr_number/files?per_page=100")
components=$(jq -r '[.[][] | .filename | capture("^packages/component-library/(?:src/core/(?<core>[A-Za-z0-9_.-]+)/|figma-connect/(?<mapping>[A-Za-z0-9_.-]+)\\.figma\\.tsx$)")? | .core // .mapping // empty] | unique | .[]' <<< "$files")
figma='[]'
while IFS= read -r component; do
    [[ -n "$component" ]] || continue
    mapping=$(gh api -H 'Accept: application/vnd.github.raw+json' "repos/$head_repo/contents/packages/component-library/figma-connect/$component.figma.tsx?ref=$head_sha" 2>/dev/null || true)
    url=$(printf '%s\n' "$mapping" | grep -Eo 'https://(www\.)?figma\.com/design/[A-Za-z0-9._~/?#%=&+-]+' | head -n 1 || true)
    figma=$(jq -c --arg name "$component" --arg url "$url" '. + [{name: $name, url: $url}]' <<< "$figma")
done <<< "$components"

security='{}'
showcase=''
chromatic=''
coverage=''
docs_packages='{}'
blackduck='[]'
blackduck_url=''
blackduck_run_url=''
if [[ "$head_repo" == "$GITHUB_REPOSITORY" ]]; then
    runs=$(gh api "repos/$GITHUB_REPOSITORY/actions/runs?event=pull_request&head_sha=$head_sha&per_page=100" 2>/dev/null || printf '%s' '{"workflow_runs":[]}')
    select_run() {
        jq -r --arg name "$1" --arg sha "$head_sha" --arg branch "$head_branch" --arg repo "$head_repo" --argjson pr "$pr_number" '[.workflow_runs[]? | select(.name == $name and .head_sha == $sha and .head_branch == $branch and .head_repository.full_name == $repo and .status == "completed" and (((.pull_requests // []) | length == 0) or any(.pull_requests[]?; .number == $pr)))] | sort_by(.id) | last | .id // empty' <<< "$runs"
    }
    read_artifact() {
        local run_id=$1 artifact_name=$2 filename=$3 artifact_id
        [[ -n "$run_id" ]] || return 1
        artifact_id=$(gh api "repos/$GITHUB_REPOSITORY/actions/runs/$run_id/artifacts?per_page=100" 2>/dev/null | jq -r --arg name "$artifact_name" '[.artifacts[]? | select(.name == $name and .expired == false and .size_in_bytes <= 65536)] | last | .id // empty') || return 1
        [[ "$artifact_id" =~ ^[0-9]+$ ]] || return 1
        gh api "repos/$GITHUB_REPOSITORY/actions/artifacts/$artifact_id/zip" > "$work_dir/artifact.zip" 2>/dev/null || return 1
        unzip -p "$work_dir/artifact.zip" "$filename" 2>/dev/null | head -c 65537 > "$work_dir/artifact.json" || true
        [[ $(wc -c < "$work_dir/artifact.json") -le 65536 ]] || return 1
        jq -ce --arg pr "$pr_number" --arg sha "$head_sha" 'select(type == "object" and .pr == $pr and .head_sha == $sha)' "$work_dir/artifact.json"
    }
    build_run=$(select_run 'Build')
    if result=$(read_artifact "$build_run" pr-summary-security pr-security.json); then
        security=$(jq -c --arg url "${GITHUB_SERVER_URL}/$GITHUB_REPOSITORY/actions/runs/$build_run" '{critical, high, url: $url}' <<< "$result")
    fi
    if result=$(read_artifact "$build_run" pr-summary-showcase pr-showcase.json); then showcase=$(jq -r '.url // "" | strings' <<< "$result"); fi
    if result=$(read_artifact "$build_run" pr-summary-chromatic pr-chromatic.json); then chromatic=$(jq -r '.url // "" | strings' <<< "$result"); fi
    for name in pr-summary-coverage-components pr-summary-coverage-workflow; do
        if result=$(read_artifact "$build_run" "$name" pr-coverage.json) && jq -e '.available == true' <<< "$result" >/dev/null; then
            coverage="https://app.codecov.io/gh/$GITHUB_REPOSITORY/pull/$pr_number"
            break
        fi
    done
    docs_run=$(select_run 'Docs Package Check')
    if result=$(read_artifact "$docs_run" pr-summary-docs-packages pr-docs-packages.json); then
        docs_packages=$(jq -c --arg url "${GITHUB_SERVER_URL}/$GITHUB_REPOSITORY/actions/runs/$docs_run" '. + {run_url: $url}' <<< "$result")
    fi
    scan_run=$(select_run 'CI-BlackDuck-SCA-Basic')
    if [[ -n "$scan_run" ]]; then
        artifacts=$(gh api "repos/$GITHUB_REPOSITORY/actions/runs/$scan_run/artifacts?per_page=100" 2>/dev/null || printf '%s' '{"artifacts":[]}')
        while IFS= read -r name; do
            [[ -n "$name" ]] || continue
            if result=$(read_artifact "$scan_run" "$name" pr-blackduck.json); then
                blackduck=$(jq -c --argjson result "$result" '. + [$result]' <<< "$blackduck")
            fi
        done < <(jq -r '.artifacts[]? | select(.name | test("^pr-summary-blackduck-[0-9]+$")) | .name' <<< "$artifacts")
        [[ "$blackduck" == '[]' ]] || blackduck_url=${BLACKDUCKSCA_URL:-}
        if [[ "$blackduck" != '[]' ]] || jq -e --argjson run "$scan_run" --argjson pr "$pr_number" 'any(.workflow_runs[]?; .id == $run and any(.pull_requests[]?; .number == $pr))' <<< "$runs" >/dev/null; then
            blackduck_run_url="${GITHUB_SERVER_URL}/$GITHUB_REPOSITORY/actions/runs/$scan_run"
        fi
    fi
fi

jq -n --argjson jira "$jira" --argjson epic_unavailable "$epic_unavailable" --argjson figma "$figma" --argjson security "$security" --argjson blackduck "$blackduck" --argjson docs_packages "$docs_packages" --arg showcase "$showcase" --arg chromatic "$chromatic" --arg coverage "$coverage" --arg blackduck_url "$blackduck_url" --arg blackduck_run_url "$blackduck_run_url" '{jira: $jira, epic_unavailable: $epic_unavailable, figma: $figma, security: $security, blackduck: $blackduck, docs_packages: $docs_packages, showcase_url: $showcase, chromatic_url: $chromatic, coverage_url: $coverage, blackduck_url: $blackduck_url, blackduck_run_url: $blackduck_run_url}' > "$work_dir/data.json"

latest=$(gh api "repos/$GITHUB_REPOSITORY/pulls/$pr_number")
[[ $(jq -r '.head.sha' <<< "$latest") == "$head_sha" && $(jq -r '.state' <<< "$latest") == open ]] || exit 0
jq -jr '.body // ""' <<< "$latest" > "$work_dir/body.md"
bash "$script_dir/render-pr-summary.sh" "$work_dir/data.json" "$work_dir/body.md" > "$work_dir/updated.md"
if ! cmp -s "$work_dir/body.md" "$work_dir/updated.md"; then
    gh api --method PATCH "repos/$GITHUB_REPOSITORY/pulls/$pr_number" -F "body=@$work_dir/updated.md" > /dev/null
fi