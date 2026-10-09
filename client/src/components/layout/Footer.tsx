import React from "react";
import { Shield, Lock, FileText, ExternalLink, Heart } from "lucide-react";

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="border-t border-surface-border bg-[#070B16] text-gray-400 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="text-cyan-accent" size={20} />
              <span className="font-extrabold text-lg text-white font-sans">
                Truth<span className="text-cyan-accent">Lens</span>
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Think Before You Trust. Investigate suspicious links, unexpected text messages, and payment requests before you interact.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-3 text-xs tracking-wider uppercase">Scam Detection Tools</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab("url-scanner")} className="hover:text-cyan-accent transition-colors">
                  URL & Link Intelligence Scanner
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("message-analyzer")} className="hover:text-cyan-accent transition-colors">
                  SMS & Message Scam Analyzer
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("dashboard")} className="hover:text-cyan-accent transition-colors">
                  Security Threat Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("history")} className="hover:text-cyan-accent transition-colors">
                  Scan History Log
                </button>
              </li>
            </ul>
          </div>

          {/* Education & Resources */}
          <div>
            <h4 className="font-bold text-white mb-3 text-xs tracking-wider uppercase">Education & Resources</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab("education")} className="hover:text-cyan-accent transition-colors">
                  Phishing & Scam Library
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("methodology")} className="hover:text-cyan-accent transition-colors">
                  Methodology & Risk Scoring
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("privacy")} className="hover:text-cyan-accent transition-colors">
                  Privacy & Data Retention Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("settings")} className="hover:text-cyan-accent transition-colors">
                  API Keys & Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Uncertainty Disclaimer & Safety Notice */}
          <div>
            <h4 className="font-bold text-white mb-3 text-xs tracking-wider uppercase flex items-center gap-1.5">
              <Lock size={12} className="text-amber-400" />
              Safety & Limitations Notice
            </h4>
            <p className="text-gray-400 text-[11px] leading-relaxed bg-surface-hover/50 p-3 rounded-lg border border-surface-border">
              TruthLens is an explainable advisory tool. No security scanning system can detect 100% of phishing links or fraudulent messages. Always verify links independently through official channels.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} TruthLens Cybersecurity Platform. Built with transparency and security in mind.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab("methodology")} className="hover:text-gray-300">
              Methodology
            </button>
            <button onClick={() => setActiveTab("privacy")} className="hover:text-gray-300">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
