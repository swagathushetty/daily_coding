import psycopg
from pgvector.psycopg import register_vector
from . import config

# ============================================================================
# Vector store — Postgres + pgvector. We use raw SQL (via psycopg) on purpose:
# a vector DB is "just" nearest-neighbor search over rows, and seeing the SQL
# demystifies what Pinecone/Weaviate/Qdrant do for you.
#
# 📝 TASK 2 (Chunking) & TASK 4 (Hybrid search) & TASK 9 (Access control) all
# touch this schema. Markers inline.
# ============================================================================


def connect():
    conn = psycopg.connect(config.PG_DSN, autocommit=True)
    # The pgvector 'vector' type must exist BEFORE we can register its adapter,
    # so ensure the extension here (idempotent) rather than only in init_schema.
    conn.execute("CREATE EXTENSION IF NOT EXISTS vector")
    register_vector(conn)  # lets us pass/get python lists as vectors
    return conn


def init_schema(conn, dim):
    conn.execute("CREATE EXTENSION IF NOT EXISTS vector")
    conn.execute("DROP TABLE IF EXISTS chunks")
    conn.execute(f"""
        CREATE TABLE chunks (
            id        SERIAL PRIMARY KEY,
            doc       TEXT NOT NULL,
            audience  TEXT NOT NULL DEFAULT 'public',  -- 📝 TASK 9: used for access control
            content   TEXT NOT NULL,
            embedding vector({dim})
            -- 📝 TASK 4 (Hybrid search): add a tsvector column for keyword/BM25-
            --   style search, e.g.  content_tsv tsvector
            --   plus a GIN index, then combine lexical + vector scores. Pure
            --   vector search misses exact terms (SKUs, error codes, "429").
        )
    """)
    # 📝 TASK 5 (Scale): with only a few dozen chunks a sequential scan is fine.
    # At scale add an ANN index:  CREATE INDEX ON chunks USING hnsw
    #   (embedding vector_cosine_ops);  and understand the recall/speed tradeoff
    # (HNSW is approximate — you trade a little accuracy for big speed).


def upsert_chunks(conn, rows):
    """rows: list of (doc, audience, content, embedding)."""
    with conn.cursor() as cur:
        cur.executemany(
            "INSERT INTO chunks (doc, audience, content, embedding) VALUES (%s, %s, %s, %s)",
            rows,
        )


def search(conn, query_embedding, k):
    # Cosine distance operator <=> ; smaller = more similar. We return distance
    # so callers can threshold on it (see TASK 6 groundedness/refusal).
    #
    # 🐛 TASK 9 (Access control): this query does NOT filter by audience, so a
    # customer's question can retrieve the CONFIDENTIAL internal-pricing chunks.
    # Fix: pass the user's allowed audiences and add
    #   WHERE audience = ANY(%s)
    # Never filter access in the PROMPT ("don't reveal internal docs") — filter
    # it in the QUERY. Retrieval-time access control is the only safe layer.
    rows = conn.execute(
        """
        SELECT doc, audience, content, embedding <=> %s::vector AS distance
        FROM chunks
        ORDER BY distance
        LIMIT %s
        """,
        (query_embedding, k),
    ).fetchall()
    return [
        {"doc": r[0], "audience": r[1], "content": r[2], "distance": float(r[3])}
        for r in rows
    ]
