# Agent Note: dsh-archived-chats 以 2.0.0 重新登记

Status: implemented

## Problem

[2026-11-05 退役轮](2026-11-05-workshop-plugin-retirement-round.md)（commit `55a380e`）将 `dsh-archived-chats` 与其他 51 个条目一并移除，原因是当时的 `engines` 下限为 `0.1.0-rc.7`，低于 `0.2.0` 的准入线；当时登记的版本是 `1.6.3`，分类为 `ui/panel`。退役记录表格里该行为 `| dsh-archived-chats | >=0.1.0-rc.7 || 0.2.2-rc.1 | 0.1.0-rc.7 | 1.6.3 |`。该插件当时的范围虽已列出 `0.2.2-rc.1`，但既有重新准入规则要求维护者先在新发布版本中将 `dsh.engines.dsh` 下限抬升至 `0.2.0` 或更高并提交新登记（`maintainer raises dsh.engines.dsh in a published release to a lower bound of 0.2.0 or higher and submits a fresh registration`），不能直接恢复旧条目。

## Decision

上游 `Ultronen/dsh-archived-chats` 已发布 `2.0.0`，将引擎下限抬到 `0.2.2-rc.1`，满足退役轮写明的重新准入条件。本次通过 PR #90 按正常重新登记录径合入（squash 合并为 `b3ba6524`），把条目追加到 `community.json` 末尾，不为它开设规则例外。

四项兼容硬约束已逐条核验：`engines` 覆盖 `0.2.2-rc.1`；`exports` 含 `./client`；该插件不注册任何模型可调用工具，因此 `output { schema, render }` 契约不适用；`dsh.client.inject` 只用了 `@deepseek-ai/dsh-client-locale`，在本仓 `scripts/inject-contract.test.mjs` 的批准名单内。

条目元数据同步按 `2.0.0` 实况更新：

- **功能描述对齐 `2.0.0` 源码。** 与只提版本号不同，`2.0.0` 相对 `1.6.3` 横跨 `1.7.0`（谱系与统一删除）、`1.7.1`（接入官方 `updateBundle`）、`2.0.0`（宿主基线下限）；退役版描述里的回收站恢复、空间与保留策略在 `1.6.4`/`1.7.0` 已移除，新描述对应 `2.0.0` 的真实功能面（正文搜索、只读预览、标签备注、ZIP 备份、谱系图、永久删除确认与重试），逐项可在源码中核到。
- **分类调整。** 分类由退役时的 `ui/panel` 改为 `utility/cleanup`，与该插件当前主面及邻居 `dsh-delete-archived` 一致。
- **作者署名保留 `Ultronen`。** 这是插件 README 与 `package.json` 里让用户核对的署名；GitHub 账号已由 `Ultronen` 改名为 `Ultroncn`（旧 handle 重定向），属账号改名而非不同作者。

## Alternatives considered

**直接恢复指向 `1.6.3` 的旧条目与旧描述。** 否决：`1.6.3` 的声明下限仍为 `0.1.0-rc.7`（低于 `0.2.0`），且退役版描述中的回收站恢复、空间与保留策略已在 `1.6.4`/`1.7.0` 移除，直接恢复既绕过重新准入条件，也与 `2.0.0` 真实功能面不符。

**保留旧分类 `ui/panel` 或将作者字段改写为 `Ultroncn`。** 否决：该插件当前主面为归档会话清理与备份，归入 `utility/cleanup` 才与邻居 `dsh-delete-archived` 一致；作者字段须与插件 README 及 `package.json` 的核对署名 `Ultronen` 保持一致，GitHub 旧 handle 已重定向至 `Ultroncn`。

**只在主仓修改生成的市场 manifest。** 否决：`community.json` 是插件目录的唯一数据源，主仓只应移动卫星仓 pin 并重建产物。

## Consequences

- `community.json` 由 106 条增至 107 条，`dsh-archived-chats` 位于末尾且只出现一次（PR #90，commit `b3ba6524`）。
- `market/editor-picks.json` 未引用 `dsh-archived-chats`，因此本次没有连带改动（与 `dsh-llm-verifier` 那次不同）。
- 其余未满足条件的退役条目不改变，原退役审计与准入规则继续有效。
- 卫星仓登记不会自动上架；主仓仍须移动 gitlink、物化 pin 并重建 `market/dist`。
