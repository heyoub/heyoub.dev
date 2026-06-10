// czap audit, downstream edition — verifies the INSTALLED LiteShip surface.
//
// The @czap/audit engine expects the LiteShip monorepo layout (packages/*),
// so downstream it scans nothing out of the box. We give it that layout:
// every @czap/* package pnpm installed (including transitive ones hidden in
// the .pnpm store) is linked into .czap-audit/packages, and the engine runs
// the full structure/integrity/surface passes against what actually shipped
// to npm. This is the publish gauntlet pointed back at the artifacts — the
// exact class of bug that required the _spine override gets caught here.
//
// Errors fail the build. Warnings/info are reported but don't block.
import { runAuditPasses, liteshipDevopsProfile, withRepoRoot } from '@czap/audit'
import { mkdirSync, rmSync, symlinkSync } from 'node:fs'
import { glob } from 'node:fs/promises'
import { basename, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const auditRoot = resolve(root, '.czap-audit')
const packagesDir = resolve(auditRoot, 'packages')

rmSync(auditRoot, { recursive: true, force: true })
mkdirSync(packagesDir, { recursive: true })

const linked = new Set()
for await (const dir of glob('node_modules/.pnpm/@czap+*/node_modules/@czap/*/', { cwd: root })) {
  const name = basename(dir)
  if (linked.has(name)) continue
  linked.add(name)
  symlinkSync(resolve(root, dir), resolve(packagesDir, name))
}

const result = runAuditPasses(withRepoRoot(liteshipDevopsProfile, auditRoot))
const { error, warning, info } = result.counts

console.log(`czap audit — ${linked.size} installed @czap packages`)
console.log(`  structure: ${result.structure.findings.length}  integrity: ${result.integrity.findings.length}  surface: ${result.surface.findings.length}`)
console.log(`  errors: ${error}  warnings: ${warning}  info: ${info}  suppressed: ${result.suppressed.length}`)

for (const f of result.findings.filter((f) => f.severity === 'error')) {
  console.error(`  [error] ${f.id}: ${f.summary ?? f.title}`)
}

rmSync(auditRoot, { recursive: true, force: true })

if (error > 0) {
  console.error('czap audit FAILED — the installed LiteShip surface is broken.')
  process.exit(1)
}
console.log('czap audit OK — installed LiteShip surface intact.')
