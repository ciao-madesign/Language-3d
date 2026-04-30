import * as THREE from 'https://esm.sh/three@0.160.0';

export function createGraph(n = 50) {
  const nodes = [];

  for (let i = 0; i < n; i++) {
    nodes.push({
      id: i,
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      ),
      vel: new THREE.Vector3(),
      mass: 1 + Math.random() * 2,
      links: []
    });
  }

  // random sparse connections
  nodes.forEach(n => {
    nodes.forEach(m => {
      if (n !== m && Math.random() < 0.03) {
        n.links.push(m.id);
      }
    });
  });

  return {
    nodes
  };
}
