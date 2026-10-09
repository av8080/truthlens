import { checkGoogleWebRisk } from "./GoogleWebRiskAdapter.js";
import { checkVirusTotal } from "./VirusTotalAdapter.js";
import { ProviderResult } from "./types.js";

export async function runThreatIntelligenceChecks(targetUrl: string): Promise<ProviderResult[]> {
  // Execute provider checks concurrently
  const results = await Promise.all([
    checkGoogleWebRisk(targetUrl),
    checkVirusTotal(targetUrl)
  ]);

  return results;
}
