export function computeCentrality(graph) {
  const result = [];

  graph.nodes.forEach(node => {
    let score = 0;

    node.links.forEach(id => {
      const keyA = `${node.id}|${id}`;
      const keyB = `${id}|${node.id}`;

      const w =
        graph.edges.get(keyA) ||
        graph.edges.get(keyB) ||
        0;

      score += w;
    });

    node.centrality = score;
    result.push(node);
  });

  return result.sort((a, b) => b.centrality - a.centrality);
}
