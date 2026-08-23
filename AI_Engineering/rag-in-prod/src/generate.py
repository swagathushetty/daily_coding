from . import config

# ============================================================================
# Generation — assemble the prompt from retrieved chunks and call Claude.
# This file is a minefield of production sins. Work the tiers in order.
# ============================================================================


def build_prompt(question, hits):
    # 🐛 TASK 8 (Prompt injection): retrieved chunk text is pasted in RAW and
    # UNDELIMITED, mixed with our instructions. A malicious chunk (see
    # corpus/product-reviews.md) can therefore issue instructions the model
    # obeys. FIXES: (1) clearly delimit untrusted context (XML tags / fenced
    # blocks) and instruct the model that everything inside is DATA, not
    # commands; (2) keep the system instruction authoritative and separate;
    # (3) consider an input/output guard. You cannot 100% prevent injection —
    # you REDUCE blast radius (which is why access control in retrieval, TASK 9,
    # matters: the model can't leak what it never retrieved).
    context = "\n\n".join(h["content"] for h in hits)  # 🐛 raw, undelimited
    return (
        "Answer the customer's question using the context below.\n\n"
        f"Context:\n{context}\n\n"
        f"Question: {question}"
    )
    # 📝 TASK 6 (Groundedness & citations):
    #   - Instruct: "answer ONLY from the context; if the context doesn't
    #     contain the answer, say you don't know" — kills a big class of
    #     hallucinations. Right now the model may answer from parametric memory.
    #   - Ask for CITATIONS (which chunk/doc each claim came from) and return
    #     them to the user — trust + debuggability.


def answer(question, hits):
    # ========================================================================
    # 📝 TASK 6b (Groundedness gate) — if the best hit is too far away
    # (distance above a threshold), the corpus probably doesn't cover this.
    # Prefer an honest "I don't have that information" over a confident guess.
    # Use hits[0]["distance"]. Tune the threshold with the eval harness.
    # ========================================================================

    from anthropic import Anthropic
    client = Anthropic(api_key=config.ANTHROPIC_API_KEY)

    # ========================================================================
    # 📝 TASK 7 (Cost & latency):
    #   - CACHING: identical/similar questions re-run the whole pipeline. Add a
    #     cache (exact-match first; then SEMANTIC cache keyed on the query
    #     embedding). Also use Anthropic PROMPT CACHING for the stable system
    #     prompt / context prefix.
    #   - STREAMING: this uses a blocking call → the user stares at nothing for
    #     seconds. Switch to client.messages.stream(...) and yield tokens.
    #   - Track tokens (resp.usage) for a cost dashboard (TASK 11 observability).
    # ========================================================================
    resp = client.messages.create(
        model=config.GEN_MODEL,
        max_tokens=512,
        # 📝 TASK 8: move the authoritative instruction into `system=` and make
        # the retrieved context clearly untrusted data in the user turn.
        messages=[{"role": "user", "content": build_prompt(question, hits)}],
    )
    text = "".join(block.text for block in resp.content if block.type == "text")
    return text, getattr(resp, "usage", None)
