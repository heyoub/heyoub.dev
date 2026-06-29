import type { APIRoute } from 'astro'
import { linearizeGraph, chooseRung } from '@czap/core'
import { dualExport } from '@czap/stage'
import { siteGraph, scenePolicy } from '@/lib/graph'

// /graph.json — the site's own DocumentGraph (0.2.0 keystone): the single
// content-addressed IR that the page layout, the scene shader, and the casts
// project from. Also surfaces two 0.2.0 primitives honestly:
//   • chooseRung — the escalation chooser's verdict for the scene policy
//   • dualExport — the proof that ONE graph casts to BOTH an Astro page AND a
//     video frame-stream under one shared source digest (no ffmpeg: these are
//     the pure markup/state casts, not the encoded bytes).
export const GET: APIRoute = async () => {
  const order = linearizeGraph(siteGraph)
  const byFamily = siteGraph.nodes.reduce<Record<string, number>>((acc, n) => {
    acc[n.family] = (acc[n.family] ?? 0) + 1
    return acc
  }, {})

  const rung = chooseRung(scenePolicy, 'browser')
  const escalation =
    'error' in rung ? { error: rung.error } : { rung: rung.rung, admittedCasts: [...rung.admittedTargets].sort() }

  // The dual-export proof: one graph → page + video, provably one source.
  const proof = await dualExport(siteGraph)

  const body = {
    $surface: 'document-graph',
    generatedBy: 'astro + LiteShip (CZAP engine) 0.4.0',
    id: siteGraph.id,
    digest: siteGraph.digest,
    nodes: siteGraph.nodes.length,
    edges: siteGraph.edges.length,
    byFamily,
    order: (order.cycle?.length ?? 0) > 0 ? { acyclic: false, cycle: order.cycle } : { acyclic: true },
    projections: siteGraph.nodes
      .filter((n) => n.family === 'projection')
      .map((n) => ({ name: (n as { keys?: { name?: string } }).keys?.name, target: (n as { target?: string }).target })),
    escalation,
    dualExport: {
      sharedSource: proof.sharedSourceDigest,
      casts: [
        { carrier: proof.astro.carrier, address: proof.astro.id },
        { carrier: proof.video.carrier, address: proof.video.id },
      ],
      receipt: proof.receipt.hash,
    },
  }
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300', 'x-czap-surface': 'document-graph' },
  })
}
