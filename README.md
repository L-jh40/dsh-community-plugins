# dsh-community-plugins · Community Plugin Index & Ecosystem Catalog for DeepSeek Harness (DSH)

English | [中文](README.zh.md)

<p align="center">
  <img src="https://img.shields.io/npm/v/@linxin666/dsh-client-ui-community-plugins?style=flat-square" alt="Version">
  &nbsp;
  <img src="https://img.shields.io/badge/DSH-%3E%3D0.2.1--rc.3-4c6ef5?style=flat-square&amp;labelColor=454a54" alt="DSH">
  &nbsp;
  <img src="https://img.shields.io/badge/license-Apache--2.0-blue?style=flat-square" alt="License">
</p>

<p align="center">
  <strong>Community Plugin Index & Manifest Source for DeepSeek Harness (DSH)</strong><br>
  <em>Community Ecosystem Extensions · Official Workshop Manifest · Curated Plugin Catalog · Third-Party Tools</em>
</p>

The authoritative community plugin index data source of the DeepSeek Harness (DSH) Web GUI and desktop client ecosystem: `community.json` is the single source for the DSH Workshop store plugin catalog and the dsh-market.com plugin manifest (`manifest/plugins.json`). It equips developers and users with vetted third-party ecosystem plugins covering external AI model integrations (ChatGPT subscriptions), long-term memory spaces (Mnemon), key-free web search, and developer tooling. Entries only carry curated links and metadata pointing to third-party plugin repositories without vendoring external code.

## What it does

- Index data: `community.json` is merged by maintainer review (see the "社区插件索引登记" section of [docs/plugins.md](../../docs/plugins.md)); every entry requires `id` / `name` / `nameEn` / `author` / `repo` plus optional `description` / `descriptionEn` / `npm` / `category` / `subcategory` (`subcategory` is the second-level classification under `category`; see the enums in `scripts/community-index`, and it is accepted only when `category` is set).
- Consumers: `scripts/market-build` derives the Workshop store and dsh-market.com plugin manifests from this file.
- Validation: `node scripts/community-index` checks the index contract (the `pnpm community:check` CI gate runs the same check).
- No settings surface: this package no longer ships any UI (the community plugin card was replaced by the Workshop store's plugin catalog); the inert cordis row only keeps existing profiles and the aggregate resolving it — it contributes no UI after install.

## Most popular plugins

The three most-liked plugins in the Workshop's plugin category on [dsh-market.com](https://dsh-market.com), in the site's default popularity order — every one of them an entry of `community.json`:

| Plugin | Author | Category | What it does |
|---|---|---|---|
| [Subagent Management](https://dsh-market.com/#plugin:dsh-chatgpt-subscription) (`dsh-chatgpt-subscription`) | Aa728848 | integration / external-ai | Use GPT models in DSH through your ChatGPT subscription: PKCE OAuth login, credential storage, streaming Responses, image generation, Codex search, quota display and subagent management |
| [Mnemon Memory](https://dsh-market.com/#plugin:dsh-mnemon) (`dsh-mnemon`) | omdsh-dev | knowledge / memory | Cross-agent, local-first persistent memory built on the Mnemon CLI: user profiles, working memory, project documents and long-term Memory Spaces, with import and export |
| [Free Search](https://dsh-market.com/#plugin:dsh-free-search) (`dsh-free-search`) | DDDMUC | tools / dev | Multi-engine web search without API keys: automatic fallback across 10 engines, time filtering, 8 platform searches and a web settings panel |

## Install

This package does not need a direct install; it ships with the repository as the index data source.

Profiles that still mount the old card (for example through the aggregate) can uninstall `@linxin666/dsh-client-ui-community-plugins` from the plugin manager tab in the official Plugins section (effective on next start).

## Known limitations

- The index only carries links; it does not validate third-party code quality or security, and each entry belongs to its original author.
- Making a new entry reach the Workshop site and the store requires running `node scripts/market-build` and committing the generated `market/dist` (the `market:check` gate).
