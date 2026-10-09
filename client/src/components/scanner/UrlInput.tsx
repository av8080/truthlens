import React, { useState } from "react";
import { Search, Clipboard, X, ShieldAlert, ArrowRight, Sparkles } from "lucide-react";

interface UrlInputProps {
  onScan: (url: string) => void;
  isLoading?: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({ onScan, isLoading }) => {
  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleClear = () => {
    setUrl("");
    setValidationError("");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setValidationError("");
      }
    } catch (err) {
      console.warn("Clipboard access denied or unavailable");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setValidationError("Please enter or paste a URL to analyze.");
      return;
    }
    setValidationError("");
    onScan(url.trim());
  };

  const sampleUrls = [
    { label: "Benign Example (Safe)", url: "https://example.com" },
    { label: "Typosquat Phishing", url: "https://paypal-security-update.account-verify.xyz" },
    { label: "Raw IP Hostname", url: "http://192.168.1.1/login.php" },
    { label: "Punycode Homograph", url: "https://xn--pypal-4ve.com" }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-surface border-2 border-surface-border focus-within:border-cyan-accent focus-within:ring-4 focus-within:ring-cyan-accent/20 rounded-2xl shadow-xl transition-all overflow-hidden p-2">
          <div className="pl-3 pr-2 text-cyan-accent">
            <Search size={22} className="animate-pulse" />
          </div>

          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (validationError) setValidationError("");
            }}
            placeholder="Paste suspicious URL or domain (e.g. https://example-security-login.xyz)"
            className="w-full bg-transparent text-white placeholder-gray-500 text-sm sm:text-base font-sans focus:outline-none px-2 py-2"
            disabled={isLoading}
          />

          <div className="flex items-center gap-1.5 pr-1">
            {url && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-surface-hover transition-colors"
                title="Clear input"
                disabled={isLoading}
              >
                <X size={18} />
              </button>
            )}

            {!url && (
              <button
                type="button"
                onClick={handlePaste}
                className="hidden sm:flex items-center gap-1 text-xs text-gray-300 hover:text-cyan-accent bg-surface-hover hover:bg-cyan-accent/10 px-3 py-2 rounded-lg border border-white/5 transition-colors"
                title="Paste from clipboard"
              >
                <Clipboard size={14} />
                Paste
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-accent to-blue-500 hover:from-cyan-hover hover:to-blue-600 disabled:opacity-50 text-gray-950 font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-cyan-accent/20 transition-all hover:scale-[1.02] shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze URL
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>

        {validationError && (
          <p className="mt-2 text-xs font-semibold text-red-400 flex items-center gap-1.5 pl-2">
            <ShieldAlert size={14} />
            {validationError}
          </p>
        )}
      </form>

      {/* Sample Testing Prompts */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-400 flex items-center gap-1 text-[11px] font-medium">
          <Sparkles size={12} className="text-cyan-accent" />
          Test Harmless Examples:
        </span>
        {sampleUrls.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setUrl(sample.url);
              setValidationError("");
            }}
            className="text-[11px] bg-surface-hover hover:bg-cyan-accent/15 text-gray-300 hover:text-cyan-accent px-2.5 py-1 rounded-md border border-white/5 hover:border-cyan-accent/30 transition-all"
          >
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
};
