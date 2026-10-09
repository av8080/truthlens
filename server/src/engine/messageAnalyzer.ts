export interface MessageFinding {
  category: "CONTEXTUAL";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  title: string;
  explanation: string;
  matchedText: string;
  startIndex: number;
  endIndex: number;
}

export interface ExtractedUrl {
  url: string;
  startIndex: number;
  endIndex: number;
}

export interface MessageAnalysisResult {
  rawMessage: string;
  sanitizedSummary: string;
  verdict: "HIGH_RISK" | "SUSPICIOUS" | "NO_THREAT_DETECTED";
  heuristicScore: number;
  findings: MessageFinding[];
  extractedUrls: ExtractedUrl[];
  recommendations: string[];
  disclaimer: string;
}

interface ScamPatternRule {
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  explanation: string;
  regex: RegExp;
  weight: number;
}

const SCAM_PATTERNS: ScamPatternRule[] = [
  {
    title: "OTP / Security Code Theft Request",
    severity: "CRITICAL",
    explanation: "Legitimate organizations never ask users to share OTP codes, 2FA security tokens, or temporary passwords via text message.",
    regex: /\b(share|send|provide|give|reply|code is|enter)\b.{0,40}\b(otp|one time password|verification code|security code|2fa code|login code|passcode)\b/i,
    weight: 45
  },
  {
    title: "Bank Card / Account Details Request",
    severity: "CRITICAL",
    explanation: "The message requests sensitive banking details, credit card numbers, CVV security codes, or account passwords.",
    regex: /\b(credit card|debit card|cvv|bank account|routing number|card number|account password|pin number)\b/i,
    weight: 40
  },
  {
    title: "Artificial Urgency & Threatening Demands",
    severity: "HIGH",
    explanation: "Scammers create artificial panic with tight deadlines, threats of account termination, legal action, or law enforcement.",
    regex: /\b(urgent|immediately|within \d+ hours|account (suspended|blocked|terminated|locked)|legal action|arrest warrant|law enforcement|police|irs)\b/i,
    weight: 25
  },
  {
    title: "Unexpected Payment or Fee Demands",
    severity: "HIGH",
    explanation: "Requests for unexpected payments via untraceable channels like wire transfer, Cash App, Zelle, Venmo, or prepaid gift cards.",
    regex: /\b(wire transfer|gift card|cash app|zelle|venmo|crypto payment|pay fee|delivery fee|customs fee|processing fee)\b/i,
    weight: 25
  },
  {
    title: "Fake Job Offer or Upfront Equipment Fee",
    severity: "HIGH",
    explanation: "Offers high-paying work-from-home jobs requiring an upfront application fee, check deposit, or training kit purchase.",
    regex: /\b(work from home|earn \$\d+\/day|no experience|upfront fee|application fee|buy equipment|deposit check|training kit)\b/i,
    weight: 25
  },
  {
    title: "Prize, Lottery, or Unexpected Grant Claims",
    severity: "HIGH",
    explanation: "Claims you won a lottery, prize, or grant you never entered. Real prizes never require a claim fee or personal verification.",
    regex: /\b(you (won|have been selected)|congratulations winner|lottery prize|claim your \$|grant approved|claim reward)\b/i,
    weight: 25
  },
  {
    title: "Remote Access App Download Request",
    severity: "CRITICAL",
    explanation: "Asks you to download remote support software (AnyDesk, TeamViewer, QuickAssist) which gives scammers total control over your device.",
    regex: /\b(download|install)\b.{0,30}\b(anydesk|teamviewer|quickassist|apk|remote access|support app)\b/i,
    weight: 40
  },
  {
    title: "Guaranteed Investment or Crypto Doubling Scam",
    severity: "HIGH",
    explanation: "Promises guaranteed financial returns or zero-risk cryptocurrency multiplication.",
    regex: /\b(guaranteed (return|profit)|double your (bitcoin|crypto|investment)|100% risk free|crypto giveaway)\b/i,
    weight: 25
  }
];

export function analyzeMessage(text: string): MessageAnalysisResult {
  const trimmed = text.trim();
  const findings: MessageFinding[] = [];
  const extractedUrls: ExtractedUrl[] = [];

  // Extract URLs embedded in message
  const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/gi;
  let match: RegExpExecArray | null;

  while ((match = urlRegex.exec(trimmed)) !== null) {
    const rawUrl = match[0].replace(/[.,;:)]+$/, "");
    extractedUrls.push({
      url: rawUrl,
      startIndex: match.index,
      endIndex: match.index + rawUrl.length
    });
  }

  let totalWeight = 0;

  for (const pattern of SCAM_PATTERNS) {
    const pMatch = pattern.regex.exec(trimmed);
    if (pMatch) {
      findings.push({
        category: "CONTEXTUAL",
        severity: pattern.severity,
        title: pattern.title,
        explanation: pattern.explanation,
        matchedText: pMatch[0],
        startIndex: pMatch.index,
        endIndex: pMatch.index + pMatch[0].length
      });
      totalWeight += pattern.weight;
    }
  }

  if (extractedUrls.length > 0) {
    totalWeight += 10;
  }

  const heuristicScore = Math.min(100, Math.round(totalWeight));

  let verdict: "HIGH_RISK" | "SUSPICIOUS" | "NO_THREAT_DETECTED" = "NO_THREAT_DETECTED";
  if (heuristicScore >= 50 || findings.some(f => f.severity === "CRITICAL")) {
    verdict = "HIGH_RISK";
  } else if (heuristicScore >= 20 || findings.length > 0) {
    verdict = "SUSPICIOUS";
  }

  const recommendations: string[] = [];
  if (verdict === "HIGH_RISK") {
    recommendations.push("Do NOT reply to this message or click any included links.");
    recommendations.push("Never share OTP codes, bank credentials, or personal verification numbers.");
    recommendations.push("If the message claims to be from a bank or service provider, contact them directly using their official website or phone number on your card.");
    recommendations.push("Report and block the sender's phone number or email address.");
  } else if (verdict === "SUSPICIOUS") {
    recommendations.push("Exercise extreme caution. Verify the sender's identity independently before taking any action.");
    recommendations.push("Inspect any embedded links using TruthLens URL Scanner before clicking.");
    recommendations.push("Be wary of any unexpected requests for money, fees, or account verifications.");
  } else {
    recommendations.push("No typical scam pattern phrases were recognized in this message text.");
    recommendations.push("Always verify sender identity if the message asks for unexpected actions.");
  }

  const sanitizedSummary = trimmed.length > 120 ? trimmed.substring(0, 117) + "..." : trimmed;

  return {
    rawMessage: trimmed,
    sanitizedSummary,
    verdict,
    heuristicScore,
    findings,
    extractedUrls,
    recommendations,
    disclaimer: "TruthLens message analysis relies on heuristic pattern matching and local rules. It is an advisory tool and does not guarantee that a message is genuine or fraudulent."
  };
}
