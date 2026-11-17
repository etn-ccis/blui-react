# Automated PR Summary

The `Update PR Summary` workflow maintains the section between `blui-pr-summary:start` and `blui-pr-summary:end` in the pull request description. Text outside those markers is preserved. The workflow runs on PR changes and after the Build, Black Duck, and Docs Package Check workflows complete. It must be present on the default branch for `workflow_run` events to trigger.

- Jira keys are read from the PR title, branch, and author-written description. To include parent issues and epics, configure the `JIRA_EMAIL` Actions variable and the `JIRA_API_TOKEN` Actions secret with read access to the relevant Jira issues. Without them, the keys remain linked and epic lookup is marked unavailable. Authenticated Jira lookup is disabled for external forks.
- The showcase link is the actual Firebase preview URL. The existing preview job supports same-repository PRs targeting `dev` and expires previews after seven days.
- The docs link points to the dev documentation. Chromatic and Codecov links appear after their corresponding successful CI uploads.
- Docs package versions compare catalogued dependencies with the registry's `latest` tag. Mismatches and registry errors are warnings; the PR description lists them and links to the check run.
- Security counts come from the pnpm audit. Missing or invalid audit results are unavailable, not zero. The Black Duck row links to the matching workflow run when it can be associated with the PR. Its counts are affected components from shared project versions; they are not guaranteed to represent PR-specific vulnerabilities or unique findings.
- Figma links are read as data from the changed component's `packages/component-library/figma-connect/<Component>.figma.tsx` at the PR head. Missing mappings are reported as not linked. This does not verify that the mapping has been published to Figma.
- External-fork PRs do not use CI artifacts or Jira credentials. Their preview, scan, and coverage results remain unavailable.

The updater checks artifact PR numbers and head commits, rejects stale workflow events, and does not execute PR code. It requires Actions read, contents read, and pull requests write permissions. Verify the integration on a real same-repository PR and a fork after merging; GitHub authentication and repository policies determine whether the workflow can access runs and update descriptions.

Run the local checks with:

```sh
bash .github/scripts/render-pr-summary.test.sh
bash .github/scripts/capture-security.test.sh
bash .github/scripts/update-pr-summary.test.sh
```