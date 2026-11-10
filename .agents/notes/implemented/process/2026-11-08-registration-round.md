# Agent Note: 2026-11-08 登记轮

Status: implemented

## Problem

2026-11-08 登记轮开始时，`main` 为 106 条（末尾 `dsh-keenable`），四仓钉版与上游 `main` 一致、无待上架内容。在此基线上推进 31 条开放 PR 的审查与合入时，需处理三方面问题：

第一，`community.json` 的单文件尾部追加结构使只有基于当前 106 条基线追加末尾一条的分支才能直接合入，且一旦合入其中一条，其余同批对准 106 条尾部的 PR 会立即整体失配。

第二，2026-11-05 退役轮（`55a380e`）移除的 `dsh-archived-chats` 在上游发布 `2.0.0` 后重新提交登记（#90），除核验宿主兼容硬约束外，还需按 `dsh-llm-verifier` 的先例处理重新准入记录、退役表指回与作者账号改名核定。

第三，新提交的 #91 `dsh-engramory` 与 #92 `dsh-video-read` 需对照宿主 `0.2.2-rc.1` 接口面、实际代码行为与商店披露文案逐项核验，判定是否满足准入条件或存在事实偏差。

## Decision

**#90 `dsh-archived-chats` 重新登记为 `2.0.0`：合并（`b3ba6524`），`main` 由 106 条增至 107 条。**

该插件在 2026-11-05 的退役轮（`55a380e`）被移除，原因是当时 `engines` 下限为 `0.1.0-rc.7`；上游发布 `2.0.0` 后下限抬到 `0.2.2-rc.1`，满足退役轮写明的重新准入条件。合并前核验：head 恰为「当前 `main` 的 106 条 + 末尾一条」、前 106 条逐字节相等；四项兼容硬约束逐条通过（`engines` 覆盖 `0.2.2-rc.1`、`exports` 含 `"./client"`、不注册模型可调用工具故 `output` 契约不适用、`dsh.client.inject` 只用 `dsh-client-locale` 且在批准名单内）；分类由退役时的 `ui`/`panel` 改为 `utility`/`cleanup`，与邻居 `dsh-delete-archived` 一致；必需检查通过。

**按 `dsh-llm-verifier` 先例补齐重新准入记录。**

新增 `2026-11-08-archived-chats-readmission.md`（`47c1e31a`），并在退役记录里那句「Any of the 52 retired plugins can return ...」之后追加一句指向该记录（`c1487193`）。`market/editor-picks.json` 未引用 `dsh-archived-chats`，因此没有连带改动（与 `llm-verifier` 那次不同）。作者字段保留 `Ultronen`：插件 README 与 `package.json` 用它署名，GitHub 账号已由 `Ultronen` 改名为 `Ultroncn`，属账号改名而非不同作者。

**本轮的尾部互斥实测：31 条开放 PR 中 11 条成立，合入 #90 后其余 10 条立即整体失配。**

轮次开始时对 31 条开放 PR 逐个判定「是否恰为当前 `main` + 末尾一条」，其中 11 条成立（#48、#60、#67、#73、#81、#84、#85、#89、#90、#91、#92）；合入 #90 之后其余 10 条立即整体失配。这与 11-06、11-07 两轮结论一致：单文件尾部追加数组使每轮只能落地一条。

**按宿主契约与商店文案核验结果分流其余 PR。**

- **#91 `dsh-engramory`：内容与契约全部通过，仅需重建。** 逐条核过宿主 `0.2.2-rc.1` 接口面：没有注册模型可见工具（`output` 契约不触发）、`exports` 含 `"./client"`、两个 `inject` 名均为 `dsh-web-app` 的 roster 行、`tools.guard` 读 `exec.name`/`arguments` 与 `session.header.cwd`、`sessionProjections` 与 `configEditor` 用法均能在宿主源码对上；商店文案里 8 条可核事实逐条对上源码。上游未声明 `engines.dsh`，按主退役轮「缺声明不等于 `0.1.x`」的口径不判阻塞（目录中仍有 24 条只给 `repo` 的条目），但作为建议要求补成 `>=0.2.0-0 <0.3.0-0`。
- **#92 `dsh-video-read`：契约通过，商店文案两处事实错误必须改。** 已核：`exports` 含 `./client`、9 个工具全部带 `output { schema, render }`、npm 无发布故商店回落 `repo` 安装（装到的就是含修复的 `main` HEAD）、本地实跑其三个自测脚本全绿。退回原因：文案称「自动安装 ffmpeg 与 yt-dlp」，实际只对 Windows x64 成立（`NPM_FFMPEG_PKG` 为 `win32-x64`、回落 ZIP 为 `win64`、`yt-dlp` 只解压 `bin/win/yt-dlp.exe`），Linux 与 macOS 上必然失败；且未披露首次使用会从 `npmmirror`/`npmjs`、`gyan.dev`、GitHub 下载数十至上百 MB 二进制、产物写工作区 `.video-read/`、开 caption 时抽取的帧会发给模型路由并计费。
- **#67 Assistant Photographer 与 #89 `dsh-free-search` 维持 11-07 的退回结论**，作者本轮未按要求改动。

## Alternatives considered

**将 #91 `dsh-engramory` 未声明 `engines.dsh` 视为准入阻塞项并退回。** 否决：2026-11-05 主退役轮记录已明确「缺声明不等于 `0.1.x`」，当前目录中仍有 24 条仅提供 `repo` 且未声明 `engines.dsh` 的条目正常分发，宿主 `0.2.2-rc.1` 安装闸门也不会拒绝无 `engines.dsh` 的插件；若将缺失该字段判为阻塞，会与既有准入口径矛盾，因此仅作为建议要求上游补齐 `>=0.2.0-0 <0.3.0-0`。

**将 #90 `dsh-archived-chats` 视为常规新插件登记，仅合入 `community.json` 条目而不补充重新准入记录与退役表指回。** 否决：`dsh-llm-verifier` 在 2026-11-07 重新登记时已确立先例，凡在退役轮被移除后因抬高 `engines` 下限重新准入的插件，均需新增专门的 readmission 记录并在原退役记录中追加指回说明；若省略这步，后续查阅退役记录的维护者会误判该插件仍处于退役状态。

## Consequences

- `main` 由 106 条增至 107 条（`b3ba6524`），随后两份记录提交把它推进到 `47c1e31a`；本轮已在 `dsh-web` 移动 gitlink、物化并重建 `market/dist`（107 plugins），`deploy-market` 跑绿（`b3a783838`）。
- 10 条内容已核清的 PR（#48、#60、#67、#73、#81、#84、#85、#89、#91、#92）仍排队等作者把条目重建到当前尾部；在登记结构改为按 `id` 字典序落位或分片文件之前，每轮只能落地一条的约束不会消失。
- 重新准入的完整路径现在是三步：上游发版抬高下限、按常规 PR 重新登记、补 readmission 记录并在退役记录里留下指回。
