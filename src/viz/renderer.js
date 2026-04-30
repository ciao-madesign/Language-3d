import * as THREE from 'https://esm.sh/three@0.160.0';

let meshGroup = new THREE.Group();
let initialized = false;

export function renderGraph(scene, graph) {
  if (!initialized) {
    scene.add(meshGroup);
    initialized = true;
  }

  meshGroup.clear();

  const geo = new THREE.SphereGeometry(0.06, 8, 8);
  const mat = new THREE.MeshBasicMaterial({ color: 0x66ccff });

  graph.nodes.forEach(n => {
    const m = new THREE.Mesh(geo, mat);
    m.position.copy(n.pos);
    meshGroup.add(m);
  });
}
