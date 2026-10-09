import React, { useState } from "react";
import { UrlInput } from "../components/scanner/UrlInput";
import { MessageInput } from "../components/scanner/MessageInput";
import { Shield, Search, MessageSquare, ShieldCheck, Zap, Lock, Info, ArrowRight, Database, AlertCircle, FileCheck } from "lucide-react";
import { RiskBadge } from "../components/ui/RiskBadge";

interface LandingPageProps {
  onScanUrl: (url: string) => void;
  onAnalyzeMessage: (msg: string) => void;
  setActiveTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onScanUrl, onAnalyzeMessage, setActiveTab }) => {
  const [activeScanner, setActiveScanner] = useState<"url" | "message">("url");

  const sampleScans = [
    {
      title: "paypal-security-update.account-verify.xyz",
      type: "URL Scan",
      verdict: "HIGH_RISK" as const,
      score: 75,
      findings: "Brand impersonation (PayPal) & high-risk TLD (.xyz) detected."
    },
    {
      title: "https://example.com",
      type: "URL Scan",
      verdict: "NO_THREAT_DETECTED" as const,
      score: 0,
      findings: "Standard registered domain, no structural anomalies."
    },
    {
      title: "URGENT: Reply with your OTP code to unlock account...",
      type: "Message Scan",
      verdict: "HIGH_RISK" as const,
      score: 80,
      findings: "Critical OTP theft pattern & artificial urgency matched."
    }
  ];

  return (
    <div className="space-y-16 py-6 sm:py-12">
      {/* HERO SECTION */}
      <section className="text-center space-y-6 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent text-xs font-semibold shadow-[0_0_15px_rgba(55,215,242,0.15)]">
          <Shield size={14} />
          TruthLens Security Platform
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Don't Trust the Link. <br />
          <span className="bg-gradient-to-r from-cyan-accent via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Verify It.
          </span>
        </h1>

        <p className="text-gray-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Check suspicious URLs, investigate unexpected messages, and understand the warning signs before you click.
        </p>

        {/* Scanner Tabs Switcher */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setActiveScanner("url")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeScanner === "url"
                ? "bg-cyan-accent text-gray-950 shadow-md shadow-cyan-accent/20"
                : "bg-surface-hover text-gray-300 border border-surface-border hover:text-white"
            }`}
          >
            <Search size={16} />
            URL Scanner
          </button>
          <button
            onClick={() => setActiveScanner("message")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeScanner === "message"
                ? "bg-cyan-accent text-gray-950 shadow-md shadow-cyan-accent/20"
                : "bg-surface-hover text-gray-300 border border-surface-border hover:text-white"
            }`}
          >
            <MessageSquare size={16} />
            Message Scam Analyzer
          </button>
        </div>

        {/* Main Interactive Scanner Container */}
        <div className="pt-2">
          {activeScanner === "url" ? (
            <UrlInput onScan={onScanUrl} />
          ) : (
            <MessageInput onAnalyze={onAnalyzeMessage} />
          )}
        </div>
      </section>

      {/* HOW IT WORKS — 3 STEPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How TruthLens Protects You</h2>
          <p className="text-gray-400 text-xs sm:text-sm">Explainable scam detection in three transparent steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-center text-cyan-accent font-extrabold text-sm">
              01
            </div>
            <h3 className="font-bold text-base text-white">Enter Link or Message</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Paste any suspicious web link, SMS text message, unexpected payment email, or fake job notification.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-center text-cyan-accent font-extrabold text-sm">
              02
            </div>
            <h3 className="font-bold text-base text-white">Multi-Layered Analysis</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              We check official threat intelligence lookup lists (Google Web Risk, VirusTotal) alongside structural URL heuristics and scam regex patterns.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-center text-cyan-accent font-extrabold text-sm">
              03
            </div>
            <h3 className="font-bold text-base text-white">Clear Verdict & Action Plan</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Receive a transparent risk score, evidence breakdown, and tailored step-by-step guidance on what to do next.
            </p>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-b from-surface to-[#0D1424] border border-surface-border space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Security & Intelligence Features</h2>
              <p className="text-gray-400 text-xs mt-1">Built to answer the 5 critical security questions before you trust a link.</p>
            </div>
            <button
              onClick={() => setActiveTab("methodology")}
              className="flex items-center gap-2 text-xs font-semibold text-cyan-accent hover:text-cyan-hover bg-cyan-accent/10 px-3.5 py-2 rounded-lg border border-cyan-accent/30"
            >
              <Info size={14} />
              Read Our Methodology
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-surface-hover/60 border border-white/5 space-y-2">
              <Database className="text-cyan-accent" size={20} />
              <h4 className="font-bold text-sm text-white">Threat Intelligence</h4>
              <p className="text-xs text-gray-400">Integrates canonical Web Risk and VirusTotal database lookups.</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-hover/60 border border-white/5 space-y-2">
              <Zap className="text-amber-400" size={20} />
              <h4 className="font-bold text-sm text-white">Structural Heuristics</h4>
              <p className="text-xs text-gray-400">Detects typosquatting, brand spoofing, raw IPs, and punycode tricks.</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-hover/60 border border-white/5 space-y-2">
              <MessageSquare className="text-indigo-400" size={20} />
              <h4 className="font-bold text-sm text-white">SMS Scam Detector</h4>
              <p className="text-xs text-gray-400">Identifies OTP theft, fake job fees, and bank impersonation phrasing.</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-hover/60 border border-white/5 space-y-2">
              <Lock className="text-emerald-400" size={20} />
              <h4 className="font-bold text-sm text-white">Zero Server URL Fetching</h4>
              <p className="text-xs text-gray-400">Protects against SSRF. TruthLens never opens or downloads external URLs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE ILLUSTRATIVE SCANS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Illustrative Scan Examples</h2>
            <p className="text-gray-400 text-xs">Sample analysis outputs clearly marked as illustrative test data.</p>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Illustrative Samples
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleScans.map((sample, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-surface border border-surface-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-400 font-mono">{sample.type}</span>
                <RiskBadge verdict={sample.verdict} size="sm" />
              </div>
              <p className="font-semibold text-sm text-white truncate font-mono">{sample.title}</p>
              <div className="p-2.5 rounded-lg bg-surface-hover text-xs text-gray-300">
                {sample.findings}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRANSPARENCY & LIMITATIONS NOTICE */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-3">
        <div className="p-4 rounded-2xl bg-surface-hover/40 border border-surface-border text-left flex items-start gap-3">
          <AlertCircle className="text-amber-400 shrink-0 mt-0.5" size={20} />
          <div className="space-y-1 text-xs text-gray-300">
            <h4 className="font-bold text-white text-sm">Honesty About Uncertainty & Security Limitations</h4>
            <p className="leading-relaxed">
              No detection system catches 100% of phishing links or fraudulent messages. TruthLens never labels a website "guaranteed safe" merely because it uses HTTPS or does not appear on a known threat list. Always exercise independent caution.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
