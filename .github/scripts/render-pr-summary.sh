#!/usr/bin/env bash
set -euo pipefail

data_file=${1:?Expected summary JSON}
body_file=${2:?Expected existing PR body}

jq -nj --slurpfile data "$data_file" --rawfile body "$body_file" '
    def safe_url: type == "string" and test("^https://[A-Za-z0-9._~:/?#@!$&%+=,-]+$");
    def link($label; $url): if ($url | safe_url) then "[\($label)](\($url))" else "Unavailable" end;
    def hosted_link($label; $url; $host): if ($url | safe_url and test($host)) then link($label; $url) else "Unavailable" end;
    def count: if type == "number" and . >= 0 and floor == . then tostring else "Unavailable" end;
    def jira:
        [(.jira // [])[] | select(type == "string" and test("^[A-Z][A-Z0-9]+-[0-9]+$")) | "[\(.)](https://eaton-corp.atlassian.net/browse/\(.))"] | unique | if length == 0 then "Not provided" else join(", ") end;
    def designs:
        [(.figma // [])[] | select(.name | type == "string" and test("^[A-Za-z0-9_.-]+$")) | if (.url | safe_url and test("^https://(www\\.)?figma\\.com/")) then "[\(.name)](\(.url))" else "\(.name): not linked" end] | unique | if length == 0 then "No component changes" else join(", ") end;
    def blackduck:
        [(.blackduck // [])[] | select(.app | type == "string" and test("^[A-Za-z0-9_./-]+$")) | "\(.app): Critical \(.critical | count), High \(.high | count)"] | unique | if length == 0 then "Unavailable" else join("; ") + " (shared project versions, affected components)" end;
    def version: if type == "string" and test("^[0-9]+\\.[0-9]+\\.[0-9]+([-+][A-Za-z0-9.-]+)?$") then . else "unavailable" end;
    def docs_packages:
      .docs_packages as $data |
      if ($data.problems | type != "number" or . < 0 or floor != .) or ($data.checked | type != "number" or . < 0 or floor != .) then "Unavailable"
      elif $data.problems == 0 and $data.checked > 0 then "Up to date"
      elif $data.problems == 0 then "Unavailable"
      else
            ([($data.details | if type == "array" then . else [] end)[] | select(type == "object") | select(.name | type == "string" and test("^@brightlayer-ui/[A-Za-z0-9._-]+$")) |
          if .reason == "outdated" then "\(.name): \(.installed | version) -> \(.latest | version)"
          elif .reason == "registry-unavailable" then "\(.name): latest version unavailable"
          elif .reason == "installed-unavailable" then "\(.name): installed version unavailable"
          else empty end] | unique) as $details |
        "Warning: \($data.problems) problem(s)" + (if ($details | length) > 0 then ": " + ($details | join("; ")) else "" end)
      end;
    ($data[0] // {}) as $summary |
    "<!-- blui-pr-summary:start -->" as $start |
    "<!-- blui-pr-summary:end -->" as $end |
    ([$start, "## Review Links", "", "| Item | Result |", "| --- | --- |",
    "| Jira | \($summary | jira)\(if $summary.epic_unavailable == true then " (epic lookup unavailable)" else "" end) |",
    "| Showcase | \(hosted_link("Preview"; $summary.showcase_url; "^https://[A-Za-z0-9-]+\\.(web\\.app|firebaseapp\\.com)(/|$)")) |",
      "| Docs | [Dev documentation](https://brightlayer-ui-dev.github.io/get-started/web) |",
      "| Docs package versions | \($summary | docs_packages) \(if ($summary.docs_packages.run_url | safe_url) then "([Workflow run](\($summary.docs_packages.run_url)))" else "" end) |",
    "| Security (pnpm audit) | Critical: \($summary.security.critical | count), High: \($summary.security.high | count) \(if ($summary.security.url | safe_url) then "([audit run](\($summary.security.url)))" else "" end) |",
    "| Chromatic | \(hosted_link("Visual review"; $summary.chromatic_url; "^https://(www\\.)?chromatic\\.com/")) |",
      "| Figma | \($summary | designs) |",
    "| Coverage | \(hosted_link("Codecov PR report"; $summary.coverage_url; "^https://app\\.codecov\\.io/")) |",
    "| Black Duck | \($summary | blackduck) \(if ($summary.blackduck_url | safe_url) then "([Black Duck](\($summary.blackduck_url)))" else "" end) \(if ($summary.blackduck_run_url | safe_url) then "([Workflow run](\($summary.blackduck_run_url)))" else "" end) |",
      $end] | join("\n")) as $block |
    if ($body | contains($start) or contains($end)) then
        ($body | split($start)) as $parts |
        if ($parts | length) != 2 or ($parts[1] | split($end) | length) != 2 or ($parts[0] | contains($end)) then
            error("Malformed PR summary markers")
        else $parts[0] + $block + ($parts[1] | split($end)[1]) end
    else $body + (if ($body | length) == 0 or ($body | endswith("\n\n")) then "" elif ($body | endswith("\n")) then "\n" else "\n\n" end) + $block + "\n" end
'