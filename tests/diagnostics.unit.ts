import { test } from 'node:test'
import assert from 'node:assert/strict'
import { consoleSink } from '../src/lib/diagnostics.ts'

const capture = () => {
  const warns: string[] = []
  const errors: string[] = []
  return { warns, errors, warn: (m: string) => warns.push(m), error: (m: string) => errors.push(m) }
}

test('a warn-level diagnostic routes to console.warn with source and code', () => {
  const c = capture()
  consoleSink(c).emit({
    level: 'warn', source: 'boundary', code: 'signal-frozen',
    message: 'scroll.yy will never update', timestamp: 0,
  })
  assert.equal(c.warns.length, 1)
  assert.equal(c.errors.length, 0)
  assert.match(c.warns[0], /boundary/)
  assert.match(c.warns[0], /signal-frozen/)
  assert.match(c.warns[0], /scroll\.yy will never update/)
})

test('an error-level diagnostic routes to console.error, not warn', () => {
  const c = capture()
  consoleSink(c).emit({
    level: 'error', source: 'compiler', code: 'compile-failed',
    message: 'boom', timestamp: 0,
  })
  assert.equal(c.errors.length, 1)
  assert.equal(c.warns.length, 0)
})
