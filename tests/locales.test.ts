import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'
import { describe, expect, it } from 'vitest'

import EN from '../src/i18n/locales/en.json'
import ES from '../src/i18n/locales/es.json'
import PT from '../src/i18n/locales/pt.json'

type Tree = { [key: string]: string | Tree }

function flatten(tree: Tree, prefix = ''): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((all, [key, value]) => {
    if (typeof value === 'string') all[prefix + key] = value
    else Object.assign(all, flatten(value, `${prefix}${key}.`))
    return all
  }, {})
}

const locales = { pt: flatten(PT as Tree), en: flatten(EN as Tree), es: flatten(ES as Tree) }
const placeholders = (text: string): string[] => (text.match(/{{\w+}}/g) ?? []).sort()

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.tsx?$/.test(name) ? [path] : []
  })
}

describe('locales', () => {
  it('es and en have every Portuguese key, with the same placeholders', () => {
    for (const lang of ['en', 'es'] as const) {
      const missing = Object.keys(locales.pt).filter((key) => !(key in locales[lang]))
      expect(missing, `${lang} is missing keys`).toEqual([])
      const mismatched = Object.keys(locales.pt).filter(
        (key) => placeholders(locales.pt[key]).join() !== placeholders(locales[lang][key]).join()
      )
      expect(mismatched, `${lang} placeholders differ`).toEqual([])
    }
  })

  it('every literal key used with t() exists in Portuguese', () => {
    const keys = new Set(Object.keys(locales.pt).map((key) => key.replace(/_(one|other)$/, '')))
    const used = sourceFiles('src/renderer/src').flatMap((file) =>
      [...readFileSync(file, 'utf8').matchAll(/\bt\(\s*['"]([A-Za-z0-9_.\-']+)['"]\s*[,)]/g)].map(
        (match) => match[1]
      )
    )
    expect([...new Set(used)].filter((key) => !keys.has(key))).toEqual([])
  })
})
