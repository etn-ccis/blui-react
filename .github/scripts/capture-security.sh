#!/usr/bin/env bash
set -euo pipefail

output=${1:?Expected output file}
audit_file=$(mktemp)
trap 'rm -f "$audit_file"' EXIT

set +e
pnpm audit --json --audit-level high > "$audit_file"
audit_status=$?
set -e

if jq -e '.metadata.vulnerabilities | (.critical | type == "number") and (.high | type == "number")' "$audit_file" >/dev/null 2>&1; then
    jq --arg pr "${PR_NUMBER:-}" --arg sha "${PR_HEAD_SHA:-}" '{critical: .metadata.vulnerabilities.critical, high: .metadata.vulnerabilities.high, pr: $pr, head_sha: $sha}' "$audit_file" > "$output"
    cat "$audit_file"
    exit "$audit_status"
else
    printf '%s\n' '{}' > "$output"
    echo 'Audit counts unavailable; check the audit output and registry connectivity.' >&2
    cat "$audit_file"
    pnpm audit --audit-level high --ignore-registry-errors
fi