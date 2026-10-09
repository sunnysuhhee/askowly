// @vitest-environment node
import handler, { classify, SCHEMA, thinkingLevelFor } from './chat'

// Stand-in for the Gemini SDK: each test sets what interactions.create returns or throws.
const create = vi.fn()
vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    interactions = { create }
  },
}))

function mockRes() {
  const res = {
    code: 0,
    body: undefined as unknown,
    status(c: number) { res.code = c; return res },
    json(b: unknown) { res.body = b; return res },
  }
  return res
}

const hello = { method: 'POST', body: { messages: [{ role: 'user', text: 'hi' }], context: { medNames: [] } } }

async function call(req: unknown = hello) {
  const res = mockRes()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await handler(req as any, res as any)
  return res
}

const completed = (output_text: string) => ({ id: 'i1', status: 'completed', output_text })

/** The shape the SDK throws for an HTTP error (taken from a real invalid-key response). */
function httpError(status: number, reason = '', message = 'test') {
  return Object.assign(new Error(`${status} API error occurred`), {
    name: 'BadRequestError',
    status,
    statusCode: status,
    body: JSON.stringify([{ error: { code: status, message, details: [{ reason }] } }]),
  })
}

const saved = process.env.GEMINI_API_KEY
beforeEach(() => {
  create.mockReset()
  process.env.GEMINI_API_KEY = 'test-key'
})
afterAll(() => {
  process.env.GEMINI_API_KEY = saved
})

describe('api/chat', () => {
  it('returns missing_key when no API key is configured', async () => {
    delete process.env.GEMINI_API_KEY
    const res = await call()
    expect(res.code).toBe(503)
    expect(res.body).toMatchObject({ code: 'missing_key' })
    expect(create).not.toHaveBeenCalled()
  })

  it('rejects a conversation that does not end with the person', async () => {
    const res = await call({ method: 'POST', body: { messages: [] } })
    expect(res.code).toBe(400)
  })

  it('sends the documented Interactions request and returns a validated answer', async () => {
    create.mockResolvedValue(completed(JSON.stringify({ intent: 'other', reply: 'Hello!', scam_tells: [] })))
    const res = await call({
      method: 'POST',
      body: {
        messages: [
          { role: 'user', text: 'hi' },
          { role: 'assistant', text: 'Hello! How is your day?' },
          { role: 'user', text: 'good' },
        ],
        context: { medNames: [] },
      },
    })
    expect(res.code).toBe(200)
    expect(res.body).toEqual({ intent: 'other', reply: 'Hello!', scam_tells: [] })

    const [params, options] = create.mock.calls[0]
    expect(params).toMatchObject({
      model: 'gemini-3.5-flash-lite',
      store: false,
      response_format: { type: 'text', mime_type: 'application/json', schema: SCHEMA },
      generation_config: { thinking_level: 'minimal' },
    })
    expect(params.system_instruction).toContain('You are Owly')
    expect(params.input.map((s: { type: string }) => s.type)).toEqual(['user_input', 'model_output', 'user_input'])
    expect(params.input[0].content[0].text).toContain('<person_says>')
    expect(options).toMatchObject({ maxRetries: 0 })
  })

  it('uses GEMINI_MODEL when set', async () => {
    process.env.GEMINI_MODEL = 'gemini-3.8-flash'
    create.mockResolvedValue(completed(JSON.stringify({ intent: 'other', reply: 'Hi', scam_tells: [] })))
    await call()
    delete process.env.GEMINI_MODEL
    expect(create.mock.calls[0][0]).toMatchObject({ model: 'gemini-3.8-flash', generation_config: { thinking_level: 'low' } })
  })

  it.each([
    ['not JSON', 'Hello there'],
    ['wrong shape', JSON.stringify({ intent: 'weather', reply: 'Hi', scam_tells: [] })],
  ])('returns invalid_response when Gemini sends %s', async (_, text) => {
    create.mockResolvedValue(completed(text))
    const res = await call()
    expect(res.code).toBe(502)
    expect(res.body).toMatchObject({ code: 'invalid_response' })
  })

  it('reports an answer that was cut off', async () => {
    create.mockResolvedValue({ id: 'i1', status: 'incomplete', output_text: '{"intent":' })
    expect((await call()).body).toMatchObject({ code: 'truncated' })
  })

  it.each([
    [httpError(400, 'API_KEY_INVALID', 'API key not valid. Please pass a valid API key.'), 'invalid_key'],
    [httpError(403, 'PERMISSION_DENIED'), 'invalid_key'],
    [httpError(404), 'model_unavailable'],
    [httpError(429, 'RESOURCE_EXHAUSTED'), 'rate_limited'],
    [httpError(400, '', 'Invalid JSON schema'), 'bad_request'],
    [Object.assign(new Error('timed out'), { name: 'RequestTimeoutError' }), 'timeout'],
    // The name the SDK actually threw in a live test.
    [Object.assign(new Error('timed out'), { name: 'APIConnectionTimeoutError' }), 'timeout'],
  ])('maps SDK error %# to %s', async (error, code) => {
    create.mockRejectedValue(error)
    expect((await call()).body).toMatchObject({ code })
  })

  it('retries once when Gemini is briefly overloaded (503)', async () => {
    create
      .mockRejectedValueOnce(httpError(503))
      .mockResolvedValueOnce(completed(JSON.stringify({ intent: 'other', reply: 'Hi', scam_tells: [] })))
    const res = await call()
    expect(res.code).toBe(200)
    expect(create).toHaveBeenCalledTimes(2)
  })

  it('does not retry other errors', async () => {
    create.mockRejectedValue(httpError(429, 'RESOURCE_EXHAUSTED'))
    expect((await call()).body).toMatchObject({ code: 'rate_limited' })
    expect(create).toHaveBeenCalledTimes(1)
  })

  it('picks the lightest thinking level each model accepts', () => {
    expect(thinkingLevelFor('gemini-3.5-flash-lite')).toBe('minimal')
    expect(thinkingLevelFor('gemini-3.8-flash')).toBe('low')
  })

  it('logs the field Google says is invalid, not the conversation', () => {
    expect(classify(httpError(400, '', 'Invalid JSON schema'), 'm')).toEqual([502, 'bad_request', 'Invalid JSON schema'])
  })
})
