# CampaignGen

Describe a product, audience and tone. Get slogans, social posts, an email draft, a media plan and more.

Vite + React + TypeScript + Tailwind on the front end, one Vercel Function (`api/generate.ts`) that calls OpenAI.
No accounts and no database: campaigns are saved in the visitor's own browser.

## Deploy (about 10 minutes)

1. Put this code on GitHub.
2. In Vercel: **Add New → Project**, import the repo, click **Deploy**.
   The site works right away for visitors who paste their own OpenAI key.
3. *(Optional)* To let people use **your** key through a shared access code, add these in
   **Settings → Environment Variables**, then redeploy:
   - `OPENAI_API_KEY` : your key
   - `ACCESS_CODE` : a long random string (16+ characters). Share it only with people you trust.

## Protecting your OpenAI credits

Do these in order of strength:

1. **Don't set `OPENAI_API_KEY` at all.** Visitors must bring their own key, so you can never be charged.
2. **If you do share your key**, make a separate OpenAI project and key just for this site, and
   put a small prepaid balance on it with **auto-reload turned off**. OpenAI stops requests when the
   balance runs out. It is not an instant cutoff, so keep the balance small enough that you're fine losing it.
3. Keep `ACCESS_CODE` long and private. Change it (and redeploy) if it leaks. Wrong guesses are slowed down.
4. Costs per request are capped: input fields have length limits and the model reply is capped at 8000 tokens.
   The default model is the low-cost `gpt-4o-mini`. Set `OPENAI_MODEL` to change it.

## Run locally

```bash
npm install
npm i -g vercel
vercel dev          # front end + /api together
```
Put `OPENAI_API_KEY` and `ACCESS_CODE` in a `.env.local` file (see `.env.example`) to test shared access.

## Checks

```bash
npm run check       # TypeScript
npm run build
npm run test:api    # 24 checks: key selection, wrong codes, cost caps, error handling (no network needed)
```

## Notes

- Generation can take a while. `vercel.json` allows up to 300 seconds. If Vercel rejects that for your plan, use 60.
- Saved campaigns don't sync between devices, and clearing browser data removes them.
- The visitor's own API key is kept only for the current browser tab and is never stored on the server.
