import type { ScamResult } from '../scam/engine'
import type { ChatErrorCode } from './answer'

export type Intent = 'meds' | 'mobility' | 'scam' | 'other'

export interface AskResult {
  intent: Intent
  reply: string
  /** 'ai' when the online AI (Gemini) answered, 'offline' when the on-device fallback did. */
  source: 'ai' | 'offline'
  /** Why we answered on-device: no internet, or the AI helper could not be reached. */
  offlineReason?: 'no-internet' | 'unavailable'
  /** Sanitized reason the AI helper failed (missing key, timeout, ...). Shown only in development. */
  diagnostic?: ChatErrorCode
  scam?: ScamResult
  medName?: string
}

/** One line of the chat. Assistant turns keep the result that drives buttons and scam cards. */
export type ChatTurn =
  | { role: 'user'; text: string }
  | { role: 'assistant'; text: string; result: AskResult; about: string }
