import pathlib
from . import embeddings, store

CORPUS_DIR = pathlib.Path(__file__).resolve().parent.parent / "corpus"


def parse_doc(path):
    """Split trivial front-matter (title/audience) from body."""
    text = path.read_text(encoding="utf-8")
    audience, title = "public", path.stem
    if text.startswith("---"):
        _, fm, body = text.split("---", 2)
        for line in fm.strip().splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                k, v = k.strip(), v.strip()
                if k == "audience":
                    audience = v
                elif k == "title":
                    title = v
        text = body.strip()
    return title, audience, text


# ============================================================================
# 📝 TASK 2 — Chunking: the naive splitter below is where retrieval quality goes
#             to die. This is the single highest-leverage fix in most RAG apps.
# ============================================================================
# ❌ PROBLEMS with fixed-size, no-overlap character chunking:
#   1. It cuts mid-sentence / mid-word — a chunk can start "...usiness days after
#      we receive" and lose the subject, so it embeds to the wrong meaning.
#   2. No OVERLAP → a fact that straddles a boundary (e.g. "refunds take 5 to 7
#      business days" split across two chunks) is retrievable from neither.
#   3. Ignores document STRUCTURE — headings, list items, paragraphs carry
#      meaning; slicing every N chars throws that away.
#   4. One size for all doc types.
#
# 💡 FIXES to implement (in rough order of payoff):
#   - Recursive/structure-aware splitting: split on paragraph/heading/sentence
#     boundaries, not raw char counts (LangChain's RecursiveCharacterTextSplitter
#     is the reference; you can hand-roll one).
#   - Add OVERLAP (e.g. 10–20%) so boundary-straddling facts survive.
#   - Tune chunk size (measure! see TASK 10 eval — too big dilutes the
#     embedding, too small loses context). ~200–500 tokens is a common start.
#   - Advanced: "contextual retrieval" — prepend a short doc-level summary to
#     each chunk before embedding so a lonely chunk knows what it's about.
#
# ✅ YOUR TASK: replace naive_chunks() with a structure-aware, overlapping
#    splitter and re-measure retrieval quality with the TASK 10 eval harness.
# ============================================================================
def naive_chunks(text, size=200):
    return [text[i:i + size] for i in range(0, len(text), size)]  # 🐛 the sin


def ingest():
    conn = store.connect()
    dim = embeddings.embedding_dim()
    store.init_schema(conn, dim)

    all_rows = []
    for path in sorted(CORPUS_DIR.glob("*.md")):
        title, audience, text = parse_doc(path)
        chunks = naive_chunks(text)
        vectors = embeddings.embed_texts(chunks)
        for chunk, vec in zip(chunks, vectors):
            all_rows.append((title, audience, chunk, vec))

    store.upsert_chunks(conn, all_rows)
    print(f"ingested {len(all_rows)} chunks from {CORPUS_DIR}")
    conn.close()


if __name__ == "__main__":
    ingest()
