import React, { useState } from "react";
import { UrlInput } from "../components/scanner/UrlInput";
import { Shield, Info, Lock, Globe, Database, Zap, AlertTriangle } from "lucide-react";

interface UrlScannerPageProps {
  onScan: (url: string) => void;
  isLoading?: boolean;
}

export const UrlScannerPage: React.FC<UrlScannerPageProps> = ({ onScan, isLoading }) => {
  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent text-xs font-semibold">
          <Globe size={14} />
          URL & Domain Intelligence Scanner
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Investigate Suspicious Links
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Analyze web URLs for brand spoofing, typosquatting, raw IP hostnames, punycode tricks, and threat intelligence list matches.
        </p>
      </div>

      {/* SCANNER INPUT COMPONENT */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-2xl space-y-6">
        <UrlInput onScan={onScan} isLoading={isLoading} />
      </div>

      {/* WHAT WE CHECK — EXPLAINABLE FEATURES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-2">
          <Database className="text-cyan-accent" size={20} />
          <h4 className="font-bold text-sm text-white">Threat Lists</h4>
          <p className="text-xs text-gray-400">Queries configured Google Web Risk & VirusTotal APIs for confirmed malicious matches.</p>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-2">
          <Zap className="text-amber-400" size={20} />
          <h4 className="font-bold text-sm text-white">Structural Heuristics</h4>
          <p className="text-xs text-gray-400">Detects brand typosquatting, excessive subdomains, non-standard web ports, and @ tricks.</p>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-2">
          <Lock className="text-emerald-400" size={20} />
          <h4 className="font-bold text-sm text-white">SSRF Protected</h4>
          <p className="text-xs text-gray-400">TruthLens never opens submitted links or fetches remote content directly from our servers.</p>
        </div>
      </div>

      {/* SAFETY WARNING NOTICE */}
      <div className="p-4 rounded-2xl bg-surface-hover/50 border border-surface-border flex items-start gap-3 text-xs text-gray-300">
        <Info size={18} className="text-cyan-accent shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-white mb-0.5">Safety Rule: Never Click Unverified Links</p>
          <p className="leading-relaxed">
            If a link arrived via an unsolicited text message or unexpected email demanding urgent action, inspect it here before opening it in your browser.
          </p>
        </div>
      </div>
    </div>
  );
};
