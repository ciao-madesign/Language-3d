export function stepPhysics(graph) {
  const nodes = Array.from(graph.nodes.values());

  const kRepel = 0.05;
  const kSpring = 0.02;
  const damping = 0.9;

  nodes.forEach(a => {
    let force = new THREE.Vector3();

    nodes.forEach(b => {
      if (a === b) return;

      const dir = new THREE.Vector3().subVectors(a.pos, b.pos);
      const dist = Math.max(dir.length(), 0.1);

      force.add(dir.normalize().multiplyScalar(kRepel / (dist * dist)));
    });

    a.links.forEach(id => {
      const b = graph.nodes.get(id);
      if (!b) return;

      const dir = new THREE.Vector3().subVectors(b.pos, a.pos);
      const dist = dir.length();

      force.add(dir.normalize().multiplyScalar(0.02 * (dist - 1.2)));
    });

    a.vel.add(force.divideScalar(a.mass));
    a.vel.multiplyScalar(damping);
    a.pos.add(a.vel);
  });
}
