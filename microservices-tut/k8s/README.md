# Kubernetes manifests — TIER 10 (optional)

Empty on purpose. This is where the **tier 10** deployment work goes (Newman
Ch 8 & 13): a Deployment + Service per microservice, ConfigMaps/Secrets,
readiness/liveness probes wired to the actuator health endpoints, and a taste
of progressive delivery (rolling update / canary).

Docker Compose is the default runtime for tiers 1–9; k8s is the optional
capstone. When you reach it, add one `*.yaml` per service here (or a Helm
chart / Kustomize base) and document the choice in `DECISIONS.md`.
