import React from "react";
import { MessageInput } from "../components/scanner/MessageInput";
import { MessageSquare, Shield, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

interface MessageAnalyzerPageProps {
  onAnalyze: (msg: string) => void;
  isLoading?: boolean;
}

export const MessageAnalyzerPage: React.FC<MessageAnalyzerPageProps> = ({ onAnalyze, isLoading }) => {
  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
          <MessageSquare size={14} />
          SMS & Text Scam Pattern Analyzer
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Analyze Suspicious Text Messages
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Paste unexpected SMS messages, WhatsApp chats, emails, or job offer texts to detect OTP theft requests, artificial urgency, fake application fees, and hidden links.
        </p>
      </div>

      {/* MESSAGE INPUT COMPONENT */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-2xl space-y-6">
        <MessageInput onAnalyze={onAnalyze} isLoading={isLoading} />
      </div>

      {/* DETECTED PATTERNS OVERVIEW */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Sparkles className="text-cyan-accent" size={16} />
          What Patterns Does Message Analyzer Detect?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300">
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-hover/50">
            <CheckCircle2 size={16} className="text-cyan-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">OTP & 2FA Token Theft</span>
              <span>Attempts to trick you into revealing login codes or security PINs.</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-hover/50">
            <CheckCircle2 size={16} className="text-cyan-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Artificial Urgency & Threats</span>
              <span>Demands for immediate action within tight deadlines or threat of arrest.</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-hover/50">
            <CheckCircle2 size={16} className="text-cyan-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Upfront Fee & Fake Job Offers</span>
              <span>Offers for high daily pay requiring training kit or application deposits.</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-hover/50">
            <CheckCircle2 size={16} className="text-cyan-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Embedded Link Extraction</span>
              <span>Automatically identifies hidden links and offers 1-click URL analysis.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
