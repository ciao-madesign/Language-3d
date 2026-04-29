import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// ===== DATASET =====
const languages = {
  Italiano:{M:0.8,C:0.5,R:0.7,F:0.6,Rec:0.6,Reg:0.7,Red:0.5,Amb:0.5,Ph:0.5,Inf:0.5},
  Inglese:{M:0.6,C:0.4,R:0.8,F:0.7,Rec:0.6,Reg:0.5,Red:0.4,Amb:0.7,Ph:0.7,Inf:0.6},
  Tedesco:{M:0.5,C:0.8,R:0.7,F:0.5,Rec:0.7,Reg:0.6,Red:0.6,Amb:0.4,Ph:0.8,Inf:0.6},
  Giapponese:{M:0.7,C:0.6,R:0.6,F:0.4,Rec:0.7,Reg:0.8,Red:0.5,Amb:0.3,Ph:0.4,Inf:0.5},
  Arabo:{M:0.9,C:0.7,R:0.8,F:0.6,Rec:0.7,Reg:0.5,Red:0.7,Amb:0.6,Ph:0.7,Inf:0.7}
};

let V = {...languages.Italiano};

// ===== UI (read-only) =====
const select = document.getElementById("language");
const slidersDiv = document.getElementById("sliders");

const labelsMap = {
  M: "Musicalità",
  C: "Complessità",
  R: "Ricchezza lessicale",
  F: "Flessibilità",
  Rec: "Ricorsività",
  Reg: "Regolarità",
  Red: "Ridondanza",
  Amb: "Ambiguità",
  Ph: "Densità fonetica",
  Inf: "Densità informativa"
};

Object.keys(languages).forEach(l=>{
  const o=document.createElement("option");
  o.value=l;
  o.textContent=l;
  select.appendChild(o);
});

select.value = "Italiano";

function createSliders(){
  slidersDiv.innerHTML="";
  Object.keys(V).forEach(k=>{
    const wrapper = document.createElement("div");

    const label=document.createElement("label");
    label.textContent = `${labelsMap[k]} (${V[k].toFixed(2)})`;

    const input=document.createElement("input");
    input.type="range";
    input.min=0;
    input.max=1;
    input.step=0.01;
    input.value=V[k];
    input.disabled = true;

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    slidersDiv.appendChild(wrapper);
  });
}

select.onchange=()=>{
  V={...languages[select.value]};
  createSliders();
  rebuildGeometry();
};

createSliders();

// ===== THREE =====
const canvas = document.getElementById("c");

const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ===== BASE GEOMETRY =====
let baseGeo = new THREE.IcosahedronGeometry(1, 64);

// ===== SEMANTIC TRANSFORM =====
function rebuildGeometry(){

  const geo = baseGeo.clone();
  const pos = geo.attributes.position.array;

  for(let i=0; i<pos.length; i+=3){
    let x = pos[i];
    let y = pos[i+1];
    let z = pos[i+2];

    const len = Math.sqrt(x*x+y*y+z*z);

    // --- SIMMETRIA (Reg)
    if (V.Reg > 0.6){
      x = Math.abs(x);
    }

    // --- RIDONDANZA (Red) → duplicazione ondulata
    const redundancy = Math.sin(x*10*V.Red) * 0.2 * V.Red;

    // --- COMPLESSITÀ (C) → rumore multi asse
    const complexity =
      Math.sin(x*V.C*6) +
      Math.sin(y*V.C*6) +
      Math.sin(z*V.C*6);

    // --- RICORSIVITÀ (Rec) → pattern frattale leggero
    const recursive =
      Math.sin((x+y+z)*V.Rec*8) * 0.2;

    // --- FLESSIBILITÀ (F) → deformazione anisotropa
    x *= 1 + V.F * 0.3;
    y *= 1 - V.F * 0.2;

    // --- AMBIGUITÀ (Amb) → distorsione caotica
    const ambiguity = (Math.random() - 0.5) * V.Amb * 0.3;

    // --- DENSITÀ FONETICA (Ph) → micro superficie
    const phonetic = Math.sin(len * 20 * V.Ph) * 0.05;

    // --- INFORMATIVITÀ (Inf) → compressione
    const infoScale = 1 - V.Inf * 0.3;

    let scale =
      1 +
      complexity * 0.05 +
      recursive +
      redundancy +
      phonetic +
      ambiguity;

    scale *= infoScale;

    pos[i]   = (x/len) * scale;
    pos[i+1] = (y/len) * scale;
    pos[i+2] = (z/len) * scale;
  }

  geo.attributes.position.needsUpdate = true;
  geo.computeVertexNormals();

  sphere.geometry.dispose();
  sphere.geometry = geo;
}

const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.6,
  metalness: 0.1
});

const sphere = new THREE.Mesh(baseGeo, material);
scene.add(sphere);

// ===== LUCI =====
scene.add(new THREE.AmbientLight(0xffffff, 0.7));

const light = new THREE.DirectionalLight(0xffffff, 0.6);
light.position.set(5,5,5);
scene.add(light);

// ===== COLOR =====
function updateColor(){
  const c = new THREE.Color();
  c.setHSL(V.M, 0.5, 0.5);
  material.color = c;
}

// ===== LOOP =====
function animate(){
  requestAnimationFrame(animate);

  sphere.rotation.y += 0.003;

  updateColor();
  controls.update();

  renderer.render(scene,camera);
}

rebuildGeometry();
animate();

// ===== RESIZE =====
window.addEventListener('resize',()=>{
  const w = window.innerWidth;
  const h = window.innerHeight;

  camera.aspect = w/h;
  camera.updateProjectionMatrix();
  renderer.setSize(w,h);
});
