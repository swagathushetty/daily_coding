from functools import lru_cache
from . import config

# ============================================================================
# Embeddings — the pluggable boundary. embed_texts([...]) -> list[list[float]].
#
# 📝 TASK 3 (Embeddings) discussion lives here. Things to understand and be able
# to explain in an interview:
#   - An embedding maps text → a vector where "similar meaning" ≈ "close in
#     space". Retrieval = nearest-neighbor search in that space.
#   - Model choice matters: dimension, max input length, domain fit, cost,
#     hosted vs local. bge-small (default) is 384-dim and fine for general text.
#   - normalize? cosine similarity assumes comparable magnitudes. bge models are
#     trained for cosine; we use the cosine operator in pgvector to match.
#   - The migration trap (see config): switching models ⇒ re-embed everything.
# ============================================================================


@lru_cache(maxsize=1)
def _fastembed_model():
    from fastembed import TextEmbedding
    return TextEmbedding(model_name=config.FASTEMBED_MODEL)


def embed_texts(texts):
    """Return a list of embedding vectors (list[float]) for the given texts."""
    if config.EMBEDDINGS_PROVIDER == "fastembed":
        model = _fastembed_model()
        # fastembed returns numpy arrays; convert to plain lists for pgvector.
        return [vec.tolist() for vec in model.embed(list(texts))]

    if config.EMBEDDINGS_PROVIDER == "openai":
        # 📝 TASK 3: the hosted path. Requires OPENAI_API_KEY. Note it's a
        # network call per batch → batch aggressively, handle rate limits.
        from openai import OpenAI
        client = OpenAI(api_key=config.OPENAI_API_KEY)
        resp = client.embeddings.create(model=config.OPENAI_EMBED_MODEL, input=list(texts))
        return [d.embedding for d in resp.data]

    raise ValueError(f"unknown EMBEDDINGS_PROVIDER: {config.EMBEDDINGS_PROVIDER}")


def embedding_dim():
    """Dimension of a single vector — used to create the pgvector column."""
    return len(embed_texts(["dimension probe"])[0])
