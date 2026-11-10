# Agent Note: The 2026-10-28 registration round

Status: implemented

## Problem

Twenty-four registration PRs were open. Fourteen had never been reviewed; ten carried our earlier changes requested, and five of those had since pushed a new head. Every fork run was parked at `action_required`, so "no checks" on a head meant an unapproved workflow rather than a failing one. Merging the cleared ones exposed a second problem: every registration appends to the tail of `community.json`, so each merge invalidated the mergeability of the ones still open.

## Decision

**#47, #46, #41 and #36 merge; #43, #40 and #27 return with the exact remaining items.** #47 answered all four earlier points, including upstream CI whose isolated job runs each interruption state under its own `DSH_HOME`, bounded engines plus `dsh.compatibility`, an entry id aligned to the bundle name, and the mirror demoted to a convenience. #46 wrote the desktop-app prerequisite, the atomic credential write-back and the narrowed engine range into the entry. #41 repaired the broken JSON, merged main, and moved the destructive-tool warning and the `dsh-delete-session` comparison into the entry. #36 cut a tag and fixed the dangling README path. #43 returns because the entry pins "version 0.3.0 (2026-10-23)" while its own npm field resolves to 0.5.1; #40 returns because three statements in its description contradict upstream; #27 returns because the two asks from 2026-10-20 were not touched by a head that only merged main.

**Tail-append conflicts were resolved by pushing merge commits to the contributor forks.** For #36 and #46 the conflict was produced by our own sequential merges of the other registrations, not by anything in the contributions, so leaving it to the authors would make them pay for our ordering. Where `maintainer_can_modify` was set, the resolution took main's `community.json` verbatim and appended the contributor's entry text unchanged, then verified a JSON parse and a unique-id count; the merge commit and the PR thread both state that no entry text was edited. #46 needed this twice because a later merge moved the tail again.

**The fourteen never-reviewed registrations are deferred to the next round rather than closed.** Each needs a third-party assessment of utility, stability and compatibility, which is a reading of the upstream project rather than of a diff; folding them into this round would have produced verdicts without the evidence behind them.

## Consequences

Four of twenty-four merged. Seven of the ten previously reviewed PRs are now merged or answered with their remaining items; #38, #32 and #34 stay with their authors, untouched since 2026-10-20. The index grew by four entries this round instead of eighteen, and the next round inherits fourteen registrations that have waited between one and sixteen days.

## Alternatives considered

Merging with `--admin` was rejected: it bypasses the branch policy for conflicts that a resolved merge commit handles cleanly.

Closing the conflicting PRs and asking for fresh branches was rejected: it discards review history for a conflict one appended entry wide.

Answering the deferred fourteen with a single "queued for review" comment was rejected: a notification without a decision adds noise to threads that have already waited two weeks.
