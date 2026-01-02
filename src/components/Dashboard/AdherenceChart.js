// src/components/Dashboard/AdherenceChart.js
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const AdherenceChart = ({ percent }) => {
  // Data for the chart: [Progress, Remaining]
  const data = [
    { name: 'Completed', value: percent },
    { name: 'Remaining', value: 100 - percent },
  ];

  // Colors: MedTracker Blue for progress, light gray for the empty track
  const COLORS = ['#00a6d6', '#f1f5f9'];

  return (
    <div className="relative w-24 h-24">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={30}
            outerRadius={45}
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {/* Central Percentage Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-800">{percent}%</span>
      </div>
    </div>
  );
};

export default AdherenceChart;