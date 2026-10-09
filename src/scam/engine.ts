/**
 * On-device scam checker. Pure and deterministic, so it works offline and
 * gives the same answer every time in a demo.
 *
 * The verdict matters less than the tells: each one quotes the exact words
 * from the message and explains in one plain sentence why it is a warning
 * sign, so the person learns to spot it on their own next time.
 */

export type Verdict = 'safe' | 'careful' | 'scam'

export interface Tell {
  id: string
  title: string
  quote: string
  why: string
  weight: number
}

export interface ScamResult {
  verdict: Verdict
  score: number
  tells: Tell[]
}

interface PhraseRule {
  id: string
  title: string
  why: string
  weight: number
  pattern: RegExp
}

const PHRASE_RULES: PhraseRule[] = [
  {
    id: 'urgency',
    title: 'It rushes you',
    why: 'Real companies give you time. Scammers want you to act before you stop and think.',
    weight: 2,
    pattern:
      /\b(within (?:the next )?\d+\s*(?:hours?|hrs?|minutes?|mins?)|act (?:now|immediately|fast)|immediately|urgent(?:ly)?|final (?:notice|warning|reminder)|last chance|expires? (?:today|tonight|soon)|right away|as soon as possible|asap)\b/i,
  },
  {
    id: 'threat',
    title: 'It tries to scare you',
    why: 'Threats like a locked account or arrest are meant to make you panic. Real agencies send letters first.',
    weight: 3,
    pattern:
      /\b(suspend(?:ed)?|locked|deactivat(?:ed|ion)|frozen|arrest(?:ed)?|warrant|lawsuit|legal action|police|penalt(?:y|ies)|late fee|disconnect(?:ed)?|unauthori[sz]ed (?:charge|purchase|transaction|activity|login|access))\b/i,
  },
  {
    id: 'payment',
    title: 'It asks for an odd way to pay',
    why: 'No real business or government office asks you to pay with gift cards, wire transfers, or cryptocurrency.',
    weight: 4,
    pattern:
      /\b(gift ?cards?|itunes card|google play card|apple card|steam card|wire (?:transfer|the money)|western union|moneygram|bitcoin|crypto(?:currency)?|zelle|venmo|cash ?app|bitcoin atm)\b/i,
  },
  {
    id: 'secrets',
    title: 'It asks for private information',
    why: 'Your bank, Medicare, and the government already have your details. They never ask for codes, passwords, or your Social Security number by text or email.',
    weight: 4,
    pattern:
      /\b(social security(?: number)?|ssn|verification code|security code|one[- ]time (?:code|password|pin)|passcode|password|pin number|your pin|account number|routing number|card number|cvv|date of birth|medicare (?:number|id))\b/i,
  },
  {
    id: 'confirm-by-reply',
    title: 'It asks you to reply or call back to confirm',
    why: 'A real bank will never ask you to "reply YES" or call a number in a text. Call the number on the back of your card instead.',
    weight: 3,
    pattern: /\b(reply (?:yes|no|y|n|stop|1|2)\b|text back|confirm (?:by|via) (?:text|reply)|call (?:us )?(?:back )?(?:at|now)|press 1)/i,
  },
  {
    id: 'too-good',
    title: 'It sounds too good to be true',
    why: 'You cannot win a prize or lottery you never entered. "Free money" offers are bait.',
    weight: 3,
    pattern:
      /\b(you(?:'ve| have)? won|winner|congratulations|claim your (?:prize|reward|gift)|lottery|sweepstakes|free (?:gift|money|iphone|vacation)|cash prize|refund (?:is )?(?:pending|available|owed))\b/i,
  },
  {
    id: 'secrecy',
    title: 'It asks you to keep it secret',
    why: 'Scammers tell you not to tell family because your family would warn you. That is the biggest red flag of all.',
    weight: 4,
    pattern: /\b(don'?t tell|do not tell|keep (?:this|it) (?:between us|secret|quiet)|don'?t (?:call|tell) (?:mom|dad|anyone|my parents))\b/i,
  },
  {
    id: 'family-emergency',
    title: 'It claims a loved one is in trouble',
    why: 'The "grandchild in trouble" scam is very common. Hang up and call your grandchild or their parents directly on a number you know.',
    weight: 3,
    pattern: /\b(grandma|grandpa|it'?s me,? your|i'?m in (?:jail|trouble|the hospital)|bail (?:money)?|car accident|need money (?:fast|now|urgently)|lost my phone)\b/i,
  },
  {
    id: 'remote-access',
    title: 'It wants to control your computer',
    why: 'Real tech support never calls you first or asks you to install a program so they can "fix" your computer.',
    weight: 4,
    pattern: /\b(virus (?:detected|found)|your computer (?:is|has been) (?:infected|hacked|compromised)|anydesk|teamviewer|remote access|tech(?:nical)? support|microsoft support|apple support)\b/i,
  },
  {
    id: 'delivery',
    title: 'It is about a package you may not expect',
    why: 'Fake "missed delivery" and "unpaid toll" texts are among the most common scams right now. Check the real website yourself instead of tapping the link.',
    weight: 1,
    pattern: /\b(package|parcel|shipment|delivery (?:attempt|failed|issue)|redeliver(?:y)?|unpaid toll|toll (?:balance|fee)|address (?:is )?incomplete|incomplete address|customs fee)\b/i,
  },
]

/** Brands commonly impersonated, mapped to the domains they actually use. */
const BRANDS: Record<string, string[]> = {
  usps: ['usps.com'],
  'post office': ['usps.com'],
  ups: ['ups.com'],
  fedex: ['fedex.com'],
  amazon: ['amazon.com'],
  paypal: ['paypal.com'],
  apple: ['apple.com', 'icloud.com'],
  microsoft: ['microsoft.com'],
  netflix: ['netflix.com'],
  irs: ['irs.gov'],
  medicare: ['medicare.gov'],
  'social security': ['ssa.gov'],
  'wells fargo': ['wellsfargo.com'],
  chase: ['chase.com'],
  'bank of america': ['bankofamerica.com'],
  walmart: ['walmart.com'],
  'e-zpass': ['e-zpassny.com', 'ezpassnj.com', 'e-zpassiag.com'],
  ezpass: ['e-zpassny.com', 'ezpassnj.com', 'e-zpassiag.com'],
}

const SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'ow.ly', 'rb.gy', 'cutt.ly', 'shorturl.at', 't.ly']
const RISKY_TLDS = ['top', 'xyz', 'icu', 'click', 'link', 'live', 'info', 'online', 'site', 'shop', 'buzz', 'cyou', 'vip', 'work', 'rest', 'win']

const URL_RE = /\b((?:https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s)]*)?)/gi

/** Returns the registrable-ish domain: last two labels (good enough for our checks). */
export function rootDomain(host: string): string {
  const parts = host.toLowerCase().replace(/^www\./, '').split('.')
  return parts.slice(-2).join('.')
}

export function extractLinks(text: string): { raw: string; host: string }[] {
  const out: { raw: string; host: string }[] = []
  for (const match of text.matchAll(URL_RE)) {
    const raw = match[1].replace(/[.,!?]+$/, '')
    const host = raw.replace(/^https?:\/\//i, '').split('/')[0].toLowerCase()
    // Skip things like "e.g" or a bare decimal.
    if (!/[a-z]{2,}$/.test(host)) continue
    // Ignore email addresses (handled by the sender, not the link).
    const before = text[(match.index ?? 0) - 1]
    if (before === '@') continue
    out.push({ raw, host })
  }
  return out
}

/** Normalize common look-alike swaps: paypa1 -> paypal, amaz0n -> amazon, rn -> m. */
function deLeet(s: string): string {
  return s.replace(/0/g, 'o').replace(/1/g, 'l').replace(/3/g, 'e').replace(/5/g, 's').replace(/rn/g, 'm')
}

function linkTells(text: string): Tell[] {
  const tells: Tell[] = []
  const lower = text.toLowerCase()
  const links = extractLinks(text)
  const mentioned = Object.keys(BRANDS).filter((b) => new RegExp(`\\b${b}\\b`, 'i').test(lower))

  for (const link of links) {
    const root = rootDomain(link.host)
    const tld = root.split('.').pop() ?? ''

    if (SHORTENERS.includes(root)) {
      tells.push({
        id: 'shortener',
        title: 'The link hides where it really goes',
        quote: link.raw,
        why: 'Short links like this hide the real website. Real companies link to their own name.',
        weight: 2,
      })
      continue
    }

    const officialForMentioned = mentioned.flatMap((b) => BRANDS[b])
    if (officialForMentioned.length > 0 && !officialForMentioned.includes(root)) {
      tells.push({
        id: 'domain-mismatch',
        title: 'The link does not match who it claims to be',
        quote: link.raw,
        why: `The message says it is from ${mentioned[0].toUpperCase()}, but the link goes to "${root}", not ${officialForMentioned[0]}.`,
        weight: 5,
      })
      continue
    }

    // Look-alike of a known brand even when the brand isn't named in the text.
    const label = deLeet(root.split('.')[0])
    const lookalike = Object.entries(BRANDS).find(([brand, domains]) => {
      const brandKey = brand.replace(/\s+/g, '')
      return !domains.includes(root) && label.includes(brandKey) && brandKey.length >= 4
    })
    if (lookalike) {
      tells.push({
        id: 'lookalike',
        title: 'The web address is a look-alike',
        quote: link.raw,
        why: `"${root}" is made to look like ${lookalike[1][0]}, but it is a different website.`,
        weight: 6,
      })
      continue
    }

    if (RISKY_TLDS.includes(tld)) {
      tells.push({
        id: 'risky-tld',
        title: 'The web address ends in an unusual way',
        quote: link.raw,
        why: `Addresses ending in ".${tld}" are cheap to buy and often used by scammers. Banks and the government use .com or .gov.`,
        weight: 2,
      })
    }
  }
  return tells
}

export function analyzeMessage(text: string): ScamResult {
  const trimmed = text.trim()
  if (!trimmed) return { verdict: 'safe', score: 0, tells: [] }

  const tells: Tell[] = []
  for (const rule of PHRASE_RULES) {
    const m = trimmed.match(rule.pattern)
    if (m) tells.push({ id: rule.id, title: rule.title, why: rule.why, weight: rule.weight, quote: m[0] })
  }
  tells.push(...linkTells(trimmed))

  // A trusted name asking for money, codes, or a reply is classic impersonation.
  const brand = Object.keys(BRANDS).find((b) => new RegExp(`\\b${b}\\b`, 'i').test(trimmed))
  const asks = tells.some((t) => ['secrets', 'payment', 'confirm-by-reply'].includes(t.id))
  if (brand && asks) {
    tells.push({
      id: 'impersonation',
      title: 'It uses a trusted name to ask for something',
      quote: trimmed.match(new RegExp(`\\b${brand}\\b`, 'i'))![0],
      why: 'Scammers borrow names you trust, like your bank or Medicare. The real ones would not ask for this in a message.',
      weight: 2,
    })
  }

  // A link plus any pressure tactic is a stronger signal than either alone.
  const hasLink = tells.some((t) => ['domain-mismatch', 'lookalike', 'shortener', 'risky-tld'].includes(t.id))
  const hasPressure = tells.some((t) => ['urgency', 'threat', 'payment', 'secrets'].includes(t.id))
  let score = tells.reduce((sum, t) => sum + t.weight, 0)
  if (hasLink && hasPressure) score += 2

  tells.sort((a, b) => b.weight - a.weight)
  const verdict: Verdict = score >= 6 ? 'scam' : score >= 2 ? 'careful' : 'safe'
  return { verdict, score, tells }
}

export const VERDICT_TEXT: Record<Verdict, { title: string; advice: string }> = {
  scam: {
    title: 'This is very likely a scam',
    advice: 'Do not tap any links, reply, or call any number in it. You can delete it, or send it to your person for a second look.',
  },
  careful: {
    title: 'Be careful with this one',
    advice: 'Something here looks off. Do not tap links. If it claims to be a company, contact them using a number you already trust.',
  },
  safe: {
    title: 'We did not find warning signs',
    advice: 'That does not guarantee it is safe. If it asks for money or private details, check with your person first.',
  },
}
