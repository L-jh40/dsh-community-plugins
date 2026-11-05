# Agent Note: The 2026-11-05 registration round

Status: implemented

## Problem

Thirty-four pull requests are open in the 2026-11-05 round (#27, #32, #34, #38, #48, #49, #50, #51, #53, #55, #56, #58, #59, #60, #61, #62, #63, #64, #65, #66, #67, #68, #69, #70, #71, #72, #73, #74, #75, #76, #77, #78, #79, and #80) against a 151-entry `main` baseline, surfacing three operational constraints.

First, required checks on twelve first-time contributor heads (#60, #66, #71, #72, #73, #74, #75, #76, #77, #78, #79, and #80, plus #65 and #67 approved separately) sit parked at `action_required`. Before maintainer approval, a head with no check results reflects an unapproved workflow run rather than a check failure, masking CI statuses across more than a third of the queue.

Second, `community.json` is a single tail-appended array, serializing merges regardless of branch settings. Even with `strict_required_status_checks_policy` set to `false` in the repository ruleset, once #80 merges and advances `main` from 151 to 153 entries, GitHub rejects merging every remaining branch with `Head branch is out of date`; only one pull request can land at a time until authors merge `main` and re-append.

Third, passing the structural validator does not prove store readiness. `scripts/community-index.cjs` is the single source of truth for the index contract (requiring `id`, `name`, `nameEn`, `author`, and a path-safe `https://` `repo`, with optional `description`, `descriptionEn`, `npm`, and paired legal `category`/`subcategory`). All thirty-four head snapshots pass the validator with zero `id`, `repo`, or `npm` duplicates against the 151 baseline entries and zero cross-PR collisions, yet nineteen pull requests still carry store copy drift against upstream source, broken install paths, or incompatible host engine ranges.

## Decision

**Pending workflow runs are approved before review verdicts.** Approving the `action_required` runs individually on #60, #66, #71, #72, #73, #74, #75, #76, #77, #78, #79, and #80, plus #65 and #67, produces check outcomes across all thirty-four heads before triage concludes.

**#80 merges after isolated install reproduction, advancing `main` from 151 to 153 entries.** #80 registers `dsh-plugin-desktop-notify` and `@chendaleiq/dsh-plugin-auto-update`. Before merge, `dsh plugin --profile web add` runs inside an isolated `DSH_HOME` (`/tmp/dsh-verify-prm`) for `dsh-plugin-desktop-notify`, `@chendaleiq/dsh-plugin-auto-update`, and `dsh-workspace-tints`; all three exit `0` and declare both `dsh.bundle.patch` and `dsh.client.platform=web` in `package.json`, reproducing actual mountability rather than relying on README claims.

**#69 remains declined, with two factual corrections recorded.** #69 registers a fork of official `packages/dsh-browser-view`; its capability derives from the official package and its package name does not exist on the npm registry, leaving the one-click install path broken. The review also corrects two misstatements from the prior round: the root `Apache-2.0` versus package `BSD-3-Clause` license split already exists in upstream `dsh-web` rather than being introduced by the author, and commits between 10-31 and 11-04 add capabilities absent upstream whose proper path is upstream contribution.

**#51 holds on unauthenticated default exposure.** #51 (`dsn` patch delivery) opens an unauthenticated endpoint on the host same-origin `/mcp` route by default, allows empty tokens through, and defaults `exposeApprovals` to `true`. Re-evaluation requires upstream to require a configured token before enabling the endpoint (or default `exposeApprovals` to `false`) and to state that boundary in the entry description.

**#49 is cleared for coexistence once differentiated in store copy.** #49 overlaps with registered `dsh-notifier` on the turn-completion sound trigger; coexistence is permitted because #49 provides six sound presets, a completion card, and session jump-back, provided the entry description states those differences.

**Host `0.2.2-rc.1` compatibility is evaluated with `semver.satisfies(version, range, { includePrerelease: true })`.** Matching host `app-boot`, #68 (`engines.dsh` upper bound `<=0.2.1-rc.6`) and #66 (exact `0.2.1-rc.3`) evaluate to `false` on `0.2.2-rc.1`, which produces entries that appear in store search but fail installation; both return to widen their engine ranges.

**Remaining pull requests stay with their authors under a single-round deviation from the 2026-09-25 conflict rule.** Across the remaining queue, nineteen pull requests require author modifications (copy drift against upstream facts, restrictive `engines.dsh` ranges, full-file CRLF rewrites, blank pull request template bodies, and missing description fields beyond `subcategory`), six wait on author rebase, and six pass review and wait on branch synchronization, with all verdicts recorded on their respective pull requests. Whereas the 2026-09-25 owning note specifies that maintainers repair contributor branches with merge commits pushed to forks, this round follows the per-round user instruction to explain the conflict in each pull request and leave rebasing to the authors—a scoped single-round deviation that does not overturn the owning note.

## Alternatives considered

Relaxing index validation to intake all thirty-four validator-passing entries rapidly is rejected: `scripts/community-index.cjs` checks schema shape and identifier uniqueness, not npm registry presence (#69), bundle mounting (#80), same-origin `/mcp` authentication defaults (#51), or accuracy of store copy against upstream source.

Pushing maintainer merge commits into contributor forks to resolve tail-append conflicts is not adopted in this round: although established in the 2026-09-25 owning note, this round's scope limits maintainer action to explaining the conflict on the pull request thread and leaving rebasing to the authors.

Listing entries whose `engines.dsh` fails against host `0.2.2-rc.1` (#66, #68) and relying on post-listing exemptions is rejected: host `app-boot` enforces `semver.satisfies(version, range, { includePrerelease: true })` before installation, so listing incompatible ranges exposes broken install paths in the Workshop store.

## Consequences

`main` advances from 151 to 153 entries with #80 merged. Because single-file tail appends trigger `Head branch is out of date` after each merge even when `strict_required_status_checks_policy` is `false`, only one pull request can land at a time; the six approved-and-waiting pull requests and six rebase-waiting pull requests must re-append onto `main` sequentially as each head merges.

Approving `action_required` workflow runs on first-time contributor heads is a routine maintenance operation rather than a review verdict: absent check results before approval do not indicate failing checks.

Three inconsistencies in `CONTRIBUTING.md` against `AGENTS.md` and `scripts/community-index.cjs` surfaced in this round and are corrected in the same change: step 1 required the "next free `rank`" even though `rank` has no consumer and none of the 151 baseline entries carry it; step 2 listed `npm` as required while the validator treats `npm` as optional (31 existing entries omit `npm`); and the file lacked an explicit rule requiring tail-only appends, LF line endings, and no reordering of existing entries, alongside the `engines.dsh` range guidance that #66 and #68 showed the index needs.
