import * as THREE from 'https://esm.sh/three@0.160.0';

import { initScene } from './src/viz/scene.js';
import { renderGraph } from './src/viz/renderer.js';

import { createGraph, updateGraphFromCorpus } from './src/core/graph.js';
import { stepPhysics } from './src/core/physics.js';

import { CorpusStore } from './src/data/store.js';

import { corpora } from './src/data/corpora.js';
import { loadCorpus } from './src/data/corpusLoader.js';
import { setCorpus, stepCorpus } from './src/data/corpusStream.js';
import { languages } from './src/data/languages.js';

import { updateUI } from './src/ui/panel.js';

const canvas = document.getElementById("c");

// ===== SCENE =====
const { scene, camera, renderer, controls } = initScene(canvas);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===== DATA =====
const store = new CorpusStore();
const graph = createGraph();

// ===== LANGUAGE SELECT =====
const langSelect = document.getElementById("languageSelect");
Object.keys(languages).forEach(lang => {
  const o = document.createElement("option");
  o.value = lang;
  o.textContent = lang;
  langSelect.appendChild(o);
});

function seedFromLanguage(langName) {
  const sentences = languages[langName];
  if (!sentences) return;
  const chunks = [];
  for (let i = 0; i < 40; i++) chunks.push(...sentences);
  setCorpus(chunks);
  store.freq.clear();
  store.cooc.clear();
  graph.nodes.clear();
  graph.edges.clear();
}

const defaultLang = Object.keys(languages)[0];
langSelect.value = defaultLang;
seedFromLanguage(defaultLang);

langSelect.onchange = () => seedFromLanguage(langSelect.value);

// ===== CORPUS SELECT =====
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
  loadBtn.disabled = true;
  loadBtn.textContent = "Loading...";
  try {
    const chunks = await loadCorpus(cfg.url);
    setCorpus(chunks);
    store.freq.clear();
    store.cooc.clear();
    graph.nodes.clear();
    graph.edges.clear();
  } catch (e) {
    console.error("Failed to load corpus:", e);
  }
  loadBtn.disabled = false;
  loadBtn.textContent = "Load";
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
