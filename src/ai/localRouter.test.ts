import { answerLocally, classify } from './localRouter'
import { mergeScam } from './client'
import { findInteractions } from '../data/interactions'
import { findMedInText } from '../data/meds'
import { goodStreak, routinesFor } from '../data/routines'

describe('classify', () => {
  it.each([
    ["what's this orange pill for", 'meds'],
    ['what is my lisinopril for', 'meds'],
    ['my knee hurts when I walk', 'mobility'],
    ['I feel dizzy and worry about falling', 'mobility'],
    ['someone texted me about a package', 'scam'],
    ['USPS: update your address at usps-help.top', 'scam'],
    ['what is the weather tomorrow', 'other'],
  ])('%s -> %s', (text, intent) => {
    expect(classify(text)).toBe(intent)
  })
})

describe('answerLocally', () => {
  it('runs the scam engine on a pasted message', () => {
    const r = answerLocally('Wells Fargo: your account is suspended. Reply YES to confirm within 24 hours.')
    expect(r.intent).toBe('scam')
    expect(r.scam?.verdict).toBe('scam')
  })
  it('asks for the message when only described', () => {
    const r = answerLocally('someone texted me')
    expect(r.scam).toBeUndefined()
    expect(r.reply).toMatch(/paste/i)
  })
  it('explains a known medicine by brand name', () => {
    const r = answerLocally('what is my Eliquis for?')
    expect(r.medName).toBe('Apixaban')
    expect(r.reply).toMatch(/blood/)
  })
  it('answers small talk without routing', () => {
    const r = answerLocally('Good morning!')
    expect(r.intent).toBe('other')
    expect(r.reply).toMatch(/hello/i)
  })
  it('never gives dosing language offline', () => {
    expect(answerLocally('how many pills should I take').reply).not.toMatch(/\btake \d/)
  })
})

describe('mergeScam', () => {
  it('keeps local tells and adds new AI tells without duplicates', () => {
    const msg = 'Pay within 24 hours. Your grandson needs help.'
    const r = mergeScam(msg, [
      { title: 'dup', quote: 'within 24 hours', why: 'x' },
      { title: 'New one', quote: 'grandson needs help', why: 'y' },
    ])
    expect(r.tells.filter((t) => t.quote === 'within 24 hours')).toHaveLength(1)
    expect(r.tells.some((t) => t.title === 'New one')).toBe(true)
  })
})

describe('data helpers', () => {
  it('finds a serious interaction', () => {
    expect(findInteractions(['Warfarin', 'Ibuprofen', 'Metformin'])).toHaveLength(1)
  })
  it('prefers the longest brand name match', () => {
    expect(findMedInText('I took Tylenol PM last night')?.name).toBe('Diphenhydramine')
  })
  it('never offers more than three routines and keeps rough days seated', () => {
    for (const f of ['good', 'okay', 'rough'] as const) {
      for (const streak of [0, 5]) expect(routinesFor(f, streak).length).toBeLessThanOrEqual(3)
    }
    expect(routinesFor('rough', 5).every((r) => r.seated)).toBe(true)
  })
  it('counts a good-day streak', () => {
    expect(goodStreak({ a: 'good', b: 'good', c: 'rough' }, ['a', 'b', 'c'])).toBe(2)
  })
})

describe('offline conversation', () => {
  it('responds warmly to loneliness instead of listing features', () => {
    const r = answerLocally('i miss my grandchildren i am a little bored what should i do?')
    expect(r.reply).toMatch(/call/i)
    expect(r.reply).not.toMatch(/three things/i)
  })
  it('says honestly why it cannot chat when the AI is unreachable', () => {
    expect(answerLocally('can you check my spelling', 'unavailable').reply).toMatch(/trouble connecting/i)
    expect(answerLocally('can you check my spelling', 'no-internet').reply).toMatch(/no internet|there is none/i)
  })
})
