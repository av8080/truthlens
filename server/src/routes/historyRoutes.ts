import { Router, Request, Response } from "express";
import { prisma } from "../config/db.js";

export const historyRouter = Router();

/**
 * GET /api/scans
 * Retrieves paginated scan history with search and filtering.
 */
historyRouter.get("/", async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string) || "";
    const verdict = (req.query.verdict as string) || "";
    const scanType = (req.query.type as string) || "";
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "10", 10);

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.sanitizedInput = { contains: search };
    }

    if (verdict && verdict !== "ALL") {
      where.verdict = verdict;
    }

    if (scanType && scanType !== "ALL") {
      where.scanType = scanType;
    }

    const [scans, total] = await Promise.all([
      prisma.scan.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          findings: true,
          providerChecks: true
        }
      }),
      prisma.scan.count({ where })
    ]);

    return res.json({
      scans,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  } catch (err) {
    console.error("Fetch history error:", err);
    return res.status(500).json({ error: "Failed to fetch scan history." });
  }
});

/**
 * GET /api/scans/:id
 * Fetches a single scan record with full findings.
 */
historyRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const scan = await prisma.scan.findUnique({
      where: { id: req.params.id },
      include: {
        findings: true,
        providerChecks: true
      }
    });

    if (!scan) {
      return res.status(404).json({ error: "Scan record not found." });
    }

    return res.json({ scan });
  } catch (err) {
    console.error("Fetch scan details error:", err);
    return res.status(500).json({ error: "Failed to fetch scan record." });
  }
});

/**
 * DELETE /api/scans/:id
 * Deletes a single scan record.
 */
historyRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.scan.delete({
      where: { id: req.params.id }
    });
    return res.json({ success: true, message: "Scan record deleted." });
  } catch (err) {
    console.error("Delete scan error:", err);
    return res.status(404).json({ error: "Scan record not found or already deleted." });
  }
});

/**
 * DELETE /api/scans
 * Clears all scan history.
 */
historyRouter.delete("/", async (_req: Request, res: Response) => {
  try {
    await prisma.scan.deleteMany();
    return res.json({ success: true, message: "All scan history cleared successfully." });
  } catch (err) {
    console.error("Clear history error:", err);
    return res.status(500).json({ error: "Failed to clear scan history." });
  }
});
