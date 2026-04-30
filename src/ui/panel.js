export function updateUI(graph) {
  const el = document.getElementById("insights");

  const nodes = graph.nodes.length;

  let avgLinks =
    graph.nodes.reduce((acc, n) => acc + n.links.length, 0) / nodes;

  el.innerHTML = `
    Nodes: ${nodes}<br/>
    Avg links: ${avgLinks.toFixed(2)}<br/>
    Status: dynamic graph active
  `;
}
