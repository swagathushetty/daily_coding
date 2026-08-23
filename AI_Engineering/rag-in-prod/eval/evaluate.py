import json
import pathlib
import sys

# make the project root importable when run as `python eval/evaluate.py`
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv  # noqa: E402

load_dotenv()

from src import rag, store, retrieve, embeddings  # noqa: E402,F401

DATASET = pathlib.Path(__file__).resolve().parent / "dataset.jsonl"

# ============================================================================
# 📝 TASK 10 — Evaluation: the most important task in the whole course.
# ============================================================================
# "How do you know your RAG is good?" is THE question that separates senior from
# junior. The answer is: a golden dataset + metrics you re-run on every change
# (new chunking, new model, new prompt). Vibes don't survive a prompt tweak.
#
# This file is a STARTER harness. It already computes two cheap, powerful
# RETRIEVAL metrics that need NO LLM and NO API key — so you can iterate on
# chunking/hybrid/rerank fast and objectively. Your task is to extend it.
#
# WHAT'S HERE (retrieval metrics):
#   - recall@k on expected_doc: did the right document make it into the top-k?
#   - a simple keyword-grounding check (are must_contain terms present in the
#     retrieved context at all?). If a fact isn't retrieved, generation CANNOT
#     get it right — retrieval is the ceiling on the whole system.
#
# ✅ YOUR TASKS (extend this):
#   1. GENERATION metrics (need the LLM): run rag.ask and check the ANSWER:
#        - must_contain terms present in the answer
#        - should_refuse cases: the answer must decline (TASK 6 groundedness)
#        - access leak cases: as a CUSTOMER, the answer must NOT reveal the
#          internal margin (TASK 9). This test should FAIL today — that failing
#          test is the point; make it pass by fixing retrieval access control.
#   2. LLM-AS-JUDGE: for open-ended answers, exact-match is too brittle. Add a
#      judge call: "given the question, the reference, and the answer, is the
#      answer faithful and correct? score 1-5." Discuss judge bias/variance.
#   3. Adopt RAGAS (faithfulness, answer_relevancy, context_precision/recall)
#      once you outgrow hand-rolled metrics — name it in interviews.
#   4. Make it a REGRESSION GATE: print a summary table and exit non-zero if a
#      metric drops below a threshold, so you can wire it into CI and never ship
#      a change that quietly makes retrieval worse.
# ============================================================================


def load_dataset():
    return [json.loads(line) for line in DATASET.read_text().splitlines() if line.strip()]


def eval_retrieval(user_audiences):
    conn = store.connect()
    rows = load_dataset()
    doc_hits, doc_total = 0, 0
    kw_hits, kw_total = 0, 0
    leaks = 0
    try:
        for row in rows:
            hits = retrieve.retrieve(conn, row["question"], allowed_audiences=user_audiences)
            docs = {h["doc"] for h in hits}
            context = "\n".join(h["content"] for h in hits).lower()

            if row.get("expected_doc"):
                doc_total += 1
                if row["expected_doc"] in docs:
                    doc_hits += 1

            for term in row.get("must_contain", []):
                kw_total += 1
                if term.lower() in context:
                    kw_hits += 1

            # access-control probe: as a customer, did we RETRIEVE a confidential
            # chunk at all? (leak potential — the model can't reveal what it
            # never got). This should be 0 after TASK 9.
            if "internal" in {h["audience"] for h in hits} and "internal" not in user_audiences:
                leaks += 1

        print(f"retrieval recall@k (expected_doc): {doc_hits}/{doc_total}")
        print(f"keyword grounding (must_contain in context): {kw_hits}/{kw_total}")
        print(f"⚠️  confidential chunks leaked into customer retrieval: {leaks}  (TASK 9 target: 0)")
    finally:
        conn.close()


if __name__ == "__main__":
    print("=== RETRIEVAL EVAL (as customer: public only) ===")
    eval_retrieval(["public"])
    # 📝 TASK 10: add generation eval + LLM-as-judge + a regression exit code.
