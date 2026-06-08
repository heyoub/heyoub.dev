/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { CzapLocals } from '@czap/astro'

declare global {
  namespace App {
    interface Locals {
      // Injected per-request by czapMiddleware: resolved capability/motion/design
      // tiers + parsed device capabilities from Client Hints / User-Agent.
      czap: CzapLocals
    }
  }
}

export {}
