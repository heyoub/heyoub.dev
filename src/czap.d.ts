import type { CzapLocals } from '@czap/astro'

declare global {
  namespace App {
    interface Locals {
      czap: CzapLocals
    }
  }
}

export {}
