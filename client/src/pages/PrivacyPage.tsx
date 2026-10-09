import React from "react";
import { Lock, Shield, Eye, Server, Trash2, CheckCircle2 } from "lucide-react";

export const PrivacyPage: React.FC = () => {
  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto text-gray-300">
      {/* HEADER */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Lock size={14} />
          Privacy & Data Protection Policy
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Your Privacy & Data Rights
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Transparent disclosure on data retention, third-party provider lookups, query parameter redaction, and user control.
        </p>
      </div>

      <div className="space-y-6">
        {/* LOCAL VS SERVER PROCESSING */}
        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Server className="text-cyan-accent" size={18} />
            Data Processing & Persistence
          </h3>
          <ul className="space-y-2 text-xs text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-cyan-accent shrink-0 mt-0.5" />
              <span><strong>Message Analysis</strong> is evaluated locally on the server using pattern matching rules. We do not upload raw user text messages to external AI services.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-cyan-accent shrink-0 mt-0.5" />
              <span><strong>Scan Reports</strong> are saved to the persistent database to allow you to review history. You can clear your entire history at any time.</span>
            </li>
          </ul>
        </div>

        {/* THIRD PARTY PROVIDER SHARING */}
        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Eye className="text-amber-400" size={18} />
            Third-Party Threat Intelligence Providers
          </h3>
          <p className="text-xs leading-relaxed">
            When third-party threat intelligence adapters (Google Web Risk API, VirusTotal v3) are configured, submitted target URLs or their cryptographic hashes may be queried against provider endpoints under their respective terms and privacy policies.
          </p>
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-200">
            <strong>Security Rule:</strong> Do not submit URLs containing private access tokens, confidential session keys, or unhashed password parameters.
          </div>
        </div>

        {/* REDACTION & DELETE RIGHTS */}
        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Trash2 className="text-emerald-400" size={18} />
            User Control & History Erasure
          </h3>
          <p className="text-xs leading-relaxed">
            TruthLens provides full data sovereignty. You can delete individual scan records or purge your entire database history instantly from the Scan History or Settings tab.
          </p>
        </div>
      </div>
    </div>
  );
};
