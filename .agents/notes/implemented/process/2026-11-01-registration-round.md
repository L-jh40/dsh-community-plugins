# Agent Note: The 2026-11-01 registration round

Status: implemented

## Problem

Twenty-seven registration PRs and one store-copy refresh PR were open at the start of the round.

The previous round on 2026-10-28 deferred fourteen never-reviewed registrations to this round.

All fork PR required checks sat parked at `action_required`. Approving twenty pending workflow runs in a single batch turned unverified runs into actionable statuses.

A platform constraint was confirmed during merge attempts: even when `strict_required_status_checks_policy` is `false` in the repository ruleset, GitHub rejects merging branches that fall behind `main` with `Head branch is out of date`. This rejection was reproduced across both `gh pr merge` and `PUT /pulls/{n}/merge`.

## Decision

**#43 (dsh-model-everything) and #40 (dsh-composer-ease) merge; the index grows from 148 to 150 entries.**

- #43 resolves all second-round feedback: hardcoded version numbers in the entry were removed, and outdated numbers in store copy were corrected. Upstream npm 0.5.2 matches the git tag and `package.json`, all 43 test suites re-run locally and pass, and `dsh.compatibility` with `includePrerelease` covers host 0.2.1-rc.5.

- #40 satisfies all third-round feedback: the version was updated to registry 0.9.66, the compatibility range matches `package.json`, opening copy no longer references VS Code feel, and the server dictionary restart disclosure was restored. The author merged `main` two minutes after review comments and re-appended the entry at the tail, eliminating maintainer conflict resolution.

**Two delimiter cleanups in #40 are accepted.** The full file contained only two malformed `}\n, {` formatting occurrences. Following normalization, all 148 pre-existing entries remain byte-identical in JSON content.

**#71, #66, #58, #69, and #60 return with concrete defects.**

- #71 (dsh-jump) is returned: the entry omits `subcategory`, violating the market layout contract requiring non-other categories to specify a secondary category (`scripts/market-layout.test.mjs`). When appended to `market/dist/manifest/plugins.json` via the market-build mapping, `pnpm test:scripts` asserts failure, demonstrating that green PR CI does not ensure post-listing build health. Upstream tag `v0.1.1` also fails 13 test cases.

- #66 (two-level model picker) is returned: `engines.dsh` pins exact `0.2.1-rc.3` while the host is `0.2.1-rc.5`. Because `semver.satisfies` evaluates to `false`, the plugin manager pre-install preflight rejects installation, blocking the store installation path.

- #58 (store copy refresh) is returned: three of its four updated declarations contradict npm `latest` (`aistudio` 0.4.7 dependencies is empty and bundles four components; `free-search` 0.9.26 lists 28 `ALL_ENGINES` rather than 27; two Zhihu engines require `ZHIHU_API_KEY` but are listed under key-free).

- #69 is returned per owner decision: it registers a community fork of official in-repo `packages/dsh-browser-view`, whose capabilities are covered by the family bundle and duplicate `dsh-pilot`.

- #60 is returned per owner decision: the package pins `0.2.1-rc.2`, below the index package's own `>=0.2.1-rc.3` floor.

**#64 passes functional verification but remains unmerged.** #64 (dsh-power-menu-mac) satisfies all entry field requirements, covers rc.5 in `engines.dsh`, and its two declared slots exist in the rc.5 host. However, GitHub rejects the merge because the head branch is out of date, and this round establishes that maintainers do not update contributor branches.

## Consequences

The index increases from 148 to 150 entries.

The remaining queue leaves #64, #71, #66, and #58 waiting for a single author action each (branch synchronization, adding `subcategory`, widening engine range, fixing four copy inaccuracies). #69 and #60 are returned; both remain open pending author revision.

The single-tail-append merge serialization constraint remains active. Both entries merged this round succeeded because their respective authors kept their branches rebased against `main`.

## Alternatives considered

Resolving tail-append conflicts by pushing merge commits to contributor forks—as done on 2026-10-28 for #36 and #46—was rejected: branch maintenance belongs to PR authors.

Merging #71 and letting post-intake CI fail was rejected: reproducing the failure against real manifest inputs confirmed it breaks downstream validation.

Bypassing branch update rules with `--admin` was rejected: the precedent from 2026-10-28 holds.
