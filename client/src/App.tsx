import React, { useState } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { UrlScannerPage } from "./pages/UrlScannerPage";
import { MessageAnalyzerPage } from "./pages/MessageAnalyzerPage";
import { DetailedResultPage } from "./pages/DetailedResultPage";
import { ScanHistoryPage } from "./pages/ScanHistoryPage";
import { EducationCenterPage } from "./pages/EducationCenterPage";
import { MethodologyPage } from "./pages/MethodologyPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { SettingsPage } from "./pages/SettingsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { scanUrl, scanMessage, getScanById } from "./services/api";
import { ScanReport } from "./types/scan";

export function App() {
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [currentReport, setCurrentReport] = useState<ScanReport | null>(null);
  const [currentScanId, setCurrentScanId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [scanError, setScanError] = useState("");

  const handleScanUrl = async (url: string) => {
    setIsLoading(true);
    setScanError("");
    try {
      const data = await scanUrl(url);
      setCurrentReport(data.report);
      setCurrentScanId(data.scanId);
      setActiveTab("result");
    } catch (err: any) {
      setScanError(err.message || "Failed to analyze URL.");
      alert(err.message || "URL Scan error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeMessage = async (msg: string) => {
    setIsLoading(true);
    setScanError("");
    try {
      const data = await scanMessage(msg);
      setCurrentReport(data.report);
      setCurrentScanId(data.scanId);
      setActiveTab("result");
    } catch (err: any) {
      setScanError(err.message || "Failed to analyze message.");
      alert(err.message || "Message analysis error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewReportById = async (scanId: string) => {
    setIsLoading(true);
    try {
      const data = await getScanById(scanId);
      const scanRec = data.scan;
      const report: ScanReport = {
        inputUrl: scanRec.scanType === "URL" ? scanRec.sanitizedInput : undefined,
        sanitizedSummary: scanRec.sanitizedInput,
        verdict: scanRec.verdict,
        heuristicScore: scanRec.heuristicScore || 0,
        providerStatus: scanRec.providerStatus,
        findings: scanRec.findings.map((f) => ({
          category: f.category as any,
          severity: f.severity as any,
          title: f.title,
          explanation: f.explanation,
          source: f.source
        })),
        providerChecks: scanRec.providerChecks?.map((p) => ({
          providerName: p.providerName,
          status: p.status as any,
          threatTypes: typeof p.threatTypes === "string" ? JSON.parse(p.threatTypes) : p.threatTypes || [],
          checkedAt: p.checkedAt
        })),
        recommendations: [
          scanRec.verdict === "KNOWN_THREAT"
            ? "DO NOT OPEN THIS LINK. Identified as malicious on threat intelligence databases."
            : scanRec.verdict === "HIGH_RISK"
            ? "Avoid interacting with this link or message. High-risk indicators detected."
            : "Exercise standard caution when verifying sender identity."
        ],
        limitationsNotice: "TruthLens scan report loaded from persistent audit records.",
        timestamp: scanRec.createdAt
      };

      setCurrentReport(report);
      setCurrentScanId(scanId);
      setActiveTab("result");
    } catch (err: any) {
      alert(err.message || "Could not load report.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case "landing":
        return (
          <LandingPage
            onScanUrl={handleScanUrl}
            onAnalyzeMessage={handleAnalyzeMessage}
            setActiveTab={setActiveTab}
          />
        );
      case "dashboard":
        return (
          <DashboardPage
            onScanUrl={handleScanUrl}
            onAnalyzeMessage={handleAnalyzeMessage}
            onViewReport={handleViewReportById}
            setActiveTab={setActiveTab}
          />
        );
      case "url-scanner":
        return <UrlScannerPage onScan={handleScanUrl} isLoading={isLoading} />;
      case "message-analyzer":
        return <MessageAnalyzerPage onAnalyze={handleAnalyzeMessage} isLoading={isLoading} />;
      case "result":
        return currentReport ? (
          <DetailedResultPage
            report={currentReport}
            scanId={currentScanId}
            onBackToDashboard={() => setActiveTab("dashboard")}
            onRescan={() => setActiveTab("url-scanner")}
            onScanUrl={handleScanUrl}
          />
        ) : (
          <DashboardPage
            onScanUrl={handleScanUrl}
            onAnalyzeMessage={handleAnalyzeMessage}
            onViewReport={handleViewReportById}
            setActiveTab={setActiveTab}
          />
        );
      case "history":
        return <ScanHistoryPage onViewReport={handleViewReportById} />;
      case "education":
        return <EducationCenterPage />;
      case "methodology":
        return <MethodologyPage />;
      case "privacy":
        return <PrivacyPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <NotFoundPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-gray-100 font-sans selection:bg-cyan-accent selection:text-gray-950">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {renderActivePage()}
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
