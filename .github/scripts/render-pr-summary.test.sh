#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd "$(dirname "$0")" && pwd)
fixture=$(mktemp -d)
trap 'rm -rf "$fixture"' EXIT

printf '%s\n' '{"jira":["APP-123","bad"],"showcase_url":"https://example.web.app/","security":{"critical":2,"high":1},"figma":[{"name":"AppBar","url":"https://www.figma.com/design/abc?node-id=1-2"},{"name":"NewComponent"}],"blackduck":[{"app":"packages/component-library","critical":1,"high":3}]}' > "$fixture/data.json"
printf 'Author text  \n  \n' > "$fixture/body.md"
bash "$script_dir/render-pr-summary.sh" "$fixture/data.json" "$fixture/body.md" > "$fixture/rendered.md"
head -c "$(wc -c < "$fixture/body.md")" "$fixture/rendered.md" | cmp "$fixture/body.md" -
grep -q 'Author text' "$fixture/rendered.md"
grep -q '\[APP-123\](https://eaton-corp.atlassian.net/browse/APP-123)' "$fixture/rendered.md"
grep -q 'Critical: 2, High: 1' "$fixture/rendered.md"
grep -q '\[AppBar\](https://www.figma.com/' "$fixture/rendered.md"
grep -q 'NewComponent: not linked' "$fixture/rendered.md"
grep -q 'packages/component-library: Critical 1, High 3 (shared project versions, affected components)' "$fixture/rendered.md"
bash "$script_dir/render-pr-summary.sh" "$fixture/data.json" "$fixture/rendered.md" > "$fixture/updated.md"
cmp "$fixture/rendered.md" "$fixture/updated.md"
printf '%s\n' '<!-- blui-pr-summary:start --> broken' > "$fixture/body.md"
if bash "$script_dir/render-pr-summary.sh" "$fixture/data.json" "$fixture/body.md" >/dev/null 2>&1; then
    echo 'Expected malformed markers to fail' >&2; exit 1
fi
printf '%s\n' '{"showcase_url":"javascript:alert(1)","security":{}}' > "$fixture/data.json"
printf '%s\n' '' > "$fixture/body.md"
bash "$script_dir/render-pr-summary.sh" "$fixture/data.json" "$fixture/body.md" > "$fixture/rendered.md"
grep -q 'Critical: Unavailable, High: Unavailable' "$fixture/rendered.md"
if grep -q 'javascript:' "$fixture/rendered.md"; then
    echo 'Expected unsafe URL to be rejected' >&2; exit 1
fi
printf '%s\n' '{"docs_packages":{"checked":1,"problems":0,"details":[]}}' > "$fixture/data.json"
bash "$script_dir/render-pr-summary.sh" "$fixture/data.json" "$fixture/body.md" > "$fixture/rendered.md"
grep -q '| Docs package versions | Up to date' "$fixture/rendered.md"
printf '%s\n' '{"docs_packages":{"checked":2,"problems":2,"details":[{"name":"@brightlayer-ui/icons","installed":"2.7.0","reason":"registry-unavailable"},{"name":"@brightlayer-ui/colors","reason":"installed-unavailable"}]}}' > "$fixture/data.json"
bash "$script_dir/render-pr-summary.sh" "$fixture/data.json" "$fixture/body.md" > "$fixture/rendered.md"
grep -q '@brightlayer-ui/icons: Local (installed): 2.7.0, Remote (npm latest): unavailable' "$fixture/rendered.md"
grep -q '@brightlayer-ui/colors: Local (installed): unavailable, Remote (npm latest): not checked' "$fixture/rendered.md"