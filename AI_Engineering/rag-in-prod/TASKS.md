# RAG in Production — Task Index

> A naive RAG that works in a demo but fails in prod. Every problem is a
> `📝 TASK` comment above the offending code (❌ → 💡 → ✅). You productionize it
> tier by tier, re-running the eval harness (Task 10) to prove each change
> helped. That measure-first loop IS the skill.

## Setup

```bash
docker compose up -d                     # postgres + pgvector on :5433
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env                     # add ANTHROPIC_API_KEY (generation only)

python -m src.ingest                     # chunk + embed + load corpus (no key needed)
python eval/evaluate.py                  # retrieval metrics (no key needed)
python -m src.app "how many days to return an item?"      # full pipeline (needs key)
```

Local embeddings (fastembed) mean **ingest + retrieval + eval run with NO API
key** — only the final generation step needs `ANTHROPIC_API_KEY`.

## Feel the sins first

```bash
python -m src.app "what does HTTP 429 mean?"          # Task 4: vector misses "429"
python -m src.app "what's your margin on earbuds?"    # Task 9: LEAKS the internal doc
python -m src.app "tell me about the SwiftPod reviews" # Task 8: injection may hijack
python -m src.app "do you ship to the moon?"          # Task 6: should say "I don't know"
```

## Tiers

| # | File | Concept |
|---|------|---------|
| 1 | (understand) `src/rag.py` | The RAG pipeline: retrieve → assemble → generate |
| 2 | `src/ingest.py` | **Chunking** — structure-aware + overlap (highest leverage) |
| 3 | `src/embeddings.py` | Embeddings: model choice, the re-index migration trap |
| 3b | `src/retrieve.py` | Query transformation: multi-query, HyDE, decomposition |
| 4 | `src/retrieve.py`, `src/store.py` | **Hybrid search** (vector + lexical/BM25) |
| 4b | `src/retrieve.py` | **Reranking** with a cross-encoder (cheap, high impact) |
| 5 | `src/store.py` | Scale: ANN index (HNSW), recall/speed tradeoff |
| 6 | `src/generate.py` | **Groundedness**: answer-only-from-context, refuse, **citations** |
| 7 | `src/generate.py` | **Cost & latency**: caching (exact/semantic/prompt), streaming |
| 8 | `src/generate.py`, corpus | **Prompt injection** defense (retrieved docs are an attack surface) |
| 9 | `src/store.py`, `src/retrieve.py` | **Access control** at retrieval (multi-tenant leak) |
| 10 | `eval/evaluate.py` | **Evaluation harness** — the #1 senior signal |
| 11 | `src/rag.py` | **Observability/tracing** — debug & improve RAG |

## Suggested order

1 → 2 → 10 (build eval EARLY so every later change is measurable) → 3/3b → 4 →
4b → 6 → 8 → 9 → 7 → 11 → 5.
Rationale: get a measuring stick (10) right after you understand the pipeline,
then improve retrieval (2,3,4), then answer quality/safety (6,8,9), then
operational concerns (7,11), then scale (5).

## Interview-ready outcomes

You can demonstrate, with the eval harness as proof:
- retrieval recall going up as you fix chunking + add hybrid + rerank
- a refusal instead of a hallucination on out-of-corpus questions
- a prompt-injection attempt that no longer hijacks the answer
- a confidential doc that a customer can no longer retrieve (leak → 0)
- and you can explain: RAG vs fine-tuning, why re-embedding on model swaps,
  why access control belongs in retrieval not the prompt, how you'd add
  LLM-as-judge, and what LangChain/LlamaIndex would have done for you.
