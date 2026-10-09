import { ScanReport, DashboardStats, HistoryScanRecord } from "../types/scan";

const API_BASE = "/api";

export async function scanUrl(url: string): Promise<{ scanId: string; report: ScanReport }> {
  const res = await fetch(`${API_BASE}/scan/url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `URL Scan request failed with status ${res.status}`);
  }

  return res.json();
}

export async function scanMessage(message: string): Promise<{ scanId: string; report: ScanReport }> {
  const res = await fetch(`${API_BASE}/scan/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Message Scan request failed with status ${res.status}`);
  }

  return res.json();
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard statistics");
  }
  return res.json();
}

export async function getScanHistory(params?: {
  search?: string;
  verdict?: string;
  type?: string;
  page?: number;
  limit?: number;
}): Promise<{
  scans: HistoryScanRecord[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.verdict) query.append("verdict", params.verdict);
  if (params?.type) query.append("type", params.type);
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());

  const res = await fetch(`${API_BASE}/scans?${query.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch scan history");
  }
  return res.json();
}

export async function getScanById(id: string): Promise<{ scan: HistoryScanRecord }> {
  const res = await fetch(`${API_BASE}/scans/${id}`);
  if (!res.ok) {
    throw new Error("Scan record not found");
  }
  return res.json();
}

export async function deleteScanRecord(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/scans/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error("Failed to delete scan record");
  }
}

export async function clearAllScanHistory(): Promise<void> {
  const res = await fetch(`${API_BASE}/scans`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error("Failed to clear scan history");
  }
}

export async function getHealthStatus(): Promise<{
  status: string;
  providers: { googleWebRisk: string; virusTotal: string };
  mode: string;
}> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) {
    throw new Error("Failed to fetch health status");
  }
  return res.json();
}
