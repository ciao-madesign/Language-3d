import * as THREE from 'https://esm.sh/three@0.160.0';
import { initScene } from './src/viz/scene.js';
import { renderGraph } from './src/viz/renderer.js';

import { createGraph, updateGraphFromCorpus } from './src/core/graph.js';
import { stepPhysics } from './src/core/physics.js';

import { CorpusStore } from './src/data/store.js';
import { startStream } from './src/data/stream.js';

import { updateUI } from './src/ui/panel.js';

const canvas = document.getElementById("c");

// ===== SCENE =====
const { scene, camera, renderer, controls } = initScene(canvas);

// ===== DATA =====
const store = new CorpusStore();
const graph = createGraph();

// ===== STREAM =====
startStream(store, () => {
  updateGraphFromCorpus(graph, store);
});

// ===== LOOP =====
function animate() {
  requestAnimationFrame(animate);

  stepPhysics(graph);
  renderGraph(scene, graph);

  controls.update();
  renderer.render(scene, camera);

  updateUI(graph);
}

animate();
