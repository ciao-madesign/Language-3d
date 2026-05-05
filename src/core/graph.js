import * as THREE from 'https://esm.sh/three@0.160.0';
import { updateEmbedding, similarity, initEmbedding } from './embedding.js';

const MAX_NODES = 60;
const MAX_EDGES_PER_NODE = 5;

export function createGraph() {
  return {
    nodes: new Map(),
    edges: new Map()
  };
}

export function updateGraphFromCorpus(graph, store) {
  const nodes = graph.nodes;

  for (let [token, freq] of store.freq) {
    if (!nodes.has(token)) {
      const node = {
        id: token,
        freq,
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ),
        vel: new THREE.Vector3(),
        mass: 1,
        links: new Set(),
        embedding: null
      };

      initEmbedding(node);
      nodes.set(token, node);
    } else {
      nodes.get(token).freq = freq;
    }
  }

  const sorted = Array.from(nodes.values())
    .sort((a, b) => b.freq - a.freq)
    .slice(0, MAX_NODES);

  const allowed = new Set(sorted.map(n => n.id));

  nodes.forEach((_, id) => {
    if (!allowed.has(id)) nodes.delete(id);
  });

  const nodeList = Array.from(nodes.values());

  // Update embeddings using CURRENT links before clearing (fixes training order)
  nodeList.forEach(node => {
    const neighbors = Array.from(node.links)
      .map(id => nodes.get(id))
      .filter(Boolean);
    updateEmbedding(node, neighbors);
  });

  nodes.forEach(n => n.links.clear());
  graph.edges.clear();

  // Build edges from co-occurrence (words that appear together in context)
  for (let [key, count] of store.cooc) {
    if (count < 0.3) continue;
    const [aId, bId] = key.split("|");
    const a = nodes.get(aId);
    const b = nodes.get(bId);
    if (!a || !b) continue;

    const weight = Math.min(1, count / 5);
    a.links.add(bId);
    b.links.add(aId);
    graph.edges.set(`${aId}|${bId}`, weight);
  }

  // Supplement with embedding-similarity edges
  nodeList.forEach(a => {
    if (a.links.size >= MAX_EDGES_PER_NODE) return;

    const sample = [];
    for (let i = 0; i < 10; i++) {
      const b = nodeList[Math.floor(Math.random() * nodeList.length)];
      if (b && b !== a && !a.links.has(b.id)) sample.push(b);
    }

    const ranked = sample
      .map(b => ({ b, sim: similarity(a, b) }))
      .sort((x, y) => y.sim - x.sim)
      .slice(0, MAX_EDGES_PER_NODE - a.links.size);

    ranked.forEach(({ b, sim }) => {
      if (sim > 0.1) {
        a.links.add(b.id);
        b.links.add(a.id);
        graph.edges.set(`${a.id}|${b.id}`, sim);
      }
    });
  });
}
