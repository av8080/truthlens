import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../services/api";
import { DashboardStats, HistoryScanRecord } from "../types/scan";
import { RiskBadge } from "../components/ui/RiskBadge";
import { RiskDistributionChart } from "../components/charts/RiskDistributionChart";
import { ScanActivityChart } from "../components/charts/ScanActivityChart";
import { Shield, ShieldAlert, AlertTriangle, ShieldCheck, Search, MessageSquare, History, BookOpen, ArrowRight, RefreshCw } from "lucide-react";

interface DashboardPageProps {
  onScanUrl: (url: string) => void;
  onAnalyzeMessage: (msg: string) => void;
  onViewReport: (scanId: string) => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onScanUrl,
  onAnalyzeMessage,
  onViewReport,
  setActiveTab
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quickUrl, setQuickUrl] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickUrl.trim()) {
      onScanUrl(quickUrl.trim());
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <Shield className="text-cyan-accent" size={28} />
            Security Intelligence Dashboard
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Real-time Threat Overview, Risk Distribution & Analysis Activity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadStats}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white bg-surface-hover px-3 py-2 rounded-lg border border-surface-border transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => setActiveTab("url-scanner")}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-950 bg-cyan-accent hover:bg-cyan-hover px-3.5 py-2 rounded-lg shadow-md shadow-cyan-accent/20 transition-all"
          >
            <Search size={14} />
            Scan URL
          </button>
        </div>
      </div>

      {/* QUICK URL SCAN BAR */}
      <div className="p-4 rounded-2xl bg-surface border border-surface-border">
        <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-accent" size={18} />
            <input
              type="text"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              placeholder="Quick URL Scan: Enter domain or suspicious link..."
              className="w-full bg-surface-hover text-white placeholder-gray-500 text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-white/5 focus:outline-none focus:border-cyan-accent"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-accent to-blue-500 hover:from-cyan-hover hover:to-blue-600 text-gray-950 font-bold text-xs px-5 py-2.5 rounded-xl shrink-0 transition-all shadow-md shadow-cyan-accent/20"
          >
            Scan Now
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("message-analyzer")}
            className="w-full sm:w-auto bg-surface-hover hover:bg-surface-border text-gray-300 font-semibold text-xs px-4 py-2.5 rounded-xl shrink-0 transition-all border border-white/5 flex items-center justify-center gap-1.5"
          >
            <MessageSquare size={14} />
            Message Analyzer
          </button>
        </form>
      </div>

      {/* STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scans */}
        <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Scans Run</span>
            <History size={18} className="text-cyan-accent" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats?.summary.totalScans || 0}</p>
          <p className="text-[11px] text-gray-400">Persistent database audit logs</p>
        </div>

        {/* Confirmed Threats */}
        <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-red-400">
            <span className="text-xs font-bold uppercase tracking-wider">Confirmed Threats</span>
            <ShieldAlert size={18} />
          </div>
          <p className="text-3xl font-extrabold text-red-400">{stats?.summary.confirmedThreats || 0}</p>
          <p className="text-[11px] text-gray-400">Threat list matches found</p>
        </div>

        {/* Suspicious & High Risk */}
        <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider">Suspicious & High Risk</span>
            <AlertTriangle size={18} />
          </div>
          <p className="text-3xl font-extrabold text-amber-400">
            {(stats?.summary.highRiskCount || 0) + (stats?.summary.suspiciousCount || 0)}
          </p>
          <p className="text-[11px] text-gray-400">Structural warning indicators</p>
        </div>

        {/* Verified Positive Checks */}
        <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold uppercase tracking-wider">No Threat Detected</span>
            <ShieldCheck size={18} />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">{stats?.summary.safeCount || 0}</p>
          <p className="text-[11px] text-gray-400">Completed checks with clean results</p>
        </div>
      </div>

      {/* VISUAL CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
          <h3 className="font-bold text-base text-white">Risk Category Breakdown</h3>
          <RiskDistributionChart data={stats?.distribution || []} />
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
          <h3 className="font-bold text-base text-white">Scan Activity Over Time</h3>
          <ScanActivityChart scans={stats?.recentScans || []} />
        </div>
      </div>

      {/* RECENT SCANS LOG TABLE */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white">Recent Scans</h3>
            <p className="text-gray-400 text-xs">Latest 5 URL & Message investigations</p>
          </div>
          <button
            onClick={() => setActiveTab("history")}
            className="flex items-center gap-1 text-xs font-semibold text-cyan-accent hover:underline"
          >
            View Full History
            <ArrowRight size={14} />
          </button>
        </div>

        {!stats?.recentScans || stats.recentScans.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-surface-border rounded-xl space-y-2">
            <History size={32} className="mx-auto text-gray-500" />
            <p className="text-xs text-gray-400 font-semibold">No Scans Recorded Yet</p>
            <p className="text-[11px] text-gray-500">Run your first URL or message scan to start tracking history.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-surface-hover/80 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-surface-border">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Input</th>
                  <th className="py-3 px-4">Verdict</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {stats.recentScans.map((record) => (
                  <tr key={record.id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-400">{record.scanType}</td>
                    <td className="py-3 px-4 font-mono text-white truncate max-w-xs">{record.sanitizedInput}</td>
                    <td className="py-3 px-4">
                      <RiskBadge verdict={record.verdict} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-accent">
                      {record.heuristicScore !== null ? `${record.heuristicScore}/100` : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-[11px]">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onViewReport(record.id)}
                        className="text-xs font-semibold text-cyan-accent hover:text-cyan-hover bg-cyan-accent/10 px-2.5 py-1 rounded border border-cyan-accent/20"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QUICK SHORTCUTS TO EDUCATION */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-surface via-[#121E33] to-surface border border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <BookOpen size={18} className="text-cyan-accent" />
            Threat Education & Awareness Library
          </h4>
          <p className="text-xs text-gray-400">Learn how to recognize typosquatting, QR scams, fake job offers, and HTTPS myths.</p>
        </div>
        <button
          onClick={() => setActiveTab("education")}
          className="bg-surface-hover hover:bg-surface-border text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/10 shrink-0 flex items-center gap-2"
        >
          Explore Articles
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
