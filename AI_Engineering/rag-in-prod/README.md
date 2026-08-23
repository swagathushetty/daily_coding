# RAG in Production — Fix the Naive RAG

A deliberately naive Retrieval-Augmented Generation app over a small SwiftCart
knowledge base. It works in a demo but commits every production sin: bad
chunking, vector-only retrieval, no reranking, no evaluation, hallucinates on
gaps, leaks other tenants' confidential docs, is vulnerable to prompt injection
from retrieved content, and has no caching or tracing.

Each problem is a numbered `📝 TASK` comment (❌ what's wrong → 💡 concept →
✅ what to do). You productionize it tier by tier, proving each change with the
eval harness. `TASKS.md` is the index.

**Stack:** Python · Claude (Anthropic SDK) for generation · pgvector for
retrieval · fastembed (local) for embeddings · raw SDKs, no framework (the
LangChain/LlamaIndex equivalents are noted in comments).

## Run

```bash
docker compose up -d
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env      # add ANTHROPIC_API_KEY

python -m src.ingest                                  # no key needed
python eval/evaluate.py                               # no key needed
python -m src.app "how long do refunds take?"         # needs key
```

Retrieval + eval run with **no API key** (local embeddings); only generation
needs `ANTHROPIC_API_KEY`. Start with `TASKS.md`.

Part of the `AI_Engineering` track — next courses: agents & tools, MCP, eval
deep-dive.
