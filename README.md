# AskOwly

Most technology assumes you already know how to use technology. AskOwly assumes nothing. It helps older adults with the three things they would otherwise call a family member about: **their medicines, moving safely, and "is this text real?"**

One chat box is the front door. Talk to Owly like a friend, or say what's going on ("someone texted me about a package"), and when it fits one of the three areas, Owly points you to the right help.

## Run it

```bash
npm install
# open .env and put your key after GEMINI_API_KEY= (see "Get a free Gemini key")
npm run dev                  # open http://localhost:5173 — the app AND /api/chat
npm test                     # scam engine, router, chat API, client fallback, and rendered UI flows
npm run build                # typecheck + production build + offline service worker
```

`npm run dev` is the whole app: Vite serves the page and also runs `api/chat.ts` at `/api/chat` (see `devApi()` in `vite.config.ts`), so no Vercel CLI is needed locally. The key is read once at startup, so **restart `npm run dev` after adding or changing it**. The terminal says `/api/chat: GEMINI_API_KEY loaded` when it found one. (`npm run preview` serves only the built page, not `/api/chat`.)

### Get a free Gemini key (no billing)

1. Go to <https://aistudio.google.com/apikey> and sign in with a Google account (you must be 18 or older).
2. Click **Create API key**. AI Studio puts it in a default project for you. Don't click anything about billing or "upgrade": without billing, the key stays on the free tier.
3. Copy the key, open `.env`, and paste it after `GEMINI_API_KEY=` (no quotes, no spaces). Save, then restart `npm run dev`.

The chat uses `gemini-3.5-flash-lite` (stable, free tier, Google's fastest) with minimal thinking: in our tests it answered in 1–2 seconds. To try another free model, add e.g. `GEMINI_MODEL=gemini-3.8-flash` to `.env` (smarter, but it took 4–25 seconds and was often overloaded when tested).

**Free-tier limits.** Google doesn't publish fixed free-tier numbers. Your limits are shown at <https://aistudio.google.com/rate-limit>. They apply per project (not per key), and the daily count resets at midnight Pacific time. When a limit is hit, Gemini returns a 429 and Owly answers in limited on-device mode (`rate_limited`) until the quota resets.

**Data on the free tier.** Google's terms for unpaid use say prompts and responses may be used to improve Google products, and human reviewers may read them (disconnected from your account). Google also says: "Do not submit sensitive, confidential, or personal information to the Unpaid Services." Owly sends the conversation and the names of saved medicines, so treat the free tier as fine for demos and testing, not for real people's health details. Paid use (or users in the EEA, Switzerland, or the UK) is not used to improve products. The request sets `store: false`, so Google doesn't keep the conversation for later retrieval. Google's terms also bar services for under-18s and say not to rely on the API for medical advice, which matches Owly's own rules.

### When the chat is in limited mode

Without a working key the chat still answers in a limited on-device mode, and each of those answers is labelled "Limited mode". In development the label also shows the reason, and the browser console and the dev-server terminal log it, without any message text:

| Code | Meaning |
|---|---|
| `missing_key` | No `GEMINI_API_KEY` in `.env` (or in Vercel) |
| `invalid_key` | Google rejected the key (wrong, deleted, or the Gemini API is not enabled for it) |
| `rate_limited` | Free-tier limit reached; try again later (daily limits reset at midnight Pacific) |
| `model_unavailable` | The model ID is not available to this key |
| `bad_request` / `invalid_response` / `truncated` | The request or Gemini's answer was not usable (the terminal says which part) |
| `timeout` | No answer within 30 seconds |
| `backend_unavailable` | `/api/chat` is not running (e.g. `npm run preview`) or the network failed |

**Deploy:** in Vercel go to Project → Settings → Environment Variables and add `GEMINI_API_KEY` for Production (and Preview if you use it), then redeploy, because a running deployment does not pick up new variables. The key is only read server-side in `api/chat.ts` and never ships to the browser. Never give it a `VITE_` prefix, and never commit `.env` (it is in `.gitignore`; only `.env.example` is tracked).

## How it works

| Piece | Where |
|---|---|
| Question box + routing | `src/features/home/AskScreen.tsx`, `src/ai/client.ts` |
| Gemini proxy (structured JSON, safety rules, prompt-injection guard) | `api/chat.ts` |
| On-device fallback router | `src/ai/localRouter.ts` |
| Scam engine (pure, tested) | `src/scam/engine.ts` |
| Medicines: add by name or bottle photo (on-device OCR), reminders, interactions, prices, share | `src/features/meds/` |
| Mobility: feeling check-in, adaptive routines, illustrated steps, daily goal, places | `src/features/mobility/` |
| Design tokens | `src/styles/tokens.css` |

**Offline first.** If there's no signal, the AI call fails, or it takes longer than 30 seconds, the app answers on-device and labels the answer as limited mode. All data ships with the app, and everything the user saves stays in `localStorage`. The service worker caches the app so it opens with no connection at all.

**Scam answers are deterministic.** The on-device engine's warning signs are always shown. When online, Gemini can add extra signs it spots, but it never removes the engine's. Each warning sign quotes the exact words and explains why they matter, so that after a few uses the person catches these on their own.

## Look and feel

Cozy and readable: warm cream paper, parchment cards, espresso ink, butter-yellow buttons, and Owly, a small hand-drawn owl.

- Theme tokens live in `src/styles/tokens.css` (palette, type scale, spacing). Measured contrast is noted beside each color.
- All artwork is SVG in `src/components/art/`: `Owly` (poses: hello, book, stretch, shield, listening), `OwlyFace` (logo), `Book`, `Mug`, `Shield`, `Leaf`, and a matching `Icon` set. One shared filter set (`ArtDefs`) gives every drawing the same slightly uneven outline and a soft crayon grain inside fills, never on text or controls.
- Fonts: Atkinson Hyperlegible for everything, Fredoka only for the logo. Loaded from Google Fonts, cached for offline use, with system fallbacks.

## Design rules (enforced in code)

- Text is 27px by default (about 20pt), with Larger and Largest options. Body text is espresso on light surfaces at 7:1 or better. Yellow is never used as a text color.
- Every tap target is at least 60px tall. No gestures, swipes, hovering, or dragging: every action is a labeled button with a visible focus ring.
- A "Speak" button sits beside each text box (Home, message checker, medicine name). If the browser cannot listen, the app says so and typing still works.
- Never more than three choices at once. `ChoiceGroup` throws in development if given four.
- No jargon. Plain words, about a 6th-grade reading level, and "Read it to me" on every answer.
- Works without service and saves on the device.

## Honest limits

- **Not medical advice.** AskOwly explains what a medicine is generally for. It never gives dosing advice or tells anyone to start, stop, or change a medicine. This is stated in the app and in the AI's instructions.
- **Pharmacy prices are a small sample dataset** (`src/data/pharmacyPrices.ts`, dated). They are not live prices. Replace them with real prices collected from local pharmacies.
- **Places are samples** (`src/data/places.ts`). Replace them with real local spots.
- **Interaction checks cover a curated list** of well-known pairs. They are not a complete database. The app always says to talk to a pharmacist.
- **Reminders work while the app is open** (on screen, out loud, and as a notification if allowed). Browsers can't reliably remind you when the app is closed.
- No accounts and no cloud sync, by design for the demo.
