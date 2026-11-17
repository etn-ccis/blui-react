#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd "$(dirname "$0")" && pwd)
fixture=$(mktemp -d)
trap 'rm -rf "$fixture"' EXIT
mkdir -p "$fixture/docs/node_modules/@brightlayer-ui/example" "$fixture/bin"
printf '%s\n' '{"dependencies":{"@brightlayer-ui/example":"workspace:^"}}' > "$fixture/docs/package.json"
printf '%s\n' '{"version":"1.0.0"}' > "$fixture/docs/node_modules/@brightlayer-ui/example/package.json"
printf '%s\n' '@brightlayer-ui/example' '@brightlayer-ui/unused' > "$fixture/catalog"
printf '%s\n' '#!/usr/bin/env bash' '[[ "${MOCK_FAIL:-}" != 1 ]] || exit 1' 'printf "%s\n" "${MOCK_LATEST:-1.0.0}"' > "$fixture/bin/npm"
chmod +x "$fixture/bin/npm"
export PATH="$fixture/bin:$PATH"

bash "$script_dir/check-packages.sh" enforce "$fixture/docs" "$fixture/catalog"
MOCK_LATEST=2.0.0 GITHUB_OUTPUT="$fixture/output" DOCS_PACKAGE_RESULT="$fixture/result.json" PR_NUMBER=31 PR_HEAD_SHA=abc bash "$script_dir/check-packages.sh" warn "$fixture/docs" "$fixture/catalog" > "$fixture/log"
grep -q '^problems=1$' "$fixture/output"
grep -q '^::warning::' "$fixture/log"
jq -e '.pr == "31" and .head_sha == "abc" and .problems == 1 and .details[0].name == "@brightlayer-ui/example" and .details[0].installed == "1.0.0" and .details[0].latest == "2.0.0"' "$fixture/result.json" > /dev/null
MOCK_FAIL=1 DOCS_PACKAGE_RESULT="$fixture/result.json" bash "$script_dir/check-packages.sh" warn "$fixture/docs" "$fixture/catalog" > /dev/null
jq -e '.details[0].reason == "registry-unavailable"' "$fixture/result.json" > /dev/null
if MOCK_LATEST=2.0.0 bash "$script_dir/check-packages.sh" enforce "$fixture/docs" "$fixture/catalog"; then
    echo 'Expected mismatch to block enforcement' >&2; exit 1
fi
if MOCK_FAIL=1 bash "$script_dir/check-packages.sh" enforce "$fixture/docs" "$fixture/catalog"; then
    echo 'Expected registry failure to block enforcement' >&2; exit 1
fi
rm "$fixture/docs/node_modules/@brightlayer-ui/example/package.json"
if bash "$script_dir/check-packages.sh" enforce "$fixture/docs" "$fixture/catalog"; then
    echo 'Expected missing package to block enforcement' >&2; exit 1
fi
bash "$script_dir/check-packages.sh" off "$fixture/docs" "$fixture/catalog"