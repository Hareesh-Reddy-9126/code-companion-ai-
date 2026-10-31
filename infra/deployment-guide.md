# Code Companion AI — Self-Hosted Deployment Guide

## Overview

Deploy Code Companion AI on your own infrastructure for air-gapped, data-residency, or compliance requirements.

## Prerequisites

- Kubernetes 1.25+
- Helm 3.10+
- Ingress controller (NGINX or Traefik)
- cert-manager for TLS
- Object storage (S3-compatible) for backups

## Quick Start

### 1. Clone and Configure

```bash
git clone https://github.com/Hareesh-Reddy-9126/code-companion-ai-.git
cd code-companion-ai-
cp infra/k8s/secrets.yaml infra/k8s/secrets.production.yaml
# Edit secrets.production.yaml with your values
```

### 2. Deploy to Kubernetes

```bash
kubectl create namespace code-companion
kubectl apply -f infra/k8s/secrets.yaml
kubectl apply -f infra/k8s/database.yaml
kubectl apply -f infra/k8s/frontend-deployment.yaml
kubectl apply -f infra/monitoring/prometheus.yaml
```

### 3. Verify Deployment

```bash
kubectl get pods -n code-companion
kubectl get ingress -n code-companion
```

## Architecture

```
┌─────────────────┐     ┌──────────────────┐
│   External User │────►│   Ingress (Nginx) │
└─────────────────┘     └──────────┬───────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │   Frontend (React + Vite)   │
                    │       3 replicas            │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │   Supabase (Managed/Self)   │
                    │   Auth + Postgres + Edge    │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │   NVIDIA NIM API            │
                    │   (Nemotron 3 Ultra)        │
                    └─────────────────────────────┘
```

## Air-Gapped Deployment

For air-gapped environments:

1. Build Docker images locally:
   ```bash
   docker build -t codecompanion/frontend:latest .
   docker save codecompanion/frontend:latest > frontend.tar
   ```

2. Transfer to air-gapped network and load:
   ```bash
   docker load -i frontend.tar
   ```

3. Deploy using local registry:
   ```bash
   kubectl apply -f infra/k8s/
   ```

## Support

Enterprise customers: support@codecompanion.ai
Self-hosted community: GitHub Discussions
