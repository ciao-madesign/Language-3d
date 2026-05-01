import * as THREE from 'https://esm.sh/three@0.160.0';
import { updateEmbedding, similarity, initEmbedding } from './embedding.js';

const MAX_NODES = 120;
const MAX_EDGES_PER_NODE = 6;

export function createGraph() {
  return {
    nodes: new Map(),
    edges: new Map()
  };
}

export function updateGraphFromCorpus(graph, store) {
  const nodes = graph.nodes;

  // ===== CREA/AGGIORNA NODI =====
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
        mass: 1 + Math.random(),
        links: new Set(),
        embedding: null
      };

      initEmbedding(node);
      nodes.set(token, node);
    } else {
      nodes.get(token).freq = freq;
    }
  }

  // ===== PRUNING NODI =====
  const sorted = Array.from(nodes.values())
    .sort((a, b) => b.freq - a.freq)
    .slice(0, MAX_NODES);

  const allowed = new Set(sorted.map(n => n.id));

  // elimina nodi fuori top
  nodes.forEach((n, id) => {
    if (!allowed.has(id)) nodes.delete(id);
  });

  const nodeList = Array.from(nodes.values());

  // reset
  nodes.forEach(n => n.links.clear());
  graph.edges.clear();

  // ===== EMBEDDING UPDATE =====
  nodeList.forEach(node => {
    const neighbors = Array.from(node.links)
      .map(id => nodes.get(id))
      .filter(Boolean);

    updateEmbedding(node, neighbors);
  });

  // ===== COSTRUZIONE EDGE COMPLETA =====
  let tempEdges = [];

  for (let i = 0; i < nodeList.length; i++) {
    for (let j = i + 1; j < nodeList.length; j++) {
      const a = nodeList[i];
      const b = nodeList[j];

      const sim = similarity(a, b);

      if (sim > 0.65) {
        tempEdges.push({ a, b, sim });
      }
    }
  }

  // ===== EDGE PRUNING (top-K per nodo) =====
  const edgeMap = new Map();

  tempEdges.forEach(e => {
    if (!edgeMap.has(e.a.id)) edgeMap.set(e.a.id, []);
    if (!edgeMap.has(e.b.id)) edgeMap.set(e.b.id, []);

    edgeMap.get(e.a.id).push(e);
    edgeMap.get(e.b.id).push(e);
  });

  edgeMap.forEach((edges, nodeId) => {
    edges
      .sort((a, b) => b.sim - a.sim)
      .slice(0, MAX_EDGES_PER_NODE)
      .forEach(e => {
        const key = `${e.a.id}|${e.b.id}`;
        graph.edges.set(key, e.sim);

        e.a.links.add(e.b.id);
        e.b.links.add(e.a.id);
      });
  });

  // ===== EMBEDDING UPDATE FINALE =====
  nodeList.forEach(node => {
    const neighbors = Array.from(node.links)
      .map(id => nodes.get(id))
      .filter(Boolean);

    updateEmbedding(node, neighbors);
  });
}
