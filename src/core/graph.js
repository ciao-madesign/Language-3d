import * as THREE from 'https://esm.sh/three@0.160.0';
import { updateEmbedding, similarity, initEmbedding } from './embedding.js';

const MAX_NODES = 60;
const MAX_EDGES_PER_NODE = 4;

export function createGraph() {
  return {
    nodes: new Map(),
    edges: new Map()
  };
}

export function updateGraphFromCorpus(graph, store) {
  const nodes = graph.nodes;

  // ===== CREA NODI =====
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

  // ===== PRUNE NODI =====
  const sorted = Array.from(nodes.values())
    .sort((a, b) => b.freq - a.freq)
    .slice(0, MAX_NODES);

  const allowed = new Set(sorted.map(n => n.id));

  nodes.forEach((_, id) => {
    if (!allowed.has(id)) nodes.delete(id);
  });

  const nodeList = Array.from(nodes.values());

  // reset
  nodes.forEach(n => n.links.clear());
  graph.edges.clear();

  // ===== EMBEDDING UPDATE (UNA SOLA VOLTA) =====
  nodeList.forEach(node => {
    updateEmbedding(node, []);
  });

  // ===== EDGE APPROX (NO O(n²)) =====
  nodeList.forEach(a => {
    // campiona pochi nodi
    const sample = [];

    for (let i = 0; i < 10; i++) {
      const b = nodeList[Math.floor(Math.random() * nodeList.length)];
      if (b && b !== a) sample.push(b);
    }

    const ranked = sample
      .map(b => ({ b, sim: similarity(a, b) }))
      .sort((x, y) => y.sim - x.sim)
      .slice(0, MAX_EDGES_PER_NODE);

    ranked.forEach(({ b, sim }) => {
      if (sim > 0.6) {
        a.links.add(b.id);
        b.links.add(a.id);

        graph.edges.set(`${a.id}|${b.id}`, sim);
      }
    });
  });
}
