"""Pydantic schemas for Real Rails PoC #93 — Chip Supply Chain Dependency Graph."""

from pydantic import BaseModel
from typing import Optional


class NodeData(BaseModel):
    """A single node in the supply chain graph."""
    id: str
    label: str
    country: str
    country_flag: str
    stage: str
    color: str
    market_share: Optional[float] = None
    revenue_usd: Optional[float] = None
    no_alternatives: bool = False
    is_bottleneck: bool = False
    bottleneck_reason: Optional[str] = None
    description: str
    risk_if_fails: str
    risk_level: str  # "critical" | "high" | "medium"


class EdgeData(BaseModel):
    """A dependency edge between two nodes."""
    id: str
    source: str
    target: str
    dependency_type: str  # "sole_supplier" | "primary" | "secondary"
    risk_level: str  # "critical" | "high" | "medium"
    annual_value_usd: float
    label: Optional[str] = None


class ControllerEntry(BaseModel):
    """A top controller in the rail."""
    name: str
    role: str


class SidebarContent(BaseModel):
    """Pre-built sidebar text content served from API."""
    title: str
    subtitle: str
    why_this_matters: str
    who_controls_the_rail: str
    top_controllers: list[ControllerEntry]


class MetricsSummary(BaseModel):
    """High-level metrics for Section A."""
    total_nodes: int
    critical_bottlenecks: int
    countries_at_risk: int
    sole_supplier_nodes: int


class BottleneckEntry(BaseModel):
    """A bottleneck node with analysis."""
    id: str
    label: str
    country: str
    country_flag: str
    stage: str
    risk_level: str
    bottleneck_reason: str
    risk_if_fails: str


class CountryConcentration(BaseModel):
    """Country-level concentration data."""
    country: str
    country_flag: str
    critical_node_count: int
    critical_node_percentage: float
    node_names: list[str]


class ConcentrationAnalytics(BaseModel):
    """Full concentration analytics response."""
    concentration_score: float  # 0-100
    by_country: list[CountryConcentration]


class GraphResponse(BaseModel):
    """Full graph API response."""
    nodes: list[NodeData]
    edges: list[EdgeData]
    sidebar_content: SidebarContent
    metrics: MetricsSummary
    bottlenecks: list[BottleneckEntry]
    analytics: ConcentrationAnalytics
    data_source: str  # "synthetic" | "live"
    timestamp: str


class NodeDetailResponse(BaseModel):
    """Single node detail response."""
    node: NodeData
    incoming_edges: list[EdgeData]
    outgoing_edges: list[EdgeData]
    connected_nodes: list[NodeData]
