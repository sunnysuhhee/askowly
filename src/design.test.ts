// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { toParagraphs } from './features/home/AskScreen'
import { MED_GROUPS } from './data/medGroups'

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? files(p) : p.endsWith('.tsx') ? [p] : []
  })
}

describe('design rules', () => {
  it('uses the hand-drawn icon set, never emoji, in the interface', () => {
    const emoji = /\p{Extended_Pictographic}/u
    const offenders = files('src').filter((f) => !f.endsWith('.test.tsx') && emoji.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('splits long replies into short paragraphs', () => {
    expect(toParagraphs('One. Two. Three. Four. Five.')).toEqual(['One. Two.', 'Three. Four.', 'Five.'])
    expect(toParagraphs('Hi there!\n\nHow are you?')).toEqual(['Hi there!', 'How are you?'])
  })

  it('keeps navy text readable on every theme and medicine color', () => {
    const lum = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    const contrast = (a: string, b: string) => {
      const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
      return (hi + 0.05) / (lo + 0.05)
    }
    const tokens = readFileSync('src/styles/tokens.css', 'utf8')
    const navy = tokens.match(/--navy: (#[0-9a-f]{6})/)![1]
    // Feature colors fill bold button text; tints sit behind body text.
    const fills = [...tokens.matchAll(/--(?:orange|feature): (#[0-9a-f]{6})/g)].map((m) => m[1])
    const tints = [...tokens.matchAll(/--(?:cream|sand|pale-orange|feature-soft): (#[0-9a-f]{6})/g)].map((m) => m[1])
    expect(fills.length).toBeGreaterThanOrEqual(4)
    for (const c of fills) expect(contrast(navy, c)).toBeGreaterThanOrEqual(5.5)
    for (const c of tints) expect(contrast(navy, c)).toBeGreaterThanOrEqual(11)
    for (const g of Object.values(MED_GROUPS)) {
      expect(contrast(navy, g.color)).toBeGreaterThanOrEqual(5.5)
      expect(contrast(navy, g.soft)).toBeGreaterThanOrEqual(11)
    }
  })
})
