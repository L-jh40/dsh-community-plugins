# Agent Note: 2026-11-15 登记轮

Status: implemented

## Problem

本轮 `main` 起始 132 条（按 `id` 升序存放）。`dsh-community-plugins` 的 23 个开放 PR 中，6 个自上一轮（[2026-11-13 登记轮](2026-11-13-registration-round.md)）之后有新动作，构成本轮范围；其余 17 个仍在等作者修改，本轮保持原状未触碰。另有 `dsh-skins` 6 个、`dsh-pet` 3 个、`dsh-presets` 0 个开放 PR，全部停留在 `CHANGES_REQUESTED` 且无新提交，未触碰。宿主基线 `@deepseek-ai/dsh` 0.2.2-rc.2。

这 6 条由三类构成：按上一轮退回清单整改的 `#65`、`#98`、`#106`，新登记的 `#108`、`#109`，以及既有条目修订的 `#107`。本轮为索引层评审：核对商店文案、上游发布产物与索引准入条件，未在任何宿主实例上运行这些插件。

## Decision

**6 个 PR 全部 squash 合入 `main`，索引由 132 条增至 137 条（5 条新增 + 1 条既有条目修订）。**

- `#65` `dsh-triage`（`df77660`，新增，tools/dev）：文案改为「默认只读、不安装到 profile、不卸载、不判安全；仅显式 `--apply` 改配置，先备份、可 `--undo` 还原」，与 npm `0.3.9` 的 `fix.js`/`rescue.js` 实现对得上。上游 `3794ec3` 的 `verify` 三矩阵失败已在 `75b6cb7` 修复并在 main 连续 10 次绿，但 npm 尚无更新版本（`latest` 仍为 `0.3.9`）。
- `#98` `dsh-man-031`（`0648678`，新增，utility/notify）：上一轮退出的两项均落实——中英描述补入「随包的科比人物图、图标与预制语音不随 MIT 再分发、仅限随插件个人非商业使用」，与包内 `LICENSE` 的 `Scope of this grant` 排除清单一致；上游 `docs/SOURCES.md` 在 `db6dc7a` 删掉了「已有授权」的矛盾表述。`engines.dsh` 为 `>=0.2.2-0 <0.3.0-0`。
- `#106` `dsh-asl-workspace`（`81371b6`，新增，ui/panel）：上一轮三项均落实——`sourceRoot`/`environment` 去掉 `.required()` 改为首次调用初始化并返回 `ASL_SETUP_REQUIRED`/`ASL_SETUP_INVALID`；包名与条目 `id` 统一为 `dsh-asl-workspace`；补 `engines.dsh >=0.2.1-rc.5 <0.3.0-0`。该条无 `npm` 字段（registry 查无此包），商店按仓库地址安装。
- `#108` `dsh-better-classifier`（`3209a8d`，新增，ui/panel）：MIT、运行期仅 `zod`、无 install 脚本、带 provenance；`engines.dsh` 为精确版本 `0.2.2-rc.2`，作为知情选择记录（宿主升级需跟版本或走豁免）；安装后会把宿主的 `session-query-sqlite` 行指到 `$DSH_HOME/storages/better_classifier_search.sqlite`，卸载后该文件保留。
- `#109` `dsh-liquid-glass`（`9bb7d90`，新增，ui/render）：MIT、零运行期依赖、带 provenance、包内 `lib/` 与 tag 逐字节一致；官方 `dsh-client-ui-theme` 不含本地图片/视频背景能力，该条补的是官方空缺；与既有 `dsh-wallpaper-engine` 机制不同（后者依赖本机 Wallpaper Engine），不判重复。包内缺 `dsh.engines.dsh` 为非阻塞跟进项。
- `#107` `dsh-archived-chats`（`4d3e665`，既有条目修订）：把 `author` 由 `Ultronen` 改为 `Ultroncn`，并把中英描述里的宿主兼容声明补到 `0.2.2-rc.3`。判定依据是 `/users/Ultronen` 返回 404、`repos/Ultronen/dsh-archived-chats` 301 重定向到 `Ultroncn/dsh-archived-chats`（repo id 未变）——这是账号改名而非换人；npm `dsh-archived-chats@2.0.3` 的 `dsh.engines.dsh` 与新文案逐字一致。此前 [2026-11-08 重新登记记录](2026-11-08-archived-chats-readmission.md) 以「与插件 README、`package.json` 的核对署名一致」为由保留 `Ultronen`；本轮改以仓库归属为准，npm 侧 `author` 同步归入上游待发版项。
- 两个首次贡献者的 fork CI 由维护者批准后跑绿：`#108` run `43542547267`、`#106` run `43570224223`。

## Alternatives considered

**暂缓 `#65` 直到发出 0.4.x。** 否决：修复只涉及测试文件，运行时行为零变化；随包 `0.3.9` 的功能与文案一致，且沿用 2026-11-11 对 `dsh-runninghub-plugin` 的既有判例（不因上游待发版阻塞索引收录），改为在评审中要求作者补发版本。

**以缺 `dsh.engines.dsh` 退回 `#109`。** 否决：商店拦装属增强而非收录前提；官方 `dsh-client-ui-theme` 的能力空缺真实存在，其余门禁（包完整性、seed 模块、插槽契约、许可、无 install 脚本）逐项通过；该缺口作为非阻塞跟进项写入评审。

**等 npm 包内 `author` 字段同步后再合 `#107`。** 否决：索引的事实来源是仓库归属，`author` 与 repo owner 一致是既有 130/132 条的惯例；npm 侧 author 属上游待发版同步项，不影响用户判断。

## Consequences

- `main` 增至 137 条并保持 `id` 升序，全表通过 `scripts/community-index.cjs --check`。
- 本轮 5 条新增内容需在 `dsh-web` 移动 `satellites/dsh-community-plugins` 钉版并重建 `market/dist` 才会到达商店。
- 跟作者的三条发版请求（`dsh-triage` 出 0.4.x、`dsh-better-classifier` 放宽 `engines.dsh`、`dsh-liquid-glass` 补 `engines.dsh`）已写入各自评审。
- 17 个等作者修改的 PR，以及 `dsh-skins` 6 个、`dsh-pet` 3 个、`dsh-presets` 0 个停留在 `CHANGES_REQUESTED` 的开放 PR 本轮未触碰，留待作者有新提交后再评。
