import React from "react";
import { ShieldAlert, ArrowLeft, Home, Search } from "lucide-react";

interface NotFoundPageProps {
  setActiveTab: (tab: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ setActiveTab }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 px-4 py-12">
      <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
        <ShieldAlert size={36} />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-extrabold text-white">404 - Page Not Found</h1>
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
          The security endpoint or page you requested does not exist or has been relocated.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setActiveTab("landing")}
          className="flex items-center gap-2 bg-cyan-accent hover:bg-cyan-hover text-gray-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-cyan-accent/20 transition-all"
        >
          <Home size={14} />
          Return to Landing Page
        </button>
        <button
          onClick={() => setActiveTab("url-scanner")}
          className="flex items-center gap-2 bg-surface hover:bg-surface-hover text-gray-300 font-semibold px-4 py-2.5 rounded-xl text-xs border border-surface-border transition-all"
        >
          <Search size={14} />
          Go to URL Scanner
        </button>
      </div>
    </div>
  );
};
