#!/usr/bin/env node
/**
 * Validate the community plugin index: the only source is community.json in
 * this repository. market-build turns that file into manifest/plugins.json for
 * the Workshop store card and the dsh-market.com site; every entry points at
 * the contributor's own repository — this repository never vendors their code.
 *
 * Entries are stored in ascending `id` order, and the array order is the store
 * order. Keeping the entries sorted is what makes a registration a single-point
 * insert instead of a tail append: two concurrent pull requests then touch
 * different parts of the file and merge without a conflict.
 *
 * Usage:
 *   node scripts/community-index            # validate
 *   node scripts/community-index --check    # same; exits 1 on failure (CI)
 */
'use strict'

const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.resolve(__dirname, '..')
const JSON_FILE = path.join(ROOT, 'community.json')

/** https://-only repository URLs limited to path-safe characters (the market
 * turns them into shell commands, so no whitespace or shell metacharacters). */
const REPO_RE = /^https:\/\/[A-Za-z0-9._~\/-]+$/
/** npm package names (optionally scoped). */
const NPM_RE = /^(@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/

/** Required entry fields. */
const REQUIRED = ['id', 'name', 'nameEn', 'author', 'repo']
/** Optional entry fields. */
const OPTIONAL = ['description', 'descriptionEn', 'npm', 'category', 'subcategory']
/** Stable category ids rendered as filter pills on the market surfaces. */
const CATEGORIES = ['ui', 'agent', 'tools', 'knowledge', 'integration', 'security', 'utility']
/** Second-level classification: the legal subcategory ids per category, also
 * rendered as a filter pill row beneath the category row. An entry may set a
 * subcategory only when it has a category, and only from its category's list. */
const SUBCATEGORIES = {
  ui: ['terminal', 'chat', 'render', 'panel'],
  agent: ['preset'],
  tools: ['context', 'browser', 'api', 'model', 'dev'],
  knowledge: ['memory', 'reading', 'qa'],
  integration: ['remote', 'bridge', 'sync', 'external-ai'],
  security: ['access', 'policy'],
  utility: ['cleanup', 'stats', 'notify', 'net'],
}

/**
 * Entries must ascend by `id`. The array order is the store order, so this is
 * a data contract rather than cosmetics: it is what keeps a registration a
 * one-point insert that merges beside every other open registration.
 * @param raw - the parsed array, whose members are already known to be objects.
 * @throws when two neighbours are out of order.
 */
function assertSortedById(raw) {
  for (let i = 1; i < raw.length; i++) {
    const previous = raw[i - 1].id
    const current = raw[i].id
    if (typeof previous === 'string' && typeof current === 'string' && previous > current) {
      throw new Error(
        'community.json: entries must be sorted by id: ' + previous + ' comes before ' + current,
      )
    }
  }
}

/**
 * Validate the parsed community.json body.
 * @param raw - the parsed JSON value.
 * @throws when the body violates the index contract.
 */
function validateEntries(raw) {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error('community.json: expected a non-empty array of entries')
  }
  const seen = new Set()
  for (const entry of raw) {
    if (typeof entry !== 'object' || entry === null) {
      throw new Error('community.json: every entry must be an object')
    }
    for (const key of REQUIRED) {
      if (typeof entry[key] !== 'string' || entry[key].trim() === '') {
        throw new Error('community.json: entry ' + JSON.stringify(entry.id) + ' missing required string field ' + key)
      }
    }
    if (seen.has(entry.id)) {
      throw new Error('community.json: duplicate entry id ' + entry.id)
    }
    seen.add(entry.id)
    if (!REPO_RE.test(entry.repo)) {
      throw new Error('community.json: entry ' + entry.id + ' repo must be an https:// URL of path-safe characters')
    }
    if (entry.npm !== undefined && (typeof entry.npm !== 'string' || !NPM_RE.test(entry.npm))) {
      throw new Error('community.json: entry ' + entry.id + ' npm must be a valid package name')
    }
    for (const key of OPTIONAL) {
      if (entry[key] !== undefined && typeof entry[key] !== 'string') {
        throw new Error('community.json: entry ' + entry.id + ' ' + key + ' must be a string')
      }
    }
    if (entry.category !== undefined && !CATEGORIES.includes(entry.category)) {
      throw new Error('community.json: entry ' + entry.id + ' category must be one of ' + CATEGORIES.join(' / '))
    }
    if (entry.subcategory !== undefined) {
      if (entry.category === undefined) {
        throw new Error('community.json: entry ' + entry.id + ' subcategory requires a category')
      }
      const legal = SUBCATEGORIES[entry.category]
      if (!legal || !legal.includes(entry.subcategory)) {
        throw new Error('community.json: entry ' + entry.id + ' subcategory must be one of ' + legal.join(' / '))
      }
    }
  }
  assertSortedById(raw)
}

function main() {
  const raw = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'))
  validateEntries(raw)
  console.log('community-index: OK (' + raw.length + ' entries)')
}

if (require.main === module) main()

module.exports = { validateEntries }
