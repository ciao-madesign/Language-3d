function clean(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Split BEFORE cleaning so punctuation is available for sentence detection
function splitSentences(text) {
  return text
    .split(/[.!?\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 20);
}

function chunkify(arr, size = 30) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size).join(" "));
  }
  return out;
}

export async function loadCorpus(url) {
  const res = await fetch(url);
  const text = await res.text();

  // Split first (before cleaning strips punctuation), then clean each sentence
  const sentences = splitSentences(text);
  const limited = sentences.slice(0, 2000);
  const cleaned = limited.map(s => clean(s)).filter(s => s.length > 10);

  return chunkify(cleaned, 30);
}
