import { tokenize } from './tokenizer.js';
import { languages } from './languages.js';

export function startStream(store, getLanguage, onUpdate) {
  setInterval(() => {
    const lang = getLanguage();
    const samples = languages[lang];

    const text =
      samples[Math.floor(Math.random() * samples.length)];

    const tokens = tokenize(text);

    store.decay();
    store.update(tokens);

    onUpdate(tokens);
  }, 500);
}
