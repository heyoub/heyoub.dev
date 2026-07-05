// IndexNow ping — push the live sitemap's URLs to the IndexNow network
// (Bing, Yandex, DuckDuckGo, Seznam, Naver…). Google does NOT use IndexNow — the
// submitted sitemap covers Google. The payoff is the AI-search channel: ChatGPT
// Search / Copilot / DuckDuckGo retrieve from Bing's index, so IndexNow → Bing is
// the fastest path from "redeployed" to "an LLM can retrieve the new version".
//
// Runs at the end of `pnpm run deploy` (after the site + the {key}.txt are live,
// which IndexNow fetches to verify ownership). Also runnable standalone:
//   pnpm indexnow
const HOST = 'heyoub.dev'
const KEY = 'b0d9940bd9ec509b4c23c756dccc5eb0'
const SITE = `https://${HOST}`

const res0 = await fetch(`${SITE}/sitemap-0.xml`).catch(() => null)
if (!res0?.ok) {
  console.error(`[indexnow] could not fetch ${SITE}/sitemap-0.xml — skipping`)
  process.exit(0) // don't fail a deploy over a discovery hiccup
}
const xml = await res0.text()
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
if (!urls.length) {
  console.error('[indexnow] no <loc> URLs in sitemap — skipping')
  process.exit(0)
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: urls,
  }),
})
// 200/202 accepted · 400 bad body · 403 key invalid · 422 URLs/host mismatch · 429 too many
console.log(`[indexnow] submitted ${urls.length} URLs → HTTP ${res.status} ${res.statusText}`)
if (!res.ok) console.error('[indexnow] non-2xx — check the key file is live at', `${SITE}/${KEY}.txt`)
process.exit(0) // never fail the deploy on an IndexNow hiccup
