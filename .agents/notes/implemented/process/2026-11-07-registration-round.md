# Agent Note: 2026-11-07 登记轮

Status: implemented

## Problem

2026-11-07 登记轮开始时，`main` 已由上一轮的 104 条推进到 105 条（上一轮之后已按 re-admission 口径将 `dsh-llm-verifier` 以 `0.19.0` 重新登记，提交 `80b3fcf0`，并附 `2026-11-07-llm-verifier-readmission.md`）。在此基线上推进 30 条开放 PR 的审查与合入时，需同时处理两方面问题：

第一，`community.json` 的单文件尾部追加结构使上一轮基于 104 条基线重推的分支在 `80b3fcf0` 合入后再次整体失配，需逐条复核当前开放 PR 是否仍满足对 105 条基线的干净尾部追加。

第二，部分重审与重新登记的 PR 虽然补齐了运行时代码契约或版本区间，但在商店披露文案（默认接管宿主键位且卸载不自动还原、引擎回退链实际条数、桌面 Web 端实际能力边界）、已退役插件再登记身份核定，以及仓库源码与 npm 发布产物的一致性上仍存在差异，需要逐项核验并分流。

## Decision

**#76 `dsh-keenable` 合并（`c964bd16`），是本轮唯一合入。**

合并前逐项核验：head 的 `community.json` 恰为「当前 `main` 的 105 条 + 末尾一条」共 106 条、前 105 条逐字节相等；必需检查在维护者批准 `action_required` 的运行后跑绿；条目十字段齐全（`tools`/`dev`），描述写明 `KEENABLE_API_KEY` 环境变量、每 IP 10 次/秒与 1000 次/小时、同一出口 IP 共用额度、查询与抓取 URL 会发送给 Keenable，卸载靠 patch rollback 恢复宿主默认。插件是 host-only、无 `dsh.client` 半边，因此不涉及 `exports["./client"]` 与工具 `output` 契约。

**本轮的尾部互斥实测：30 条开放 PR 中仅 #76 一条成立。**

对 30 条开放 PR 逐个按「是否恰为当前 `main` + 末尾一条」判定，只有 #76 一条成立；其余多为基于 104 条基线的 105 条文件（缺 `dsh-llm-verifier`），因此每次 `main` 前进都会整体失配。这与 2026-11-06 轮的结论一致：单文件尾部追加数组使每轮只能落地一条。

**按宿主契约、商店披露与发布产物核验结果分流其余重点 PR。**

- **#89 `dsh-free-search` 重新登记：内容与契约全部通过，退回补披露。** 插件侧四项硬约束逐条核过：`engines.dsh` 的 `>=0.2.1-rc.2 <0.4.0-0` 覆盖 `0.2.2-rc.1` 且下限已抬到 `0.2.0` 之上（满足重新准入条件）、`exports` 含 `"./client"`、9 个工具注册点全部带 `output { schema, render }`、三个 `inject` 名都是宿主 roster 行。退回原因是商店文案漏了默认接管：加载即把 `web.searchProvider` 写成 `ddg`、`web.fetchProvider` 写成 `fs-quality-fetch` 并落盘到 profile 的 `cordis.patch.yml`，停用或卸载不会自动还原，用户需自行删掉该行，否则宿主报 `configured web provider "ddg" is not registered`。旧条目曾写「卸载由 rollbackPatch 恢复」，但现在的 `cordis.patch.yml` 已无静态 `searchProvider` 行，该机制不复存在，因此更要写清。另有「35 个引擎自动回退」应改准确：35 个可用，5 个 HTML SERP 与 3 个按次计费引擎默认不进自动回退链，实际约 27 条。
- **#90 Archive Management `2.0.0`：内容合格，仅需重基。** 澄清一处前提：`main` 里并没有 `dsh-archived-chats`，它在 `55a380e` 已被退役；作者 `Ultronen` 与 `Ultroncn` 是同一账号改名（`Ultronen/dsh-archived-chats` 重定向到 `Ultroncn/dsh-archived-chats`，插件 README 与 `package.json` 仍署名 `Ultronen`）。因此这是同一插件 `1.6.3` → `2.0.0` 的再登记（下限 `0.1.0-rc.7` → `0.2.2-rc.1`），不是 `id` 重复；合并时应按 `dsh-llm-verifier` 的先例补一份 re-admission 记录。
- **#67 Assistant Photographer：源码已修、发布未修，仍阻塞。** 工具 `output` 契约在仓库 `main`（`0.1.1`）已补，用宿主真实 `ToolsService` 装载 `0.1.1` 源码注册成功；但 npm 上只有 `0.1.0`，装载仍抛 `tool "photographer_shoot" must declare output`，而商店对有 `npm` 字段的条目直接 `dsh plugin add` 包名，装上即挂不起来。要求发 `0.1.1` 或去掉 `npm` 字段改由仓库安装。
- **#73 `pocket-harness`：文案仍未改，再次退回。** 上游 `client.js` 只注册 `sidebar.panellist` 与 `main` 两个席位，全文无 `iframe`/`canvas`/`img`/`pet.js`，像素鲸在插件自己的 `/pet-voice/` 页面与 Android App 中，条目仍写「桌宠在会话页里按需打开」，属面向桌面 Web 用户的商店文案误导；另有一处非尾部的空白重排 hunk 需还原。

## Alternatives considered

**在 #89 `dsh-free-search` 通过全部代码与宿主运行时契约校验后直接放行合入，不再因商店描述文案退回。** 否决：虽然插件侧四项硬约束均已达标，但插件加载即改写并落盘 `web.searchProvider` 与 `web.fetchProvider`，且停用或卸载后无法靠 `rollbackPatch` 自动恢复。若不在商店文案中披露这一默认接管与手工清理方式，用户会误以为同时安装多个搜索插件可以叠加生效，并在卸载插件后因残留 `configured web provider "ddg" is not registered` 报错而无法定位原因。

**以 #67 Assistant Photographer 仓库 `main` 分支（`0.1.1`）源码已补齐工具 `output` 契约为依据直接合并登记条目。** 否决：商店安装流对声明了 `npm` 字段的条目直接执行 `dsh plugin add` 拉取 npm 注册表产物，而非克隆仓库源码；当前 npm 上仍只有未包含修复的 `0.1.0`，合入后用户从商店安装得到的仍是启动即抛 `tool "photographer_shoot" must declare output` 的损坏版本。

## Consequences

- `main` 由 105 条推进到 106 条（`c964bd16`）；本轮已在 `dsh-web` 移动 gitlink、物化并重建 `market/dist`（106 plugins），`deploy-market` 跑绿。
- 12 条内容已核清的 PR 仍排队等作者把条目重建到当前尾部；在登记结构改为按 `id` 字典序落位或分片文件之前，每轮只能落地一条的约束不会消失。
- `dsh-archived-chats` 的再登记若合并，需同时补 re-admission 记录并在退役记录里标注该行已恢复，沿用 `dsh-llm-verifier` 的先例。
