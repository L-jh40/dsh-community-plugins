# dsh-community-plugins Repository Instructions

This repository owns the community plugin index: `community.json` is the single
source of the Workshop store plugin catalog and the dsh-market.com plugin
manifest (`manifest/plugins.json`). Entries carry links and metadata only — this
repository never vendors third-party plugin code.

## Common Commands

```sh
pnpm install
pnpm build
pnpm test
pnpm typecheck
pnpm community:check   # scripts/community-index.cjs --check
```

## Rules

- `community.json` keeps its entries in ascending `id` order, one entry per
  commit: insert at the id position, never at the tail. Required fields are
  `id`, `name`, `nameEn`, `author`, `repo`; `npm`, `category`,
  `subcategory`, and the descriptions are optional per the validator, but the
  published copy is user-visible and is reviewed as such.
- An entry's `description` / `descriptionEn` are store copy shown to every user.
  Claims about defaults, permissions, or platform support are checked against the
  upstream plugin's current source before merge. See
  [.agents/notes](.agents/notes/README.md).
- Use Conventional Commits (`feat(community-plugins): ...`, `fix(...)`,
  `docs(...)`). No emoji in code, comments, documentation, or commit messages.
- The integration branch is `main`.

## Agent Notes

Decision records live in [.agents/notes](.agents/notes/README.md). Read it before
changing how entries are reviewed or merged.
