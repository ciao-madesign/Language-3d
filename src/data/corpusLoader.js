function clean(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ");
}

function splitSentences(text) {
  return text
    .split(/[.!?]/)
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

  const cleaned = clean(text);
  const sentences = splitSentences(cleaned);

  const limited = sentences.slice(0, 2000);

  return chunkify(limited, 30);
}
