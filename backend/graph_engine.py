"""NetworkX-based graph analysis engine for PoC #93.

Computes bottleneck scores, country concentration, and supply chain risk metrics.
"""

import networkx as nx
from mock_data import NODES, EDGES, SIDEBAR_CONTENT


def build_graph() -> nx.DiGraph:
    """Build a NetworkX directed graph from mock data."""
    G = nx.DiGraph()

    for node in NODES:
        G.add_node(node["id"], **node)

    for edge in EDGES:
        G.add_edge(
            edge["source"],
            edge["target"],
            id=edge["id"],
            dependency_type=edge["dependency_type"],
            risk_level=edge["risk_level"],
            annual_value_usd=edge["annual_value_usd"],
            label=edge.get("label", ""),
        )

    return G


def compute_bottlenecks(G: nx.DiGraph) -> list[dict]:
    """Identify bottleneck nodes based on Real Rails criteria.

    A node is a bottleneck if:
    - It has no_alternatives: true, OR
    - Its market_share > 70%, OR
    - Its risk_level === "critical"
    """
    bottlenecks = []

    for node_id in G.nodes:
        data = G.nodes[node_id]
        is_bottleneck = False
        reasons = []

        # Criterion 1: no alternatives
        if data.get("no_alternatives", False):
            is_bottleneck = True
            reasons.append("No viable alternatives exist")

        # Criterion 2: market share > 70%
        market_share = data.get("market_share")
        if market_share is not None and market_share > 70:
            is_bottleneck = True
            reasons.append(f"Controls {market_share}% market share")

        # Criterion 3: risk level critical
        if data.get("risk_level") == "critical":
            is_bottleneck = True
            reasons.append("Critical risk level")

        if is_bottleneck:
            reason_str = ". ".join(reasons) + "."
            bottlenecks.append({
                "id": node_id,
                "label": data["label"],
                "country": data["country"],
                "country_flag": data["country_flag"],
                "stage": data["stage"],
                "risk_level": data["risk_level"],
                "bottleneck_reason": reason_str,
                "risk_if_fails": data["risk_if_fails"],
            })

    return bottlenecks


def compute_country_concentration(G: nx.DiGraph, bottleneck_ids: set[str]) -> dict:
    """Compute country-level concentration of critical nodes.

    Returns concentration scores and per-country breakdowns.
    """
    country_data: dict[str, dict] = {}

    # Count critical/bottleneck nodes per country
    for node_id in G.nodes:
        data = G.nodes[node_id]
        country = data["country"]
        flag = data["country_flag"]

        if country not in country_data:
            country_data[country] = {
                "country": country,
                "country_flag": flag,
                "critical_node_count": 0,
                "node_names": [],
                "total_nodes": 0,
            }

        country_data[country]["total_nodes"] += 1

        if node_id in bottleneck_ids:
            country_data[country]["critical_node_count"] += 1
            country_data[country]["node_names"].append(data["label"])

    total_bottlenecks = len(bottleneck_ids)
    by_country = []

    for cdata in country_data.values():
        pct = (cdata["critical_node_count"] / total_bottlenecks * 100) if total_bottlenecks > 0 else 0
        by_country.append({
            "country": cdata["country"],
            "country_flag": cdata["country_flag"],
            "critical_node_count": cdata["critical_node_count"],
            "critical_node_percentage": round(pct, 1),
            "node_names": cdata["node_names"],
        })

    # Sort by critical node count descending
    by_country.sort(key=lambda x: x["critical_node_count"], reverse=True)

    # Concentration score: Herfindahl-like index
    # Higher score = more concentrated = more risk
    if total_bottlenecks > 0:
        shares = [c["critical_node_percentage"] / 100 for c in by_country if c["critical_node_count"] > 0]
        hhi = sum(s ** 2 for s in shares)
        # Normalize: HHI ranges from 1/N to 1, map to 0-100
        n_countries_with_bottlenecks = len(shares)
        if n_countries_with_bottlenecks > 1:
            min_hhi = 1 / n_countries_with_bottlenecks
            concentration_score = round(((hhi - min_hhi) / (1 - min_hhi)) * 100, 1)
        else:
            concentration_score = 100.0
    else:
        concentration_score = 0.0

    return {
        "concentration_score": concentration_score,
        "by_country": by_country,
    }


def compute_metrics(G: nx.DiGraph, bottleneck_ids: set[str]) -> dict:
    """Compute high-level summary metrics for sidebar Section A."""
    countries = set()
    sole_supplier_count = 0

    for node_id in G.nodes:
        data = G.nodes[node_id]
        countries.add(data["country"])

    # Count sole supplier edges
    for u, v, edata in G.edges(data=True):
        if edata.get("dependency_type") == "sole_supplier":
            sole_supplier_count += 1

    # Unique sole supplier source nodes
    sole_supplier_nodes = set()
    for u, v, edata in G.edges(data=True):
        if edata.get("dependency_type") == "sole_supplier":
            sole_supplier_nodes.add(u)

    # Countries at risk: countries with bottleneck nodes
    countries_at_risk = set()
    for bn_id in bottleneck_ids:
        countries_at_risk.add(G.nodes[bn_id]["country"])

    return {
        "total_nodes": G.number_of_nodes(),
        "critical_bottlenecks": len(bottleneck_ids),
        "countries_at_risk": len(countries_at_risk),
        "sole_supplier_nodes": len(sole_supplier_nodes),
    }


def get_full_graph_data() -> dict:
    """Build and analyze the full graph, returning structured data for the API."""
    G = build_graph()

    # Compute bottlenecks
    bottleneck_list = compute_bottlenecks(G)
    bottleneck_ids = {b["id"] for b in bottleneck_list}

    # Annotate nodes with bottleneck status
    nodes_out = []
    for node in NODES:
        node_copy = dict(node)
        if node["id"] in bottleneck_ids:
            bn = next(b for b in bottleneck_list if b["id"] == node["id"])
            node_copy["is_bottleneck"] = True
            node_copy["bottleneck_reason"] = bn["bottleneck_reason"]
        else:
            node_copy["is_bottleneck"] = False
            node_copy["bottleneck_reason"] = None
        nodes_out.append(node_copy)

    # Analytics
    concentration = compute_country_concentration(G, bottleneck_ids)
    metrics = compute_metrics(G, bottleneck_ids)

    return {
        "nodes": nodes_out,
        "edges": EDGES,
        "sidebar_content": SIDEBAR_CONTENT,
        "metrics": metrics,
        "bottlenecks": bottleneck_list,
        "analytics": concentration,
    }


def get_node_detail(node_id: str) -> dict | None:
    """Get detailed information for a single node including connected edges."""
    G = build_graph()

    if node_id not in G.nodes:
        return None

    node_data = dict(G.nodes[node_id])

    # Check bottleneck status
    bottleneck_list = compute_bottlenecks(G)
    bottleneck_ids = {b["id"] for b in bottleneck_list}
    if node_id in bottleneck_ids:
        bn = next(b for b in bottleneck_list if b["id"] == node_id)
        node_data["is_bottleneck"] = True
        node_data["bottleneck_reason"] = bn["bottleneck_reason"]
    else:
        node_data["is_bottleneck"] = False
        node_data["bottleneck_reason"] = None

    # Find connected edges
    incoming = []
    outgoing = []
    connected_node_ids = set()

    for edge in EDGES:
        if edge["target"] == node_id:
            incoming.append(edge)
            connected_node_ids.add(edge["source"])
        if edge["source"] == node_id:
            outgoing.append(edge)
            connected_node_ids.add(edge["target"])

    # Get connected node data
    connected_nodes = []
    for n in NODES:
        if n["id"] in connected_node_ids:
            n_copy = dict(n)
            n_copy["is_bottleneck"] = n["id"] in bottleneck_ids
            n_copy["bottleneck_reason"] = None
            connected_nodes.append(n_copy)

    return {
        "node": node_data,
        "incoming_edges": incoming,
        "outgoing_edges": outgoing,
        "connected_nodes": connected_nodes,
    }
