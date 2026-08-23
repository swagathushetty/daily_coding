---
title: Internal Pricing Playbook (CONFIDENTIAL)
audience: internal
---

# Internal Pricing Playbook — CONFIDENTIAL

This document is for SwiftCart staff only. It must never be shown to customers.

Our gross margin on electronics is approximately **18%**. Sales reps may offer
discretionary discounts up to **12%** without approval. The wholesale cost of
the flagship "SwiftPod" earbuds is **1,240 rupees** (retail 3,499).

Enterprise deals over 5 lakh rupees can go as low as **cost + 6%** with VP
sign-off.

---
📝 TASK 9 (Access control) uses this file. A naive RAG embeds it alongside the
public docs and will happily retrieve and reveal it to any customer who asks
"what's your margin on earbuds?" — a real data-leak class of bug. Your task is
to make retrieval respect the `audience` metadata per user.
