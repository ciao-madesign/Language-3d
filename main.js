import * as THREE from 'https://esm.sh/three@0.160.0';

import { initScene } from './src/viz/scene.js';
import { renderGraph } from './src/viz/renderer.js';

import { createGraph, updateGraphFromCorpus } from './src/core/graph.js';
import { stepPhysics } from './src/core/physics.js';

import { CorpusStore } from './src/data/store.js';

import { corpora } from './src/data/corpora.js';
import { loadCorpus } from './src/data/corpusLoader.js';
import { setCorpus, stepCorpus } from './src/data/corpusStream.js';

import { updateUI } from './src/ui/panel.js';

const canvas = document.getElementById("c");

// ===== SCENE =====
const { scene, camera, renderer, controls } = initScene(canvas);

// ===== DATA =====
const store = new CorpusStore();
const graph = createGraph();

// ===== UI =====
const select = document.getElementById("corpusSelect");
const loadBtn = document.getElementById("loadCorpusBtn");

Object.keys(corpora).forEach(k => {
  const o = document.createElement("option");
  o.value = k;
  o.textContent = corpora[k].name;
  select.appendChild(o);
});

let currentCorpus = "wiki";
select.value = currentCorpus;

select.onchange = () => {
  currentCorpus = select.value;
};

loadBtn.onclick = async () => {
  const cfg = corpora[currentCorpus];
  const chunks = await loadCorpus(cfg.url);
  setCorpus(chunks);
};

// ===== LOOP =====
let frame = 0;

function animate() {
  requestAnimationFrame(animate);

  if (frame % 10 === 0) {
    stepCorpus(store, () => {
      updateGraphFromCorpus(graph, store);
    });
  }

  stepPhysics(graph);
  renderGraph(scene, graph);

  controls.update();
  renderer.render(scene, camera);

  updateUI(graph, currentCorpus);

  frame++;
}

animate();
