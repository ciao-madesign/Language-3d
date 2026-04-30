import * as THREE from 'https://esm.sh/three@0.160.0';

export function createGraph() {
  return {
    nodes: new Map(),
    edges: new Map()
  };
}

export function updateGraphFromCorpus(graph, store) {
  const nodes = graph.nodes;

  // crea nodi
  for (let [token, freq] of store.freq) {
    if (!nodes.has(token)) {
      nodes.set(token, {
        id: token,
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5
        ),
        vel: new THREE.Vector3(),
        mass: 1 + Math.random(),
        links: new Set()
      });
    }
  }

  // aggiorna edge (top co-occorrenze)
  graph.edges.clear();

  for (let [pair, val] of store.cooc) {
    if (val < 0.5) continue;

    const [a, b] = pair.split("|");

    if (nodes.has(a) && nodes.has(b)) {
      nodes.get(a).links.add(b);
      nodes.get(b).links.add(a);

      graph.edges.set(pair, val);
    }
  }
}
