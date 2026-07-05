import type { APIRoute } from 'astro'
import { heroContent, coreThesisContent, pillars, openToContent, stackPyramid } from '@/data/content'
import { proofPoints } from '@/data/projects'
import { contactConfig } from '@/data/footer'
import { projectManifest } from '@/data/manifest'

// /manifest.json — the machine surface, cast from the same content the
// "decompile" footer renders for humans. Echoes the edge-resolved tier.
export const GET: APIRoute = ({ locals }) => {
  const czap = locals.czap
  const manifest = {
    $schema: 'https://heyoub.dev/manifest.schema.json',
    version: 3,
    generatedBy: 'astro + LiteShip (CZAP engine)',
    identity: {
      name: `${heroContent.name.first} ${heroContent.name.last}`,
      label: heroContent.label,
      thesis: `${heroContent.tagline.before} ${heroContent.tagline.emphasis}${heroContent.tagline.after}`,
      conviction: `${heroContent.quote.regular} ${heroContent.quote.emphasis}`,
      location: contactConfig.status.location,
    },
    principles: pillars.map((p, i) => ({ id: ['attention', 'rent', 'constraints'][i], name: p.label, claim: p.title, summary: p.summary, details: p.details })),
    thesis: {
      headline: `${coreThesisContent.headline.regular} ${coreThesisContent.headline.emphasis}`,
      definition: coreThesisContent.problem.definition,
      truth: `${coreThesisContent.universalTruth.before} ${coreThesisContent.universalTruth.emphasis} ${coreThesisContent.universalTruth.after}`,
    },
    proof: proofPoints.map((p) => ({ principle: p.principle, evidence: p.proof })),
    stack: stackPyramid.map((l) => ({ layer: l.label, hint: l.hint, tech: l.techs.map((x) => x.name) })),
    projects: projectManifest.map((p) => ({ name: p.name, tagline: p.pitch.tagline, blurb: p.pitch.blurb, stack: p.pitch.stack, repo: p.gitUrl, live: p.siteUrl })),
    open_to: { pitch: openToContent.description, services: openToContent.services.map((s) => ({ title: s.title, description: s.description })), lens: openToContent.hook.close },
    contact: { heading: contactConfig.heading, links: contactConfig.links.map((l) => ({ key: l.key, href: l.href })), building: contactConfig.status.building },
    your_session: czap ? { tier: czap.tiers, viewportHint: czap.capabilities.viewportWidth, saveData: czap.capabilities.connection?.saveData ?? false } : null,
  }
  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300', 'x-czap-surface': 'ai-manifest' },
  })
}
