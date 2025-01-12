export async function* streamReader(
  reader: ReadableStreamDefaultReader<Uint8Array>
) {
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    yield decoder.decode(value, { stream: true });
  }
}
