import React, { useState } from "react";
import { BookOpen, Search, ShieldCheck, AlertCircle, ExternalLink, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

interface Article {
  id: string;
  category: "Phishing" | "Job Scams" | "Payments" | "Account Safety" | "URL Intelligence";
  title: string;
  summary: string;
  warningSigns: string[];
  checklist: string[];
  actions: string[];
}

export const EducationCenterPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [expandedId, setExpandedId] = useState<string | null>("phishing-101");

  const articles: Article[] = [
    {
      id: "phishing-101",
      category: "Phishing",
      title: "How to Recognize Modern Phishing & Social Engineering",
      summary: "Phishing attacks use psychological manipulation and artificial urgency to trick you into submitting passwords or financial credentials.",
      warningSigns: [
        "Unsolicited messages demanding immediate verification.",
        "Mismatched domain names (e.g., support-paypal.xyz instead of paypal.com).",
        "Generic greetings like 'Dear Valued Customer' or threatening legal action.",
        "Shortened links masking the true destination host."
      ],
      checklist: [
        "Inspect the exact registered domain name in your browser address bar.",
        "Never log in through links sent directly in email or SMS messages.",
        "Use official bookmarks or search engine results to access accounts."
      ],
      actions: [
        "If clicked: Close the browser window immediately.",
        "Change your password on the official platform using a clean device.",
        "Enable hardware or authenticator app 2FA on your account."
      ]
    },
    {
      id: "fake-job-offers",
      category: "Job Scams",
      title: "Identifying Fake Remote Job Offers & Upfront Fee Fraud",
      summary: "Scammers recruit victims for fictitious work-from-home positions and demand upfront fees for training kits, background checks, or laptop equipment.",
      warningSigns: [
        "Immediate job offers without a live video or phone interview.",
        "Requests to pay application fees or buy equipment from a specific vendor.",
        "Interviews conducted strictly over messaging apps (Telegram, Signal).",
        "Promises of $500+/day for simple data entry with no experience required."
      ],
      checklist: [
        "Verify the company's official careers page at their domain name.",
        "Legitimate employers NEVER ask candidate employees to send money for equipment.",
        "Research the recruiter's official LinkedIn profile."
      ],
      actions: [
        "Do not deposit checks sent by a recruiter asking you to wire funds back.",
        "Report the fraudulent listing to FTC and job board platform administrators."
      ]
    },
    {
      id: "https-myths",
      category: "URL Intelligence",
      title: "What HTTPS Does — and What It Does NOT Guarantee",
      summary: "A green padlock or https:// prefix only means the connection is encrypted. Over 80% of active phishing websites use HTTPS certificates.",
      warningSigns: [
        "Assuming a website is 100% safe simply because it displays a padlock icon.",
        "Believing SSL certificates verify the moral legitimacy of a domain owner.",
        "Free automated SSL certificates (e.g. Let's Encrypt) are issued to anyone in seconds."
      ],
      checklist: [
        "HTTPS protects against eavesdropping on public Wi-Fi, NOT against scam sites.",
        "Always verify WHO owns the domain, not just that encryption is enabled."
      ],
      actions: [
        "Check domain age and structural typosquatting before entering payment info."
      ]
    },
    {
      id: "otp-account-takeover",
      category: "Account Safety",
      title: "OTP Codes & Preventing Account Takeover Attacks",
      summary: "One-Time Password (OTP) codes are the master keys to your accounts. Scammers use SMS social engineering to trick victims into sharing them.",
      warningSigns: [
        "A text message containing an OTP code you did not explicitly request.",
        "A caller claiming to be bank fraud prevention asking you to read them a code.",
        "Messages claiming your account will be locked unless you reply with the code."
      ],
      checklist: [
        "NO BANK OR SERVICE WILL EVER ASK YOU TO READ OR REPLY WITH AN OTP CODE.",
        "OTP text messages explicitly state: 'Do not share this code with anyone'."
      ],
      actions: [
        "If you accidentally shared an OTP: Log in immediately and terminate active sessions.",
        "Switch from SMS 2FA to an Authenticator App (Google/Microsoft Authenticator or YubiKey)."
      ]
    },
    {
      id: "emergency-post-click",
      category: "Account Safety",
      title: "Emergency Checklist: What to Do After Clicking a Suspicious Link",
      summary: "Don't panic. Follow these immediate mitigation steps if you clicked a suspicious link or entered credentials.",
      warningSigns: [
        "You entered your password on a domain that looked slightly unusual.",
        "A file or APK automatically downloaded after visiting a link.",
        "Your browser warned of a certificate error or dangerous page."
      ],
      checklist: [
        "Step 1: Disconnect your internet / Wi-Fi immediately if a file downloaded.",
        "Step 2: Change passwords for the affected service from an uncompromised device.",
        "Step 3: Enable Multi-Factor Authentication (MFA) on your email and banking accounts."
      ],
      actions: [
        "Monitor your bank and credit card statements for unauthorized charges.",
        "Run an antivirus scan on your computer or mobile device."
      ]
    }
  ];

  const categories = ["ALL", "Phishing", "Job Scams", "Payments", "Account Safety", "URL Intelligence"];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = activeCategory === "ALL" || art.category === activeCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent text-xs font-semibold">
          <BookOpen size={14} />
          TruthLens Security Education Library
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Scam Awareness & Protection Guides
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Learn how to spot phishing tactics, evaluate domain legitimacy, protect your 2FA tokens, and respond effectively to security incidents.
        </p>
      </div>

      {/* SEARCH & CATEGORIES */}
      <div className="p-4 rounded-2xl bg-surface border border-surface-border space-y-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by keyword (e.g. OTP, HTTPS, Job Offer, Password)..."
            className="w-full bg-surface-hover text-white text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-white/5 focus:outline-none focus:border-cyan-accent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-cyan-accent text-gray-950 font-bold shadow-sm"
                  : "bg-surface-hover text-gray-300 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ARTICLES LIST */}
      <div className="space-y-4">
        {filteredArticles.map((article) => {
          const isExpanded = expandedId === article.id;
          return (
            <div
              key={article.id}
              className="p-6 rounded-2xl bg-surface border border-surface-border transition-all space-y-4"
            >
              <div
                className="flex items-start justify-between cursor-pointer group"
                onClick={() => setExpandedId(isExpanded ? null : article.id)}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-accent/10 text-cyan-accent border border-cyan-accent/20">
                    {article.category}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-accent transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-300">{article.summary}</p>
                </div>
                <div className="p-2 text-gray-400 group-hover:text-white">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {isExpanded && (
                <div className="pt-4 border-t border-surface-border space-y-6 animate-fadeIn">
                  {/* WARNING SIGNS */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle size={14} />
                      Key Warning Signs
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                      {article.warningSigns.map((sign, idx) => (
                        <li key={idx} className="p-2.5 rounded-lg bg-surface-hover/50 flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          {sign}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* SAFETY CHECKLIST */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-cyan-accent uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck size={14} />
                      Practical Verification Checklist
                    </h4>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      {article.checklist.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-cyan-accent shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* RECOMMENDED ACTIONS */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 size={14} />
                      Recommended Immediate Actions
                    </h4>
                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs text-emerald-200 space-y-1">
                      {article.actions.map((act, idx) => (
                        <p key={idx}>✓ {act}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
