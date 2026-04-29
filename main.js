import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// ===== DATASET =====
const languages = {
  Italiano:{M:0.8,C:0.5,R:0.7,F:0.6,Rec:0.6,Reg:0.7,Red:0.5,Amb:0.5,Ph:0.5,Inf:0.5},
  Inglese:{M:0.6,C:0.4,R:0.8,F:0.7,Rec:0.6,Reg:0.5,Red:0.4,Amb:0.7,Ph:0.7,Inf:0.6},
  Tedesco:{M:0.5,C:0.8,R:0.7,F:0.5,Rec:0.7,Reg:0.6,Red:0.6,Amb:0.4,Ph:0.8,Inf:0.6},
  Giapponese:{M:0.7,C:0.6,R:0.6,F:0.4,Rec:0.7,Reg:0.8,Red:0.5,Amb:0.3,Ph:0.4,Inf:0.5},
  Arabo:{M:0.9,C:0.7,R:0.8,F:0.6,Rec:0.7,Reg:0.5,Red:0.7,Amb:0.6,Ph:0.7,Inf:0.7}
};

// fix default (chiave corretta)
let V = {...languages.Italiano};

// ===== UI =====
const select = document.getElementById("language");
const slidersDiv = document.getElementById("sliders");

Object.keys(languages).forEach(l=>{
  const o=document.createElement("option");
  o.value=l;
  o.textContent=l;
  select.appendChild(o);
});

// imposta default selezione
select.value = "Italiano";

function createSliders(){
  slidersDiv.innerHTML="";
  Object.keys(V).forEach(k=>{
    const label=document.createElement("label");
    label.textContent=k;

    const input=document.createElement("input");
    input.type="range";
    input.min=0;
    input.max=1;
    input.step=0.01;
    input.value=V[k];

    input.oninput=()=>V[k]=parseFloat(input.value);

    slidersDiv.appendChild(label);
    slidersDiv.appendChild(input);
  });
}

select.onchange=()=>{
  V={...languages[select.value]};
  createSliders();
  rebuildOrbits();
};

createSliders();

// ===== COLOR =====
function getColor() {
  const h = V.M;
  const s = 0.4 + V.C * 0.6;
  const l = 0.3 + V.R * 0.4;
  const color = new THREE.Color();
  color.setHSL(h, s, l);
  return color;
}

// ===== THREE =====
const canvas = document.getElementById("c");

const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ===== SHADER =====
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color(0x66ccff) }
  },
  vertexShader: `
    uniform float time;
    varying vec3 vNormal;

    void main() {
      vNormal = normal;
      vec3 pos = position + normal * sin(position.x * 5.0 + time) * 0.1;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    varying vec3 vNormal;

    void main() {
      float intensity = dot(normalize(vNormal), vec3(0.0,0.0,1.0));
      gl_FragColor = vec4(color * intensity, 1.0);
    }
  `
});

const geo = new THREE.IcosahedronGeometry(1, 64);
const sphere = new THREE.Mesh(geo, material);
scene.add(sphere);

// luce
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(5,5,5);
scene.add(light);

// orbite
const orbitGroup = new THREE.Group();
scene.add(orbitGroup);

function rebuildOrbits(){
  orbitGroup.clear();

  const count = Math.floor(3 + (V.C + V.Rec) * 5);

  for(let i=0;i<count;i++){
    const g = new THREE.TorusGeometry(1.5+i*0.2,0.01,16,100);
    const m = new THREE.MeshBasicMaterial({color:0xffffff});
    const ring = new THREE.Mesh(g,m);

    ring.rotation.x = Math.random()*Math.PI;
    ring.rotation.y = Math.random()*Math.PI;

    orbitGroup.add(ring);
  }
}

rebuildOrbits();

// ===== ANIMATE =====
let t = 0;

function animate(){
  requestAnimationFrame(animate);

  t += 0.01;

  material.uniforms.time.value = t;
  material.uniforms.color.value = getColor();

  sphere.rotation.y += 0.01;
  orbitGroup.rotation.y += 0.01;

  controls.update();

  renderer.render(scene,camera);
}

animate();

// ===== RESIZE =====
window.addEventListener('resize',()=>{
  const w = window.innerWidth;
  const h = window.innerHeight;

  camera.aspect = w/h;
  camera.updateProjectionMatrix();

  renderer.setSize(w,h);
});
