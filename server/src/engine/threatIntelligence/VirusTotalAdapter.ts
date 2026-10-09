import { ProviderResult } from "./types.js";

/**
 * VirusTotal API v3 Provider Adapter
 * https://docs.virustotal.com/reference/overview
 */
export async function checkVirusTotal(targetUrl: string): Promise<ProviderResult> {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return {
      providerName: "VirusTotal v3",
      status: "NOT_CONFIGURED",
      threatTypes: [],
      checkedAt: new Date().toISOString()
    };
  }

  try {
    // Generate VirusTotal URL identifier (base64url encoded URL without trailing =)
    const urlBuffer = Buffer.from(targetUrl);
    const urlId = urlBuffer.toString("base64url");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
      method: "GET",
      headers: {
        "x-apikey": apiKey,
        "Accept": "application/json"
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.status === 404) {
      // URL has not been analyzed yet on VirusTotal
      return {
        providerName: "VirusTotal v3",
        status: "NO_MATCH",
        threatTypes: [],
        checkedAt: new Date().toISOString()
      };
    }

    if (!response.ok) {
      return {
        providerName: "VirusTotal v3",
        status: "ERROR",
        threatTypes: [],
        checkedAt: new Date().toISOString(),
        errorCode: `HTTP_${response.status}`
      };
    }

    const data = (await response.json()) as {
      data?: {
        attributes?: {
          last_analysis_stats?: { malicious?: number; suspicious?: number };
          last_analysis_results?: Record<string, { category?: string; result?: string }>;
        };
      };
    };

    const stats = data.data?.attributes?.last_analysis_stats;
    const maliciousCount = stats?.malicious || 0;
    const suspiciousCount = stats?.suspicious || 0;

    if (maliciousCount > 0 || suspiciousCount > 1) {
      const threatTypes = [`MALICIOUS_DETECTIONS: ${maliciousCount}`, `SUSPICIOUS_DETECTIONS: ${suspiciousCount}`];
      return {
        providerName: "VirusTotal v3",
        status: "MATCH_FOUND",
        threatTypes,
        checkedAt: new Date().toISOString(),
        finding: {
          category: "THREAT_INTEL",
          severity: "CRITICAL",
          title: `VirusTotal Detections Identified (${maliciousCount} security vendors flagged as malicious)`,
          explanation: `VirusTotal security engine report found ${maliciousCount} malicious and ${suspiciousCount} suspicious detections across independent threat intelligence vendors.`
        }
      };
    }

    return {
      providerName: "VirusTotal v3",
      status: "NO_MATCH",
      threatTypes: [],
      checkedAt: new Date().toISOString()
    };
  } catch (err: any) {
    return {
      providerName: "VirusTotal v3",
      status: "ERROR",
      threatTypes: [],
      checkedAt: new Date().toISOString(),
      errorCode: err.name === "AbortError" ? "TIMEOUT" : "NETWORK_ERROR"
    };
  }
}
