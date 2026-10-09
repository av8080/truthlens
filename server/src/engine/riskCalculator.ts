import { validateAndNormalizeUrl, NormalizedUrlResult } from "./urlValidator.js";
import { analyzeUrlStructure, StructuralFinding } from "./urlHeuristics.js";
import { runThreatIntelligenceChecks } from "./threatIntelligence/ThreatIntelAggregator.js";
import { ProviderResult } from "./threatIntelligence/types.js";

export interface CombinedScanReport {
  inputUrl: string;
  normalizedUrl?: string;
  verdict: "KNOWN_THREAT" | "HIGH_RISK" | "SUSPICIOUS" | "NO_THREAT_DETECTED" | "INCONCLUSIVE" | "UNABLE_TO_VERIFY";
  heuristicScore: number; // 0 to 100
  providerStatus: string;
  findings: Array<{
    category: "THREAT_INTEL" | "URL_STRUCTURE" | "DOMAIN_INFO" | "CONTEXTUAL";
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
    title: string;
    explanation: string;
    source: string;
    metadata?: Record<string, any>;
  }>;
  providerChecks: Array<{
    providerName: string;
    status: "MATCH_FOUND" | "NO_MATCH" | "ERROR" | "NOT_CONFIGURED";
    threatTypes?: string[];
    checkedAt: string;
    errorCode?: string;
  }>;
  recommendations: string[];
  limitationsNotice: string;
  timestamp: string;
}

export async function calculateUrlRisk(rawUrl: string): Promise<CombinedScanReport> {
  const norm: NormalizedUrlResult = validateAndNormalizeUrl(rawUrl);

  if (!norm.isValid || !norm.normalizedUrl) {
    return {
      inputUrl: rawUrl,
      verdict: "UNABLE_TO_VERIFY",
      heuristicScore: 0,
      providerStatus: "URL validation failed",
      findings: [
        {
          category: "URL_STRUCTURE",
          severity: "HIGH",
          title: "Malformed or Unsafe URL Format",
          explanation: norm.error || "The submitted URL could not be parsed or uses an unsupported protocol.",
          source: "TruthLens Validator"
        }
      ],
      providerChecks: [],
      recommendations: [
        "Check that the URL is spelled correctly.",
        "Ensure the URL uses HTTP or HTTPS protocol."
      ],
      limitationsNotice: "TruthLens was unable to analyze this input due to invalid formatting.",
      timestamp: new Date().toISOString()
    };
  }

  // 1. Run Structural Heuristics
  const structuralFindings = analyzeUrlStructure(norm);

  // 2. Run Threat Intelligence Checks
  const providerResults: ProviderResult[] = await runThreatIntelligenceChecks(norm.normalizedUrl);

  const findings: CombinedScanReport["findings"] = [];
  const providerChecks: CombinedScanReport["providerChecks"] = [];

  let hasConfirmedThreat = false;
  let totalSeverityScore = 0;

  // Process Threat Intel results
  for (const pRes of providerResults) {
    providerChecks.push({
      providerName: pRes.providerName,
      status: pRes.status,
      threatTypes: pRes.threatTypes,
      checkedAt: pRes.checkedAt,
      errorCode: pRes.errorCode
    });

    if (pRes.status === "MATCH_FOUND" && pRes.finding) {
      hasConfirmedThreat = true;
      findings.push({
        category: pRes.finding.category,
        severity: pRes.finding.severity,
        title: pRes.finding.title,
        explanation: pRes.finding.explanation,
        source: pRes.providerName
      });
      totalSeverityScore += 80;
    }
  }

  // Process Structural Findings
  for (const sFind of structuralFindings) {
    findings.push({
      category: sFind.category,
      severity: sFind.severity,
      title: sFind.title,
      explanation: sFind.explanation,
      source: sFind.source,
      metadata: sFind.metadata
    });

    switch (sFind.severity) {
      case "CRITICAL": totalSeverityScore += 50; break;
      case "HIGH": totalSeverityScore += 35; break;
      case "MEDIUM": totalSeverityScore += 20; break;
      case "LOW": totalSeverityScore += 10; break;
      default: break;
    }
  }

  // Calculate Heuristic Score (0 to 100)
  const heuristicScore = Math.min(100, Math.round(totalSeverityScore));

  // Determine Verdict
  let verdict: CombinedScanReport["verdict"] = "NO_THREAT_DETECTED";

  if (hasConfirmedThreat) {
    verdict = "KNOWN_THREAT";
  } else if (heuristicScore >= 60 || findings.some(f => f.severity === "HIGH" || f.severity === "CRITICAL")) {
    verdict = "HIGH_RISK";
  } else if (heuristicScore >= 25 || findings.length > 0) {
    verdict = "SUSPICIOUS";
  } else if (providerResults.every(p => p.status === "ERROR")) {
    verdict = "UNABLE_TO_VERIFY";
  } else {
    verdict = "NO_THREAT_DETECTED";
  }

  // Create Provider Status Summary string
  const activeProviders = providerChecks.filter(p => p.status === "MATCH_FOUND" || p.status === "NO_MATCH").length;
  const totalConfigured = providerChecks.filter(p => p.status !== "NOT_CONFIGURED").length;
  let providerStatus = "";
  if (totalConfigured === 0) {
    providerStatus = "Heuristic-only mode (No external API keys configured)";
  } else {
    providerStatus = `${activeProviders}/${totalConfigured} threat intelligence providers checked`;
  }

  // Recommendations
  const recommendations: string[] = [];
  if (verdict === "KNOWN_THREAT") {
    recommendations.push("DO NOT OPEN THIS URL. This domain has been identified on official threat intelligence lists.");
    recommendations.push("Do NOT enter any passwords, credit card numbers, or personal information.");
    recommendations.push("If you have already submitted credentials on this site, change your passwords immediately on the official service and contact your institution.");
  } else if (verdict === "HIGH_RISK") {
    recommendations.push("Avoid visiting this website. Multiple high-risk indicators were detected in the URL structure or domain identity.");
    recommendations.push("Verify the sender independently through official contact channels before trusting this link.");
    recommendations.push("Check the exact domain name against official bookmark or search results.");
  } else if (verdict === "SUSPICIOUS") {
    recommendations.push("Proceed with caution. One or more warning signs were detected.");
    recommendations.push("Do not log in or provide payment details unless you have verified the domain identity independently.");
  } else {
    recommendations.push("No known threats or critical structural anomalies were detected in the checks performed.");
    recommendations.push("Remember: No detection system catches every scam. Always stay vigilant when entering credentials or sensitive data.");
  }

  const limitationsNotice = "Honesty about uncertainty: TruthLens automated analysis evaluates canonical threat lists and URL structural indicators. The absence of a detected threat does not guarantee that a site is legitimate.";

  return {
    inputUrl: rawUrl,
    normalizedUrl: norm.normalizedUrl,
    verdict,
    heuristicScore,
    providerStatus,
    findings,
    providerChecks,
    recommendations,
    limitationsNotice,
    timestamp: new Date().toISOString()
  };
}
