import * as THREE from 'https://esm.sh/three@0.160.0';
import { computeCentrality } from '../analysis/metrics.js';

let meshGroup = new THREE.Group();
let initialized = false;

export function renderGraph(scene, graph) {
  if (!initialized) {
    scene.add(meshGroup);
    initialized = true;
  }

  meshGroup.clear();

  const ranked = computeCentrality(graph);
  const maxC = ranked[0]?.centrality || 1;

  const nodeGeo = new THREE.SphereGeometry(0.08, 8, 8);

  // ===== NODI =====
  graph.nodes.forEach(n => {
    const intensity = (n.centrality || 0) / maxC;

    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(
        0.6 - intensity * 0.6,
        0.8,
        0.5 + intensity * 0.2
      )
    });

    const m = new THREE.Mesh(nodeGeo, mat);

    // scala hub
    const scale = 1 + intensity * 2;
    m.scale.set(scale, scale, scale);

    m.position.copy(n.pos);
    meshGroup.add(m);
  });

  // ===== EDGE =====
  graph.edges.forEach((weight, key) => {
    const [aId, bId] = key.split("|");

    const a = graph.nodes.get(aId);
    const b = graph.nodes.get(bId);
    if (!a || !b) return;

    const opacity = Math.min(0.6, weight);

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity
    });

    const geo = new THREE.BufferGeometry().setFromPoints([
      a.pos,
      b.pos
    ]);

    const line = new THREE.Line(geo, lineMat);
    meshGroup.add(line);
  });
}
