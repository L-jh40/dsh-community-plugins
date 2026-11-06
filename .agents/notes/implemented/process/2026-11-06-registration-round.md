# Agent Note: 2026-11-06 登记轮

Status: implemented

## Problem

2026-11-06 登记轮基于 `main` 的 103 条基线推进开放 PR 审查与合入时，暴露出两方面问题：

第一，`community.json` 的单文件尾部追加结构使相邻合入在文件末尾同一位置直接互斥。合并前实测有 13 条 PR 同时满足「当前 `main` + 末尾一条」的干净追加（#55、#59、#60、#64、#71、#74、#77、#78、#83、#84、#85、#86、#87），但只要合入其中任意一条，其余指向旧尾部的分支就会因末尾锚点变化而失配，或夹带过期基线与既有行改动。

第二，静态索引结构校验无法覆盖宿主运行时的客户端 bundle 导出契约、工具注册 `output` 契约，以及已发布 npm 产物与商店文案、仓库源码之间的漂移，需要在准入审查中补齐对应的宿主级核验口径。

## Decision

**#64 `dsh-power-menu-mac` 合并（`4567a595`），是本轮唯一合入。**

合并前逐条核验：head 的 `community.json` 恰为「`main` 的 103 条 + 末尾一条」共 104 条、前 103 条逐字节相等；条目十字段齐全（`ui`/`panel`）；必需检查通过。合并后 `main` 为 104 条。

**结构性事实：尾部追加互斥，一轮只能合一条。**

合并前实测有 13 条 PR 同时是「当前 `main` + 末尾一条」的干净追加（#55、#59、#60、#64、#71、#74、#77、#78、#83、#84、#85、#86、#87）；合入 #64 之后重新取数，其中 10 条立刻变为 `CONFLICTING`（#78、#87、#67 的 `MERGEABLE` 是 GitHub 尚未重算的缓存值，按 head 内容复算分别是缺一条、缺一条与夹带退役条目）。这说明瓶颈在 `community.json` 的单文件尾部追加结构，不是评审严格度。

**新增两条准入判定并已实际使用。**

- **`dsh.client` 导出契约**：插件若声明 `dsh.client`，则必须有 `exports` 且含 `"./client"`，否则宿主 `dsh-client-modules` 抛 `declares dsh.client but exports no "./client" bundle`，客户端半区被丢弃、面板不出现。据此判定 #87 `dsh-douyin-all` 阻塞。
- **工具定义 `output` 契约**：插件若注册工具，工具定义必须带 `output { schema, render }`，否则 `0.2.2-rc.1` 的 `dsh-tools` `register()` 首行即抛错、`apply` 中断、工具与技能都不会出现。据此判定 #67 `dsh-assistant-photographer` 阻塞：用宿主真实 `ToolsService` 装载后抛 `tool "photographer_shoot" must declare output`，补上 `output` 即可注册成功；该校验在 `0.1.1-rc.2` / `0.2.1-rc.2` / `0.2.2-rc.1` 三个版本都在，即该插件声明的 `engines` 区间内没有能跑起来的宿主。

**按具体契约、结构与文案核验结果分流其余开放 PR。**

- **#67 另有结构性风险**：其分支基于 `3b0673d`，文件是 149 条、夹带 `55a380e` 已退役的 51 条条目；真实三方合并实测是干净的（105 条、退役条目不会复活），但任何整文件覆盖式解法都会把它们复活，因此要求作者以当前 `main` 为基重建。
- **#74 与 #77 违反 tail-only 约定**：两条 PR 在解决冲突时顺手规范化了 `main` 既有条目的分隔符（把 `"  }"` + `",  {"` 改成 `"  },"` + `"  {"`），产生 2 行删除，违反 `CONTRIBUTING` 的 tail-only 约定，已要求还原。
- **#78 属于发布后漂移的文案**：条目写「每 5 秒」，而 npm `0.4.16` 的 `lib/client.js:981` 默认 `periodMs` 为 `3e3`（5 秒是 `0.4.15` 的行为），按本仓既有口径属合并前必须改的文案。
- **#86 `dsh-memory-engine` 另需两件事**：npm `0.8.3` 的 tarball 里带了 `lib/client.src.js.bak-before-closefix` 与 `lib/index.js.bak-before-titlefix` 两个仓库中不存在的备份文件；描述未提默认开启的会话导入（`autoImport` 默认 `true`、每 60 分钟最多 200 条）。
- **#83 `session-chains` 三处默认开启行为与链判定实现需说明**：`autoHandoff` 会自动建会话、选模型、发消息并切走；`voiceAnnounce` 依赖作者的 `$DSH_HOME/skills/voice-say` 脚本，别人机器上每轮 `spawn` 失败并写不轮转的日志；自动编号会改写既有会话标题且首次不确认、卸载不还原。另其链判定只认行首「鏈=」、行首「接續」与首句含「30-CodingSkills/」，在 442 场真实会话上命中 0 条链，PR 描述的「first message 里的项目路径」与实现不符。
- **#84 `dsh-cost-voice` 与 #85 `dsh-thanks-carl` 内容与契约均通过**：唯一阻塞是尾部冲突；#84 建议在描述里补随包音频与图标的许可限定（与 #85 自己的写法对齐）。
- **内容已核清、仅待作者重建到当前尾部的 PR**：#55、#59、#60、#71。

## Alternatives considered

**将单次合并后其余分支冲突视为个别分支落后的偶发现象，仅靠逐个等待作者重推来消化队列。** 否决：合并前原本有 13 条 PR 同时处于干净追加状态，合入 #64 后其中 10 条当即转为 `CONFLICTING`（其余显示 `MERGEABLE` 的缓存项按 head 复算同样失配）。这是单文件末尾共享同一追加锚点带来的可复现结构性结果，并非个别贡献者分支滞后所致。

**通过 GitHub `update-branch` 接口逐条同步分支以实现连续合入。** 否决：`update-branch` 只能合入修改位置互不重叠的提交（例如 `dsh-skins` 中各分支分别新增独立目录、仅提交历史落后于 `main` 的情形）；而在 `dsh-community-plugins` 中，各分支同时改写 `community.json` 末尾同一行位置，属于文本冲突，调用 `update-branch` 只会因冲突被直接拒绝而失败。

## Consequences

- `main` 现为 104 条（`4567a595`）；卫星仓合并不等于上架，仍需在 `dsh-web` 移动 `satellites/dsh-community-plugins` 的 gitlink 并重建 `market/dist`。
- 在 `community.json` 仍为单文件尾部追加数组的前提下，每一轮都只能落地一条，其余 12 条内容已核清的 PR 会在每次合并后重新冲突；提效方向应改为按 `id` 字典序固定落位或拆分为分片文件。
