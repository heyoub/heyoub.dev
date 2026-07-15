// The DNS records heyoub.dev must publish, and WHY each one exists.
//
// Why this file exists: DNS was the last load-bearing fact on this site with no
// owner. Identity lives in identity.ts with a drift test; canonical URLs live in
// url-canonical.ts with unit tests; product facts live in the-fbf's
// product-record.ts with a drift test. DNS lived in a dashboard, was hand-edited,
// and nothing anywhere knew what was supposed to be there.
//
// The cost of that was real and measured. On 2026-07-15 a cleanup that removed one
// malformed record also took `v=MCPv1` and `openai-domain-verification` with it and
// swapped the google-site-verification token. Nothing failed, nothing alerted, and
// the site kept advertising an MCP endpoint whose domain proof no longer resolved.
// A record with no expected-state has no drift; it just quietly becomes wrong.
//
// So: this is the expected state. `scripts/dns-check.mjs` resolves live TXT and
// asserts every REQUIRED record below is present and well-formed. It runs in
// predeploy, so a deploy cannot ship over silently-broken DNS.
//
// This file does NOT publish records — Cloudflare still owns that. It owns the
// ANSWER to "what is supposed to be there", which is the part that was missing.

export type DnsRecordStatus = 'required' | 'retired'

export interface ExpectedTxt {
  /** Short stable id for reporting. */
  readonly id: string
  /** Exact expected TXT string, or a prefix when the tail is an opaque token. */
  readonly value: string
  /** True when `value` is a prefix and only the prefix is asserted. */
  readonly prefixOnly?: boolean
  readonly status: DnsRecordStatus
  /** What breaks if this record is missing. Written for the person at 2am. */
  readonly why: string
  /** Where the authoritative copy of this token can be re-obtained. */
  readonly reissue: string
}

export const APEX = 'heyoub.dev'

// NOTE (2026-07-15): the three CONFIRM-marked entries were observed live on this
// zone earlier the same day, before the cleanup. They are recorded here as
// last-known-good so the values are never lost again — but the architect must
// confirm whether each removal/rotation was INTENTIONAL before treating these as
// canonical. Do not restore a record just because it used to exist.
export const EXPECTED_TXT: readonly ExpectedTxt[] = [
  {
    id: 'spf',
    value: 'v=spf1 include:_spf.google.com ~all',
    status: 'required',
    why: 'Mail sent from hello@heyoub.dev is authenticated by receivers. Without it, mail from this domain lands in spam or is rejected outright.',
    reissue: 'Google Workspace admin — Apps > Google Workspace > Gmail > Authenticate email.',
  },
  {
    id: 'google-site-verification',
    value: 'google-site-verification=',
    prefixOnly: true,
    status: 'required',
    why: 'Proves domain ownership to Google Search Console. Losing it loses Search Console access — which is the ONLY source of real query data for this site, and the input the FAQ copy is waiting on.',
    reissue: 'Search Console > Settings > Ownership verification > DNS record. Token rotated on 2026-07-15 (was UU0dz2AIfkL-E4b7x9tzsfb3Qhp9dO0ZAUoV1NHzy2c, now 4ab6UixYmfpL2UIqq9fWHNmpBBRfz9vdu7JDHH231NM) — CONFIRM the new token is the one Search Console expects.',
  },
  {
    id: 'mcp-identity',
    value: 'v=MCPv1;',
    prefixOnly: true,
    status: 'required',
    why: "The ed25519 domain identity for the MCP server this site advertises in llms.txt and profile.json. Without it, agents cannot verify the endpoint belongs to this domain — the site claims an MCP endpoint whose proof does not resolve.",
    reissue:
      'CONFIRM whether removal on 2026-07-15 was intentional. Last known good: ' +
      '"v=MCPv1; k=ed25519; p=o4EEq73yGckTAWBHTkGT2YvGvONb3qk2Q1qQp8peSIs=". ' +
      'Restoring requires the matching private key — if that is lost, the keypair must be reissued and the TXT republished, not copy-pasted.',
  },
  {
    id: 'openai-domain-verification',
    value: 'openai-domain-verification=',
    prefixOnly: true,
    status: 'required',
    why: 'Proves domain ownership to OpenAI. Required for the domain to be claimed/attributed on their surfaces.',
    reissue:
      'CONFIRM whether removal on 2026-07-15 was intentional. Last known good: ' +
      '"openai-domain-verification=dv-wJ1gBfqyPXaNj3a41ovmdOPX". Reissue from the OpenAI platform domain-verification page.',
  },
]

/** A TXT record that must NEVER reappear, with the reason it was retired. */
export const FORBIDDEN_TXT: readonly { readonly id: string; readonly match: string; readonly why: string }[] = [
  {
    id: 'truncated-google-token',
    match: '…',
    why: 'A google-site-verification value containing a literal ellipsis was published (issue #6) — a copy-paste of TRUNCATED dashboard output, not a real token. It sat live for weeks next to the valid one. Any TXT containing an ellipsis is a paste of elided text and is never a real value.',
  },
]
