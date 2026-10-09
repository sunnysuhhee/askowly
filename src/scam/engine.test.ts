import { analyzeMessage, extractLinks, rootDomain } from './engine'

const SCAMS: [string, string][] = [
  ['toll text', 'E-ZPass: You have an unpaid toll balance of $4.15. Pay within 24 hours to avoid a late fee: https://ezpass-tolls.top/pay'],
  ['usps redelivery', 'USPS: Your package could not be delivered due to an incomplete address. Update here: usps-redeliver-help.com/track'],
  ['bank lock', 'Wells Fargo ALERT: Your account has been suspended due to unauthorized activity. Reply YES to confirm or call now.'],
  ['paypal lookalike', 'Your payment of $499.99 was approved. If this was not you, visit paypa1-secure.com/refund'],
  ['grandparent', "Grandma it's me, I was in a car accident and I need bail money. Please don't tell mom. Can you send gift cards?"],
  ['irs', 'IRS final notice: a warrant has been issued for your arrest. Pay immediately with Bitcoin to avoid legal action.'],
  ['medicare', 'Medicare: your new card is ready. Confirm your Medicare number and date of birth to receive it.'],
  ['tech support', 'Microsoft Support: virus detected on your computer. Call now and we will connect with AnyDesk to fix it.'],
  ['prize', 'Congratulations! You have won a $1,000 Walmart gift card. Claim your prize: bit.ly/3xYzAb'],
  ['otp', 'Amazon: we need you to share the verification code we just sent to keep your account active.'],
]

const LEGIT: [string, string][] = [
  ['pharmacy ready', 'Your prescription at Main Street Pharmacy is ready for pickup.'],
  ['family', 'Hi Mom, I will be over Sunday around 2 with the kids. Love you!'],
  ['doctor', 'Reminder: you have an appointment with Dr. Patel on Tuesday at 10:30 AM.'],
  ['church', 'Potluck this Saturday at noon in the fellowship hall. Bring a dish if you can.'],
  ['real usps', 'USPS: Your package was delivered. Track at https://www.usps.com/track'],
]

describe('analyzeMessage', () => {
  it.each(SCAMS)('flags %s as a scam', (_, msg) => {
    const r = analyzeMessage(msg)
    expect(r.verdict).toBe('scam')
    expect(r.tells.length).toBeGreaterThan(0)
  })

  it.each(LEGIT)('does not flag %s as a scam', (_, msg) => {
    expect(analyzeMessage(msg).verdict).not.toBe('scam')
  })

  it('quotes the exact phrase it found', () => {
    const r = analyzeMessage('Pay within 24 hours with a gift card')
    expect(r.tells.map((t) => t.quote)).toEqual(expect.arrayContaining(['within 24 hours', 'gift card']))
  })

  it('explains a domain mismatch by naming both sides', () => {
    const r = analyzeMessage('USPS: package held. Visit usps-help.top now')
    const tell = r.tells.find((t) => t.id === 'domain-mismatch')
    expect(tell?.why).toContain('usps-help.top')
    expect(tell?.why).toContain('usps.com')
  })

  it('returns safe for empty input', () => {
    expect(analyzeMessage('   ')).toEqual({ verdict: 'safe', score: 0, tells: [] })
  })
})

describe('link helpers', () => {
  it('extracts hosts from bare and full urls', () => {
    expect(extractLinks('go to https://www.usps.com/track or bit.ly/abc.').map((l) => l.host)).toEqual(['www.usps.com', 'bit.ly'])
  })
  it('skips email addresses', () => {
    expect(extractLinks('write to help@example.com')).toEqual([])
  })
  it('reduces to the root domain', () => {
    expect(rootDomain('www.secure.paypal.com')).toBe('paypal.com')
  })
})
