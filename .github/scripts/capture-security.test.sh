#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd "$(dirname "$0")" && pwd)
fixture=$(mktemp -d)
trap 'rm -rf "$fixture"' EXIT
mkdir "$fixture/bin"
printf '%s\n' '#!/usr/bin/env bash' 'printf "%s\n" "$*" >> "$AUDIT_CALLS"' 'printf "%s\n" "$AUDIT_RESPONSE"' 'exit "${AUDIT_STATUS:-0}"' > "$fixture/bin/pnpm"
chmod +x "$fixture/bin/pnpm"
export PATH="$fixture/bin:$PATH"
export AUDIT_CALLS="$fixture/audit-calls"

AUDIT_RESPONSE='{"metadata":{"vulnerabilities":{"critical":2,"high":3}}}' AUDIT_STATUS=1 \
    bash "$script_dir/capture-security.sh" "$fixture/security.json" > /dev/null && exit 1
jq -e '.critical == 2 and .high == 3' "$fixture/security.json" > /dev/null
AUDIT_RESPONSE='{"error":"registry unavailable"}' bash "$script_dir/capture-security.sh" "$fixture/security.json" > /dev/null
jq -e '. == {}' "$fixture/security.json" > /dev/null
grep -q -- '--ignore-registry-errors' "$fixture/audit-calls"