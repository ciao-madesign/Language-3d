import { tokenize } from './tokenizer.js';

let chunks = [];
let index = 0;

export function setCorpus(newChunks) {
  chunks = newChunks;
  index = 0;
}

export function stepCorpus(store, onUpdate) {
  if (!chunks.length) return;

  const text = chunks[index];
  index = (index + 1) % chunks.length;

  const tokens = tokenize(text);

  store.decay();
  store.update(tokens);

  onUpdate(tokens);
}
