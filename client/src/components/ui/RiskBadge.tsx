import React from "react";
import { VerdictType } from "../../types/scan";
import { ShieldAlert, AlertTriangle, AlertCircle, ShieldCheck, HelpCircle } from "lucide-react";

interface RiskBadgeProps {
  verdict: VerdictType;
  size?: "sm" | "md" | "lg";
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ verdict, size = "md" }) => {
  let bg = "";
  let text = "";
  let border = "";
  let label = "";
  let Icon = HelpCircle;

  switch (verdict) {
    case "KNOWN_THREAT":
      bg = "bg-red-950/80";
      text = "text-red-400";
      border = "border-red-500/50";
      label = "KNOWN THREAT";
      Icon = ShieldAlert;
      break;
    case "HIGH_RISK":
      bg = "bg-orange-950/80";
      text = "text-orange-400";
      border = "border-orange-500/50";
      label = "HIGH RISK";
      Icon = AlertTriangle;
      break;
    case "SUSPICIOUS":
      bg = "bg-amber-950/80";
      text = "text-amber-400";
      border = "border-amber-500/50";
      label = "SUSPICIOUS";
      Icon = AlertCircle;
      break;
    case "NO_THREAT_DETECTED":
      bg = "bg-emerald-950/80";
      text = "text-emerald-400";
      border = "border-emerald-500/50";
      label = "NO THREAT DETECTED";
      Icon = ShieldCheck;
      break;
    case "INCONCLUSIVE":
    case "UNABLE_TO_VERIFY":
    default:
      bg = "bg-gray-800/80";
      text = "text-gray-300";
      border = "border-gray-600/50";
      label = verdict === "UNABLE_TO_VERIFY" ? "UNABLE TO VERIFY" : "INCONCLUSIVE";
      Icon = HelpCircle;
      break;
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-semibold gap-1",
    md: "px-3 py-1 text-xs font-bold tracking-wider gap-1.5",
    lg: "px-4 py-1.5 text-sm font-extrabold tracking-widest gap-2"
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 18
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm uppercase ${bg} ${text} ${border} ${sizeClasses[size]}`}
    >
      <Icon size={iconSizes[size]} className="shrink-0" />
      {label}
    </span>
  );
};
