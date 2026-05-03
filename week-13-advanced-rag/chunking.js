export function chunkDocument(text, options = {}) {
  const chunkSize = options.chunkSize || 300;
  const overlap = options.overlap || 50;

  if (!text || typeof text !== "string") {
    return [];
  }

  if (chunkSize <= 0) {
    throw new Error("chunkSize must be greater than 0");
  }

  if (overlap < 0 || overlap >= chunkSize) {
    throw new Error("overlap must be greater than or equal to 0 and smaller than chunkSize");
  }

  const chunks = [];
  let start = 0;
  let chunkIndex = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const content = text.slice(start, end).trim();

    if (content) {
      chunks.push({
        chunk_index: chunkIndex,
        content,
        start,
        end,
        length: content.length,
      });

      chunkIndex++;
    }

    if (end === text.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
}