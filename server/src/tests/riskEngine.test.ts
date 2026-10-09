import { describe, it, expect } from "vitest";
import { validateAndNormalizeUrl } from "../engine/urlValidator.js";
import { analyzeUrlStructure } from "../engine/urlHeuristics.js";
import { analyzeMessage } from "../engine/messageAnalyzer.js";
import { calculateUrlRisk } from "../engine/riskCalculator.js";

describe("TruthLens URL Validator", () => {
  it("normalizes standard HTTP/HTTPS URLs", () => {
    const res = validateAndNormalizeUrl("example.com");
    expect(res.isValid).toBe(true);
    expect(res.normalizedUrl).toBe("https://example.com/");
    expect(res.hostname).toBe("example.com");
  });

  it("rejects dangerous javascript: protocols", () => {
    const res = validateAndNormalizeUrl("javascript:alert(1)");
    expect(res.isValid).toBe(false);
    expect(res.error).toContain("Unsupported or unsafe protocol");
  });

  it("rejects embedded authentication credentials", () => {
    const res = validateAndNormalizeUrl("http://admin:secret123@phishing-site.com");
    expect(res.isValid).toBe(false);
    expect(res.error).toContain("embedded authentication credentials");
  });

  it("identifies raw IP address hostnames", () => {
    const res = validateAndNormalizeUrl("http://192.168.1.1/login.php");
    expect(res.isValid).toBe(true);
    expect(res.isIpHostname).toBe(true);
  });
});

describe("TruthLens Structural Heuristics Engine", () => {
  it("detects brand typosquatting / impersonation", () => {
    const norm = validateAndNormalizeUrl("https://paypal-security-update.account-verify.xyz");
    const findings = analyzeUrlStructure(norm);
    
    const brandFinding = findings.find(f => f.title.includes("Brand Impersonation"));
    expect(brandFinding).toBeDefined();
    expect(brandFinding?.severity).toBe("HIGH");

    const tldFinding = findings.find(f => f.title.includes("Top-Level Domain"));
    expect(tldFinding).toBeDefined();
  });

  it("flags raw IP address hostnames", () => {
    const norm = validateAndNormalizeUrl("http://192.168.1.1/login.php");
    const findings = analyzeUrlStructure(norm);
    
    const ipFinding = findings.find(f => f.title.includes("Raw IP Address"));
    expect(ipFinding).toBeDefined();
    expect(ipFinding?.severity).toBe("HIGH");
  });
});

describe("TruthLens Message Analyzer", () => {
  it("detects OTP theft and urgency in suspicious messages", () => {
    const msg = "URGENT: Your account has been locked! Reply immediately with your OTP verification code to prevent permanent deletion.";
    const result = analyzeMessage(msg);
    
    expect(result.verdict).toBe("HIGH_RISK");
    expect(result.findings.some(f => f.title.includes("OTP"))).toBe(true);
    expect(result.findings.some(f => f.title.includes("Urgency"))).toBe(true);
  });

  it("extracts embedded URLs accurately", () => {
    const msg = "Please verify your account details at http://paypal-update.top now.";
    const result = analyzeMessage(msg);

    expect(result.extractedUrls.length).toBe(1);
    expect(result.extractedUrls[0].url).toBe("http://paypal-update.top");
  });
});

describe("TruthLens End-to-End Risk Calculator", () => {
  it("classifies benign domain correctly as NO_THREAT_DETECTED", async () => {
    const report = await calculateUrlRisk("https://example.com");
    expect(report.verdict).toBe("NO_THREAT_DETECTED");
    expect(report.heuristicScore).toBeLessThan(25);
  });

  it("classifies typosquatting domain correctly as HIGH_RISK", async () => {
    const report = await calculateUrlRisk("https://paypal-verify-login.secure-account-update.xyz");
    expect(report.verdict).toBe("HIGH_RISK");
    expect(report.heuristicScore).toBeGreaterThanOrEqual(50);
    expect(report.findings.length).toBeGreaterThan(0);
  });
});
