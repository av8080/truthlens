import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface ScanActivityChartProps {
  scans: Array<{ createdAt: string; verdict: string }>;
}

export const ScanActivityChart: React.FC<ScanActivityChartProps> = ({ scans }) => {
  // Aggregate scans by date
  const dateMap: Record<string, { date: string; threats: number; safe: number; suspicious: number }> = {};

  // Last 7 days fallback structure
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const displayDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dateMap[dateStr] = { date: displayDate, threats: 0, safe: 0, suspicious: 0 };
  }

  scans.forEach((scan) => {
    const dateStr = new Date(scan.createdAt).toISOString().split("T")[0];
    if (dateMap[dateStr]) {
      if (scan.verdict === "KNOWN_THREAT" || scan.verdict === "HIGH_RISK") {
        dateMap[dateStr].threats += 1;
      } else if (scan.verdict === "SUSPICIOUS") {
        dateMap[dateStr].suspicious += 1;
      } else {
        dateMap[dateStr].safe += 1;
      }
    }
  });

  const chartData = Object.values(dateMap);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2A40" />
          <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} />
          <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#121A2B",
              borderColor: "#1E2A40",
              borderRadius: "8px",
              color: "#F3F4F6",
              fontSize: "12px"
            }}
          />
          <Bar dataKey="threats" name="Confirmed Threat / High Risk" fill="#EF4444" radius={[4, 4, 0, 0]} stackId="a" />
          <Bar dataKey="suspicious" name="Suspicious Findings" fill="#F59E0B" radius={[4, 4, 0, 0]} stackId="a" />
          <Bar dataKey="safe" name="No Threat Detected" fill="#10B981" radius={[4, 4, 0, 0]} stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
