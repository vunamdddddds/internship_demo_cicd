// src/pages/DiligenceHr/components/DiligenceCharts.jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

const DiligenceCharts = ({ data }) => {
	const ac = data.content || [];
	//console.log(ac)
  const totalWork = ac.reduce((a, b) => a + b.attended, 0);
  const totalLeave = ac.reduce((a, b) => a + b.leave, 0);
  const totalIssue = ac.reduce((a, b) => a + (b.late + b.early), 0);

  const pieData = [
    { name: "Đi làm", value: totalWork },
    { name: "Nghỉ phép", value: totalLeave },
    { name: "Muộn/Sớm", value: totalIssue },
  ];

  return (
    <div className="my-6">
      {/* Biểu đồ tròn - Tỉ lệ chuyên cần */}
      <div className="bg-white p-5 rounded-lg shadow">
        <h3 className="font-semibold text-sm mb-3">Tỉ lệ chuyên cần</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DiligenceCharts;