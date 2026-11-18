# Agent Note: 2026-11-13 登记轮

Status: implemented

## Problem

2026-11-13 登记轮开始时 `main` 共 124 条（按 `id` 升序存放）。本轮维护范围覆盖 `dsh-community-plugins` 中待初审（8 个）、反馈更新或回复澄清（6 个）、维护者已代同步待放行（4 个）及明确不收录或重复项（3 个）共 21 个开放 PR；另有 12 个先前已退回且作者无新动作的 PR 本轮保持原状。需要逐条核对商店文案与上游发布产物一致性，并按实用性、稳定性与兼容性三项准入标准给出合入、退回或关闭裁定。

## Decision

**11 个 PR 经 squash 合入 `main`，索引由 124 条增至 132 条（3 条既有条目更新 + 8 条新第三方插件收录）。**

- 既有条目更新（3 个）：`#104` `dsh-archived-chats`（`48decc3`，商店文案对齐 npm `2.0.2`）、`#102` `dsh-thanks-carl`（`97eec8b`，对齐 `0.3.0`）、`#101` `dsh-plugin-restart-button`（`865d1d1`，补入 `npm` 字段）。
- `#105` `dsh-sidebar-suite`（`4f31ba0`）：MIT 许可，npm `0.6.0`；合入评审附带两项不阻塞收录的改进建议，即将 `temp-session-config.txt` 迁出安装包目录，以及把 `setInterval` 挂入 `ctx.effect` 以便停用时自动回收。
- `#99` `dsh-agent-lines`（`99ea1d1`）：Apache-2.0 许可，npm `0.12.0`，支持零配置启动，且 `engines.dsh` 声明为 `>=0.2.1-rc.5 <0.3.0`。合入后在 `dsh-web` 市场产物回归（`scripts/market-layout.test.mjs:95-101`）发现非 `other` 一级分类必须携带 `subcategory`，而 `agent` 二级分类仅允许 `preset`；鉴于 `dsh-agent-lines` 属于跨会话开发工作流工具而非预设，随后在 `main` 将其分类调整为 `category: "tools"`、`subcategory: "dev"`。
- `#83` `session-chains`（`feed4da`）：npm `0.2.0`，复核确认默认值全关及「套用」改写标题与卸载还原相关的商店说明均已落地。
- `#77` `dsh-skills-tools`（`6c086e0`）与 `#75` `dsh-multithread-downloader`（`39b2994`）：分别对齐 npm `1.3.0` 与 npm `1.1.2`，前序反馈项已落实。
- `#71` `dsh-jump`（`0f63f8e`）：npm `0.2.0`，确认文案不再写死默认和弦，且聚焦模式默认关闭。
- `#63` `dsh-runninghub-plugin`（`f74a3fa`）：沿用 11-05 口径先予合入收录，并在评审中同步提示作者上游 `#23`、`#24` 的修复仍未发布 `0.3.4`。
- `#38` `smart-compaction`（`e7a4ae9`）：对齐 npm `0.3.15` 后放行合入。

**2 个 PR 关闭。**

- `#69` `dsh-browser-view`：与官方 `@linxin666/dsh-client-ui-browser-view@0.4.18` 同名、共用同一 tab kind 且存在 10 个 `browser_*` 工具命名冲突，同时上游自 11-05 后无更新，按不收录关闭。
- `#87` `dsh-douyin-all`：旧登记 PR，与 `#94` 重复，关闭并统一归口至 `#94` 跟踪。

**7 个 PR 提交 `REQUEST_CHANGES`，1 个 PR 留言保持暂缓。**

- `#106` `dsh-asl`：条目无 `npm` 字段时商店直装仓库不会拉取 `upstream` 子模块，而 `host.js` 将 `sourceRoot` 与 `environment` 设为必填导致启动失败；此外包名 `dsh-asl-workspace` 与条目 `id` 不一致，且缺少 `engines.dsh`。
- `#103` `travel-agent`：`/travel-agent/*` 路由仅判断回环地址而未接入 `ctx.connection.requestRejection` 鉴权；缺少 `engines.dsh` 与 `dsh.client.inject`，且上游无 CI 与 Release。
- `#100`（`regrevia` 4 插件合集）：`dsh-fast-mode` 描述仍写自适应思考档位，与上游 `1.7.35` 移除修改 `reasoningEffort` 直接冲突（阻塞）；同时指出 `dsh-unlag` 右键菜单文案偏差与覆写 `id: hmr` 风险、`dsh-mobile-use` 的 `THIRD_PARTY_NOTICES.md` 遗漏 `vendor/scrcpy-server`，以及 `envoy-dsh` 以 `failOnStartupError: true` 配合启动期下载 wheel 的可用性风险。
- `#98` `dsh-man-031`：`community.json` 缺少随包第三方素材的非商用限定（未对齐 `#84` 口径），且上游 `docs/SOURCES.md` 与 `THIRD-PARTY-NOTICES.md` 存在矛盾。
- `#95` `rss-pal-dsh`：`engines.dsh` 锁在 `0.2.1-rc.5 || 0.2.2-rc.1` 不兼容当前宿主 `0.2.2-rc.2`，且 `better-sqlite3` 原生构建阻断仍未解决。
- `#82` `dsh-git-branch-switcher`：上游 `v0.9.1` 已改名为 `@milestone-l/dsh-git-branch-switcher` 发布 npm 并新增常驻面板与单轮 diff，当前 PR 缺少 `npm` 字段且文案滞后。
- `#65` `dsh-triage`：`community.json` 仍写「不安装、不卸载」，与上游 `0.3.7+` `--apply` 写盘行为矛盾，且上游 `0.3.9` 的 `verify` 三矩阵测试全败。
- `#94` `dsh-douyin-all`（留言保持暂缓）：复核确认 `UNLICENSED`、`enabled: true`、缺 `stopEdge`，以及仓库 `0.4.9` 与 npm `0.5.0` 脱节等 11-09 阻塞项均未改变，保持开放等待作者修改。

## Alternatives considered

**因 `#63` 上游 `#23/#24` 修复尚未发布 `0.3.4` 而继续暂缓合入。** 否决：11-05 轮次已裁定该问题不阻塞索引收录，当前商店文案与已发布包契约核对无误；沿用既有口径合入并同步提醒作者发版 `0.3.4`，可避免跨轮次标准漂移。

**将长期未更新的 `#94` 与重复旧单 `#87` 一并关闭。** 否决：`#87` 属于与 `#94` 完全重叠的历史旧单，关闭可消除重复条目；`#94` 仍承载 11-09 给出的完整整改清单且球在作者一侧，保留 `#94` 仅关闭 `#87` 符合既有维护约定。

**把 `#105` 的安装包内临时文件与 `setInterval` 未挂 `ctx.effect` 升级为阻塞退回。** 否决：两项均属生命周期与目录整洁度改进项，不阻断 `0.6.0` 的正常安装与挂载，作为非阻塞建议随合并评审给出即可。

## Consequences

- `community.json` 条目总数增至 132 条（3 条更新、8 条新增），全表维持按 `id` 升序与校验门禁通过。
- 待作者跟进的开放 PR 包括本轮提交 `REQUEST_CHANGES` 的 7 个（`#106`、`#103`、`#100`、`#98`、`#95`、`#82`、`#65`）、留言保持暂缓的 `#94`，以及先前已退回且本轮无新动作的 12 个 PR。
- 本轮合并变更不会自动同步至线上商店，还须在 `dsh-web` 移动 `satellites/dsh-community-plugins` 钉版并重建 `market/dist` 推至 `origin/dev` 才能上线商店。
