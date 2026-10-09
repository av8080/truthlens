import React, { useState } from "react";
import { Shield, Search, MessageSquare, LayoutDashboard, History, BookOpen, Settings, Menu, X, Info, Lock } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "url-scanner", label: "Scan URL", icon: Search },
    { id: "message-analyzer", label: "Analyze Message", icon: MessageSquare },
    { id: "history", label: "Scan History", icon: History },
    { id: "education", label: "Learn Scams", icon: BookOpen },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B1020]/90 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick("landing")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-accent/20 to-blue-600/30 border border-cyan-accent/40 flex items-center justify-center text-cyan-accent group-hover:shadow-[0_0_15px_rgba(55,215,242,0.3)] transition-all">
              <Shield size={22} className="group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                  Truth<span className="text-cyan-accent">Lens</span>
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-cyan-accent/10 text-cyan-accent border border-cyan-accent/20">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium hidden sm:block">Think Before You Trust</p>
            </div>
          </div>

          {/* Desktop Navigation Link Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-cyan-accent/10 text-cyan-accent border border-cyan-accent/30 shadow-[0_0_10px_rgba(55,215,242,0.15)]"
                      : "text-gray-300 hover:text-white hover:bg-surface-hover"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleNavClick("url-scanner")}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-accent to-blue-500 hover:from-cyan-hover hover:to-blue-600 text-gray-950 font-bold px-4 py-2 rounded-lg text-xs shadow-lg shadow-cyan-accent/20 transition-all hover:scale-[1.02]"
            >
              <Search size={14} />
              Quick Scan
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-surface-hover"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-surface-border bg-surface px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-cyan-accent/15 text-cyan-accent border border-cyan-accent/30"
                    : "text-gray-300 hover:bg-surface-hover"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => handleNavClick("methodology")}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs text-gray-400 hover:text-white"
            >
              <Info size={16} />
              Methodology & Transparency
            </button>
            <button
              onClick={() => handleNavClick("privacy")}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs text-gray-400 hover:text-white"
            >
              <Lock size={16} />
              Privacy & Data Policy
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
