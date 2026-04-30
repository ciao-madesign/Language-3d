import * as THREE from 'https://esm.sh/three@0.160.0';

let meshGroup = new THREE.Group();
let initialized = false;

export function renderGraph(scene, graph) {
  if (!initialized) {
    scene.add(meshGroup);
    initialized = true;
  }

  meshGroup.clear();

  const nodeGeo = new THREE.SphereGeometry(0.08, 8, 8);

  // ===== NODI =====
  graph.nodes.forEach(n => {
    const mat = new THREE.MeshBasicMaterial({
      color: 0x66ccff
    });

    const m = new THREE.Mesh(nodeGeo, mat);
    m.position.copy(n.pos);
    meshGroup.add(m);
  });

  // ===== EDGE =====
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.25
  });

  graph.edges.forEach((weight, key) => {
    const [aId, bId] = key.split("|");

    const a = graph.nodes.get(aId);
    const b = graph.nodes.get(bId);

    if (!a || !b) return;

    const geo = new THREE.BufferGeometry().setFromPoints([
      a.pos,
      b.pos
    ]);

    const line = new THREE.Line(geo, lineMat);
    meshGroup.add(line);
  });
}
