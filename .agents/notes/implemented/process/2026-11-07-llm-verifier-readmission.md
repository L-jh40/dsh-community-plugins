# Agent Note: dsh-llm-verifier 以 0.19.0 重新登记

Status: implemented

## Problem

[2026-11-05 退役轮](2026-11-05-workshop-plugin-retirement-round.md) 将 `dsh-llm-verifier` 与其他 51 个条目一并移除，因为当时的 `engines.dsh` 下限仍为 `0.1.1-rc.2`。该插件实际上也支持当前 0.2.2-rc.1 宿主，但既有重新准入规则要求先在新发布版本中抬高下限，不能直接恢复旧条目。

## Decision

上游 `Aa728848/dsh-llm-verifier` 已发布 0.19.0，将 `engines.dsh` 与全部 8 条 DSH peer 同步收窄为 `>=0.2.0-rc.1 <0.3.0-0`。npm registry 的 `/dsh-llm-verifier/latest` 与 `/dsh-llm-verifier/0.19.0` 均已回读该版本和新范围，因此本次按正常重新登记录径把原条目追加到 `community.json` 末尾，不为它开设规则例外。条目的四个工具、自动验收与 Web 设置页描述已对照上游当前 manifest、测试和源码。

## Alternatives considered

**直接恢复指向 0.18.0 的旧条目。** 否决：其声明下限仍低于 0.2.0，会绕过退役轮建立的重新准入条件。

**只在主仓修改生成的市场 manifest。** 否决：`community.json` 是插件目录的唯一数据源，主仓只应移动卫星仓 pin 并重建产物。

## Consequences

- 社区索引从 104 条增至 105 条，`dsh-llm-verifier` 位于末尾且只出现一次。
- 本次只恢复该插件；其余 51 个退役条目不改变，原退役审计与规则继续有效。
- 卫星仓登记不会自动上架；主仓仍须移动 gitlink、物化 pin 并重建 `market/dist`。
