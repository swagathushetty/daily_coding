import os

# ============================================================================
# Central config. Read from env (.env is auto-loaded in app.py via dotenv).
# ============================================================================

# --- Generation (the LLM) ---------------------------------------------------
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
# Default to a small, cheap, fast Claude model — appropriate for RAG answering.
# 📝 TASK 7 (Cost/latency): model choice is a cost lever. Discuss when a bigger
# model is worth it (hard synthesis) vs when the small one suffices (most Q&A).
GEN_MODEL = os.getenv("GEN_MODEL", "claude-haiku-4-5-20251001")

# --- Embeddings -------------------------------------------------------------
# Pluggable so you can swap providers (a real migration concern — see below).
# Default 'fastembed' runs a small model LOCALLY: no API key, free, offline —
# great for learning and for running the retrieval half without any secrets.
# 📝 TASK 3 note: prod usually uses a HOSTED embedding model (OpenAI/Voyage).
# ⚠️ Swapping embedding providers changes vector dimensions AND meaning → you
# must RE-EMBED the entire corpus. That re-index is a real operational cost;
# never mix vectors from two models in one index.
EMBEDDINGS_PROVIDER = os.getenv("EMBEDDINGS_PROVIDER", "fastembed")  # fastembed|openai
FASTEMBED_MODEL = os.getenv("FASTEMBED_MODEL", "BAAI/bge-small-en-v1.5")  # 384-dim
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_EMBED_MODEL = os.getenv("OPENAI_EMBED_MODEL", "text-embedding-3-small")

# --- Vector store (Postgres + pgvector) -------------------------------------
PG_DSN = os.getenv("PG_DSN", "postgresql://rag:rag@localhost:5433/rag")

# --- Retrieval knobs --------------------------------------------------------
TOP_K = int(os.getenv("TOP_K", "4"))
