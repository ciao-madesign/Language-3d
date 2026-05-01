export function updateUI(graph, corpusName) {
  const el = document.getElementById("insights");

  const nodes = graph.nodes.size;

  let links = 0;
  graph.nodes.forEach(n => links += n.links.size);

  const avgLinks = links / (nodes || 1);

  el.innerHTML = `
    <b>Corpus:</b> ${corpusName}<br/>
    <hr/>
    <b>Nodes:</b> ${nodes}<br/>
    <b>Avg links:</b> ${avgLinks.toFixed(2)}<br/>
    <b>Status:</b> optimized
  `;
}
