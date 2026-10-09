import React, { useEffect, useState } from "react";
import { getScanHistory, deleteScanRecord, clearAllScanHistory } from "../services/api";
import { HistoryScanRecord, VerdictType } from "../types/scan";
import { RiskBadge } from "../components/ui/RiskBadge";
import { History, Search, Trash2, RefreshCw, ChevronLeft, ChevronRight, AlertTriangle, ShieldAlert } from "lucide-react";

interface ScanHistoryPageProps {
  onViewReport: (scanId: string) => void;
}

export const ScanHistoryPage: React.FC<ScanHistoryPageProps> = ({ onViewReport }) => {
  const [scans, setScans] = useState<HistoryScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [verdictFilter, setVerdictFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [showClearModal, setShowClearModal] = useState(false);

  const loadHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getScanHistory({
        search,
        verdict: verdictFilter,
        type: typeFilter,
        page,
        limit: 10
      });
      setScans(data.scans);
      setTotalPages(data.pagination.totalPages);
      setTotalCount(data.pagination.total);
    } catch (err: any) {
      setError(err.message || "Failed to load scan history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [search, verdictFilter, typeFilter, page]);

  const handleDeleteRecord = async (id: string) => {
    try {
      await deleteScanRecord(id);
      loadHistory();
    } catch (err: any) {
      alert(err.message || "Failed to delete record.");
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearAllScanHistory();
      setShowClearModal(false);
      loadHistory();
    } catch (err: any) {
      alert(err.message || "Failed to clear scan history.");
    }
  };

  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <History className="text-cyan-accent" size={28} />
            Persistent Scan History Audit Log
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Browse, search, filter, and manage your saved URL and message analysis reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadHistory}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white bg-surface-hover px-3 py-2 rounded-xl border border-surface-border"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => setShowClearModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950/70 px-3.5 py-2 rounded-xl border border-red-800/50"
          >
            <Trash2 size={14} />
            Clear All History
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 rounded-2xl bg-surface border border-surface-border grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Search */}
        <div className="sm:col-span-2 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search saved scans by URL or keyword..."
            className="w-full bg-surface-hover text-white text-xs pl-9 pr-3 py-2 rounded-xl border border-white/5 focus:outline-none focus:border-cyan-accent"
          />
        </div>

        {/* Verdict Filter */}
        <div>
          <select
            value={verdictFilter}
            onChange={(e) => {
              setVerdictFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-surface-hover text-white text-xs px-3 py-2 rounded-xl border border-white/5 focus:outline-none focus:border-cyan-accent"
          >
            <option value="ALL">All Verdict Types</option>
            <option value="KNOWN_THREAT">Known Threats</option>
            <option value="HIGH_RISK">High Risk</option>
            <option value="SUSPICIOUS">Suspicious</option>
            <option value="NO_THREAT_DETECTED">No Threat Detected</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-surface-hover text-white text-xs px-3 py-2 rounded-xl border border-white/5 focus:outline-none focus:border-cyan-accent"
          >
            <option value="ALL">All Scan Types</option>
            <option value="URL">URL Scans</option>
            <option value="MESSAGE">Message Scans</option>
          </select>
        </div>
      </div>

      {/* HISTORY TABLE */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400 space-y-2">
            <div className="w-6 h-6 border-2 border-cyan-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading database scan records...</p>
          </div>
        ) : scans.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400 space-y-2">
            <History size={36} className="mx-auto text-gray-500" />
            <p className="font-semibold text-gray-300">No History Records Found</p>
            <p className="text-gray-500">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-surface-hover text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-surface-border">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Input Target</th>
                  <th className="py-3 px-4">Verdict</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {scans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-surface-hover/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-400">{scan.scanType}</td>
                    <td className="py-3 px-4 font-mono text-white truncate max-w-sm">{scan.sanitizedInput}</td>
                    <td className="py-3 px-4">
                      <RiskBadge verdict={scan.verdict} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-accent">
                      {scan.heuristicScore !== null ? `${scan.heuristicScore}/100` : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-[11px]">
                      {new Date(scan.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => onViewReport(scan.id)}
                        className="text-xs font-semibold text-cyan-accent hover:text-cyan-hover bg-cyan-accent/10 px-2.5 py-1 rounded border border-cyan-accent/20"
                      >
                        Report
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(scan.id)}
                        className="text-xs text-gray-400 hover:text-red-400 p-1 rounded hover:bg-red-950/30"
                        title="Delete record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-border text-xs text-gray-400">
          <span>
            Showing {scans.length} of {totalCount} total scans
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded bg-surface-hover disabled:opacity-40 hover:text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-mono text-white">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded bg-surface-hover disabled:opacity-40 hover:text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL FOR CLEAR ALL */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-surface-border rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <ShieldAlert size={24} />
              <h3 className="font-extrabold text-base text-white">Confirm Clear Scan History</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to delete all saved scan reports from the local database? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:bg-surface-hover"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30"
              >
                Clear All History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
