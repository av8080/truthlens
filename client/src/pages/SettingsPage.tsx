import React, { useEffect, useState } from "react";
import { getHealthStatus, clearAllScanHistory } from "../services/api";
import { Settings, Shield, Database, Trash2, Key, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export const SettingsPage: React.FC = () => {
  const [health, setHealth] = useState<{
    status: string;
    providers: { googleWebRisk: string; virusTotal: string };
    mode: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState("");

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const data = await getHealthStatus();
      setHealth(data);
    } catch (err) {
      console.warn("Failed to fetch server health status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleClearHistory = async () => {
    if (!confirm("Are you sure you want to purge all saved scan reports from the database?")) {
      return;
    }
    setClearing(true);
    try {
      await clearAllScanHistory();
      setMessage("All scan history has been successfully purged.");
      setTimeout(() => setMessage(""), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to clear history.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto text-gray-300">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-surface-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <Settings className="text-cyan-accent" size={28} />
            Platform & API Settings
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Manage Threat Intelligence Provider Keys, Storage Retention & Preferences
          </p>
        </div>

        <button
          onClick={fetchStatus}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white bg-surface-hover px-3 py-2 rounded-xl border border-surface-border"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Status Check
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={16} />
          {message}
        </div>
      )}

      {/* THREAT INTEL API KEY STATUS */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Key className="text-cyan-accent" size={18} />
          Threat Intelligence Provider API Readiness
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          TruthLens seamlessly operates with or without third-party API keys. When keys are present in the server <code className="text-cyan-accent">.env</code> configuration, live threat list endpoints are queried.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Google Web Risk */}
          <div className="p-4 rounded-xl bg-surface-hover/60 border border-white/5 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white font-sans">Google Web Risk API</span>
              {health?.providers.googleWebRisk === "CONFIGURED" ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  ACTIVE
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                  NOT CONFIG (HEURISTIC)
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 font-sans">
              Provides social engineering, malware, and unwanted software URI lookup queries.
            </p>
          </div>

          {/* VirusTotal */}
          <div className="p-4 rounded-xl bg-surface-hover/60 border border-white/5 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white font-sans">VirusTotal API v3</span>
              {health?.providers.virusTotal === "CONFIGURED" ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  ACTIVE
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                  NOT CONFIG (HEURISTIC)
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 font-sans">
              Queries global multi-vendor security intelligence scan reports.
            </p>
          </div>
        </div>
      </div>

      {/* DATABASE & RETENTION MANAGEMENT */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Database className="text-cyan-accent" size={18} />
          Scan History & Database Storage
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          Manage stored report history. Deleting history permanently removes saved URL and message analysis records from the local SQLite/Postgres database.
        </p>

        <div className="pt-2">
          <button
            onClick={handleClearHistory}
            disabled={clearing}
            className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Trash2 size={16} />
            {clearing ? "Purging History..." : "Purge Database Scan History"}
          </button>
        </div>
      </div>

      {/* DESIGN THEME INFORMATION */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-2 text-xs">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Shield className="text-cyan-accent" size={18} />
          Theme & Display Preferences
        </h3>
        <p className="text-gray-300">
          TruthLens is locked to the <strong>Cybersecurity Dark Navy SaaS Theme</strong> (#0B1020 base with #37D7F2 Electric Cyan accents) for maximum readability and visual contrast.
        </p>
      </div>
    </div>
  );
};
