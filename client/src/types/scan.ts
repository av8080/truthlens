export type VerdictType =
  | "KNOWN_THREAT"
  | "HIGH_RISK"
  | "SUSPICIOUS"
  | "NO_THREAT_DETECTED"
  | "INCONCLUSIVE"
  | "UNABLE_TO_VERIFY";

export interface ScanFinding {
  id?: string;
  category: "THREAT_INTEL" | "URL_STRUCTURE" | "DOMAIN_INFO" | "CONTEXTUAL";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  title: string;
  explanation: string;
  source: string;
  metadata?: any;
}

export interface ProviderCheck {
  id?: string;
  providerName: string;
  status: "MATCH_FOUND" | "NO_MATCH" | "ERROR" | "NOT_CONFIGURED";
  threatTypes?: string[];
  checkedAt: string;
  errorCode?: string;
}

export interface ScanReport {
  inputUrl?: string;
  normalizedUrl?: string;
  rawMessage?: string;
  sanitizedSummary?: string;
  verdict: VerdictType;
  heuristicScore: number;
  providerStatus: string;
  findings: ScanFinding[];
  providerChecks?: ProviderCheck[];
  extractedUrls?: Array<{ url: string; startIndex: number; endIndex: number }>;
  recommendations: string[];
  limitationsNotice: string;
  timestamp: string;
}

export interface HistoryScanRecord {
  id: string;
  scanType: "URL" | "MESSAGE";
  sanitizedInput: string;
  verdict: VerdictType;
  heuristicScore?: number;
  providerStatus: string;
  createdAt: string;
  findings: ScanFinding[];
  providerChecks?: ProviderCheck[];
}

export interface DashboardStats {
  summary: {
    totalScans: number;
    confirmedThreats: number;
    highRiskCount: number;
    suspiciousCount: number;
    safeCount: number;
    inconclusiveCount: number;
  };
  distribution: Array<{ name: string; count: number; color: string }>;
  recentScans: HistoryScanRecord[];
}
