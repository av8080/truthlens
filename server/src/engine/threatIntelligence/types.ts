export interface ProviderResult {
  providerName: "Google Web Risk" | "VirusTotal v3";
  status: "MATCH_FOUND" | "NO_MATCH" | "ERROR" | "NOT_CONFIGURED";
  threatTypes: string[];
  checkedAt: string;
  errorCode?: string;
  finding?: {
    category: "THREAT_INTEL";
    severity: "CRITICAL" | "HIGH";
    title: string;
    explanation: string;
  };
}
