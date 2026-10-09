import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import { scanRouter } from "./routes/scanRoutes.js";
import { historyRouter } from "./routes/historyRoutes.js";
import { statsRouter } from "./routes/statsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false // Disabled for dev flexibility
  })
);

// Cross-Origin Resource Sharing
app.use(cors());

// Body Parsers with strict size limits
app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: true, limit: "256kb" }));

// Rate Limiting (100 requests per 15 minutes window)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many scan requests from this IP. Please try again after 15 minutes." }
});
app.use("/api/", limiter);

// API Routes
app.use("/api/scan", scanRouter);
app.use("/api/scans", historyRouter);
app.use("/api/stats", statsRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.redirect("/api/stats/health");
});

// Serve static client bundle in production if built
const clientBuildPath = path.join(process.cwd(), "..", "client", "dist");
app.use(express.static(clientBuildPath));

app.get("*", (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, "index.html"), (err) => {
    if (err) {
      res.status(404).send("TruthLens API server running. Frontend client static assets not built.");
    }
  });
});

// Centralized Error Handling Middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({ error: "An unexpected internal server error occurred." });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` TruthLens Server Running on http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`=======================================================`);
});
