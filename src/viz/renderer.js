export function renderGraph(scene, graph) {
  meshGroup.clear();

  const geo = new THREE.SphereGeometry(0.08, 8, 8);

  graph.nodes.forEach(n => {
    const mat = new THREE.MeshBasicMaterial({
      color: 0x66ccff
    });

    const m = new THREE.Mesh(geo, mat);
    m.position.copy(n.pos);
    meshGroup.add(m);
  });
}
