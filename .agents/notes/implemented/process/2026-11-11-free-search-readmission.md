# Agent Note: dsh-free-search 以 0.9.42 重新登记

Status: implemented

## Problem

[2026-11-05 退役轮](2026-11-05-workshop-plugin-retirement-round.md)（commit `55a380e`）把 `dsh-free-search` 与另外 51 个条目一并移除，原因是当时的 `dsh.engines.dsh` 下限为 `0.1.7-rc.1`，低于 `0.2.0` 的准入线；退役时登记的版本是 `0.9.31`，分类为 `tools/dev`，退役记录表格里该行为 `| dsh-free-search | >=0.1.7-rc.1 | 0.1.7-rc.1 | 0.9.31 |`。退役轮写明的重新准入路径是：上游在新发布版本里把 `dsh.engines.dsh` 下限抬到 `0.2.0` 或更高，并提交一份新的登记，不能直接恢复旧条目。

## Decision

上游 `DDDMUC/dsh-free-search` 已发布 `0.9.42`，其 `dsh.engines.dsh` 为 `>=0.2.1-rc.2 <0.4.0-0`，下限 `0.2.1-rc.2` 高于 `0.2.0`，满足退役轮写明的条件。本次经 PR #89 按正常重新登记录径合入（squash 合并为 `cdcda5b`），把条目插到它的 `id` 位置（升序索引的第 38 位，位于 `dsh-flash-presets` 与 `dsh-friendly-steps` 之间），不为它开设规则例外。

四项兼容硬约束逐条核验：`engines` 覆盖宿主 `0.2.2-rc.1`（`semver.satisfies` 实跑为 true）；`exports` 含 `./client`；该插件不注册模型可调用工具，因此 `output { schema, render }` 契约不适用；`dsh.client.inject` 未使用任何宿主 roster 名，不触发本仓 `scripts/inject-contract.test.mjs` 的白名单。

条目文案按 `0.9.42` 实况刷新，而不是沿用退役版：

- **引擎口径。** 中英两段同步改为「37 个引擎可选、默认回退链实际覆盖 28 个」——`lib/engine_meta.js` 的 `ALL_ENGINES` 为 37（32 base + 5 SERP），`DEFAULT_FALLBACK_ORDER` 为 28，`SERP_ENGINE_IDS` 5 个默认不参与，`EXPLICIT_ONLY_ENGINES` 4 个（`metaso`、`openai`、`gemini`、`claude`）只在显式点名时运行。0.9.41 时是 36/28/3，`metaso` 随 `0.9.42` 加入，因此写死的数量会随发版漂移，这一点记在评审里作为已知风险。
- **接管与卸载披露。** 文案写明安装后会把 profile 的 `cordis.patch.yml` 中 `web.searchProvider` 接管为 `ddg`、`web.fetchProvider` 接管为 `fs-quality-fetch`，停用或卸载不会自动还原、需手动删除 `- id: web` 下的两行，否则宿主会报 `configured web provider "ddg" is not registered`；并写明与其它设置 `searchProvider` 的插件互斥、最后生效的一层决定实际搜索（`lib/doctor.js` 的 `search providers are mutually exclusive (the last takeover wins)`）。
- **出口探测披露。** 写明启动时会向 `cloudflare`、`ip.sb`、`ipinfo` 探测出口地区来选择默认引擎，查询会发送给所选第三方引擎。
- **作者与分类保持。** 作者仍为 `DDDMUC`，分类仍为 `tools/dev`，与退役前一致。

## Alternatives considered

**直接恢复指向 `0.9.31` 的旧条目。** 否决：`0.9.31` 的声明下限仍低于 `0.2.0`，绕过重新准入条件；且退役版文案缺少接管、卸载残留与出口探测三段披露，与 `0.9.42` 的真实行为不符。

**照搬 0.9.41 的引擎口径（36/28）。** 否决：0.9.42 于 2026-11-10 加入 `metaso`，实际为 37/28 且显式计费引擎为 4 个；作者在推送时已按当时的 npm latest 更新，核验以 0.9.42 为准。

**只改条目、不补 readmission 记录与退役表回指。** 否决：`dsh-llm-verifier` 与 `dsh-archived-chats` 两次重新准入已确立先例——凡退役后重新准入的条目都要新增专门的 readmission 记录并在退役记录里留下指回，否则后续查阅退役记录的维护者会误判该条目仍在退役状态。

## Consequences

- `community.json` 由 121 条增至 122 条，`dsh-free-search` 位于升序索引第 38 位且只出现一次（PR #89，commit `cdcda5b`）。
- `market/editor-picks.json` 未引用 `dsh-free-search`，本次没有连带改动（与 `dsh-archived-chats` 那次一致）；本仓 `README.md` 与 `README.zh.md` 的「最受欢迎插件」表已引用该条，重新登记后该引用重新成立，无需改动。
- 退役记录里那句「Any of the 52 retired plugins can return …」之后追加了对本记录的指回。
- 卫星仓登记不会自动上架；主仓仍须移动 gitlink、物化 pin 并重建 `market/dist`。
- 已知风险：条目里写死的引擎数量会随上游发版再次漂移，下一轮复评需要重新对照 `dist-tags.latest`。
