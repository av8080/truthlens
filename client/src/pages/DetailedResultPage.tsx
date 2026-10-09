import React, { useState } from "react";
import { ScanReport } from "../types/scan";
import { RiskBadge } from "../components/ui/RiskBadge";
import { EvidenceCard } from "../components/ui/EvidenceCard";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Download,
  Printer,
  ArrowLeft,
  RotateCcw,
  Check,
  ExternalLink,
  Info,
  Database,
  Search
} from "lucide-react";

interface DetailedResultPageProps {
  report: ScanReport;
  scanId?: string;
  onBackToDashboard: () => void;
  onRescan?: () => void;
  onScanUrl?: (url: string) => void;
}

export const DetailedResultPage: React.FC<DetailedResultPageProps> = ({
  report,
  scanId,
  onBackToDashboard,
  onRescan,
  onScanUrl
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const summaryText = `[TruthLens Security Report]
Input: ${report.normalizedUrl || report.inputUrl || report.sanitizedSummary}
Verdict: ${report.verdict}
Heuristic Score: ${report.heuristicScore}/100
Provider Status: ${report.providerStatus}
Timestamp: ${new Date(report.timestamp).toLocaleString()}
Key Recommendation: ${report.recommendations[0] || "Exercise caution."}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `truthlens-report-${scanId || Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  // Verdict Colors for Banner
  let bannerClass = "border-gray-700 bg-surface text-white";
  switch (report.verdict) {
    case "KNOWN_THREAT":
      bannerClass = "border-red-500/50 bg-red-950/30 glow-border-threat";
      break;
    case "HIGH_RISK":
      bannerClass = "border-orange-500/50 bg-orange-950/30 glow-border-highRisk";
      break;
    case "SUSPICIOUS":
      bannerClass = "border-amber-500/50 bg-amber-950/30 glow-border-suspicious";
      break;
    case "NO_THREAT_DETECTED":
      bannerClass = "border-emerald-500/50 bg-emerald-950/30 glow-border-safe";
      break;
    default:
      bannerClass = "border-gray-700 bg-surface";
      break;
  }

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* ACTION BAR & BACK BUTTON */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white bg-surface hover:bg-surface-hover px-3.5 py-2 rounded-xl border border-surface-border transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {onRescan && (
            <button
              onClick={onRescan}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white bg-surface hover:bg-surface-hover px-3 py-2 rounded-xl border border-surface-border"
            >
              <RotateCcw size={14} />
              Rescan
            </button>
          )}

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-accent bg-cyan-accent/10 hover:bg-cyan-accent/20 px-3 py-2 rounded-xl border border-cyan-accent/30 transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy Summary"}
          </button>

          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white bg-surface hover:bg-surface-hover px-3 py-2 rounded-xl border border-surface-border"
          >
            <Download size={14} />
            Export JSON
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white bg-surface hover:bg-surface-hover px-3 py-2 rounded-xl border border-surface-border"
          >
            <Printer size={14} />
            Print Report
          </button>
        </div>
      </div>

      {/* OVERALL VERDICT BANNER */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${bannerClass} transition-all space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <RiskBadge verdict={report.verdict} size="lg" />
              <span className="text-xs text-gray-400 font-mono">ID: {scanId || "LIVE-SCAN"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono break-all pt-2">
              {report.normalizedUrl || report.inputUrl || report.sanitizedSummary}
            </h1>
          </div>

          {/* Heuristic Score Meter */}
          <div className="p-4 rounded-2xl bg-surface/80 border border-white/10 text-center shrink-0 min-w-[140px]">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Heuristic Risk Score
            </span>
            <span className="text-3xl font-extrabold text-white">
              {report.heuristicScore}
              <span className="text-sm font-normal text-gray-400">/100</span>
            </span>
            <span className="text-[10px] text-gray-400 block mt-1">
              {report.heuristicScore >= 60 ? "High Risk Level" : report.heuristicScore >= 25 ? "Moderate Risk" : "Low Risk"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-gray-300">
          <div>
            <span className="text-gray-400">Scan Timestamp: </span>
            <span className="font-mono text-white">{new Date(report.timestamp).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-400">Threat Intel Provider Status: </span>
            <span className="font-semibold text-cyan-accent">{report.providerStatus}</span>
          </div>
        </div>
      </div>

      {/* RECOMMENDED ACTIONS PANEL */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <ShieldCheck size={20} className="text-cyan-accent" />
          Recommended Action Guidance
        </h3>

        <div className="space-y-2">
          {report.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-surface-hover/50 text-xs text-gray-200">
              <span className="font-bold text-cyan-accent shrink-0">{idx + 1}.</span>
              <p className="leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* EXTRACTED URLS (FOR MESSAGE SCANS) */}
      {report.extractedUrls && report.extractedUrls.length > 0 && (
        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Search className="text-cyan-accent" size={16} />
            Extracted Links Found in Message
          </h3>

          <div className="space-y-2">
            {report.extractedUrls.map((extracted, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-hover/60 border border-white/5 text-xs"
              >
                <span className="font-mono text-cyan-accent truncate max-w-md">{extracted.url}</span>
                {onScanUrl && (
                  <button
                    onClick={() => onScanUrl(extracted.url)}
                    className="flex items-center gap-1 font-bold text-gray-950 bg-cyan-accent hover:bg-cyan-hover px-3 py-1.5 rounded-lg shrink-0 transition-colors"
                  >
                    Analyze Link
                    <ExternalLink size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* THREAT INTEL PROVIDERS CHECK TABLE */}
      {report.providerChecks && report.providerChecks.length > 0 && (
        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Database size={18} className="text-cyan-accent" />
            Threat Intelligence Provider Checks
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-surface-hover text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-surface-border">
                <tr>
                  <th className="py-2.5 px-4">Provider Engine</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Threat Categories Match</th>
                  <th className="py-2.5 px-4 text-right">Checked At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border font-mono">
                {report.providerChecks.map((p, idx) => (
                  <tr key={idx} className="hover:bg-surface-hover/40">
                    <td className="py-3 px-4 font-bold text-white">{p.providerName}</td>
                    <td className="py-3 px-4">
                      {p.status === "MATCH_FOUND" ? (
                        <span className="text-red-400 font-bold bg-red-950/60 px-2 py-0.5 rounded border border-red-800">
                          MATCH FOUND
                        </span>
                      ) : p.status === "NO_MATCH" ? (
                        <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          CLEAN / NO MATCH
                        </span>
                      ) : p.status === "NOT_CONFIGURED" ? (
                        <span className="text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                          NOT CONFIG (HEURISTIC MODE)
                        </span>
                      ) : (
                        <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
                          ERROR / UNREACHABLE
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {p.threatTypes && p.threatTypes.length > 0 ? p.threatTypes.join(", ") : "None"}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-400 text-[11px]">
                      {new Date(p.checkedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUSPICIOUS INDICATORS BREAKDOWN */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
        <h3 className="font-bold text-base text-white">
          Suspicious Indicators Breakdown ({report.findings.length})
        </h3>

        {report.findings.length === 0 ? (
          <div className="p-6 rounded-xl bg-surface-hover/40 text-center text-xs text-gray-400">
            No high-risk structural anomalies or threat indicators were flagged during this check.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.findings.map((finding, idx) => (
              <EvidenceCard key={idx} finding={finding} />
            ))}
          </div>
        )}
      </div>

      {/* LIMITATIONS NOTICE */}
      <div className="p-4 rounded-2xl bg-surface-hover/40 border border-surface-border flex items-start gap-3 text-xs text-gray-400">
        <Info size={18} className="text-cyan-accent shrink-0 mt-0.5" />
        <p className="leading-relaxed">{report.limitationsNotice}</p>
      </div>
    </div>
  );
};
