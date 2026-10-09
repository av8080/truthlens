import React from "react";
import { Shield, Info, Lock, Database, Code, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";

export const MethodologyPage: React.FC = () => {
  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto text-gray-300">
      {/* HEADER */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent text-xs font-semibold">
          <Info size={14} />
          About & Detection Methodology
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How TruthLens Analyzes Threats
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Full technical disclosure of our 5-question framework, explainable risk scoring, provider adapters, and SSRF architecture.
        </p>
      </div>

      {/* THE 5 QUESTIONS FRAMEWORK */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className="text-cyan-accent" size={22} />
          The 5 Questions Security Framework
        </h2>
        <p className="text-xs text-gray-300 leading-relaxed">
          Every scan performed by TruthLens is designed to evaluate five foundational security questions before you trust a link or message:
        </p>

        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-surface-hover/60 border border-white/5 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-accent/20 text-cyan-accent text-xs font-bold flex items-center justify-center shrink-0">1</span>
            <div>
              <h4 className="font-bold text-xs text-white">Does this URL appear on a known threat list?</h4>
              <p className="text-[11px] text-gray-400">Queries canonical threat intelligence databases (Google Web Risk, VirusTotal v3) for confirmed malware, phishing, or social engineering listings.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-hover/60 border border-white/5 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-accent/20 text-cyan-accent text-xs font-bold flex items-center justify-center shrink-0">2</span>
            <div>
              <h4 className="font-bold text-xs text-white">What suspicious indicators were found?</h4>
              <p className="text-[11px] text-gray-400">Analyzes structural URL anomalies such as typosquatting brand spoofing, punycode homographs, raw IP hostnames, and excessive subdomains.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-hover/60 border border-white/5 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-accent/20 text-cyan-accent text-xs font-bold flex items-center justify-center shrink-0">3</span>
            <div>
              <h4 className="font-bold text-xs text-white">Why might this message or website be dangerous?</h4>
              <p className="text-[11px] text-gray-400">Provides clear human-understandable explanations for every flagged indicator so users understand the precise risk mechanism.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-hover/60 border border-white/5 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-accent/20 text-cyan-accent text-xs font-bold flex items-center justify-center shrink-0">4</span>
            <div>
              <h4 className="font-bold text-xs text-white">How confident can we reasonably be in the result?</h4>
              <p className="text-[11px] text-gray-400">Distinguishes between confirmed provider detections, heuristic-only evaluations, and provider timeout errors.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-hover/60 border border-white/5 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-accent/20 text-cyan-accent text-xs font-bold flex items-center justify-center shrink-0">5</span>
            <div>
              <h4 className="font-bold text-xs text-white">What should the user do next?</h4>
              <p className="text-[11px] text-gray-400">Formulates actionable, step-by-step guidance tailored specifically to the verdict severity.</p>
            </div>
          </div>
        </div>
      </div>

      {/* EXPLAINABLE RISK SCORING */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Zap className="text-amber-400" size={18} />
          Explainable Heuristic Risk Score (0 - 100)
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          TruthLens calculates a transparent <strong>Heuristic Risk Score</strong> based on evidence severity weights. A score is elevated by individual structural and threat intelligence findings:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/40">
            <span className="font-bold text-red-400 block mb-1">Confirmed Threat Match (+80 Points)</span>
            <span className="text-gray-300">Explicit listing on Google Web Risk or VirusTotal malicious engine reports.</span>
          </div>
          <div className="p-3 rounded-xl bg-orange-950/20 border border-orange-900/40">
            <span className="font-bold text-orange-400 block mb-1">Brand Impersonation (+35 Points)</span>
            <span className="text-gray-300">Hostname containing brand keywords (e.g. PayPal, Apple) hosted on non-official TLDs.</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40">
            <span className="font-bold text-amber-400 block mb-1">Raw IP / Punycode (+35 Points)</span>
            <span className="text-gray-300">Numerical IP hostnames or non-Latin Punycode IDN homograph character encoding.</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-900/40">
            <span className="font-bold text-blue-400 block mb-1">High-Risk TLD (+20 Points)</span>
            <span className="text-gray-300">Domain endings (.xyz, .top, .work) frequently registered for low-cost phishing.</span>
          </div>
        </div>
      </div>

      {/* SSRF & ARCHITECTURAL SAFETY */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Lock className="text-emerald-400" size={18} />
          Architecture & SSRF Protection
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          To prevent Server-Side Request Forgery (SSRF) and protect internal networks, <strong>TruthLens backend servers never make direct HTTP requests to user-submitted target URLs</strong>. All inspections are performed either via canonical REST lookup APIs or through static string structural parsing.
        </p>
      </div>
    </div>
  );
};
