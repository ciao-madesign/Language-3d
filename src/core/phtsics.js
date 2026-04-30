import * as THREE from 'https://esm.sh/three@0.160.0';

export function stepPhysics(graph) {
  const nodes = graph.nodes;

  const kRepel = 0.05;
  const kSpring = 0.02;
  const damping = 0.92;

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];

    let force = new THREE.Vector3();

    // repulsion
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;

      const b = nodes[j];
      const dir = new THREE.Vector3().subVectors(a.pos, b.pos);
      const dist = Math.max(dir.length(), 0.1);

      dir.normalize().multiplyScalar(kRepel / (dist * dist));
      force.add(dir);
    }

    // springs
    a.links.forEach(id => {
      const b = nodes[id];
      const dir = new THREE.Vector3().subVectors(b.pos, a.pos);
      const dist = dir.length();

      dir.normalize().multiplyScalar(kSpring * (dist - 1.5));
      force.add(dir);
    });

    // integrate
    a.vel.add(force.divideScalar(a.mass));
    a.vel.multiplyScalar(damping);
    a.pos.add(a.vel);
  }
}
