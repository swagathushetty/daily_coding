# AI Engineering — Course Track

Hands-on courses for taking LLM features from "works in a demo" to "works in
prod." Same style as the rest of this repo: a deliberately naive app with
numbered `📝 TASK` comments (❌ what's wrong → 💡 the concept → ✅ what to do),
productionized tier by tier.

**Stack:** Python (interview-standard for AI work). Claude for generation via
the Anthropic SDK; pgvector for retrieval; raw SDKs first (no framework) so you
learn what LangChain/LlamaIndex hide, with the framework equivalents noted.

## Courses

- [x] **rag-in-prod** (`./rag-in-prod/`) — a naive RAG that hallucinates,
      retrieves poorly, has no evaluation, leaks other tenants' documents, and
      costs too much → productionize it: chunking, hybrid search, reranking,
      query transforms, **evaluation harness**, tracing, caching, prompt-
      injection defense, access control, citations/groundedness, streaming.
- [ ] **agents-and-tools** (planned) — tool/function calling → an agent loop →
      when a workflow beats an agent; controlling cost/loops; evaluating agents.
- [ ] **mcp-server** (planned) — build a Model Context Protocol server exposing
      your own tools/data; the security model.
- [ ] **eval-deep-dive** (planned) — LLM-as-judge, RAGAS, golden datasets,
      regression testing, offline vs online eval.

## The mental model (say this in interviews)

RAG is one pattern (get the right context in). Tool use lets the model act.
Agents chain those into loops. MCP standardizes how tools connect. Across ALL
of them the hard prod problems are the same: **evaluation, observability, cost,
latency, and prompt-injection / access-control.**
