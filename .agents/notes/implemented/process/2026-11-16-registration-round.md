# Agent Note: 2026-11-16 登记轮

Status: implemented

## Problem

本轮 `main` 起始 137 条（按 `id` 升序存放）。`dsh-community-plugins` 的 19 个开放 PR 里只有 3 个进入本轮范围：`#111` dsh-ai-diagrams、`#110` dsh-braingames 是首次评审，`#91` dsh-engramory 是作者的反馈更新。其余 16 个自上一轮评审后没有新的内容提交（其中一部分在 2026-11-10 由维护方代做过 main 合并，提交内容是 merge 而不改条目），继续等作者修改。另有 `dsh-skins` 6 个、`dsh-pet` 3 个、`dsh-presets` 0 个开放 PR，全部停在 `CHANGES_REQUESTED` 且无新提交。宿主基线 `@deepseek-ai/dsh` 0.2.2-rc.2。

顺带发现一处上一轮遗留的过期要求：2026-11-10 的 [按 id 排序](2026-11-10-id-sorted-community-index.md) 把登记从「追加到末尾」改为「插到 id 位置」，但当时 8 个 PR（`#27` `#32` `#49` `#50` `#51` `#53` `#66` `#73`）收到的评审正文仍写着「追加到数组末尾」。这些分支本身在 11-10 已被代重建到 id 位置、校验可通过，过期的是评审措辞，本轮在这 8 个 PR 各留一条更正说明。

## Decision

**1 个 PR 合入 `main`（`#91`），2 个退回作者修改（`#110`、`#111`）。**

- `#91` `dsh-engramory`（`319925f`，squash，新增，knowledge/memory）：head 恰好等于当前 `main` 再加一条，无删除、无改既有条目、位置满足 `id` 升序。新提交 `6e635f25` 改写的写入上限表述与适配器源码逐条对上——`DEFAULT_MAX_LINES = 200`、`DEFAULT_MAX_BYTES = 25600`，拒绝条件是 `lines > maxLines && lines > curLines` 或 `bytes > maxBytes && bytes > curBytes`，因此已超限时往小里改照常放行，拒绝文案本身也写明 SHRINKS always passes；守卫挂在 dsh 文件工具的调用上，shell 写入不在拦截范围。`repo` 是子目录 tree URL（`.../tree/master/adapters/dsh/plugin`），市场构建原样写进 `plugins.json`，站点在有 `npm` 字段时用包名生成安装命令、`repo` 只作来源链接，不影响安装。
- `#110` `dsh-braingames`（退回）：`engines.dsh` 为 `>=0.2.2-rc.1`，当前宿主放行；注入的四个宿主服务与六个客户端模块都存在；`__ModuleLoader__` 注册方式与 cordis 行 id 不冲突。阻塞项是条目缺 `category`/`subcategory`——现存 137 条全都有，缺省时市场构建落成 `other`，商店里会掉进「其他」分类。附带建议：`name`/`nameEn` 用了包名；`peerDependencies` 里 7 个 `@deepseek-ai/dsh-client-*` 与家族口径不同（同类风险见 dsh-web #1966），插件管理器是否自动装 peer 本轮未验证。
- `#111` `dsh-ai-diagrams`（退回）：机制项全过——npm 上已是 0.2.0（PR 正文写的 0.1.0 已过期），`dsh.engines.dsh` 为 `>=0.2.1-rc.3 <0.3.0` 对宿主 0.2.2-rc.2 判定通过，7 个 `diagram_*` 工具都声明了 `output { schema, render }`，`dsh.client.inject` 的四个包宿主里都在，`peerDependencies` 只写 `@deepseek-ai/dsh`，内置 diagram-design skill 的 50 个 `type-*.md` 与 MIT 署名齐全。退回原因是文案要补一句：PNG 导出依赖本机 Chrome/Chromium（README 第 51、66 行与代码都在找它），条目现在写「不需要 Python，不需要 Playwright」会让读者以为零环境依赖。
- 三个首次贡献者的 fork CI 由维护者批准后跑绿：`#111` run `43811618290`、`#110` run `43725560724`、`#91` run `43696326986`。

## Alternatives considered

**按子 agent 的判定把 `#110` 的「像素风」文案作为阻塞项。** 否决：上游 README 第 5 行就是「玩几分钟像素风认知训练小游戏」，与条目中英文逐字一致；实际画面是柔和着色的 Q 版角色加低多边形渲染精灵，船甲板与 UI 面板确实有像素化边缘，属混合风格。要求作者改自己产品的措辞缺乏依据，改为不提。

**把 `#111` 的 Chrome 依赖记为非阻塞跟进项。** 否决：条目现在写「一键导出 SVG / PNG …… 不需要 Python，不需要 Playwright」，读者会理解为零额外环境，而 PNG 导出在没有 Chrome 的机器上直接不可用；与前几轮对 `#94`（需要 Edge）、`#92`（平台限制）的处理保持一致，作为合并前的一句话补充。

**等 `#111` 作者回应后再一并上架。** 否决：上架是把已合入内容推到商店的机械承接，与其它 PR 无关；`#91` 已合入，本轮即移动钉版。若等 `#111`，已合入的条目会迟迟不到商店。

## Consequences

- `main` 增至 138 条并保持 `id` 升序，全表通过 `scripts/community-index.cjs --check`。
- 本轮 1 条新增内容需在 `dsh-web` 移动 `satellites/dsh-community-plugins` 钉版并重建 `market/dist` 才会到达商店。
- 16 个等作者修改的 `dsh-community-plugins` PR，以及 `dsh-skins` 6 个、`dsh-pet` 3 个、`dsh-presets` 0 个开放 PR 本轮未触碰；其中 8 个已收到排序约定的更正说明。
- 跟作者的两条跟进项（`#110` 补 `category`、`#111` 补 Chrome 依赖说明）已写入各自评审。
