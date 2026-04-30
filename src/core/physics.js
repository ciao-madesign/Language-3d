import * as THREE from 'https://esm.sh/three@0.160.0';

export function stepPhysics(graph) {
  const nodes = Array.from(graph.nodes.values());

  const kRepel = 0.06;
  const kSpring = 0.025;
  const damping = 0.9;

  nodes.forEach(a => {
    let force = new THREE.Vector3();

    // ===== REPULSIONE =====
    nodes.forEach(b => {
      if (a === b) return;

      const dir = new THREE.Vector3().subVectors(a.pos, b.pos);
      const dist = Math.max(dir.length(), 0.2);

      force.add(dir.normalize().multiplyScalar(kRepel / (dist * dist)));
    });

    // ===== SPRING (SEMANTICO) =====
    a.links.forEach(id => {
      const b = graph.nodes.get(id);
      if (!b) return;

      const dir = new THREE.Vector3().subVectors(b.pos, a.pos);
      const dist = dir.length();

      force.add(dir.normalize().multiplyScalar(kSpring * (dist - 1.5)));
    });

    // ===== INTEGRAZIONE =====
    a.vel.add(force.divideScalar(a.mass));
    a.vel.multiplyScalar(damping);
    a.pos.add(a.vel);
  });
}
