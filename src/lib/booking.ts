// The three booking slots, and the only place their destinations are written.
//
// Booking runs on Google appointment schedules, whose URLs are opaque hashes
// (`calendar.app.google/Fq5L4L6CkKYqQLQQ8`) that change if a schedule is ever
// regenerated. Nothing public links them directly: every surface points at a
// first-party `/book/<key>`, which 302s here.
//
// That matters more on this site than on most. ContactDecompile RENDERS the
// booking URL as visible text inside a code view whose whole conceit is that
// these are real values — `heyoub.dev/book` reads as one, an appointment hash
// reads as garbage.
//
// This module deliberately imports NOTHING. It is read by the redirect route,
// the chooser UI, and the guards, so the allowlist the router fails closed
// against is DERIVED from the same array the UI renders: a slot cannot exist in
// the chooser and 404 in the router.
//
// The three rows are one sibling set. Onsite has no fixed duration, but it
// FILLS the timing slot ("By request") and carries a note line like the others
// rather than being the member with a different internal treatment.
//
// Kept deliberately in sync with the-fbf's src/lib/booking.ts by hand, not by a
// shared package: two separate repos, two separate deploys, and a guard in each
// pinning its own copy.

export interface BookingSlot {
  /** URL segment: `/book/<key>`. Lowercase, no escaping needed. */
  key: string
  name: string
  /** Always present. Onsite fills it with "By request", never blank. */
  timing: string
  /** The shared second line. Every row has one, so none is the odd sibling. */
  note: string
  /** The Google appointment schedule. Never rendered as a link anywhere public. */
  destination: string
}

export interface BookingCopy {
  /** First-party chooser path. Every CTA points here. */
  path: string
  heading: string
  body: string
  slots: readonly BookingSlot[]
}

export const BOOKING: BookingCopy = {
  path: '/book',
  heading: 'Book time.',
  body: 'Three formats. Intro is the default — the other two are for work already underway.',
  slots: [
    {
      key: 'intro',
      name: 'Intro',
      timing: '30 min',
      note: "The default. Start here if we haven't talked.",
      destination: 'https://calendar.app.google/Fq5L4L6CkKYqQLQQ8',
    },
    {
      key: 'session',
      name: 'Work session',
      timing: '60 min',
      note: "Bring the repo, the spreadsheet, the thing that's breaking.",
      destination: 'https://calendar.app.google/u5F7MVmTZ6BuvsFf6',
    },
    {
      // Not a booking: a request. No fixed length, a phone number is required,
      // and the location is arranged afterwards on a call. The row says so
      // BEFORE the click rather than surprising somebody at the form.
      key: 'onsite',
      name: 'Onsite',
      timing: 'By request',
      note: "Phone required. I'll call to set the place and how long we need.",
      destination: 'https://calendar.app.google/mwetSVnnWCtuC6Pm8',
    },
  ],
}

/** The router's allowlist. Unknown key → undefined → the route fails closed. */
export const bookingSlot = (key: string | undefined): BookingSlot | undefined =>
  BOOKING.slots.find((s) => s.key === key)

export const bookingPath = (key: string): string => `${BOOKING.path}/${key}`
