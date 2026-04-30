import { tokenize } from './tokenizer.js';

const SAMPLE_TEXT = [
  "la lingua evolve nel tempo con nuove parole",
  "le reti semantiche cambiano struttura",
  "i sistemi dinamici mostrano comportamenti emergenti",
  "la comunicazione umana è adattiva",
  "i cluster linguistici si formano naturalmente"
];

export function startStream(store, onUpdate) {
  setInterval(() => {
    const text =
      SAMPLE_TEXT[Math.floor(Math.random() * SAMPLE_TEXT.length)];

    const tokens = tokenize(text);

    store.decay();
    store.update(tokens);

    onUpdate(tokens);
  }, 500);
}
