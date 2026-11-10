# Agent Note: 2026-11-09 登记轮

Status: implemented

## Problem

2026-11-09 登记轮开始时 `main` 为 107 条（末尾 `dsh-archived-chats`）。本轮按 pr-maintenance 的默认范围处理「球在维护者一侧」的 10 条开放 PR：其中 8 条已有上一轮 CHANGES_REQUESTED 并带了新提交（#58、#60、#66、#72、#78、#82、#84、#85），2 条从未评审（#93、#94）。需要逐条核对反馈是否落实、商店文案与上游当前发布是否一致、宿主兼容与三性（实用性 / 稳定性 / 兼容性），并裁定能否合入。

## Decision

- **#85 `dsh-thanks-carl` 合入（16:03:42Z）。** 文案逐句对上 0.2.3 源码：`core.mjs` 的 probability 0.15 与 cooldown 30 分钟、`rejectedReasons` 五类、缺 Web Locks 时 fail-closed、错过的提醒不补放；`LICENSE` 23-27 行把卡尔照片排除在 MIT 之外，与「仅限随插件个人非商用」一致；37/37 测试复跑通过。
- **#78 `dsh-logo-golden` 合入（16:05:25Z）。** 三秒、rgba16float、1600 nit、几何掩码与 `sidebar.brand.mark`/`.name` 单座填充都能在源码对上，正文 0.4.16 与 npm latest 一致；格式 nit（新增分隔符写成单独一行逗号）留待后续统一。
- **#84 `dsh-cost-voice` 批准，待作者 rebase 与两处跟进。** 功能文案按 1.2.0 逐句核过、78 项测试与两套冒烟复跑全绿；但 1.2.0 已把展示名改为「大白饭到账语音播报」而条目名仍是 1.1.1 时期的名字，且随包支付宝片段来自没有 LICENSE 的 Reathin/XVoice、大白饭为 MiMo 克隆、图标为二创梗图，包内 LICENSE 为纯 MIT 无排除条款、商店文案无许可限定。#85 合入后其条目变为 CONFLICTING。
- **#72 `dsh-plugin-upgrader` 批准，待作者 rebase。** 条目按 1.8.0 核过（MAX_VERSIONS=80、就地替换与回退、不兼容版本禁用、镜像缺口、loopback 403 与 409 busy），必检 check 已在 head `313bbab` 上 success；同样因尾部互斥而冲突。
- **#60 `dsh-novel-fish` 退回。** 条目中英两处写「npm 最新 1.0.1」，registry 的 latest 已是 1.1.0（2026-11-07T05:36:41Z 发布，早于推送约 35 小时），而商店 `installSpec` 不带版本号、装的是 latest；其余（engines 区间与上游一致、CI 的 7 项宿主契约检查）成立。
- **#82 `git-branch-switcher` 退回。** 条目写「默认 master」，与 v0.6.1 `RELEASE-NOTES` 第 7 行及源码 `preferredBase()`（先判 main）冲突，属商店文案与已发布版本漂移，按既有决策为合并阻塞。
- **#66 `model-picker-2level` 退回。** 条目落在 index 104/107 而非尾部、head 缺 `dsh-archived-chats`、正文条目数与实测宿主版本过期、实装证据停在 0.1.7 而 latest 0.2.0 已按 CHANGELOG 重写弹层布局。
- **#58 文案刷新退回。** 第 1 轮点名的两条 url-router 改动仍未做：macOS 桌面地址栏（上游 0.5.0 支持）与「绝不覆盖外来 fragment」应在「唯一写者」旁并存；另有「五个补丁行」实为 6 个 `insert` 行、`delete-session` 的「等写所有权释放」实为 12×200ms 探测后 409、分支需基于当前 main 重基。
- **#93 `dsh-plugin-restart-button` 退回。** 文案漏「仅 Windows + 仅打包桌面版」与取消语义（关闭指令发出后不可取消）；正文省略 npm 的理由与事实相反——registry 上该包名属 jiqiu0709 的另一个插件（latest 0.1.2）；六条路由无回环地址、Host 头与同源校守卫，空 body 的跨站 POST 即可触发重启；`index.js:349` 的 close request 判据永不匹配，界面会谎报「应用没有被关闭」。
- **#94 `dsh-douyin-all` 退回。** 商店文案是对着 0.4.9 写的，npm latest 已 0.5.0，而 0.5.0 回退了上一轮要求的两处修复：`enabled` 回到 true、`stopEdge` 整个函数消失，挂载后约 60 秒会 detach 一个无头 Edge 且无回收路径；文案另漏「只在 Windows 上实测过」与 Edge、扫码登录前置；该条与 #87 同 id，只能留一条；许可为 UNLICENSED 专有许可。

## Alternatives considered

- **把 #84 与 #72 也挤进本轮合入。** 否决：`community.json` 是单文件尾部追加结构，一次合入即令同批对准旧尾部的分支整体失配；硬推只能手工解冲突或代作者改写分支，让作者 rebase 才能维持「恰为当前 `main` + 末尾一条」的既有约定。
- **允许 #94 以 UNLICENSED 专有许可直接收录。** 否决：许可是否可接受属维护者政策裁量，不能由审查代作判断；先把实现与文案的可核实缺陷修好，许可问题单独提请决定。
- **对 #93 只要求改文案、不要求补路由守卫。** 否决：六条路由缺回环地址、Host 头与同源校验，跨站表单即可触发重启，属安全缺陷而非文案瑕疵。

## Consequences

- `main` 由 107 条增至 109 条（#85、#78 两次 squash 合入），其余 8 条仍在队列；单文件尾部追加导致「每轮只能落地一条」的约束未改变。
- 上架需在 dsh-web 移动 `satellites/dsh-community-plugins` 钉版并重建 `market/dist`；本轮已在同一次 dsh-web 提交中承接四个卫星仓的最新钉版。
- 两条政策同日由维护者定下：其一，商店文案必须披露随包第三方素材的许可限定，#84 据此由批准改判退回，口径与已收录的 `dsh-thanks-carl`（文案写明「随包照片仅限随插件个人非商用」）一致；其二，UNLICENSED 专有许可不接受进索引，#94 已要求作者改为允许分发与再分发的开源许可，保留专有许可则该条不上架。
