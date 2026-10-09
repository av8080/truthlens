import { Router, Request, Response } from "express";
import { prisma } from "../config/db.js";

export const statsRouter = Router();

/**
 * GET /api/stats
 * Aggregates live database statistics for the Security Dashboard.
 */
statsRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const totalScans = await prisma.scan.count();
    const confirmedThreats = await prisma.scan.count({ where: { verdict: "KNOWN_THREAT" } });
    const highRiskCount = await prisma.scan.count({ where: { verdict: "HIGH_RISK" } });
    const suspiciousCount = await prisma.scan.count({ where: { verdict: "SUSPICIOUS" } });
    const safeCount = await prisma.scan.count({ where: { verdict: "NO_THREAT_DETECTED" } });
    const inconclusiveCount = await prisma.scan.count({
      where: { verdict: { in: ["INCONCLUSIVE", "UNABLE_TO_VERIFY"] } }
    });

    // Recent 5 scans
    const recentScans = await prisma.scan.findMany({
      orderBy: { createdAt: "desc" },
      take: 5
    });

    // Risk distribution chart data
    const distribution = [
      { name: "Known Threats", count: confirmedThreats, color: "#EF4444" },
      { name: "High Risk", count: highRiskCount, color: "#F97316" },
      { name: "Suspicious", count: suspiciousCount, color: "#FBBF24" },
      { name: "No Threat Detected", count: safeCount, color: "#10B981" },
      { name: "Inconclusive", count: inconclusiveCount, color: "#6B7280" }
    ];

    return res.json({
      summary: {
        totalScans,
        confirmedThreats,
        highRiskCount,
        suspiciousCount,
        safeCount,
        inconclusiveCount
      },
      distribution,
      recentScans
    });
  } catch (err) {
    console.error("Stats calculation error:", err);
    return res.status(500).json({ error: "Failed to compute dashboard statistics." });
  }
});

/**
 * GET /api/health
 * Returns application health status and threat intel key readiness.
 */
statsRouter.get("/health", (_req: Request, res: Response) => {
  const googleConfigured = Boolean(process.env.GOOGLE_WEB_RISK_API_KEY);
  const virusTotalConfigured = Boolean(process.env.VIRUSTOTAL_API_KEY);

  return res.json({
    status: "OK",
    service: "TruthLens Security Platform",
    timestamp: new Date().toISOString(),
    providers: {
      googleWebRisk: googleConfigured ? "CONFIGURED" : "NOT_CONFIGURED",
      virusTotal: virusTotalConfigured ? "CONFIGURED" : "NOT_CONFIGURED"
    },
    mode: (googleConfigured || virusTotalConfigured) ? "THREAT_INTEL_ACTIVE" : "HEURISTIC_ONLY"
  });
});
