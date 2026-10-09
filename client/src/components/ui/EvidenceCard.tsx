import React from "react";
import { ScanFinding } from "../../types/scan";
import { ShieldAlert, AlertCircle, Info, Database, Code, Globe, MessageSquare } from "lucide-react";

interface EvidenceCardProps {
  finding: ScanFinding;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ finding }) => {
  let severityColor = "border-gray-700 bg-gray-900/40 text-gray-300";
  let badgeColor = "bg-gray-800 text-gray-400 border-gray-700";
  let Icon = Info;

  switch (finding.severity) {
    case "CRITICAL":
      severityColor = "border-red-900/60 bg-red-950/20 text-red-200";
      badgeColor = "bg-red-900/50 text-red-300 border-red-700/50";
      Icon = ShieldAlert;
      break;
    case "HIGH":
      severityColor = "border-orange-900/60 bg-orange-950/20 text-orange-200";
      badgeColor = "bg-orange-900/50 text-orange-300 border-orange-700/50";
      Icon = AlertCircle;
      break;
    case "MEDIUM":
      severityColor = "border-amber-900/60 bg-amber-950/20 text-amber-200";
      badgeColor = "bg-amber-900/50 text-amber-300 border-amber-700/50";
      Icon = AlertCircle;
      break;
    case "LOW":
    case "INFO":
    default:
      severityColor = "border-blue-900/40 bg-blue-950/10 text-blue-200";
      badgeColor = "bg-blue-900/40 text-blue-300 border-blue-700/50";
      Icon = Info;
      break;
  }

  let CategoryIcon = Code;
  switch (finding.category) {
    case "THREAT_INTEL": CategoryIcon = Database; break;
    case "DOMAIN_INFO": CategoryIcon = Globe; break;
    case "CONTEXTUAL": CategoryIcon = MessageSquare; break;
    case "URL_STRUCTURE": default: CategoryIcon = Code; break;
  }

  return (
    <div className={`p-4 rounded-xl border transition-all duration-200 ${severityColor}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Icon className="shrink-0" size={18} />
          <h4 className="font-semibold text-sm text-gray-100">{finding.title}</h4>
        </div>
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border shrink-0 ${badgeColor}`}>
          {finding.severity}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-gray-300 mb-3">{finding.explanation}</p>
      
      <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-white/5">
        <span className="flex items-center gap-1 text-cyan-400">
          <CategoryIcon size={12} />
          {finding.category.replace("_", " ")}
        </span>
        <span className="text-gray-400 font-mono">Source: {finding.source}</span>
      </div>
    </div>
  );
};
