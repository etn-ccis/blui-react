#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd "$(dirname "$0")" && pwd)
fixture=$(mktemp -d)
trap 'rm -rf "$fixture"' EXIT
mkdir "$fixture/bin"
export FIXTURE="$fixture" GITHUB_REPOSITORY='example/blui-react' GITHUB_SERVER_URL='https://github.com'
export BLACKDUCKSCA_URL='https://blackduck.example.com'
export JIRA_EMAIL='test@example.com' JIRA_API_TOKEN='test-token'
sha=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
jq -n --arg sha "$sha" '{state:"open",title:"APP-123 Add component",body:"Author description APP-222",head:{sha:$sha,ref:"feature/APP-123",repo:{full_name:"example/blui-react"}}}' > "$fixture/pr.json"
printf '%s\n' '[[{"filename":"packages/component-library/src/core/AppBar/AppBar.tsx"},{"filename":"packages/component-library/src/core/NewComponent/NewComponent.tsx"}]]' > "$fixture/files.json"
jq -n --arg sha "$sha" '{workflow_runs:[{id:11,name:"Build",head_sha:$sha,head_branch:"feature/APP-123",head_repository:{full_name:"example/blui-react"},status:"completed"},{id:22,name:"CI-BlackDuck-SCA-Basic",head_sha:$sha,head_branch:"feature/APP-123",head_repository:{full_name:"example/blui-react"},status:"completed"},{id:33,name:"Docs Package Check",head_sha:$sha,head_branch:"feature/APP-123",head_repository:{full_name:"example/blui-react"},status:"completed"}]}' > "$fixture/runs.json"
printf '%s\n' '{"artifacts":[{"id":101,"name":"pr-summary-security","expired":false,"size_in_bytes":100},{"id":102,"name":"pr-summary-showcase","expired":false,"size_in_bytes":100},{"id":103,"name":"pr-summary-chromatic","expired":false,"size_in_bytes":100},{"id":105,"name":"pr-summary-coverage-components","expired":false,"size_in_bytes":100}]}' > "$fixture/build-artifacts.json"
printf '%s\n' '{"artifacts":[{"id":104,"name":"pr-summary-blackduck-0","expired":false,"size_in_bytes":100}]}' > "$fixture/scan-artifacts.json"
printf '%s\n' '{"artifacts":[{"id":106,"name":"pr-summary-docs-packages","expired":false,"size_in_bytes":100}]}' > "$fixture/docs-artifacts.json"
printf '%s\n' '{"critical":2,"high":3}' > "$fixture/pr-security.json"
printf '%s\n' '{"url":"https://preview.web.app/"}' > "$fixture/pr-showcase.json"
printf '%s\n' '{"url":"https://www.chromatic.com/build?number=1"}' > "$fixture/pr-chromatic.json"
printf '%s\n' '{"app":"packages/component-library","critical":1,"high":4}' > "$fixture/pr-blackduck.json"
printf '%s\n' '{"available":true}' > "$fixture/pr-coverage.json"
printf '%s\n' '{"checked":1,"problems":1,"details":[{"name":"@brightlayer-ui/colors","installed":"3.3.0","latest":"3.4.0","reason":"outdated"}]}' > "$fixture/pr-docs-packages.json"
for file in pr-security.json pr-showcase.json pr-chromatic.json pr-blackduck.json pr-coverage.json pr-docs-packages.json; do
    jq --arg sha "$sha" '. + {pr:"31",head_sha:$sha}' "$fixture/$file" > "$fixture/next.json"
    mv "$fixture/next.json" "$fixture/$file"
done
zip -qj "$fixture/101.zip" "$fixture/pr-security.json"
zip -qj "$fixture/102.zip" "$fixture/pr-showcase.json"
zip -qj "$fixture/103.zip" "$fixture/pr-chromatic.json"
zip -qj "$fixture/104.zip" "$fixture/pr-blackduck.json"
zip -qj "$fixture/105.zip" "$fixture/pr-coverage.json"
zip -qj "$fixture/106.zip" "$fixture/pr-docs-packages.json"

cat > "$fixture/bin/curl" <<'EOF'
#!/usr/bin/env bash
case "$*" in
    *'/issue/APP-123?'*) printf '%s\n' '{"fields":{"parent":{"key":"APP-456"}}}' ;;
    *'/issue/APP-456?'*) printf '%s\n' '{"fields":{"parent":{"key":"APP-789"}}}' ;;
    *'/issue/APP-789?'*) printf '%s\n' '{"fields":{"parent":null}}' ;;
    *'/issue/APP-222?'*) printf '%s\n' '{"fields":{"parent":null}}' ;;
    *) exit 1 ;;
esac
EOF
chmod +x "$fixture/bin/curl"

cat > "$fixture/bin/gh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
case "$*" in
    *'--method PATCH'*)
        for arg in "$@"; do
            case "$arg" in body=@*) cp "${arg#body=@}" "$FIXTURE/body.md" ;; esac
        done
        jq --rawfile body "$FIXTURE/body.md" '.body = $body' "$FIXTURE/pr.json" > "$FIXTURE/pr-next.json"
        mv "$FIXTURE/pr-next.json" "$FIXTURE/pr.json"
        printf '%s\n' patch >> "$FIXTURE/patches"
        ;;
    *'/pulls/31/files?'*) cat "$FIXTURE/files.json" ;;
    *'/pulls/31'*) cat "$FIXTURE/pr.json" ;;
    *'/figma-connect/AppBar.figma.tsx?'*) printf '%s\n' "figma.connect(AppBar, 'https://www.figma.com/design/abc?node-id=1-2')" ;;
    *'/figma-connect/'*) exit 1 ;;
    *'/actions/runs?event='*) cat "$FIXTURE/runs.json" ;;
    *'/actions/runs/11/artifacts?'*) cat "$FIXTURE/build-artifacts.json" ;;
    *'/actions/runs/22/artifacts?'*) cat "$FIXTURE/scan-artifacts.json" ;;
    *'/actions/runs/33/artifacts?'*) cat "$FIXTURE/docs-artifacts.json" ;;
    *'/actions/artifacts/101/zip'*) cat "$FIXTURE/101.zip" ;;
    *'/actions/artifacts/102/zip'*) cat "$FIXTURE/102.zip" ;;
    *'/actions/artifacts/103/zip'*) cat "$FIXTURE/103.zip" ;;
    *'/actions/artifacts/104/zip'*) cat "$FIXTURE/104.zip" ;;
    *'/actions/artifacts/105/zip'*) cat "$FIXTURE/105.zip" ;;
    *'/actions/artifacts/106/zip'*) cat "$FIXTURE/106.zip" ;;
    *'/commits/'*'/pulls'*) jq -n --arg sha "$TEST_SHA" '[{number:31,state:"open",head:{sha:$sha}}]' ;;
    *) echo "Unexpected gh call: $*" >&2; exit 1 ;;
esac
EOF
chmod +x "$fixture/bin/gh"
export PATH="$fixture/bin:$PATH"

bash "$script_dir/update-pr-summary.sh" 31 "$sha"
grep -q 'Author description' "$fixture/body.md"
grep -q '\[APP-123\]' "$fixture/body.md"
grep -q '\[APP-222\]' "$fixture/body.md"
grep -q '\[APP-789\]' "$fixture/body.md"
grep -q '\[AppBar\](https://www.figma.com/' "$fixture/body.md"
grep -q 'NewComponent: not linked' "$fixture/body.md"
grep -q 'Critical: 2, High: 3' "$fixture/body.md"
grep -q '\[Preview\](https://preview.web.app/)' "$fixture/body.md"
grep -q '\[Visual review\](https://www.chromatic.com/' "$fixture/body.md"
grep -q '\[Codecov PR report\](https://app.codecov.io/gh/example/blui-react/pull/31)' "$fixture/body.md"
grep -q 'packages/component-library: Critical 1, High 4' "$fixture/body.md"
grep -q '| Docs package versions | Warning: 1 problem(s): @brightlayer-ui/colors: 3.3.0 -> 3.4.0.*\[Workflow run\](https://github.com/example/blui-react/actions/runs/33)' "$fixture/body.md"
grep -q '\[Workflow run\](https://github.com/example/blui-react/actions/runs/22)' "$fixture/body.md"
bash "$script_dir/update-pr-summary.sh" 31 "$sha"
[[ $(wc -l < "$fixture/patches") -eq 1 ]]
bash "$script_dir/update-pr-summary.sh" 31 bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
[[ $(wc -l < "$fixture/patches") -eq 1 ]]
export TEST_SHA="$sha" GITHUB_EVENT_PATH="$fixture/event.json"
jq -n --arg sha "$sha" '{workflow_run:{event:"pull_request",head_sha:$sha}}' > "$fixture/event.json"
bash "$script_dir/dispatch-pr-summary.sh"
[[ $(wc -l < "$fixture/patches") -eq 1 ]]
printf '%s\n' '{"artifacts":[]}' > "$fixture/scan-artifacts.json"
bash "$script_dir/update-pr-summary.sh" 31 "$sha"
grep -q '| Black Duck | Unavailable' "$fixture/body.md"
if grep -q '^| Black Duck |.*\[Workflow run\]' "$fixture/body.md"; then
    echo 'Expected no Black Duck run link without a PR association' >&2; exit 1
fi
[[ $(wc -l < "$fixture/patches") -eq 2 ]]
jq '(.workflow_runs[] | select(.id == 22)).pull_requests = [{number:31}]' "$fixture/runs.json" > "$fixture/next.json"
mv "$fixture/next.json" "$fixture/runs.json"
bash "$script_dir/update-pr-summary.sh" 31 "$sha"
grep -q '| Black Duck | Unavailable.*\[Workflow run\](https://github.com/example/blui-react/actions/runs/22)' "$fixture/body.md"
[[ $(wc -l < "$fixture/patches") -eq 3 ]]
jq '.pr = "99"' "$fixture/pr-showcase.json" > "$fixture/next.json"
mv "$fixture/next.json" "$fixture/pr-showcase.json"
rm "$fixture/102.zip"
zip -qj "$fixture/102.zip" "$fixture/pr-showcase.json"
bash "$script_dir/update-pr-summary.sh" 31 "$sha"
grep -q '| Showcase | Unavailable |' "$fixture/body.md"
[[ $(wc -l < "$fixture/patches") -eq 4 ]]
jq '.head.repo.full_name = "fork/blui-react"' "$fixture/pr.json" > "$fixture/pr-next.json"
mv "$fixture/pr-next.json" "$fixture/pr.json"
bash "$script_dir/update-pr-summary.sh" 31 "$sha"
grep -q '| Showcase | Unavailable |' "$fixture/body.md"
grep -q '| Coverage | Unavailable |' "$fixture/body.md"
grep -q '| Docs package versions | Unavailable' "$fixture/body.md"
grep -q 'Critical: Unavailable, High: Unavailable' "$fixture/body.md"
if grep -q '^| Black Duck |.*\[Workflow run\]' "$fixture/body.md"; then
    echo 'Expected no Black Duck run link for external forks' >&2; exit 1
fi