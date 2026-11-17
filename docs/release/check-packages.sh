#!/usr/bin/env bash
set -euo pipefail

mode=${1:?Expected warn, enforce, or off}
docs_dir=${2:?Expected docs directory}
catalog=${3:?Expected package catalog}

case "$mode" in
    off) echo 'Package check disabled.'; exit 0 ;;
    warn|enforce) ;;
    *) echo "Invalid package gate mode: $mode" >&2; exit 1 ;;
esac

failures=0
checked=0
details='[]'
while IFS= read -r package || [[ -n "$package" ]]; do
    [[ -z "$package" || "$package" == \#* ]] && continue
    if ! jq -e --arg package "$package" '.dependencies | has($package)' "$docs_dir/package.json" >/dev/null; then
        continue
    fi

    checked=$((checked + 1))
    package_manifest="$docs_dir/node_modules/$package/package.json"
    if ! installed=$(jq -er '.version | strings | select(length > 0)' "$package_manifest"); then
        echo "ERROR: $package: installed version unavailable" >&2
        failures=$((failures + 1))
        details=$(jq -c --arg name "$package" '. + [{name: $name, reason: "installed-unavailable"}]' <<< "$details")
        continue
    fi
    if ! latest=$(npm view "$package@latest" version); then
        echo "ERROR: $package: could not retrieve the published latest version" >&2
        failures=$((failures + 1))
        details=$(jq -c --arg name "$package" --arg installed "$installed" '. + [{name: $name, installed: $installed, reason: "registry-unavailable"}]' <<< "$details")
        continue
    fi
    if [[ "$installed" != "$latest" ]]; then
        echo "MISMATCH: $package: installed=$installed latest=$latest"
        failures=$((failures + 1))
        details=$(jq -c --arg name "$package" --arg installed "$installed" --arg latest "$latest" '. + [{name: $name, installed: $installed, latest: $latest, reason: "outdated"}]' <<< "$details")
    else
        echo "OK: $package@$installed"
    fi
done < "$catalog"

if (( checked == 0 )); then
    echo 'ERROR: no catalog packages found in docs dependencies' >&2
    failures=$((failures + 1))
fi
echo "Package check: $checked checked, $failures problem(s), mode=$mode"
if [[ -n "${DOCS_PACKAGE_RESULT:-}" ]]; then
    jq -n --arg pr "${PR_NUMBER:-}" --arg sha "${PR_HEAD_SHA:-}" --argjson checked "$checked" --argjson problems "$failures" --argjson details "$details" '{pr: $pr, head_sha: $sha, checked: $checked, problems: $problems, details: $details}' > "$DOCS_PACKAGE_RESULT"
fi
if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
    echo "problems=$failures" >> "$GITHUB_OUTPUT"
fi
if (( failures > 0 )) && [[ "$mode" == warn ]]; then
    echo "::warning::Docs package check found $failures problem(s); see the step log for details."
fi
if (( failures > 0 )) && [[ "$mode" == enforce ]]; then
    exit 1
fi