# Deploy AskOwly on Netlify

Everything is already set up: `netlify.toml` (build settings + page routing) and
`netlify/functions/chat.ts` (runs the Gemini chat at `/api/chat`, same code as `api/chat.ts`).

## Option A: from GitHub (easiest, auto-redeploys on every push)

1. Push this folder to a GitHub repo (or use `sunnysuhhee/askowly` after copying these files in).
2. Go to https://app.netlify.com → **Add new project** → **Import an existing project** → GitHub → pick the repo.
3. Netlify reads `netlify.toml` automatically. Leave build settings as they are
   (build command `npm run build`, publish directory `dist`).
4. Before deploying (or right after), go to **Project configuration → Environment variables** and add:
   - `GEMINI_API_KEY` = your key from https://aistudio.google.com/apikey
   - (optional) `GEMINI_MODEL` = e.g. `gemini-3.8-flash`
5. Click **Deploy**. If you added the key after the first deploy, go to **Deploys → Trigger deploy → Deploy site** so it picks up the key.

## Option B: from your computer with the Netlify CLI

```bash
npm install
npm install -g netlify-cli
netlify login
netlify init                                  # create/link a site
netlify env:set GEMINI_API_KEY your_key_here
netlify deploy --build --prod
```

## Check it works

- Open the site and say "hi" to Owly. A normal reply = the key works.
- If answers say **"Limited mode"**, the key is missing or wrong: recheck the env variable, then redeploy.
- Function logs: Netlify → your site → **Logs → Functions → chat**.

## Notes

- Don't use Netlify Drop (drag-and-drop of `dist`): it can't run the chat function, so Owly would be stuck in limited mode.
- Never commit `.env` or put the key in a `VITE_` variable.
- Favicon / app icons: `public/favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`.
