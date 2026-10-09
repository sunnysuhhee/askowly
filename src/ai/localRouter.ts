import { analyzeMessage, VERDICT_TEXT } from '../scam/engine'
import { findMedInText } from '../data/meds'
import type { AskResult, Intent } from './types'

const KEYWORDS: Record<Exclude<Intent, 'other'>, RegExp> = {
  scam: /\b(text(?:ed)?|e-?mail(?:ed)?|message|voicemail|link|scam|package|parcel|bank|gift ?card|prize|won|irs|caller|called me|someone (?:called|texted|emailed)|is this real|suspicious|fraud|toll)\b/i,
  meds: /\b(pill|pills|medicine|medication|meds|tablet|capsule|prescription|pharmacy|drug|dose|refill|side effect|take with|interact)\b/i,
  mobility: /\b(walk(?:ing)?|exercise|stretch|knee|hip|back|balance|fall(?:ing)?|dizzy|stiff|move|moving|legs?|strength|chair|steps|sore|arthritis|joint)\b/i,
}

/** Scores every intent so a message like "a text about my pills" picks the stronger signal. */
export function classify(text: string): Intent {
  const scores = (Object.keys(KEYWORDS) as (keyof typeof KEYWORDS)[]).map((intent) => {
    const matches = text.match(new RegExp(KEYWORDS[intent], 'gi'))
    return { intent, n: matches?.length ?? 0 }
  })
  // A known medicine name is a strong meds signal.
  if (findMedInText(text)) scores.find((s) => s.intent === 'meds')!.n += 2
  // Pasted messages with links are almost always a scam check.
  if (/https?:\/\/|www\.|\.(?:com|top|xyz|ly)\b/i.test(text)) scores.find((s) => s.intent === 'scam')!.n += 2
  // Anything the scam engine finds suspicious is a pasted message to check.
  if (analyzeMessage(text).score >= 2) scores.find((s) => s.intent === 'scam')!.n += 2

  const best = scores.sort((a, b) => b.n - a.n)[0]
  return best.n > 0 ? best.intent : 'other'
}

const SMALL_TALK: [RegExp, string][] = [
  [/^\s*(thanks|thank you|thx|ty)\b/i, 'You are very welcome. I am here any time you want to chat or need a hand.'],
  [/\bhow are you\b/i, 'I am doing well, thank you for asking. How are you feeling today?'],
  [/^\s*(hi|hello|hey|good (morning|afternoon|evening))\b/i, 'Hello! It is nice to hear from you. How is your day going?'],
  [/^\s*(bye|goodbye|good night|see you)\b/i, 'Take care! Come back any time.'],
  [
    /\b(miss(?:ing)? (?:my|the) (?:grand)?(?:kids|children|grandchildren|family|son|daughter)|lonely|alone|bored|nothing to do)\b/i,
    'That sounds hard, and it is a very normal feeling. A short phone or video call can brighten both your days, even just to say hello. You could also write them a little letter, or take a gentle walk and tell them about it later.',
  ],
  [/\b(sad|down|blue|depressed)\b/i, 'I am sorry you are feeling down. It can help to call someone you love, step outside for some fresh air, or do something small you enjoy. If the sad feelings will not go away, your doctor can help too.'],
]

const CANT_CHAT = {
  'no-internet': 'I can only have a full conversation when there is internet, and there is none right now.',
  unavailable: 'I am having trouble connecting right now, so I cannot have a full conversation.',
}

export function answerLocally(text: string, reason: AskResult['offlineReason'] = 'unavailable'): AskResult {
  const result = answerOnDevice(text, reason ?? 'unavailable')
  return { ...result, offlineReason: reason }
}

function answerOnDevice(text: string, reason: NonNullable<AskResult['offlineReason']>): AskResult {
  const intent = classify(text)
  if (intent === 'other') {
    const hit = SMALL_TALK.find(([re]) => re.test(text))
    if (hit) return { intent, source: 'offline', reply: hit[1] }
  }
  switch (intent) {
    case 'scam': {
      const scam = analyzeMessage(text)
      const looksPasted = text.length > 80 || scam.tells.length > 0
      return {
        intent,
        source: 'offline',
        // The result card below shows the assessment, warning signs and next step, so keep this short.
        reply: looksPasted
          ? `I checked this message for you. ${VERDICT_TEXT[scam.verdict].title}. Here is what I found.`
          : 'I can check that for you. Paste or read out the message you got, and I will show you any warning signs.',
        scam: looksPasted ? scam : undefined,
      }
    }
    case 'meds': {
      const med = findMedInText(text)
      return {
        intent,
        source: 'offline',
        medName: med?.name,
        reply: med
          ? `${med.name} is usually used ${med.purpose}. Your pharmacist can tell you more about your own prescription.`
          : 'I can help with your medicines. If you tell me the name on the bottle, I can explain what it is for. If you are not sure what a pill is, your pharmacist can identify it from its color and the letters stamped on it.',
      }
    }
    case 'mobility':
      return {
        intent,
        source: 'offline',
        reply:
          'Gentle movement can help. I have short routines you can do sitting down or holding a chair. If something hurts sharply, swells, or does not get better, please check with your doctor.',
      }
    default:
      return {
        intent: 'other',
        source: 'offline',
        reply: `I am sorry. ${CANT_CHAT[reason]} I can still help with your medicines, moving more safely, or checking if a message is a scam. Please try me again a little later for anything else.`,
      }
  }
}
