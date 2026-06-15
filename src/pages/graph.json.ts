import type { APIRoute } from 'astro'
import { linearizeGraph } from '@czap/core'
import { siteGraph } from '@/lib/graph'

// /graph.json — the site's own DocumentGraph (0.2.0 keystone): the single
// content-addressed IR that the page layout, the scene shader, and the
// build-time OG/video casts all project from. Sealed + validated at build;
// this just reports its shape. The companion to /manifest.json — that's the
// content cast for machines, this is the *structure* cast for machines.
export const GET: APIRoute = () => {
  const order = linearizeGraph(siteGraph)
  const byFamily = siteGraph.nodes.reduce<Record<string, number>>((acc, n) => {
    acc[n.family] = (acc[n.family] ?? 0) + 1
    return acc
  }, {})
  const body = {
    $surface: 'document-graph',
    generatedBy: 'astro + LiteShip (CZAP engine) 0.2.0',
    id: siteGraph.id,
    digest: siteGraph.digest,
    nodes: siteGraph.nodes.length,
    edges: siteGraph.edges.length,
    byFamily,
    order: (order.cycle?.length ?? 0) > 0 ? { acyclic: false, cycle: order.cycle } : { acyclic: true },
    projections: siteGraph.nodes
      .filter((n) => n.family === 'projection')
      .map((n) => ({ name: (n as { keys?: { name?: string } }).keys?.name, target: (n as { target?: string }).target })),
  }
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300', 'x-czap-surface': 'document-graph' },
  })
}
