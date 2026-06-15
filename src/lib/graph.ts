// The site as ONE DocumentGraph — the 0.2.0 keystone.
//
// Every adaptive surface on the page already comes from a Boundary (layout,
// card grid, scene mood). 0.2.0 makes those projections of a single
// content-addressed graph: signal → component → projection (css) + poses.
// That graph is what @czap/stage casts to OG cards and the generative video
// clips at build time (graph.ts is the shared source the page AND the video
// agree on — the dual-export proof, made literal for this site).
//
// There is no `Graph.make` builder in 0.2.0 — graphs are hand-assembled node
// records, sealed (content-addressed), then validated. `boundaryNodes` below is
// our local sugar over that. [Upstream finding: a Boundary→node helper would
// remove ~40 lines/boundary of boilerplate; filed against ~/Code/LiteShip.]
import {
  sealNode,
  sealGraph,
  validateGraph,
  CanonicalCbor,
  AddressedDigest,
  projectionKeys,
  Cap,
  HLC,
  type Boundary,
} from '@czap/core'
import type {
  DocumentGraph,
  DocumentGraphEdge,
  DocumentGraphNode,
  SignalNode,
  ComponentNode,
  EntityNode,
  ProjectionNode,
  PoseNode,
  PolicyNode,
  ContentAddress,
  CellMeta,
} from '@czap/core'
import { heroLayout, cardGrid, sceneMood } from './boundaries'
import { MOOD_GLSL } from '@/data/scene-moods'

// Deterministic, clock-free meta → the graph's content address is stable across
// builds, so cached OG/video keyed by `siteGraph.id` survive redeploys.
const ts = HLC.increment(HLC.create('heyoub.dev'), 1)
const meta: CellMeta = { created: ts, updated: ts, version: 1 }

const UNSEALED = '' as ContentAddress

/**
 * Mint the node family for one boundary: a signal, a component (carrying the
 * boundary's thresholds + states), a css projection, an entity, and one pose
 * per state when `poses` is given (numeric bindings → what the video cast
 * renders). Returns sealed nodes + their edges.
 */
function boundaryNodes(
  boundary: Boundary.Shape,
  name: string,
  poses?: Record<string, Record<string, number>>,
): { nodes: DocumentGraphNode[]; edges: DocumentGraphEdge[] } {
  const signal = sealNode<SignalNode>({
    _tag: 'DocGraphSignalNode',
    _version: 1,
    family: 'signal',
    id: UNSEALED,
    meta,
    input: boundary.input as SignalNode['input'],
  })
  const component = sealNode<ComponentNode>({
    _tag: 'DocGraphComponentNode',
    _version: 1,
    family: 'component',
    id: UNSEALED,
    meta,
    name,
    thresholds: boundary.thresholds as ComponentNode['thresholds'],
    // StateName is branded; the boundary's state strings are the real names.
    states: boundary.states as unknown as ComponentNode['states'],
  })
  const entity = sealNode<EntityNode>({
    _tag: 'DocGraphEntityNode',
    _version: 1,
    family: 'entity',
    id: UNSEALED,
    meta,
    components: [component.id],
  })
  const projection = sealNode<ProjectionNode>({
    _tag: 'DocGraphProjectionNode',
    _version: 1,
    family: 'projection',
    id: UNSEALED,
    meta,
    target: 'css',
    sourceRef: component.id,
    keys: projectionKeys(name),
    resultDigest: AddressedDigest.of(CanonicalCbor.encode({ target: 'css', name })),
  })
  const poseNodes: PoseNode[] = poses
    ? Object.entries(poses).map(([state, bindings]) =>
        sealNode<PoseNode>({
          _tag: 'DocGraphPoseNode',
          _version: 1,
          family: 'pose',
          id: UNSEALED,
          meta,
          entityRef: entity.id,
          state: state as unknown as PoseNode['state'],
          bindings,
        }),
      )
    : []

  const nodes: DocumentGraphNode[] = [signal, component, entity, projection, ...poseNodes]
  const edges: DocumentGraphEdge[] = [
    { from: signal.id, to: component.id, type: 'seq' },
    { from: entity.id, to: component.id, type: 'seq' },
    { from: component.id, to: projection.id, type: 'seq' },
    ...poseNodes.map((p) => ({ from: entity.id, to: p.id, type: 'seq' as const })),
  ]
  return { nodes, edges }
}

// heroLayout + cardGrid cast to css (the page / OG layout); sceneMood carries
// the numeric mood poses the video cast renders frames from.
const hero = boundaryNodes(heroLayout, 'hero-grid')
const cards = boundaryNodes(cardGrid, 'card-grid')
const scene = boundaryNodes(sceneMood, 'scene-mood', MOOD_GLSL)

// A capability policy for the scene surface: it wants up to the `gpu` rung and
// grants every rung below it, so the escalation chooser (chooseRung) reports
// the admitted cast targets for a runtime site. Read by /graph.json.
const sceneComponent = scene.nodes.find((n) => n.family === 'component') as ComponentNode
export const scenePolicy: PolicyNode = sealNode<PolicyNode>({
  _tag: 'DocGraphPolicyNode',
  _version: 1,
  family: 'policy',
  id: UNSEALED,
  meta,
  appliesTo: [sceneComponent.id],
  requires: 'gpu',
  grants: Cap.from(['static', 'styled', 'reactive', 'animated', 'gpu']),
  sites: ['browser', 'edge'],
})

const parts = [hero, cards, { nodes: [scenePolicy], edges: [] }, scene]

// Content-addressing means identical nodes collapse to one id (e.g. the
// `viewport.width` signal shared by heroLayout + cardGrid). Dedupe by id so the
// graph carries each node/edge once — the address IS the identity.
const nodesById = new Map<ContentAddress, DocumentGraphNode>()
for (const n of parts.flatMap((p) => p.nodes)) nodesById.set(n.id, n)
const edgesByKey = new Map<string, DocumentGraphEdge>()
for (const e of parts.flatMap((p) => p.edges)) edgesByKey.set(`${e.from}>${e.to}:${e.type}`, e)

export const siteGraph: DocumentGraph = sealGraph({
  _tag: 'DocumentGraph',
  _version: 1,
  meta,
  nodes: [...nodesById.values()],
  edges: [...edgesByKey.values()],
})

// Build-time integrity gate: a dangling edge / malformed node fails the build,
// not the request. Same spirit as the consumer audit.
const check = validateGraph(siteGraph)
if (!check.ok) {
  throw new Error(
    `siteGraph failed validateGraph:\n` + check.errors.map((e) => `  - ${JSON.stringify(e)}`).join('\n'),
  )
}
