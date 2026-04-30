const DECAY = 0.995;

export class CorpusStore {
  constructor() {
    this.freq = new Map();
    this.cooc = new Map();
  }

  decay() {
    for (let [k, v] of this.freq) {
      this.freq.set(k, v * DECAY);
    }

    for (let [k, v] of this.cooc) {
      this.cooc.set(k, v * DECAY);
    }
  }

  update(tokens) {
    const unique = [...new Set(tokens)];

    // frequenze
    unique.forEach(t => {
      this.freq.set(t, (this.freq.get(t) || 0) + 1);
    });

    // co-occorrenze
    for (let i = 0; i < unique.length; i++) {
      for (let j = i + 1; j < unique.length; j++) {
        const key = this._pairKey(unique[i], unique[j]);
        this.cooc.set(key, (this.cooc.get(key) || 0) + 1);
      }
    }
  }

  _pairKey(a, b) {
    return a < b ? `${a}|${b}` : `${b}|${a}`;
  }
}
