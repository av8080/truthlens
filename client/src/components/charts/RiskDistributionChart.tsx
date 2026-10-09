import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface RiskDistributionChartProps {
  data: Array<{ name: string; count: number; color: string }>;
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ data }) => {
  const hasData = data && data.some((item) => item.count > 0);

  if (!hasData) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-4 border border-dashed border-surface-border rounded-xl">
        <p className="text-gray-400 text-xs mb-1 font-medium">No Scan Distribution Data Available Yet</p>
        <p className="text-gray-500 text-[11px]">Run your first URL or message scan to generate stats.</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#121A2B" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#121A2B",
              borderColor: "#1E2A40",
              borderRadius: "8px",
              color: "#F3F4F6",
              fontSize: "12px"
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-gray-300 font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
