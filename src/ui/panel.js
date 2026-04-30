import { computeCentrality } from '../analysis/metrics.js';

export function updateUI(graph) {
  const el = document.getElementById("insights");

  const ranked = computeCentrality(graph);

  const top = ranked.slice(0, 5);

  const avgLinks =
    ranked.reduce((acc, n) => acc + n.links.size, 0) /
    (ranked.length || 1);

  const entropy = computeEntropy(graph);

  el.innerHTML = `
    <b>Nodes:</b> ${ranked.length}<br/>
    <b>Avg links:</b> ${avgLinks.toFixed(2)}<br/>
    <b>Entropy:</b> ${entropy.toFixed(2)}<br/>
    <hr/>
    <b>Top hubs:</b><br/>
    ${top.map(n =>
      `${n.id} (${n.centrality.toFixed(2)})`
    ).join("<br/>")}
  `;
}

function computeEntropy(graph) {
  let sum = 0;

  graph.edges.forEach(w => {
    if (w > 0) {
      sum += -w * Math.log(w);
    }
  });

  return sum;
}
