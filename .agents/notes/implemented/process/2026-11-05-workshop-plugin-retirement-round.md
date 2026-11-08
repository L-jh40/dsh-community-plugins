# Agent Note: The 2026-11-05 Workshop plugin retirement round

Status: implemented

## Problem

The Workshop (`dsh-market.com`) plugin catalog derives from a single data source, `community.json` in `dsh-community-plugins`, which holds 153 entries. Each plugin declares its minimum compatible host version in its published manifest under `dsh.engines.dsh`, evaluated by the host with `semver.satisfies(hostVersion, range, { includePrerelease: true })`.

Across the 153 catalog entries, 97 declare `dsh.engines.dsh` and 56 omit it entirely. Among the 97 entries with a declaration, 52 still anchor their lower bound on the `0.1.x` release line (strictly below `0.2.0-0`). On the `0.2` host line these `0.1.x` lower bounds are stale compatibility declarations, and 3 of the 52 entries (`dsh-codekin`, `dsh-thread-tools`, and `dsh-session-suspend`) fail installation on the current host `0.2.2-rc.1` altogether. The repository validator (`scripts/community-index.cjs`) checks JSON schema shape and identifier uniqueness only; no automated check or review gate re-verifies `dsh.engines.dsh` lower bounds after initial registration.

## Decision

**Entries whose declared `dsh.engines.dsh` lower bound falls below `0.2.0-0` are retired from `community.json`.** Using `< 0.2.0-0` (the `0.1.x` line) as the cutoff removes 52 entries from the 153-entry catalog and leaves 101 entries in place.

The audit partition across all 153 entries settles four buckets:

- **52 entries with a declared lower bound `< 0.2.0-0` (`0.1.x` line): retired.** This set includes the 3 entries (`dsh-codekin`, `dsh-thread-tools`, and `dsh-session-suspend`) whose declared ranges also fail `semver.satisfies("0.2.2-rc.1", range, { includePrerelease: true })` on the current host `0.2.2-rc.1`.
- **14 entries with a declared lower bound of `0.2.0-rc.1` or `0.2.0-rc.2`: retained.** Under strict semver ordering without a `-0` prerelease floor, `0.2.0-rc.1` and `0.2.0-rc.2` compare as less than `0.2.0`, but these declarations target the `0.2` host line and remain valid.
- **31 entries declaring a lower bound on the `0.2.1` line or later: retained.** Under `minVersion(range, { includePrerelease: true })`, only 3 of the 31 entries evaluate at or above the `0.2.1` release (`0.2.2-0`: 1; `0.2.2-rc.1`: 2), while the other 28 fall on the `0.2.1` prerelease line — 21 at `0.2.1-0` (the `includePrerelease` lower bound of ranges such as `^0.2.1`), 2 at `0.2.1-rc.1`, 4 at `0.2.1-rc.2`, and 1 at `0.2.1-rc.3`.
- **56 entries with no `dsh.engines.dsh` declaration: retained.** Omitting `dsh.engines.dsh` is not evidence that a plugin targets a pre-`0.2.0` host.

**Data source and durable record.** Each entry's `dsh.engines.dsh` field was read from its published npm `latest` manifest, falling back to `package.json` in the plugin's GitHub repository when no npm manifest was available. The audit was a one-off local review; the two rosters in this note (the 52-entry retirement table and the 56-entry undeclared-range list) serve as the durable record without relying on external artifacts.

**Explicit exception to the `community.json` append-only rule.** `AGENTS.md` in `dsh-community-plugins` specifies that `community.json` is append-only with one entry per commit. Retiring 52 entries in a single batch deletion is an explicit one-round exception to that rule; this note records the rationale and the exact roster of removed entries.

**Coupled removal in `market/editor-picks.json`.** `market/editor-picks.json` in the main repository referenced `dsh-llm-verifier`, which is one of the 52 retired entries (`min`: `0.1.1-rc.2`). Because `scripts/market-build` validates that every editor pick resolves to an entry present in the plugin catalog, `dsh-llm-verifier` is removed from `market/editor-picks.json` in the same batch.

### Retired entries (52)

| Plugin ID | Declared `dsh.engines.dsh` range | Lower bound (`min`) | Published version |
|---|---|---|---|
| `dsh-history-tree` | `>=0.1.2-alpha.2` | `0.1.2-alpha.2` | `1.0.4` |
| `dsh-logicprobe` | `>=0.1.0-rc.7` | `0.1.0-rc.7` | `1.4.4` |
| `dsh-llm-verifier` | `^0.1.1-rc.2 \|\| ^0.1.2-alpha.1 \|\| ^0.1.2-alpha.2 \|\| ^0.1.2-alpha.3 \|\| ^0.1.2-alpha.4 \|\| ^0.1.2-alpha.5 \|\| ^0.1.2-rc.1 \|\| ~0.1.2 \|\| ^0.1.3 \|\| ^0.1.4 \|\| ^0.1.5-alpha.1 \|\| ^0.1.5-rc.1 \|\| ~0.1.5 \|\| ^0.1.6-alpha.1 \|\| ^0.1.6-alpha.2 \|\| ~0.1.6 \|\| ^0.1.7-alpha.1 \|\| ^0.1.7-alpha.2 \|\| ^0.1.7-rc.1 \|\| ^0.1.7-rc.2 \|\| ^0.2.0-rc.1 \|\| ^0.2.0-rc.2 \|\| ^0.2.1-alpha.1 \|\| ^0.2.1-alpha.2 \|\| ^0.2.1-alpha.3 \|\| ^0.2.1-alpha.4 \|\| ^0.2.1-alpha.5 \|\| ^0.2.1-rc.1 \|\| ^0.2.1-rc.2 \|\| ^0.2.1-rc.3 \|\| ^0.2.1-rc.4 \|\| ^0.2.1-rc.5 \|\| ^0.2.2-alpha.2 \|\| ^0.2.2-alpha.3 \|\| ^0.2.2-rc.1` | `0.1.1-rc.2` | `0.16.0` |
| `dsh-delete-message` | `>=0.1.1-rc.2` | `0.1.1-rc.2` | `0.2.2` |
| `dsh-free-search` | `>=0.1.7-rc.1` | `0.1.7-rc.1` | `0.9.31` |
| `dsh-reasoning-effort` | `>=0.1.1-rc.2` | `0.1.1-rc.2` | `0.2.7` |
| `dsh-codekin` | `>=0.1.5-rc.1 <0.1.6-0 \|\| >=0.1.7-rc.1 <0.1.8-0 \|\| >=0.2.0-rc.2 <0.2.1-0 \|\| 0.2.1-alpha.1` | `0.1.5-rc.1` | `0.4.1-rc.1` |
| `dsh-archived-chats` | `>=0.1.0-rc.7 \|\| 0.2.2-rc.1` | `0.1.0-rc.7` | `1.6.3` |
| `dsh-prompt-enhance` | `>=0.1.1-rc.2 <0.3.0` | `0.1.1-rc.2` | `0.3.4` |
| `dsh-linkdigest` | `>=0.1.2-rc.1` | `0.1.2-rc.1` | `1.0.0` |
| `dsh-quote-followup` | `>=0.1.2-rc.1` | `0.1.2-rc.1` | `0.2.10` |
| `plugin-effort-slider` | `>=0.1.2-alpha` | `0.1.2-alpha` | `1.2.2` |
| `dsh-backup` | `^0.1.1-rc.2 \|\| ^0.1.2-rc.1 \|\| ^0.1.5-rc.1 \|\| ^0.1.6-alpha.1 \|\| ^0.1.7-alpha.1 \|\| ^0.2.0-rc.1` | `0.1.1-rc.2` | `0.14.2` |
| `dsh-permission-rules` | `>=0.1.2-rc.1 <0.2.0 \|\| >=0.1.5-alpha.1 <0.2.0 \|\| >=0.1.6-0 <0.2.0 \|\| >=0.1.7-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0` | `0.1.2-rc.1` | `0.7.20` |
| `dsh-desktop-shell` | `>=0.1.5-rc.1` | `0.1.5-rc.1` | `1.1.3` |
| `dsh-tty` | `>=0.1.7-rc.2` | `0.1.7-rc.2` | `0.37.3` |
| `dsh-docker` | `>=0.1.7-rc.2` | `0.1.7-rc.2` | `0.14.0` |
| `dsh-codegraph` | `>=0.1.7-rc.2` | `0.1.7-rc.2` | `0.6.19` |
| `dsh-env` | `>=0.1.7-rc.2` | `0.1.7-rc.2` | `0.3.16` |
| `dsh-mcp` | `>=0.1.7-rc.2` | `0.1.7-rc.2` | `0.3.12` |
| `dsh-profile` | `>=0.1.7-rc.2` | `0.1.7-rc.2` | `0.2.14` |
| `dsh-prompt` | `>=0.1.7-rc.2` | `0.1.7-rc.2` | `0.2.14` |
| `dsh-rss` | `>=0.1.7-rc.2` | `0.1.7-rc.2` | `0.4.15` |
| `dsh-search` | `>=0.1.7-rc.2` | `0.1.7-rc.2` | `0.4.17` |
| `dsh-stalled-turn-continue` | `>=0.1.5-rc.1` | `0.1.5-rc.1` | `0.1.0` |
| `dsh-thread-tools` | `>=0.1.2-rc.1 <0.1.6` | `0.1.2-rc.1` | `0.1.0` |
| `dsh-ppt-studio` | `>=0.1.7-rc.1` | `0.1.7-rc.1` | `1.2.6` |
| `dsh-mcp-panel` | `>=0.1.2-rc.1 <0.2.0 \|\| >=0.1.5-alpha.1 <0.2.0 \|\| >=0.1.6-0 <0.2.0 \|\| >=0.1.7-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0` | `0.1.2-rc.1` | `0.6.30` |
| `dsh-autotier` | `>=0.1.6-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0` | `0.1.6-0` | `0.2.20` |
| `dsh-background-agents` | `>=0.1.2-rc.1 <0.2.0 \|\| >=0.1.5-alpha.1 <0.2.0 \|\| >=0.1.6-0 <0.2.0 \|\| >=0.1.7-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0` | `0.1.2-rc.1` | `0.10.3` |
| `dsh-budget` | `>=0.1.2-rc.1 <0.2.0 \|\| >=0.1.5-alpha.1 <0.2.0 \|\| >=0.1.6-0 <0.2.0 \|\| >=0.1.7-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0` | `0.1.2-rc.1` | `0.4.21` |
| `dsh-claude-move` | `>=0.1.6-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0` | `0.1.6-0` | `0.4.18` |
| `dsh-defend` | `>=0.1.2-rc.1 <0.2.0 \|\| >=0.1.5-alpha.1 <0.2.0 \|\| >=0.1.6-0 <0.2.0 \|\| >=0.1.7-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0` | `0.1.2-rc.1` | `0.3.26` |
| `dsh-doublecheck` | `>=0.1.6-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0` | `0.1.6-0` | `0.9.29` |
| `dsh-draw` | `>=0.1.2-rc.1 <0.2.0 \|\| >=0.1.5-alpha.1 <0.2.0 \|\| >=0.1.6-0 <0.2.0 \|\| >=0.1.7-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0` | `0.1.2-rc.1` | `0.2.25` |
| `dsh-fast` | `>=0.1.2-rc.1 <0.2.0 \|\| >=0.1.5-alpha.1 <0.2.0 \|\| >=0.1.6-0 <0.2.0 \|\| >=0.1.7-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0` | `0.1.2-rc.1` | `0.2.28` |
| `dsh-local-ai` | `>=0.1.2-rc.1 <0.2.0 \|\| >=0.1.5-alpha.1 <0.2.0 \|\| >=0.1.6-0 <0.2.0 \|\| >=0.1.7-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0` | `0.1.2-rc.1` | `0.2.24` |
| `dsh-mask` | `>=0.1.2-rc.1 <0.2.0 \|\| >=0.1.5-alpha.1 <0.2.0 \|\| >=0.1.6-0 <0.2.0 \|\| >=0.1.7-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0` | `0.1.2-rc.1` | `0.2.23` |
| `dsh-memento` | `>=0.1.2-rc.1 <0.2.0 \|\| >=0.1.5-alpha.1 <0.2.0 \|\| >=0.1.6-0 <0.2.0 \|\| >=0.1.7-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0` | `0.1.2-rc.1` | `0.5.29` |
| `dsh-reach` | `>=0.1.2-rc.1 <0.2.0 \|\| >=0.1.5-alpha.1 <0.2.0 \|\| >=0.1.6-0 <0.2.0 \|\| >=0.1.7-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0` | `0.1.2-rc.1` | `0.1.24` |
| `dsh-research-report` | `>=0.1.6-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0` | `0.1.6-0` | `0.3.30` |
| `dsh-session-pin` | `>=0.1.2-rc.1 <0.2.0 \|\| >=0.1.5-alpha.1 <0.2.0 \|\| >=0.1.6-0 <0.2.0 \|\| >=0.1.7-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0` | `0.1.2-rc.1` | `0.7.21` |
| `dsh-session-sync` | `>=0.1.2-rc.1 <0.2.0 \|\| >=0.1.5-alpha.1 <0.2.0 \|\| >=0.1.6-0 <0.2.0 \|\| >=0.1.7-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0` | `0.1.2-rc.1` | `0.2.31` |
| `dsh-skill-pack-security` | `>=0.1.2-rc.1 <0.2.0 \|\| >=0.1.5-alpha.1 <0.2.0 \|\| >=0.1.6-0 <0.2.0 \|\| >=0.1.7-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0-0 \|\| >=0.2.1-0 <0.3.0-0` | `0.1.2-rc.1` | `2.2.30` |
| `dsh-team-rooms` | `>=0.1.2-rc.1 <0.2.0 \|\| >=0.1.5-alpha.1 <0.2.0 \|\| >=0.1.6-0 <0.2.0 \|\| >=0.1.7-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0` | `0.1.2-rc.1` | `1.0.9` |
| `dsh-claude-style` | `>=0.1.7` | `0.1.7` | `0.19.8` |
| `dsh-session-suspend` | `>=0.1.6-alpha.1 <0.1.7 \|\| >=0.1.7-alpha.1 <0.2.0-0` | `0.1.6-alpha.1` | `0.2.5` |
| `agent-body` | `>=0.1.1-rc.1` | `0.1.1-rc.1` | `0.1.0` |
| `dsh-model-priority` | `>=0.1.2-rc.1` | `0.1.2-rc.1` | `0.8.3` |
| `dsh-novel-writer` | `>=0.1.1-rc.2` | `0.1.1-rc.2` | `7.0.0` |
| `dsh-loglens` | `>=0.1.7-rc.2` | `0.1.7-rc.2` | `0.1.7` |
| `dsh-model-everything` | `^0.1.7-alpha.2 \|\| ^0.1.7-rc.1 \|\| ^0.2.0-rc.1 \|\| ^0.2.1-alpha.1 \|\| ^0.2.1-rc.4` | `0.1.7-alpha.2` | `0.5.2` |

### Retained entries without a declared `dsh.engines.dsh` range (56)

`dsh-quick-ask`, `dsh-tui`, `dsh-tianshu-tui`, `dsh-builtin-toggles`, `dsh-pilot`, `dsh-housekeeper`, `dsh-deepread`, `dsh-plugin-hub`, `dsh-annotation`, `deepseek-harness-auth`, `dsh-cloud-sync`, `dsh-auto-memory`, `dsh-worktime-board`, `dsh-friendly-steps`, `dsh-full-remote`, `dsh-gzip`, `dsh-mimo-agent-tools`, `dsh-skill-fuzzy`, `dsh-approve-for-me`, `dsh-memories`, `dsh-notifier`, `dsh-chatgpt-subscription`, `dsh-imagegen`, `dsh-api-visualizer`, `dsh-postman`, `dsh-workspace-api`, `dsh-mcp-manager`, `dsh-provider-usage`, `dsh-milestone`, `dsh-notion-skill`, `dsh-passwords`, `dsh-agent-plugins-market`, `dsh-fulltext-search`, `dsh-session-enhance`, `dsh-audiogen`, `dsh-taskfold`, `dsh-whale-girl`, `dsh-delete-session`, `dsh-usage-panel`, `dsh-workbench`, `dsh-mcptoon`, `dsh-ltm`, `dsh-attention-health`, `dsh-wx-bridge`, `dsh-widgets`, `dsh-screen-capture-record-desktop`, `dsh-pet-quota`, `dsh-flash-presets`, `dsh-connection-card-host`, `dsh-trae-relay`, `dsh-workspace-activity`, `dsh-vitals`, `dsh-version-guard`, `dsh-composer-ease`, `dsh-plugin-desktop-notify`, `dsh-plugin-auto-update`.

**Forward admission gate.** New plugin registrations whose declared `dsh.engines.dsh` lower bound is below `0.2.0` (`< 0.2.0-0`) will not be accepted into `community.json`.

## Alternatives considered

- **Retiring all 66 entries whose lower bound is strictly `< 0.2.0` under bare semver.** Rejected: in semver order `0.2.0-rc.1` and `0.2.0-rc.2` sort below `0.2.0`, so a bare `< 0.2.0` cutoff would wrongly remove 14 plugins that were authored for the `0.2` release line. Using `< 0.2.0-0` isolates the `0.1.x` line accurately.
- **Retiring only the 3 entries that fail installation on current host `0.2.2-rc.1` (`dsh-codekin`, `dsh-thread-tools`, `dsh-session-suspend`).** Rejected: those 3 plugins are a subset of the 52 `0.1.x`-anchored entries whose upper bounds also expired; restricting removal to the 3 immediate install failures would leave 49 stale `0.1.x` compatibility declarations in the catalog.
- **Retiring the 56 entries without `dsh.engines.dsh` at the same time.** Rejected: an absent `dsh.engines.dsh` field does not prove pre-`0.2.0` targeting, and retiring them alongside the `0.1.x` cohort would delist 56 working plugins at once without evidence of incompatibility.

## Consequences

- `community.json` decreases from 153 entries to 101 entries, and `dsh-llm-verifier` is removed from `market/editor-picks.json` so `scripts/market-build` continues to pass reference validation.
- The external plugin count in `README.md` and `README.en.md` (`130+` to `100+` external plugins) is updated to `100+` to reflect the 101 remaining catalog entries.
- The 56 entries that omit `dsh.engines.dsh` remain in the catalog as the scope for a subsequent compatibility review round.
- Any of the 52 retired plugins can return to the Workshop catalog once its maintainer raises `dsh.engines.dsh` in a published release to a lower bound of `0.2.0` or higher and submits a fresh registration. `dsh-llm-verifier` later satisfied that condition in 0.19.0; see [its readmission record](2026-11-07-llm-verifier-readmission.md). `dsh-archived-chats` later satisfied that condition in 2.0.0; see [its readmission record](2026-11-08-archived-chats-readmission.md).
- **Delivery path to users without an npm release.** The main repository pins this commit via the submodule gitlink, `scripts/market-fetch-inputs.mjs` materializes it into `.market-inputs/`, `scripts/market-build` derives `market/dist/manifest/plugins.json` from it, and `scripts/deploy-market` deploys the result to `dsh-market.com` (where `.github/workflows/deploy-market.yml` line 87 runs `market-fetch-inputs.mjs` first). Because the Workshop store card sets `MARKET_ORIGIN = 'https://dsh-market.com'` at `packages/dsh-market/src/client/MarketCard.tsx` line 53 and fetches `fetchJson(MARKET_ORIGIN + '/manifest/plugins.json')` at runtime around line 340 (in the same `Promise.all` that loads skins, pets, presets, `api/stats`, and editor-picks), retiring these entries takes effect without publishing a new npm package.
- **Mandatory `pnpm market:fetch` before rebuilding `market/dist`, and the three `PLUGINS_FILE` fallback states.** `scripts/market-build:86-92` resolves `PLUGINS_FILE` at module load time to `.market-inputs/community/community.json` when present, and otherwise falls back to the `community.json` shipped inside `@linxin666/dsh-client-ui-community-plugins` (whose published `0.4.15` tarball and `v0.4.15:community.json` carry 151 entries — two entries behind the 153-entry pre-retirement baseline, and containing all 52 retired plugin IDs). In `main()`, `scanSkins -> scanPets -> scanPlugins -> scanPresets` run at lines 753-756 before `scanEditorPicks` runs around line 766, producing three distinct states:
  1. **Entire `.market-inputs/` directory absent (verified by running `node scripts/market-build --check`):** `scanPlugins` has already read the 151-entry in-package catalog, and both `--check` and a plain build then fail in `scanEditorPicks` before emitting `market/dist` because skin and pet catalogs have no in-package fallback (`Error: editor picks #0: skin:orca-link is not in the skin catalog`, `at scanEditorPicks (scripts/market-build:407:20)`, exit code `1`).
  2. **Only `.market-inputs/community/community.json` absent while skins and pets are present (derived from reading `scripts/market-build`, not executed):** a plain `node scripts/market-build` (non-`--check`) reads the 151-entry in-package `community.json` and writes `market/dist` with all 52 retired entries reintroduced into the generated manifest.
  3. **Stale or mismatched `.market-inputs` stamps under `--check` (verified by execution):** `assertInputsPinned()` (defined at `scripts/market-build:135` and called only inside the `if (CHECK)` branch around lines 822-825) rejects the check with `market-build: .market-inputs is not at the pinned commits (skins: stale, community: stale); run "node scripts/market-fetch-inputs.mjs" first`.
  Rebuilding `market/dist` must therefore always be preceded by `pnpm market:fetch`: `--check` rejects stale materialized inputs through the stamp guard, whereas a plain build does not self-verify when the community input is missing and cannot be relied on to fail by itself.
