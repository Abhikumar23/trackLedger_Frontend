import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, CalendarDays, IndianRupee } from 'lucide-react'; // Lucide icons

// export default function (unchanged)
export default function BarChartPage({ data }) {
  const [hoveredBar, setHoveredBar] = useState(null);
  const itemNames = [...new Set(data.flatMap(d => Object.keys(d)).filter(k => k !== 'month'))];
  const colors = ['#4f46e5', '#16a34a', '#dc2626', '#f59e0b', '#0ea5e9', '#8b5cf6'];

  // Custom tooltip (only hovered bar)
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0 && hoveredBar) {
      const entry = payload.find(p => p.dataKey === hoveredBar);
      if (entry) {
        return (
          <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg text-sm">
            <p className="font-semibold text-gray-800 mb-1 flex items-center gap-1">
              <CalendarDays className="w-4 h-4 text-blue-500" />
              {label}
            </p>
            <p style={{ color: entry.fill }} className="font-medium flex items-center gap-1">
              <IndianRupee className="w-4 h-4" />
              {entry.name}: ₹{entry.value}
            </p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 rounded-2xl hover:shadow-2xl transition duration-400 shadow-md max-w-4xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2 text-white">
        <TrendingUp className="w-5 h-5 text-green-600" />
        Monthly Amount Tracker
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          barGap={8}
          barCategoryGap="20%"
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type="number"
            domain={[0, 'dataMax + 100']}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
          />
          {itemNames.map((name, index) => (
            <Bar
              key={name}
              dataKey={name}
              fill={colors[index % colors.length]}
              radius={[4, 4, 0, 0]}
              minPointSize={5}
              stroke="rgba(255,255,255,0.8)"
              strokeWidth={1}
              onMouseEnter={() => setHoveredBar(name)}
              onMouseLeave={() => setHoveredBar(null)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
