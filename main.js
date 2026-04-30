import * as THREE from 'https://esm.sh/three@0.160.0';
import { initScene } from './src/viz/scene.js';
import { createGraph } from './src/core/graph.js';
import { stepPhysics } from './src/core/physics.js';
import { updateUI } from './src/ui/panel.js';

const canvas = document.getElementById("c");

// ===== SCENE =====
const { scene, camera, renderer, controls } = initScene(canvas);

// ===== GRAPH =====
let graph = createGraph(80);

// ===== ANIMATION LOOP =====
function animate() {
  requestAnimationFrame(animate);

  stepPhysics(graph);

  renderGraph(scene, graph);

  controls.update();
  renderer.render(scene, camera);

  updateUI(graph);
}

animate();
