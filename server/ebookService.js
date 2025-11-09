// ebookService - placeholder stub matching service contract
// Minimal implementation returning the canonical out_envelope shape.

function buildContent(prompt) {
  const title = `eBook: ${String(prompt || "")
    .split(/\s+/)
    .slice(0, 6)
    .join(" ")}`;
  const body = `eBook generated content for prompt: ${prompt}`;
  return { title, body, layout: "ebook-mock" };
}

function makePages(content, n = 5) {
  return Array.from({ length: n }).map((_, i) => ({
    title: `${content.title} — Chapter ${i + 1}`,
    body: `${content.body}\n\nChapter ${i + 1} content...`,
    layout: content.layout,
  }));
}

async function generateFromPrompt(prompt) {
  const content = buildContent(prompt);
  const copies = makePages(content, 5);
  const metadata = { model: "ebook-mock", pages: copies.length };
  return { content, copies, metadata };
}

async function handle(payload) {
  const prompt =
    typeof payload === "string" ? payload : (payload && payload.prompt) || "";
  const result = await generateFromPrompt(prompt);
  const out_envelope = {};
  out_envelope.pages = (result.copies || []).map((c, idx) => ({
    id: `p${idx + 1}`,
    title: c.title,
    blocks: [{ type: "text", content: c.body }],
  }));
  out_envelope.metadata = result.metadata || {};
  out_envelope.actions = {};
  return { out_envelope, metadata: result.metadata };
}

module.exports = { generateFromPrompt, buildContent, makePages, handle };
