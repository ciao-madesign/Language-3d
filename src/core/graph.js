import * as THREE from 'https://esm.sh/three@0.160.0';
import { updateEmbedding, similarity, initEmbedding } from './embedding.js';

export function createGraph() {
  return {
    nodes: new Map(),
    edges: new Map()
  };
}

export function updateGraphFromCorpus(graph, store) {
  const nodes = graph.nodes;

  // ===== CREAZIONE NODI =====
  for (let [token, freq] of store.freq) {
    if (!nodes.has(token)) {
      const node = {
        id: token,
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6
        ),
        vel: new THREE.Vector3(),
        mass: 1 + Math.random(),
        links: new Set(),
        embedding: null
      };

      initEmbedding(node);
      nodes.set(token, node);
    }
  }

  // ===== RESET LINKS =====
  nodes.forEach(n => n.links.clear());
  graph.edges.clear();

  const nodeList = Array.from(nodes.values());

  // ===== UPDATE EMBEDDING (LOCAL) =====
  nodeList.forEach(node => {
    const neighbors = Array.from(node.links)
      .map(id => nodes.get(id))
      .filter(Boolean);

    updateEmbedding(node, neighbors);
  });

  // ===== COSTRUZIONE EDGE SEMANTICI =====
  for (let i = 0; i < nodeList.length; i++) {
    for (let j = i + 1; j < nodeList.length; j++) {
      const a = nodeList[i];
      const b = nodeList[j];

      const sim = similarity(a, b);

      if (sim > 0.75) {
        a.links.add(b.id);
        b.links.add(a.id);

        graph.edges.set(`${a.id}|${b.id}`, sim);
      }
    }
  }

  // ===== RE-UPDATE EMBEDDING DOPO EDGE =====
  nodeList.forEach(node => {
    const neighbors = Array.from(node.links)
      .map(id => nodes.get(id))
      .filter(Boolean);

    updateEmbedding(node, neighbors);
  });
}
