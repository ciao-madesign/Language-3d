import * as THREE from 'https://esm.sh/three@0.160.0';

const TARGET_RADIUS = 5;

export function stepPhysics(graph) {
  const nodes = Array.from(graph.nodes.values());

  const kRepel = 0.05;
  const kSpring = 0.04;
  const kCenter = 0.01;
  const damping = 0.9;

  nodes.forEach(a => {
    let force = new THREE.Vector3();

    for (let i = 0; i < 10; i++) {
      const b = nodes[Math.floor(Math.random() * nodes.length)];
      if (a === b) continue;

      const dir = new THREE.Vector3().subVectors(a.pos, b.pos);
      const dist = Math.max(dir.length(), 0.3);

      force.add(dir.normalize().multiplyScalar(kRepel / (dist * dist)));
    }

    a.links.forEach(id => {
      const b = graph.nodes.get(id);
      if (!b) return;

      const dir = new THREE.Vector3().subVectors(b.pos, a.pos);
      const dist = dir.length();

      force.add(dir.normalize().multiplyScalar(kSpring * (dist - 1.2)));
    });

    force.add(a.pos.clone().multiplyScalar(-kCenter));

    a.vel.add(force.divideScalar(a.mass));
    a.vel.multiplyScalar(damping);
    a.pos.add(a.vel);
  });

  let maxR = 0;

  nodes.forEach(n => {
    const r = n.pos.length();
    if (r > maxR) maxR = r;
  });

  if (maxR > 0) {
    const scale = TARGET_RADIUS / maxR;
    nodes.forEach(n => n.pos.multiplyScalar(scale));
  }
}
