import { CorpusStore } from './src/data/store.js';
import { startStream } from './src/data/stream.js';
import { updateGraphFromCorpus } from './src/core/graph.js';

const store = new CorpusStore();
const graph = createGraph();

startStream(store, () => {
  updateGraphFromCorpus(graph, store);
});
