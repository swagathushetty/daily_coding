from . import embeddings, store, config

# ============================================================================
# Retrieval — turn a question into the top-k most relevant chunks.
# The naive version is one embed + one vector search. Several tiers live here.
# ============================================================================


def retrieve(conn, question, k=None, allowed_audiences=None):
    k = k or config.TOP_K

    # ========================================================================
    # 📝 TASK 4 — Hybrid search (lexical + vector)
    # ========================================================================
    # ❌ PROBLEM: pure vector search misses EXACT tokens. Ask "what does HTTP 429
    #    mean?" and semantic search may rank fluffy paragraphs above the one line
    #    that literally says "429", because embeddings blur exact terms (codes,
    #    SKUs, names, numbers).
    # 💡 FIX: combine dense (vector) with lexical (Postgres full-text / BM25),
    #    then fuse the rankings (Reciprocal Rank Fusion is simple and strong).
    #    Add the tsvector column from store.py TASK 4, query both, merge.
    # ========================================================================

    # ========================================================================
    # 📝 TASK 3b — Query transformation
    # ========================================================================
    # ❌ PROBLEM: the user's raw phrasing is embedded as-is. Short, vague, or
    #    multi-part questions retrieve poorly. "is it free and how long?" mixes
    #    shipping cost + delivery time — one embedding can't be near both.
    # 💡 FIXES: query rewriting/expansion, multi-query (generate N paraphrases,
    #    retrieve for each, union), HyDE (embed a hypothetical answer), and
    #    decomposition (split multi-part questions). Implement multi-query first.
    # ========================================================================

    q_vec = embeddings.embed_texts([question])[0]

    # 🐛 TASK 9 (Access control): allowed_audiences is accepted but IGNORED —
    # store.search returns confidential chunks to anyone. Fix by pushing the
    # filter into the SQL (see store.search). Enforce at RETRIEVAL, not in the
    # prompt.
    hits = store.search(conn, q_vec, k)

    # ========================================================================
    # 📝 TASK 4b — Reranking (do after hybrid search)
    # ========================================================================
    # ❌ PROBLEM: vector/lexical scores are cheap approximations of relevance.
    #    The truly best chunk is often at rank 3, not rank 1.
    # 💡 FIX: over-fetch (k*5), then RERANK with a cross-encoder (e.g.
    #    Cohere Rerank, or a local bge-reranker) that scores (query, chunk)
    #    pairs jointly, and keep the top k. This is a cheap, high-impact quality
    #    win most people skip — worth calling out in an interview.
    # ✅ YOUR TASK: fetch more, rerank, trim to k.
    # ========================================================================

    return hits
