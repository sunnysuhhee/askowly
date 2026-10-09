import type { Intent } from './types'

/**
 * The JSON shape /api/chat returns. Shared by the server (to validate Gemini's
 * output) and the client (to validate what the server sent back).
 */
export interface ApiAnswer {
  intent: Intent
  reply: string
  med_name?: string
  scam_tells: { title: string; quote: string; why: string }[]
}

/** Why the chat answered on-device instead of through Gemini. Sanitized: no keys, no message text. */
export type ChatErrorCode =
  | 'missing_key'
  | 'invalid_key'
  | 'rate_limited'
  | 'model_unavailable'
  | 'bad_request'
  | 'truncated'
  | 'invalid_response'
  | 'upstream_error'
  | 'timeout'
  | 'backend_unavailable'

const INTENTS: readonly Intent[] = ['meds', 'mobility', 'scam', 'other']

const isText = (v: unknown): v is string => typeof v === 'string'

/** Returns the answer if it matches the schema, otherwise null. */
export function readAnswer(raw: unknown): ApiAnswer | null {
  if (!raw || typeof raw !== 'object') return null
  const a = raw as Record<string, unknown>
  if (!INTENTS.includes(a.intent as Intent) || !isText(a.reply) || a.reply.trim() === '') return null
  if (a.med_name !== undefined && a.med_name !== null && !isText(a.med_name)) return null
  if (!Array.isArray(a.scam_tells)) return null
  const tells = a.scam_tells
  if (!tells.every((t) => t && typeof t === 'object' && isText(t.title) && isText(t.quote) && isText(t.why))) return null
  return {
    intent: a.intent as Intent,
    reply: a.reply,
    med_name: isText(a.med_name) && a.med_name.trim() ? a.med_name : undefined,
    scam_tells: tells.map(({ title, quote, why }) => ({ title, quote, why })),
  }
}
