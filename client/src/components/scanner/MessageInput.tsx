import React, { useState } from "react";
import { MessageSquare, Clipboard, X, ShieldAlert, ArrowRight, Sparkles } from "lucide-react";

interface MessageInputProps {
  onAnalyze: (message: string) => void;
  isLoading?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onAnalyze, isLoading }) => {
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleClear = () => {
    setMessage("");
    setValidationError("");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setMessage(text);
        setValidationError("");
      }
    } catch (err) {
      console.warn("Clipboard access denied or unavailable");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setValidationError("Please enter or paste a text message to analyze.");
      return;
    }
    setValidationError("");
    onAnalyze(message.trim());
  };

  const sampleMessages = [
    {
      label: "OTP Theft Scam",
      text: "URGENT: Your Netflix account payment was declined. Reply immediately with your OTP verification code to prevent service cancellation."
    },
    {
      label: "Fake Job Offer",
      text: "Congratulations! You have been selected for a remote Data Entry position earning $450/day. Pay a $50 application kit deposit at http://job-verify-fee.top to start."
    },
    {
      label: "Bank Account Urgency",
      text: "Chase Bank Alert: Suspicious transaction detected. Your account has been suspended. Update details at http://chase-security-auth.xyz within 24 hours."
    },
    {
      label: "Legitimate Notification",
      text: "Your dental appointment is scheduled for tomorrow at 2:00 PM. Reply 1 to confirm or 2 to reschedule."
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative bg-surface border-2 border-surface-border focus-within:border-cyan-accent focus-within:ring-4 focus-within:ring-cyan-accent/20 rounded-2xl shadow-xl transition-all overflow-hidden p-3">
          <div className="flex items-center justify-between border-b border-surface-border pb-2 mb-2">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
              <MessageSquare size={16} className="text-cyan-accent" />
              SMS / Email Scam Text Analyzer
            </span>
            <div className="flex items-center gap-2">
              {message && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-surface-hover"
                >
                  <X size={14} /> Clear
                </button>
              )}
              <button
                type="button"
                onClick={handlePaste}
                className="text-xs text-gray-300 hover:text-cyan-accent flex items-center gap-1 px-2 py-1 rounded bg-surface-hover hover:bg-cyan-accent/10 border border-white/5"
              >
                <Clipboard size={14} /> Paste Text
              </button>
            </div>
          </div>

          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (validationError) setValidationError("");
            }}
            rows={5}
            placeholder="Paste suspicious SMS, WhatsApp message, unexpected email, or payment demand text here..."
            className="w-full bg-transparent text-white placeholder-gray-500 text-sm font-sans focus:outline-none resize-y min-h-[120px]"
            disabled={isLoading}
          />

          <div className="flex items-center justify-between pt-2 border-t border-surface-border">
            <span className="text-[11px] text-gray-500 font-mono">
              {message.length} / 10,000 characters
            </span>
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-accent to-blue-500 hover:from-cyan-hover hover:to-blue-600 disabled:opacity-50 text-gray-950 font-extrabold px-5 py-2 rounded-xl text-xs sm:text-sm shadow-lg shadow-cyan-accent/20 transition-all hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                  Analyzing Message...
                </>
              ) : (
                <>
                  Analyze Message
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>

        {validationError && (
          <p className="text-xs font-semibold text-red-400 flex items-center gap-1.5 pl-2">
            <ShieldAlert size={14} />
            {validationError}
          </p>
        )}
      </form>

      {/* Preset Fictional Examples */}
      <div className="space-y-2">
        <span className="text-gray-400 flex items-center gap-1 text-[11px] font-medium">
          <Sparkles size={12} className="text-cyan-accent" />
          Test Fictional Message Examples:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sampleMessages.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setMessage(sample.text);
                setValidationError("");
              }}
              className="text-left p-2.5 rounded-lg bg-surface-hover hover:bg-cyan-accent/10 border border-surface-border hover:border-cyan-accent/30 transition-all group"
            >
              <p className="text-xs font-bold text-gray-200 group-hover:text-cyan-accent mb-0.5">{sample.label}</p>
              <p className="text-[11px] text-gray-400 line-clamp-2">{sample.text}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
