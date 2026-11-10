# Contributing

This repository is the community plugin index for the dsh web ecosystem.
`community.json` is the single source of the Workshop store plugin list and the
`dsh-market.com` plugin manifest, so an entry added here reaches every user of
the family bundle.

## Adding or updating a plugin entry

1. Insert one object into the `community.json` array at its ascending `id`
   position. There is no `rank` field: the array order is the store order, and
   because every entry sits where its id sorts, two concurrent registrations
   touch different parts of the file and merge without a conflict — a tail
   append would collide with every other open registration.
2. Fill the required fields: `id`, `name`, `nameEn`, `author`, `repo`.
   `description`, `descriptionEn`, `category`, `subcategory` and `npm` are
   optional to the validator, but the descriptions are store copy shown to every
   user and are reviewed as published copy, and `subcategory` is accepted only
   together with a `category`. Omit `npm` when the plugin is not published to
   the registry — the store then installs from `repo`.
3. Run the gate and the tests before pushing:

   ```sh
   pnpm install
   pnpm community:check
   node --test scripts/community-index.test.mjs
   ```

The gate rejects malformed registrations: `repo` must be an `https://` URL
without whitespace or shell metacharacters (the market turns it into a shell
command) and `npm` must be a valid npm package name. `pnpm test` covers the
same validation through the module API.

Keep the diff to the one entry. The file is UTF-8 with LF line endings, one
object per entry, in ascending `id` order: a pull request that rewrites the line
endings or reformats existing entries turns a one-entry addition into a
whole-file diff that can be neither reviewed nor merged alongside another
registration.

An entry that states a compatibility range must match the plugin's current
`engines.dsh`. Prefer an open range such as `>=0.2.1-rc.2 <0.4.0-0` over an
exact version or a closed upper bound: the host evaluates
`semver.satisfies(hostVersion, range, { includePrerelease: true })` and refuses
the install when the range excludes the running host, so a stale range turns the
store listing into an install that always fails.

## Commit and review

Use Conventional Commits (`feat(community-plugins): ...`, `fix(...)`,
`docs(...)`). Do not use emoji in code, comments, documentation, or commit
messages. Keep changes to one entry per commit where practical so the diff is
reviewable.

## Release

The version is per-repository: it advances here and no longer with the dsh-web
monorepo. To cut a release, bump `version` in `package.json`, add the matching
`docs/release-notes/vX.Y.Z.md`, commit both, then push the tag:

```sh
git tag vX.Y.Z
git push origin vX.Y.Z
```

The tag is the release switch. `.github/workflows/release.yml` reruns the CI
gates, refuses to publish when `package.json` disagrees with the tag, publishes
to npm, verifies the version resolves from the registry, and creates the GitHub
Release. It needs the repository secret `NPM_TOKEN` (an npm automation token for
the `@linxin666` scope).

