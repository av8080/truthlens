import { NormalizedUrlResult } from "./urlValidator.js";

export interface StructuralFinding {
  category: "URL_STRUCTURE" | "DOMAIN_INFO";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  title: string;
  explanation: string;
  source: "Structural Analysis Engine";
  metadata?: Record<string, any>;
}

const BRAND_KEYWORDS = [
  "paypal", "apple", "google", "microsoft", "amazon", "netflix",
  "facebook", "instagram", "meta", "whatsapp", "bankofamerica", "chase",
  "wellsfargo", "citibank", "binance", "coinbase", "metamask", "steam",
  "roblox", "usps", "fedex", "dhl", "ups", "irs", "support-apple", "my-account"
];

const OFFICIAL_DOMAINS: Record<string, string[]> = {
  "paypal": ["paypal.com", "paypal.me"],
  "apple": ["apple.com", "icloud.com"],
  "google": ["google.com", "youtube.com", "gmail.com"],
  "microsoft": ["microsoft.com", "live.com", "outlook.com", "office.com"],
  "amazon": ["amazon.com", "aws.amazon.com"],
  "netflix": ["netflix.com"],
  "facebook": ["facebook.com", "fb.com"],
  "instagram": ["instagram.com"],
  "meta": ["meta.com"],
  "whatsapp": ["whatsapp.com"],
  "bankofamerica": ["bankofamerica.com"],
  "chase": ["chase.com"],
  "wellsfargo": ["wellsfargo.com"],
  "citibank": ["citi.com", "citibank.com"],
  "binance": ["binance.com"],
  "coinbase": ["coinbase.com"],
  "metamask": ["metamask.io"],
  "usps": ["usps.com"],
  "fedex": ["fedex.com"],
  "dhl": ["dhl.com"],
  "ups": ["ups.com"]
};

const SUSPICIOUS_TLDS = [
  "xyz", "top", "tk", "ml", "ga", "cf", "gq", "work", "click",
  "download", "racing", "biz", "info", "club", "site", "online", "live"
];

const KNOWN_SHORTENERS = [
  "bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "rb.gy",
  "goo.gl", "buff.ly", "ow.ly", "bit.do", "tiny.cc"
];

const SECURITY_KEYWORDS = [
  "login", "verify", "secure", "account", "banking", "update",
  "signin", "auth", "support", "wallet", "claim", "billing", "recovery"
];

/**
 * Analyzes normalized URL structure for high-risk heuristics, typosquatting, and suspicious flags.
 */
export function analyzeUrlStructure(norm: NormalizedUrlResult): StructuralFinding[] {
  const findings: StructuralFinding[] = [];

  if (!norm.isValid || !norm.hostname) {
    return findings;
  }

  const hostname = norm.hostname;

  // 1. Raw IP Hostname Check
  if (norm.isIpHostname) {
    findings.push({
      category: "URL_STRUCTURE",
      severity: "HIGH",
      title: "Raw IP Address Used as Hostname",
      explanation: `The URL uses a raw numerical IP address (${hostname}) instead of a registered domain name. Phishing sites frequently use raw IP addresses to bypass domain-based filters.`,
      source: "Structural Analysis Engine",
      metadata: { ip: hostname }
    });
  }

  // 2. Punycode / Internationalized Domain Name Check
  if (norm.isPunycode) {
    findings.push({
      category: "URL_STRUCTURE",
      severity: "HIGH",
      title: "Punycode (IDN) Character Encoding Detected",
      explanation: "The domain uses Punycode encoding (starting with 'xn--'). This technique is often used in homograph attacks to mimic legitimate brand domains using visually similar non-Latin characters.",
      source: "Structural Analysis Engine",
      metadata: { hostname }
    });
  }

  // 3. Brand Impersonation / Typosquatting Check
  for (const brand of BRAND_KEYWORDS) {
    if (hostname.includes(brand)) {
      const officialList = OFFICIAL_DOMAINS[brand] || [];
      const isOfficial = officialList.some(official => hostname === official || hostname.endsWith("." + official));
      
      if (!isOfficial) {
        findings.push({
          category: "DOMAIN_INFO",
          severity: "HIGH",
          title: `Potential Brand Impersonation (${brand.toUpperCase()})`,
          explanation: `The hostname contains the brand name '${brand}' but is NOT an official domain registered to ${brand}. Legitimate services rarely host brand portals on third-party domain structures.`,
          source: "Structural Analysis Engine",
          metadata: { brand, hostname, officialDomains: officialList }
        });
        break;
      }
    }
  }

  // 4. Suspicious Top-Level Domain (TLD) Check
  const parts = hostname.split(".");
  const tld = parts[parts.length - 1];
  if (SUSPICIOUS_TLDS.includes(tld)) {
    findings.push({
      category: "DOMAIN_INFO",
      severity: "MEDIUM",
      title: `High-Risk Top-Level Domain (.${tld})`,
      explanation: `The top-level domain '.${tld}' is frequently associated with disposable, low-cost registration phishing and malware domains.`,
      source: "Structural Analysis Engine",
      metadata: { tld }
    });
  }

  // 5. Excessive Subdomain Depth Check
  if (parts.length > 4 && !norm.isIpHostname) {
    findings.push({
      category: "URL_STRUCTURE",
      severity: "MEDIUM",
      title: "Excessive Subdomain Complexity",
      explanation: `The domain contains ${parts.length - 1} subdomain levels (${hostname}). Deeply nested subdomains are often used to confuse users by pushing the actual registered domain out of view.`,
      source: "Structural Analysis Engine",
      metadata: { subdomainCount: parts.length - 1 }
    });
  }

  // 6. Shortened URL Service Check
  if (KNOWN_SHORTENERS.includes(hostname)) {
    findings.push({
      category: "URL_STRUCTURE",
      severity: "LOW",
      title: "URL Shortening Service Detected",
      explanation: `This link uses a URL shortener (${hostname}), which masks the final destination address. Attackers use shorteners to hide dangerous links from casual inspection.`,
      source: "Structural Analysis Engine",
      metadata: { shortener: hostname }
    });
  }

  // 7. Non-Standard Port Check
  if (norm.port && norm.port !== "80" && norm.port !== "443") {
    findings.push({
      category: "URL_STRUCTURE",
      severity: "MEDIUM",
      title: `Non-Standard Web Port (${norm.port})`,
      explanation: `The URL explicitly specifies port ${norm.port}. Standard web browsing uses ports 80 (HTTP) or 443 (HTTPS). Non-standard ports may host unmonitored services.`,
      source: "Structural Analysis Engine",
      metadata: { port: norm.port }
    });
  }

  // 8. Obfuscated '@' Symbol Trick Check
  if (norm.rawInput.includes("@")) {
    findings.push({
      category: "URL_STRUCTURE",
      severity: "HIGH",
      title: "Embedded '@' Obfuscation Symbol Detected",
      explanation: "The URL contains an '@' symbol. Browsers treat characters before '@' as login credentials, effectively directing the user to whatever domain comes AFTER the '@' symbol, regardless of what appears first.",
      source: "Structural Analysis Engine"
    });
  }

  // 9. Sensitive Keyword Combination Check
  const fullPath = (hostname + (norm.pathname || "") + (norm.search || "")).toLowerCase();
  const matchedSecurityKeywords = SECURITY_KEYWORDS.filter(kw => fullPath.includes(kw));
  if (matchedSecurityKeywords.length >= 2 && !findings.some(f => f.title.includes("Brand Impersonation"))) {
    findings.push({
      category: "URL_STRUCTURE",
      severity: "MEDIUM",
      title: "Security & Authentication Keywords Present",
      explanation: `The URL contains suspicious security-sensitive keywords (${matchedSecurityKeywords.join(", ")}). Unverified sites collecting credentials or login data carry increased risk.`,
      source: "Structural Analysis Engine",
      metadata: { matchedKeywords: matchedSecurityKeywords }
    });
  }

  // 10. Excessive URL Length Check
  if (norm.rawInput.length > 120) {
    findings.push({
      category: "URL_STRUCTURE",
      severity: "LOW",
      title: "Unusually Long URL Length",
      explanation: `The URL length is ${norm.rawInput.length} characters. Extremely long URLs may be used to obscure payload parameters or bypass rudimentary string filters.`,
      source: "Structural Analysis Engine",
      metadata: { length: norm.rawInput.length }
    });
  }

  return findings;
}
