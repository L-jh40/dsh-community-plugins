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

## 当天傍晚第二轮

### Problem

当天上午的记录建立在 151 条基线上（合并 #80 后升至 153 条）；随后 `55a380e` 按 `engines.dsh < 0.2.0-0` 口径退役 52 条，将 `main` 基线降到 101 条。在此基线上进入傍晚第二轮复核时，队列暴露出两类待收敛问题：

第一，评审口径需要在两处边界上定型并落地：一是 `dsh.client.inject` 合法模块名的判定范围此前曾单看静态模块表，导致把宿主 shell 组装实际注入的 roster 包误判为不合规；二是 11-05 退役轮新立的 `engines.dsh >= 0.2.0-0` 前向准入闸门首次在新增登记 PR 中触发。

第二，`community.json` 作为单文件尾部追加数组，使合并在结构上天然串行。合入 #62（`43b1b27`）将 `main` 从 101 条推进到 102 条后，35 个开放 PR 中有 31 个立刻因尾部锚点变化进入 `CONFLICTING` 状态，仅 #34、#56、#67 当时保持干净；即便内容与校验全部通过，后续 PR 也会在每一次合并后被前序合并顶掉。

### Decision

**#62 与 #56 合入 `main`，目录规模由 101 条依次升至 102 条、103 条（`c991046`）。**

- **#62 `dsh-tutorloop`**：作者在 `017f68d` 将条目重放到数组末尾并改写商店文案（写明内置 6 道自编示例题、真题库需自行导入），与包内 `seed_catalog.json` 事实一致；索引校验器在 102 条规模下通过，squash 合并为 `43b1b27`。
- **#56 `dsh-character-cards`**：在 `43b1b27` 之后做三方合并模拟结果干净，条目落在 `dsh-tutorloop` 之后；squash 合并为 `c991046`，`main` 升至 103 条。

**确立并复用两项可复现的准入判定标准。**

- **`dsh.client.inject` 合法名字集合为两类之和**：(a) 冻结静态模块表的 11 个名字；(b) 宿主 shell 组装里的 roster 行，即 `dsh-web` 仓库 `scripts/inject-contract.test.mjs` 钉住的名单（含 `dsh-client-locale`、`dsh-client-ui-settings`、`dsh-api-remotes`、`dsh-client-ui-chat` 等）。只有指向已删除、宿主安装树里不存在的包（如 `dsh-client-runtime`）才构成兼容阻塞。该标准纠正了上一轮对 #74 的一次误判：#74 的三个 inject 名曾仅对照静态模块表被判为不合规，复核确认均属宿主 roster 行，不再作为阻塞项。
- **11-05 退役轮确立的前向准入闸门应用于 #61 `dsh-later`**：其声明的 `engines.dsh` 下限为 `0.1.2-rc.1`，低于 `0.2.0-0` 准入线，按该口径不予登记，退回作者发版将下限抬升至 `>=0.2.0-0`。

**#69 `dsh-browser-view` 维持不收录，同时更正上一轮记录的两处事实偏差。**

- **不收录理由**：该插件与随 `dsh-family` bundle 分发的官方 `@linxin666/dsh-client-ui-browser-view` 同源同能力，两者注册的 tab kind 均为 `browser-view`，11 个 `browser_*` 工具名逐一相同；`dsh-tools` 对同名工具会抛出 `tool "..." is already registered`，而官方插件随 family bundle 默认挂载，用户从商店安装等同于把同一宿主半区重复安装两遍。其 DOM 镜像、标签页录屏、自动 lane 等增量能力的演进正路是向上游 `packages/dsh-browser-view` 提交。
- **事实更正**：其一，条目缺少 `npm` 字段不等于一键安装路径不可用——`dsh-market` 在 `entry.npm` 为空时回落到 `entry.repo`，现有索引中已有 23 条 repo-only 条目正常运行；其二，`engines >=0.2.1-rc.3` 在宿主 `0.2.2-rc.1` 上按 `includePrerelease` 判定为通过。

**15 条对话内容已核清，唯一剩余步骤是作者将条目重建到当前 `main` 尾部。**

涉及 #55、#59、#60、#63、#64、#65、#70、#71、#72、#75、#76、#77、#79、#82，以及已合并的 #56 之外的 #62（合入前同属该队列）。其中 #79 内容早已批准，仅待分支同步；#72 除尾部重建外另需必检工作流在最新 head 上实际跑通一次。#55 的复核评论同时更正了上一轮留言中「合并后应为 152 条」的过期基线数字（按 103 条 `main` 计算，正确目标为 104 条），并注明插件自带皮肤 `1.14.4` 与皮肤中心已上架的 `1.14.1` 写入同一个 `$DSH_HOME/skins/diy-journal` 目录。

**5 条 PR 仍因具体内容或上游契约缺陷退回作者修订。**

- **#48**：`dsh.client.inject` 含悬空的 `dsh-client-runtime`；虽在运行时被宿主静默跳过，但按注入契约与 2026-08-29 的既有裁决属于硬性兼容阻塞，需作者发版删除该项。
- **#73**：文案将手机端能力写成桌宠表述，需改为手机端描述。
- **#74**：描述点名已随 `55a380e` 退役的 `dsh-free-search`，需移除过期引用。
- **#78**：轮询周期在文案中写成 5 秒而源码实为 3 秒，`name` / `nameEn` 仍填 slug，且 PR 正文称 npm 未发布而 registry 已有 `0.4.16`。
- **#81**：条目缺少 `subcategory`，未披露 `archive_delete` 的不可恢复性，未披露安装后默认开启自动搬移，上游包缺少 `engines.dsh`，且 `moveProjections` 嵌套在 `moveLogs` 条件内导致仅开启搬移投影时开关无效。

**结构性判断：提效方向是改登记存储结构，而非加严评审。** `community.json` 单文件尾部追加使每次合并都改写文件末尾同一锚点，合入 #62 后 35 个开放 PR 中 31 个立即冲突即证明瓶颈在文件组织方式。后续提效需要调整登记机制（如改为按 `id` 字典序固定落位，或拆分为按插件独立存放的分片文件），消除相邻合并之间的尾部互斥。

### Alternatives considered

**调用 GitHub `update-branch` 逐条同步分支以推进合并。** 否决：`dsh-community-plugins` 的阻塞是多个分支同时向 `community.json` 同一尾部位置追加行造成的文本真冲突，GitHub `update-branch` API 在存在合并冲突时会直接拒绝；该手段仅在 `dsh-skins` 那类修改互不重叠、分支只是单纯落后于 `main` 的情形下才有效。

**由维护者直接修改贡献者分支并代推同步提交。** 否决：本轮指令明确维护者不向贡献者分支推送同步提交，所有尾部重建均留给作者在各自 PR 分支完成。

### Consequences

- `main` 现为 103 条（`c991046`）。仓库合入本身不会自动更新商店目录，还需在主仓 `dsh-web` 将 `satellites/dsh-community-plugins` 子模块 gitlink 移动到 `c991046` 并运行 `pnpm market:fetch` 与市场构建，新合入的 `dsh-tutorloop` 与 `dsh-character-cards` 才会真正上架。
- 15 条内容已核清的 PR（除去本轮已合入的 #62 外尚有 14 条开放 PR：#55、#59、#60、#63、#64、#65、#70、#71、#72、#75、#76、#77、#79、#82）已完成内容与兼容性审查；后续只要作者把条目重建到当前 `main` 尾部并通过必检（#72 含 head 必检实跑通过），即可直接合入，无需再次评审内容。
- 在 `community.json` 单文件尾部追加机制未改为按 `id` 排序落位或分片文件之前，下一轮每合入一条 PR 仍会让其余指向旧尾部的开放分支再次产生同量级的冲突。
