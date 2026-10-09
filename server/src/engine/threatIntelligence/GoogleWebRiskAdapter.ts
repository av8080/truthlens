import { ProviderResult } from "./types.js";

/**
 * Official Google Web Risk Lookup API Adapter
 * https://docs.cloud.google.com/web-risk/docs/lookup-api
 */
export async function checkGoogleWebRisk(targetUrl: string): Promise<ProviderResult> {
  const apiKey = process.env.GOOGLE_WEB_RISK_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return {
      providerName: "Google Web Risk",
      status: "NOT_CONFIGURED",
      threatTypes: [],
      checkedAt: new Date().toISOString()
    };
  }

  const endpoint = new URL("https://webrisk.googleapis.com/v1/uris:search");
  endpoint.searchParams.append("key", apiKey);
  endpoint.searchParams.append("uri", targetUrl);
  endpoint.searchParams.append("threatTypes", "MALWARE");
  endpoint.searchParams.append("threatTypes", "SOCIAL_ENGINEERING");
  endpoint.searchParams.append("threatTypes", "UNWANTED_SOFTWARE");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 sec timeout

    const response = await fetch(endpoint.toString(), {
      method: "GET",
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        providerName: "Google Web Risk",
        status: "ERROR",
        threatTypes: [],
        checkedAt: new Date().toISOString(),
        errorCode: `HTTP_${response.status}`
      };
    }

    const data = (await response.json()) as { threat?: { threatTypes?: string[] } };

    if (data.threat && data.threat.threatTypes && data.threat.threatTypes.length > 0) {
      const threats = data.threat.threatTypes;
      return {
        providerName: "Google Web Risk",
        status: "MATCH_FOUND",
        threatTypes: threats,
        checkedAt: new Date().toISOString(),
        finding: {
          category: "THREAT_INTEL",
          severity: "CRITICAL",
          title: `Confirmed Threat Identified by Google Web Risk (${threats.join(", ")})`,
          explanation: `Google Web Risk threat intelligence database explicitly flagged this URL under threat categories: ${threats.join(", ")}. This site presents active security risks such as social engineering or malware distribution.`
        }
      };
    }

    return {
      providerName: "Google Web Risk",
      status: "NO_MATCH",
      threatTypes: [],
      checkedAt: new Date().toISOString()
    };
  } catch (err: any) {
    return {
      providerName: "Google Web Risk",
      status: "ERROR",
      threatTypes: [],
      checkedAt: new Date().toISOString(),
      errorCode: err.name === "AbortError" ? "TIMEOUT" : "NETWORK_ERROR"
    };
  }
}
