import { Router, Request, Response } from "express";
import { z } from "zod";
import { calculateUrlRisk } from "../engine/riskCalculator.js";
import { analyzeMessage } from "../engine/messageAnalyzer.js";
import { prisma } from "../config/db.js";

export const scanRouter = Router();

const UrlScanSchema = z.object({
  url: z.string().min(1, "URL is required").max(2048, "URL is too long")
});

const MessageScanSchema = z.object({
  message: z.string().min(1, "Message content is required").max(10000, "Message is too long")
});

/**
 * POST /api/scan/url
 * Scans a user-submitted URL and persists report to database.
 */
scanRouter.post("/url", async (req: Request, res: Response) => {
  try {
    const parse = UrlScanSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.errors[0].message });
    }

    const report = await calculateUrlRisk(parse.data.url);

    // Persist scan to database
    let scanRecord = null;
    try {
      scanRecord = await prisma.scan.create({
        data: {
          scanType: "URL",
          sanitizedInput: report.normalizedUrl || report.inputUrl,
          verdict: report.verdict,
          heuristicScore: report.heuristicScore,
          providerStatus: report.providerStatus,
          findings: {
            create: report.findings.map(f => ({
              category: f.category,
              severity: f.severity,
              title: f.title,
              explanation: f.explanation,
              source: f.source,
              metadata: f.metadata ? JSON.stringify(f.metadata) : null
            }))
          },
          providerChecks: {
            create: report.providerChecks.map(p => ({
              providerName: p.providerName,
              status: p.status,
              threatTypes: p.threatTypes ? JSON.stringify(p.threatTypes) : null,
              errorCode: p.errorCode
            }))
          }
        },
        include: {
          findings: true,
          providerChecks: true
        }
      });
    } catch (dbErr) {
      console.warn("Failed to persist scan record to database:", dbErr);
    }

    return res.json({
      scanId: scanRecord?.id || "temp-" + Date.now(),
      report
    });
  } catch (err: any) {
    console.error("URL scan error:", err);
    return res.status(500).json({ error: "An error occurred while processing the URL scan request." });
  }
});

/**
 * POST /api/scan/message
 * Analyzes a text message for scam indicators and persists report to database.
 */
scanRouter.post("/message", async (req: Request, res: Response) => {
  try {
    const parse = MessageScanSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.errors[0].message });
    }

    const report = analyzeMessage(parse.data.message);

    // Persist scan to database
    let scanRecord = null;
    try {
      scanRecord = await prisma.scan.create({
        data: {
          scanType: "MESSAGE",
          sanitizedInput: report.sanitizedSummary,
          verdict: report.verdict,
          heuristicScore: report.heuristicScore,
          providerStatus: "Local Heuristic Pattern Analysis",
          findings: {
            create: report.findings.map(f => ({
              category: f.category,
              severity: f.severity,
              title: f.title,
              explanation: f.explanation,
              source: "Message Scam Engine",
              metadata: JSON.stringify({ matchedText: f.matchedText, startIndex: f.startIndex, endIndex: f.endIndex })
            }))
          }
        },
        include: {
          findings: true
        }
      });
    } catch (dbErr) {
      console.warn("Failed to persist scan record to database:", dbErr);
    }

    return res.json({
      scanId: scanRecord?.id || "temp-msg-" + Date.now(),
      report
    });
  } catch (err: any) {
    console.error("Message scan error:", err);
    return res.status(500).json({ error: "An error occurred while analyzing the message." });
  }
});
