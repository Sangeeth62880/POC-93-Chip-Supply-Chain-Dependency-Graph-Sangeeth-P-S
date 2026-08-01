"""FastAPI application for Real Rails PoC #93 — Chip Supply Chain Dependency Graph.

Serves structured JSON matching sidebar requirements.
Three endpoints:
  GET /api/graph          → Full graph data
  GET /api/graph/node/{id} → Single node detail
  GET /api/analytics      → Country concentration scores
"""

from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from schemas import (
    GraphResponse,
    NodeDetailResponse,
    ConcentrationAnalytics,
)
from graph_engine import get_full_graph_data, get_node_detail

load_dotenv()

app = FastAPI(
    title="Real Rails PoC #93 — Chip Supply Chain",
    description="Semiconductor supply chain dependency graph API",
    version="1.0.0",
)

# CORS
cors_origins_env = os.getenv("CORS_ORIGINS", "*")

if cors_origins_env == "*":
    cors_origins = ["*"]
else:
    cors_origins = [
        o.strip()
        for o in cors_origins_env.split(",")
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "operational",
        "project": "Real Rails PoC #93",
        "title": "Chip Supply Chain Dependency Graph",
    }


@app.get("/api/graph", response_model=GraphResponse)
async def get_graph():
    """Return the full supply chain graph with all metadata, sidebar content,
    bottleneck analysis, and concentration analytics."""
    data = get_full_graph_data()

    return GraphResponse(
        nodes=data["nodes"],
        edges=data["edges"],
        sidebar_content=data["sidebar_content"],
        metrics=data["metrics"],
        bottlenecks=data["bottlenecks"],
        analytics=data["analytics"],
        data_source="synthetic",
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@app.get("/api/graph/node/{node_id}", response_model=NodeDetailResponse)
async def get_node(node_id: str):
    """Return detailed information for a single node including connected edges."""
    detail = get_node_detail(node_id)

    if detail is None:
        raise HTTPException(status_code=404, detail=f"Node '{node_id}' not found")

    return NodeDetailResponse(**detail)


@app.get("/api/analytics", response_model=ConcentrationAnalytics)
async def get_analytics():
    """Return country concentration analytics."""
    data = get_full_graph_data()
    return ConcentrationAnalytics(**data["analytics"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
