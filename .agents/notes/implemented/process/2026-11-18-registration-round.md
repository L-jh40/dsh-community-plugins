# Agent Note: 2026-11-18 登记轮

Status: implemented

## Problem

本轮 `main` 起始 139 条（按 `id` 升序存放），宿主基线 `@deepseek-ai/dsh` 0.2.2-rc.3。`dsh-community-plugins` 有 8 个开放 PR：`#114` fanframe（承接被 7 天规则关闭的 `#68`）、`#113` session-chains 商店文案、`#112` bloomtutor-dsh、`#110` dsh-braingames 的作者反馈更新、`#103` travel-agent 与 `#95` rss-pal-dsh 的作者反馈更新，另有 `#100` 无新提交。`dsh-skins` 的 `#108` 无新提交，`dsh-pet` 与 `dsh-presets` 没有开放 PR；这三者本轮未触碰。

同日第二轮（13:36 UTC）复核同一批 PR：`#114`、`#100`、`dsh-skins` `#108` 仍无新提交；`#103` 与 `#95` 的条目内容已无异议，唯一阻塞是分支与 `main` 的 `community.json` 冲突，两个 fork 的 PR 都开了维护者可编辑（`maintainerCanModify: true`）。

## Decision

**5 个 PR 合入 `main`（`#113`、`#110`、`#112`、`#103`、`#95`），1 个退回作者（`#114`）。索引由 139 条增至 143 条。**

- `#113` session-chains（`0cf19a4`，squash，既有条目文案）：只改该条目的 `description` / `descriptionEn`（+2 / -2）。npm `0.3.0` 的 `plugin/client.js` 里 `keepRecent` 默认 5、设置夹在 0-50、0 为全部列出，折叠状态只在侧栏卡片组件内存里、不写 `aliases.json` 的 `archived`；三项开关默认全关与「套用」改写标题的说明也都对得上。
- `#110` dsh-braingames（`c659c55`，squash，新增）：首轮唯一阻塞项是缺 `category` / `subcategory`，作者补为 `ui` / `panel`，与插件从会话顶栏打开、`shell.overlay` 挂悬浮游戏面板的形态一致。`engines.dsh` 为 `>=0.2.2-rc.1`，对 0.2.2-rc.3 判定通过；宿主默认 profile 设了 `autoInstallPeers: false`，多余的 `@deepseek-ai/dsh-client-*` peer 不会被装入，作者已在上游开 PR 清理，不阻塞。fork CI run `43859251748` 由维护者批准后跑绿。
- `#112` bloomtutor-dsh（`8ffbf4b`，squash，新增，knowledge/qa）：纯 Skill 包，npm `0.1.0` 的 21 个文件与上游提交 `d3d9c0b` 逐字节一致，无依赖、无脚本。在隔离 `DSH_HOME` 里用宿主 0.2.2-rc.3 跑通 pack、安装、加载 7 个 Skill、同名个人 Skill 覆盖、卸载恢复。非阻塞建议：`includeDefaultRoots` 改 `false`、补顶层 `engines.dsh`、`bloom-tutor` 固定输出中文要在英文文档里写明。fork CI run `44019429304` 由维护者批准后跑绿。
- `#114` fanframe（退回）：`#68` 挂的 `engines.dsh` 区间、LF 换行、`rank`、第一人称描述、`id` 排序都已修好，条目不用再改。阻塞项在上游：npm `latest` 是 `1.10.0`（`lib/client.js` 3009 行），而 `AngleNaris/fanframe` 的 `main` 仍停在 11-10 的 `b2ac633`（`1.10.0-beta.23`，2524 行），tag 只到 `v1.10.0-beta.23`。商店卡片标题直接链接该仓库，用户与维护者看不到与发布物一致的源码。
- `#103` travel-agent（`d3165ab3`，squash，新增，agent/preset）：首审三条意见在上游 `7076f12` 全部落实（路由先走 `connection.requestRejection`、补 `engines.dsh` 与 `dsh.client.inject`、有 CI 与 `v0.2.1` Release）。包没有发布到 npm（`travel-agent` 在 npm 上有 2017 年撤销记录），条目不加 `npm` 字段，商店按 `repo` 直装。冲突由维护者代解：分支从 `e89d1805` 变为 `a0c4541`（基于 `main` 的 `488aa47`，取 `main` 的 141 条并把 travel-agent 插到 `smart-compaction` 之后的 `id` 末尾），`node scripts/community-index.cjs --check`（142 条）与 `node --test scripts/community-index.test.mjs`（10/10）通过，diff 仍只 +11。用一次性 URL + `--force-with-lease` 推回 `wang-bool/dsh-community-plugins` 的 `add-travel-story-dsh`，fork CI run `44316087819` 由维护者批准后跑绿。
- `#95` rss-pal-dsh（`45eac5d8`，squash，新增，knowledge/reading）：`engines.dsh` 已放宽为 `>=0.2.1-rc.5 <0.3.0-0`；`better-sqlite3` 在隔离目录实测，只对它执行 `approve-builds` 后能构建，FTS5 `MATCH` 返回正确，包内 `docs/native-build.md` 写明该步骤；npm `0.1.2` 压缩包 sha256 与 GitHub `v0.1.2` 发布包一致。冲突同样由维护者代解：分支从 `04b5dab8` 变为 `5455cbd`（两个提交都保留，条目插在 `dsh-wx-bridge` 与 `session-chains` 之间并带上 `npm` 字段），同两道门禁通过、diff 仍 +12；推回 `morefreeze/dsh-community-plugins` 的 `add-rss-pal`，fork CI run `44316090304` 批准后跑绿。`#103` 合入后两条改动落在文件不同区域，GitHub 直接干净合并、无需二次 rebase。
- `#100`（regrevia 合集）与 `dsh-skins` `#108` 自上轮评审后没有新提交，本轮不动。

## Alternatives considered

**`#114` 的源码未同步只作非阻塞建议，先合入。** 否决：商店卡片名称是指向 `repo` 的链接，装到的是 npm `1.10.0`，仓库里却是 `beta.23` 的 README 和 2524 行代码，等于公开仓库无法审计所发布的版本；作者只需推一次上游，不必改本 PR，成本很低。

**`#103`、`#95` 的冲突由维护者在 fork 分支上代做 rebase。** 首轮否决：作者自己重推最干净，避免向贡献者 fork 写入，也避免替作者背书其分支内容。第二轮改判执行：用户明确授权代推，两个 PR 都开了 `maintainerCanModify`，冲突只是同一插入点的机械排序，而首轮已请作者 rebase 逾 9 小时未动。代价是改写了贡献者分支，所以每次推送都用 `--force-with-lease` 钉住原 HEAD，并在推送后逐条核对结果仍只多一条、作者与提交信息不变。

**`#112` 因 `includeDefaultRoots: true` 在 CLI profile 下重复监听个人与项目目录而退回。** 否决：这只带来重复监听和同名候选的告警日志，不影响安装、加载与卸载的正确性，作为下一版建议给出。

**`#110` 因 `name` / `nameEn` 沿用包名、`peerDependencies` 冗余而退回。** 否决：首轮已定为非阻塞，作者已在上游跟进清理，宿主 `autoInstallPeers: false` 兜底，没有安装污染。

## Consequences

- `main` 增至 143 条并保持 `id` 升序。
- 五条合入内容（`#113` 文案、`#110`、`#112`、`#103`、`#95`）需要在 `dsh-web` 移动 `satellites/dsh-community-plugins` 钉版到 `45eac5d8` 并重建 `market/dist` 才会到达商店。
- 三个仍待处理：`#114` 推上游 `1.10.0` 源码；`#100` 回应四条文案与配置意见并解冲突；`dsh-skins` `#108` 处理选择器与窄屏问题。
