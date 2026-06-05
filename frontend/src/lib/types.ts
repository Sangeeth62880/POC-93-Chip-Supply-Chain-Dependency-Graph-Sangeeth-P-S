/* ─── Real Rails PoC #93 — TypeScript Interfaces ─────────── */

export interface NodeData {
  id: string;
  label: string;
  country: string;
  country_flag: string;
  stage: Stage;
  color: string;
  market_share: number | null;
  revenue_usd: number | null;
  no_alternatives: boolean;
  is_bottleneck: boolean;
  bottleneck_reason: string | null;
  description: string;
  risk_if_fails: string;
  risk_level: RiskLevel;
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  dependency_type: DependencyType;
  risk_level: RiskLevel;
  annual_value_usd: number;
  label?: string;
}

export interface ControllerEntry {
  name: string;
  role: string;
}

export interface SidebarContent {
  title: string;
  subtitle: string;
  why_this_matters: string;
  who_controls_the_rail: string;
  top_controllers: ControllerEntry[];
}

export interface MetricsSummary {
  total_nodes: number;
  critical_bottlenecks: number;
  countries_at_risk: number;
  sole_supplier_nodes: number;
}

export interface BottleneckEntry {
  id: string;
  label: string;
  country: string;
  country_flag: string;
  stage: string;
  risk_level: RiskLevel;
  bottleneck_reason: string;
  risk_if_fails: string;
}

export interface CountryConcentration {
  country: string;
  country_flag: string;
  critical_node_count: number;
  critical_node_percentage: number;
  node_names: string[];
}

export interface ConcentrationAnalytics {
  concentration_score: number;
  by_country: CountryConcentration[];
}

export interface GraphResponse {
  nodes: NodeData[];
  edges: EdgeData[];
  sidebar_content: SidebarContent;
  metrics: MetricsSummary;
  bottlenecks: BottleneckEntry[];
  analytics: ConcentrationAnalytics;
  data_source: "synthetic" | "live";
  timestamp: string;
}

export interface NodeDetailResponse {
  node: NodeData;
  incoming_edges: EdgeData[];
  outgoing_edges: EdgeData[];
  connected_nodes: NodeData[];
}

/* ─── Enums / Unions ─────────────────────────────────────── */

export type Stage =
  | "design"
  | "fabrication"
  | "equipment"
  | "memory"
  | "packaging"
  | "consumer";

export type RiskLevel = "critical" | "high" | "medium";

export type DependencyType = "sole_supplier" | "primary" | "secondary";

/* ─── Constants ──────────────────────────────────────────── */

export const STAGE_LABELS: Record<Stage, string> = {
  design: "Design",
  fabrication: "Fabrication",
  equipment: "Equipment",
  memory: "Memory",
  packaging: "Packaging",
  consumer: "Consumer",
};

export const STAGE_COLORS: Record<Stage, string> = {
  design: "#818CF8",
  fabrication: "#38BDF8",
  equipment: "#F59E0B",
  memory: "#10B981",
  packaging: "#6B7280",
  consumer: "#EF4444",
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
};

export const ALL_STAGES: Stage[] = [
  "design",
  "fabrication",
  "equipment",
  "memory",
  "packaging",
  "consumer",
];

export const ALL_RISK_LEVELS: RiskLevel[] = ["critical", "high", "medium"];

export const ALL_COUNTRIES = [
  "Taiwan",
  "United States",
  "Netherlands",
  "South Korea",
  "China",
  "United Kingdom",
];
