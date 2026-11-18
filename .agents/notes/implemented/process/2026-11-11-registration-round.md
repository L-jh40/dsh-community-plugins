# Agent Note: 2026-11-11 登记轮

Status: implemented

## Problem

2026-11-11 登记轮开始时 `main` 为 119 条（已按 `id` 升序存放），开放 PR 38 个（skins 5 / pet 3 / community 30 / presets 0）。需要在四个新登记（#98、#97、#96、#95）与一条复评（#89）上给出内容判定，并处理上轮结构改动留下的收尾：上一轮把索引改为按 `id` 升序后，26 个开放 PR 被维护者重建到新结构，其中 #79 与 #72 已批准且与当前 `main` 无冲突，只差合入。

## Decision

**5 个 PR 合入，`main` 由 119 条增至 124 条。**

- `#79` `dsh-workspace-tints`（`db07e96`）与 `#72` `dsh-plugin-upgrader`（`e3e2532`）：内容在更早的轮次已批准，本轮只核验重建后的形态——各自只多一条、落位符合 `id` 升序、CI 绿——然后合入。
- `#89` `dsh-free-search`（`cdcda5b`）：退役后重新登记。作者按 11-10 的要求把引擎口径同步到 npm latest 0.9.42（`ALL_ENGINES` 37、`SERP_ENGINE_IDS` 5、`EXPLICIT_ONLY_ENGINES` 4、默认回退链 28），中英两段一致；接管、卸载残留与出口探测三段披露与上游 README 逐句吻合。合入时按 `dsh-llm-verifier` 与 `dsh-archived-chats` 的先例补了 [readmission 记录](2026-11-11-free-search-readmission.md)（`de2c9698`）并在退役记录里留下指回。
- `#96` `dsh-artifacts`（`92dae3b`）：商店文案逐句对上了 npm 0.2.1（该 tarball 与仓库 HEAD 逐文件一致）。四处非阻塞项已写进评审：自带测试在 Linux 上有两个文件因夹具写死 Windows 路径而失败、`files` 未含 `test/` 导致装完后 `npm test` 必失败、存储根目录只认 `DSH_ARTIFACTS_HOME` 与 `homedir()` 而不认 `DSH_HOME`、PR 正文关于 `$DSH_HOME/artifacts/` 的表述与代码不符。
- `#97` `dsh-ai-terminal-pet`（`acc4286`）：条目无 `npm` 字段，商店按 repo 安装，安装路径已按商店真实规格复现（`pnpm add <repo-url>` 返回 0，解析到 1.2.3，`dependencies` 与 `scripts` 均为 null，随包 exe 与 protocol 模块的 SHA-256 与 `vendor/manifest.json` 记录逐位一致）；MIT、`engines.dsh >=0.1.0-rc.6` 在宿主 0.2.2-rc.1 上 satisfy、`dsh.bundle.platforms` 已声明 `win32`。

**两条退回，各有实证。**

- `#95` `rss-pal-dsh`：**条目未发 npm、商店按 repo 安装，而 `better-sqlite3` 是非 optional 直接依赖且带构建脚本**（`install: prebuild-install || node-gyp rebuild --release`）。维护者在与 DSH profile 设置逐字节相同的目录里实测 `pnpm add better-sqlite3@12.4.1`，得到 `ERR_PNPM_IGNORED_BUILDS` 且不生成任何 `.node`；宿主 `packages/dsh-plugin-manager/src/host/gateway.ts` 的 `IGNORED_BUILDS_PATTERN` 与 `recordToleratedExit` 把这一非零退出按「变更已落地」当成成功，其注释亦写明包已在磁盘上、profile 已带上它。结果是用户点一次安装得到装得上但起不来的插件。要求作者三选一：去掉原生依赖、随包提供预构建 binding、或与维护者就 profile 侧预批准该构建达成一致并在 README 写明用户需手动执行的步骤。另要求把 `engines.dsh` 从两个精确版本改为开放范围。
- `#98` `dsh-man-031`：三项。其一是商店文案过期——npm latest 已是 0.8.0（发布于 PR 开设之后），0.8.0 把 `dsh-cost-meter` 变为可选、缺失时按原生用量与公开单价估算，而条目仍写「需启用 dsh-cost-meter」，且未提 0.8.0 新增的 Token 播报模式。其二是许可——包的 `license` 为 `UNLICENSED`、仓库无 LICENSE 文件，与索引口径不符（现有 93 个带 npm 的条目全部带标准 SPDX 许可），按 2026-11-10 对 `dsh-douyin-all` 确立的口径要求改为允许分发与再分发的开源许可。其三是随包的科比肖像二创图——作者自己的 `SOURCES.md` 写明不持有摄影、肖像与品牌权利，要求给出素材来源与权利依据并写明仅供个人非商业使用，或换掉该图。

## Alternatives considered

**对 `#79`、`#72` 再做一次完整内容评审。** 否决：两条的内容在更早轮次已批准，此后唯一的变化是维护者把分支按 `id` 升序重建（纯位置调整，已在重建时逐条核验过「只多自己那一条」）。本轮只复核重建后的形态与 CI，不重复消耗一轮评审。

**对 `#95` 先合入、把原生依赖问题留作已知项。** 否决：条目一旦进入商店，用户点一次安装就会得到一个装得上但起不来的插件，而宿主把该失败记为成功、只留下一条无归因的 missing native module；这是可复现的实证缺陷，属通过前的阻塞项而非观察项。

**对 `#98` 只要求改文案，许可与肖像另开一轮。** 否决：许可与文案同属该条目的收录前置条件，分两轮会让作者推两次；三项一起给出，作者一次改完即可合入。

## Consequences

- `community.json` 由 119 条增至 124 条；本轮新增的 readmission 记录与退役表回指已随 `de2c9698` 进入 `main`。
- 结构改动的效果在本轮得到验证：合入 5 条之后，其余 25 个开放 PR 仍全部保持 `MERGEABLE`（BLOCKED 只来自尚未撤销的 CHANGES_REQUESTED），不再出现「每合一条就让其余全部失配」。
- 待作者处理：#95（原生依赖 + engines 范围）、#98（文案 + 许可 + 肖像）、以及更早轮次里仍在等作者回应的 `#94`、`#92`、`#91`、`#87`、`#83`、`#82`、`#77`、`#75`、`#73`、`#71`、`#69`、`#68`、`#66`、`#65`、`#63`、`#53`、`#51`、`#50`、`#49`、`#38`、`#34`、`#32`、`#27`。
- 卫星仓登记不会自动上架；主仓仍须移动 gitlink、物化 pin 并重建 `market/dist`。
