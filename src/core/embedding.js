const DIM = 32;
const LR = 0.05;

function randomVec() {
  return Array.from({ length: DIM }, () => Math.random() - 0.5);
}

function add(a, b) {
  return a.map((v, i) => v + b[i]);
}

function scale(a, s) {
  return a.map(v => v * s);
}

function normalize(v) {
  const len = Math.sqrt(v.reduce((sum, x) => sum + x * x, 0)) || 1;
  return v.map(x => x / len);
}

function cosine(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-6);
}

export function initEmbedding(node) {
  node.embedding = randomVec();
}

export function updateEmbedding(node, neighbors) {
  if (!node.embedding) initEmbedding(node);

  let agg = new Array(DIM).fill(0);

  neighbors.forEach(n => {
    if (!n.embedding) initEmbedding(n);
    agg = add(agg, n.embedding);
  });

  if (neighbors.length > 0) {
    agg = scale(agg, 1 / neighbors.length);
  }

  // update verso media dei vicini
  node.embedding = normalize(
    add(
      scale(node.embedding, 1 - LR),
      scale(agg, LR)
    )
  );
}

export function similarity(a, b) {
  return cosine(a.embedding, b.embedding);
}
