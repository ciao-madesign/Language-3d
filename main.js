import * as THREE from 'https://esm.sh/three@0.160.0';

import { initScene } from './src/viz/scene.js';
import { renderGraph } from './src/viz/renderer.js';

import { createGraph, updateGraphFromCorpus } from './src/core/graph.js';
import { stepPhysics } from './src/core/physics.js';

import { CorpusStore } from './src/data/store.js';
import { startStream } from './src/data/stream.js';

import { updateUI } from './src/ui/panel.js';
import { languages } from './src/data/languages.js';

const canvas = document.getElementById("c");

// ===== SCENE =====
const { scene, camera, renderer, controls } = initScene(canvas);

// ===== LANGUAGE UI =====
const select = document.getElementById("languageSelect");

let currentLang = "Italiano";

Object.keys(languages).forEach(l => {
  const o = document.createElement("option");
  o.value = l;
  o.textContent = l;
  select.appendChild(o);
});

select.value = currentLang;

select.onchange = () => {
  currentLang = select.value;
};

// ===== DATA =====
const store = new CorpusStore();
const graph = createGraph();

// ===== STREAM =====
startStream(
  store,
  () => currentLang,
  () => {
    updateGraphFromCorpus(graph, store);
  }
);

// ===== LOOP =====
function animate() {
  requestAnimationFrame(animate);

  stepPhysics(graph);
  renderGraph(scene, graph);

  controls.update();
  renderer.render(scene, camera);

  updateUI(graph, currentLang);
}

animate();
