/** Common scams targeting older adults right now, with an example and how to spot them. */
export interface ScamCard {
  id: string
  title: string
  how: string
  example: string
  spotIt: string[]
  doThis: string
}

export const SCAM_LIBRARY_UPDATED = 'September 2026'

export const SCAM_LIBRARY: ScamCard[] = [
  {
    id: 'toll', title: 'Unpaid toll text',
    how: 'A text says you owe a small toll and must pay today or get a fine.',
    example: 'E-ZPass: You have an unpaid toll of $4.15. Pay within 24 hours to avoid a late fee: ezpass-tolls.top/pay',
    spotIt: ['The link does not go to the real toll website', 'It rushes you with a deadline', 'Small amounts make you less careful'],
    doThis: 'Do not tap the link. Check your account on the official toll website or call the number on your bill.',
  },
  {
    id: 'package', title: 'Missed package delivery',
    how: 'A text claims a delivery failed and asks you to "update your address" or pay a small fee.',
    example: 'USPS: Your package is on hold due to an incomplete address. Update here: usps-redeliver-help.com',
    spotIt: ['The post office does not text you links unless you signed up', 'The web address is not usps.com'],
    doThis: 'Go to usps.com yourself and type in your tracking number, if you have one.',
  },
  {
    id: 'grandparent', title: 'Grandchild in trouble',
    how: 'Someone calls or texts pretending to be a grandchild who needs bail or hospital money, and begs you not to tell anyone.',
    example: "Grandma it's me. I was in a car accident and need bail money. Please don't tell Mom.",
    spotIt: ['They ask you to keep it secret', 'They want gift cards, wire transfers, or cash picked up', 'The voice may sound right; scammers can fake voices'],
    doThis: 'Hang up. Call your grandchild or their parents on a number you already know. Agree on a family code word.',
  },
  {
    id: 'medicare', title: 'Medicare card or benefits call',
    how: 'A caller says you need a new Medicare card or have a refund, and asks for your Medicare number.',
    example: 'Medicare: your new card is ready. Confirm your Medicare number and date of birth to receive it.',
    spotIt: ['Medicare will not call you to ask for your number', 'Offers of "free" equipment or tests in exchange for your number'],
    doThis: 'Hang up. Call 1-800-MEDICARE (1-800-633-4227) if you have questions.',
  },
  {
    id: 'tech', title: 'Fake tech support',
    how: 'A pop-up or call says your computer has a virus and gives a number to call. They ask to control your computer.',
    example: 'Microsoft Support: virus detected! Call now and we will connect with AnyDesk to fix it.',
    spotIt: ['Real companies do not put phone numbers in warning pop-ups', 'They ask you to install a program like AnyDesk or TeamViewer', 'They ask for payment by gift card'],
    doThis: 'Close the browser, or turn the computer off and on. Never let a stranger control your computer.',
  },
  {
    id: 'bank', title: 'Bank fraud alert',
    how: 'A text says your account is locked or there is a strange charge, and asks you to reply or call.',
    example: 'Wells Fargo ALERT: Your account has been suspended. Reply YES to confirm or call now.',
    spotIt: ['Banks will not ask for your PIN or a code by text', '"Reply YES" texts are often used to find active numbers'],
    doThis: 'Call the number on the back of your bank card. Do not use any number in the message.',
  },
  {
    id: 'irs', title: 'IRS or government threat',
    how: 'A caller says you owe taxes and will be arrested unless you pay right now.',
    example: 'IRS final notice: a warrant has been issued for your arrest. Pay immediately with Bitcoin.',
    spotIt: ['The IRS sends letters first and does not threaten arrest by phone', 'Government agencies never take gift cards or crypto'],
    doThis: 'Hang up. If worried, call the IRS directly at 1-800-829-1040.',
  },
  {
    id: 'prize', title: 'You won a prize',
    how: 'A message says you won a lottery, sweepstakes, or gift card, but you have to pay a fee to collect.',
    example: 'Congratulations! You have won a $1,000 Walmart gift card. Claim your prize: bit.ly/3xYzAb',
    spotIt: ['You cannot win a contest you did not enter', 'Real prizes never require a fee'],
    doThis: 'Delete it. Never pay to receive a prize.',
  },
  {
    id: 'romance', title: 'Online sweetheart',
    how: 'Someone you met online builds a relationship over weeks, then needs money for an emergency or a trip to see you.',
    example: 'I want so much to visit you, my love, but customs is holding my money. Could you send $2,000 by wire?',
    spotIt: ['They always have a reason they cannot meet or video chat', 'They ask for money, often by wire or gift card'],
    doThis: 'Talk to a family member or friend before sending anything. Never send money to someone you have not met.',
  },
  {
    id: 'job', title: 'Easy work-from-home job',
    how: 'An offer for easy money "liking" videos or reshipping packages, which later asks you to pay in.',
    example: 'Earn $300/day from home rating products! Just a small deposit to unlock your account.',
    spotIt: ['Real jobs never ask you to pay to start', 'Pay that sounds too good to be true'],
    doThis: 'Ignore it. Do not send money or your bank details.',
  },
]
