# Agent Note: community.json 改为按 id 排序

Status: implemented

## Problem

`community.json` 是单文件数组，约定是「新条目追加到数组末尾」。这个约定让每次合入都必然使其余开放 PR 失配：数组只有一个可追加点，两个 PR 的插入位置永远相同，Git 的三方合并必然冲突。2026-11-10 登记轮结束时 46 个开放 PR 里有 27 个处于 `CONFLICTING`，且每合入一条就会让当时仍然可合并的分支立刻全部失配——维护者只能对每个 PR 单独做一次尾部重建才能合入。数组顺序同时是商店顺序（`scripts/market-build` 用 `rank: i + 1` 生成 `manifest/plugins.json`，商店按「点赞数 → rank」排序），所以这不是纯格式问题，而是数据契约。

## Decision

**条目改为按 `id` 升序存放，登记插到自己的 id 位置，不再追加到末尾。** 两个并发 PR 只要新增 id 不相邻，就落在文件的不同位置，三方合并可以直接通过。

- `community.json` 的 119 条按 `id` 重排；顺带归一了两处畸形分隔符（第 1202、1274 行的「单独一行逗号」改为标准的 `  },`）。
- `scripts/community-index.cjs` 新增 `assertSortedById`，由 `validateEntries` 调用：乱序即失败并指出是哪两条相邻条目。CI 的 `pnpm community:check` 因此同时成为排序门禁。
- `scripts/community-index.test.mjs` 增加一条乱序用例（10 项测试）。
- `CONTRIBUTING.md` 与 `AGENTS.md` 把「追加到末尾 / append-only」改为「插入到 id 位置」，并说明这样做的理由。

代价与取舍：商店的默认排序（`rank`，即数组下标）从**登记顺序**变为**字母序**。这是本轮明确接受的用户可见变化——投票数仍是第一排序键，`rank` 只在同票时决定先后。

## Alternatives considered

- **每条加一个显式 `order` 字段，保持登记顺序。** 否决：需要给 119 条各加字段、改 `scripts/market-build` 读它、再加一条唯一性检查，收益只是让同票条目的默认次序不变；对一个 119 条的目录而言，字母序是稳定且可预期的默认顺序，不值得为它多维护一个字段与一条 CI 规则。
- **一条一个文件（`entries/<id>.json`）+ 生成 `community.json`。** 否决：这是唯一能彻底零冲突的方案，但要改贡献者流程、CI 同步检查、npm 包的 `community.json` 导出与 `market:fetch` 的取数路径，并转换当时全部 27 个开放 PR；按 id 排序已经消除了「每次合入让其余全部失配」这一根因，残余的「同槽位」冲突由维护者代重建处理，性价比更高。若将来同槽位冲突变得频繁，这条仍是下一步。
- **维持末尾追加，只靠维护者代重建。** 否决：2026-11-10 轮已证明这条路可行（10 个 PR 靠代重建合入），但它把每个 PR 的合入都变成一次人工重建，而且没有改变「一个可追加点」这一成因；结构上按 id 落位之后，正常 PR 不需要重建即可合并。

## Consequences

- `main` 上的 `community.json` 现在按 `id` 升序；乱序提交会被 `pnpm community:check` 拒绝。
- 商店默认排序变为字母序（同票时），`market/dist` 的 `manifest/plugins.json` 中 `rank` 随之变化，需要与钉版一起重建并提交。
- 现有开放 PR 仍是「旧 main + 尾部追加」形态，全部需要转换：维护者按新结构重建每个分支并推回作者 fork，作者无需手动 rebase。
- 若作者在自己分支上 force push，会覆盖维护者的重建，重新退回旧形态；这种情况下仍按「合入时代重建」处理。
