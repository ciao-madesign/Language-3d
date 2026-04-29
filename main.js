import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// ===== DATA =====
const languages = {
  Italiano:{M:0.8,C:0.5,R:0.7,F:0.6,Rec:0.6,Reg:0.7,Red:0.5,Amb:0.5,Ph:0.5,Inf:0.5},
  Inglese:{M:0.6,C:0.4,R:0.8,F:0.7,Rec:0.6,Reg:0.5,Red:0.4,Amb:0.7,Ph:0.7,Inf:0.6},
  Tedesco:{M:0.5,C:0.8,R:0.7,F:0.5,Rec:0.7,Reg:0.6,Red:0.6,Amb:0.4,Ph:0.8,Inf:0.6},
  Giapponese:{M:0.7,C:0.6,R:0.6,F:0.4,Rec:0.7,Reg:0.8,Red:0.5,Amb:0.3,Ph:0.4,Inf:0.5},
  Arabo:{M:0.9,C:0.7,R:0.8,F:0.6,Rec:0.7,Reg:0.5,Red:0.7,Amb:0.6,Ph:0.7,Inf:0.7}
};

let V = {...languages.Italiano};

// ===== UI =====
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
    const d=document.createElement("div");
    const label=document.createElement("label");
    label.textContent = `${labelsMap[k]} (${V[k].toFixed(2)})`;

    const input=document.createElement("input");
    input.type="range";
    input.value=V[k];
    input.disabled=true;

    d.appendChild(label);
    d.appendChild(input);
    slidersDiv.appendChild(d);
  });
}

select.onchange=()=>{
  V={...languages[select.value]};
  createSliders();
  rebuildSystem();
};

createSliders();

// ===== THREE =====
const renderer = new THREE.WebGLRenderer({canvas:document.getElementById("c"), antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.z = 12;

const controls = new OrbitControls(camera, renderer.domElement);

// ===== SYSTEM =====
let group = new THREE.Group();
scene.add(group);

function rebuildSystem(){
  scene.remove(group);
  group = new THREE.Group();

  const nodeCount = Math.floor(50 + V.C * 350);
  const clusters = Math.floor(1 + V.Rec * 6);
  const spread = 3 * (1 - V.Inf);

  const nodes = [];

  for(let c=0;c<clusters;c++){
    const center = new THREE.Vector3(
      (Math.random()-0.5)*spread,
      (Math.random()-0.5)*spread,
      (Math.random()-0.5)*spread
    );

    const localCount = Math.floor(nodeCount / clusters);

    for(let i=0;i<localCount;i++){
      let pos = new THREE.Vector3(
        center.x + (Math.random()-0.5)*(1-V.Ph),
        center.y + (Math.random()-0.5)*(1-V.Ph),
        center.z + (Math.random()-0.5)*(1-V.Ph)
      );

      // simmetria forte
      if(V.Reg > 0.7){
        pos.x = Math.abs(pos.x);
      }

      // ambiguità = caos
      pos.addScalar((Math.random()-0.5)*V.Amb*2);

      nodes.push(pos);
    }
  }

  // ===== NODI =====
  const sphereGeo = new THREE.SphereGeometry(0.05 + V.Ph*0.05, 8, 8);
  const mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color().setHSL(V.M,0.6,0.5)
  });

  nodes.forEach(p=>{
    const m = new THREE.Mesh(sphereGeo, mat);
    m.position.copy(p);
    group.add(m);
  });

  // ===== LEGAMI =====
  const lineMat = new THREE.LineBasicMaterial({color:0xffffff, transparent:true, opacity:0.4});

  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const d = nodes[i].distanceTo(nodes[j]);

      // soglia dipende da flessibilità e ridondanza
      if(d < 0.6 + V.F*0.5){
        const geo = new THREE.BufferGeometry().setFromPoints([nodes[i], nodes[j]]);
        const line = new THREE.Line(geo, lineMat);
        group.add(line);
      }
    }
  }

  // ===== RIDONDANZA = copia cluster =====
  if(V.Red > 0.6){
    const clone = group.clone();
    clone.position.x += 1.5;
    group.add(clone);
  }

  scene.add(group);
}

rebuildSystem();

// ===== LOOP =====
function animate(){
  requestAnimationFrame(animate);

  group.rotation.y += 0.002 + V.M*0.01;

  renderer.render(scene,camera);
}

animate();

// ===== RESIZE =====
window.addEventListener('resize',()=>{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
});
