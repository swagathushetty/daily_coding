---
title: Developer API Rate Limits
audience: public
---

# Developer API Rate Limits

The SwiftCart REST API is rate limited per API key:

- Free tier: **60 requests per minute**, 10,000 requests per day.
- Pro tier: **600 requests per minute**, 1,000,000 requests per day.

Exceeding the limit returns HTTP **429** with a `Retry-After` header (in
seconds). Clients should back off exponentially.

Bulk endpoints (the `/batch` routes) count each item in the batch as one
request against your limit. Webhooks do not count against your rate limit.
