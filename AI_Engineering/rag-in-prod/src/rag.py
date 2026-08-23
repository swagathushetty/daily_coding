from . import store, retrieve, generate

# ============================================================================
# The RAG pipeline = retrieve → (assemble) → generate. Thin on purpose so the
# tiers live in the focused modules. This wiring is also where TASK 11
# (Observability) belongs.
# ============================================================================


def ask(question, user_audiences=None):
    # 📝 TASK 9 (Access control): pass the CURRENT USER's allowed audiences from
    # your auth layer. Default here simulates a customer who may see only public
    # docs. A staff user would pass ["public", "internal"].
    if user_audiences is None:
        user_audiences = ["public"]

    conn = store.connect()
    try:
        hits = retrieve.retrieve(conn, question, allowed_audiences=user_audiences)

        # ====================================================================
        # 📝 TASK 11 — Observability / tracing
        # ====================================================================
        # ❌ PROBLEM: when an answer is wrong you have NO idea why — which chunks
        #    were retrieved? what distances? what prompt? how many tokens? cost?
        #    latency per stage? Without traces you can't debug or improve RAG.
        # 💡 FIX: emit a structured trace per request — the question, retrieved
        #    chunk ids + distances, the final prompt, model, token usage,
        #    per-stage latency. Tools: Langfuse / LangSmith / Arize (or just
        #    structured logs to start). This is non-negotiable for "in prod".
        # ✅ For now, we return the hits so a caller can inspect them; replace
        #    with real tracing.
        # ====================================================================

        text, usage = generate.answer(question, hits)
        return {"answer": text, "hits": hits, "usage": usage}
    finally:
        conn.close()
