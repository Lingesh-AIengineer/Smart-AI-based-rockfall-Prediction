import { LocationData, RiskData } from "@/pages/Dashboard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface DataChartsProps {
  locationData: LocationData;
  riskData: RiskData;
}

const DataCharts = ({ locationData, riskData }: DataChartsProps) => {
  // Generate time series data for monitoring trends
  const timeSeriesData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    vibration: locationData.vibration + (Math.random() - 0.5) * 20,
    slope: locationData.slope + (Math.random() - 0.5) * 5,
    rainfall: Math.max(0, locationData.rainfall + (Math.random() - 0.5) * 10),
  }));

  // Risk factors data for bar chart
  const riskFactorsData = [
    {
      name: "Slope Instability",
      value: riskData.factors.slopeInstability,
      color: "#ef4444",
    },
    {
      name: "Vibration Patterns", 
      value: riskData.factors.vibrationPatterns,
      color: "#f97316",
    },
    {
      name: "Weather Conditions",
      value: riskData.factors.weatherConditions,
      color: "#eab308",
    },
  ];

  // Risk distribution pie chart data
  const riskDistribution = [
    { name: "Current Risk", value: riskData.probability, color: "#ef4444" },
    { name: "Safety Margin", value: 100 - riskData.probability, color: "#22c55e" },
  ];

  return (
    <div className="space-y-6">
      {/* Real-time Monitoring Trends */}
      <div>
        <h4 className="font-medium text-dashboard-text mb-3">24-Hour Monitoring Trends</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="hour" 
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#f3f4f6"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="vibration" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Vibration Level"
              />
              <Line 
                type="monotone" 
                dataKey="slope" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Slope Movement"
              />
              <Line 
                type="monotone" 
                dataKey="rainfall" 
                stroke="#22c55e" 
                strokeWidth={2}
                name="Rainfall (mm)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Factors Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-dashboard-text mb-3">Risk Factors Contribution</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskFactorsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#f3f4f6"
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-dashboard-text mb-3">Risk vs Safety Margin</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#f3f4f6"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm text-dashboard-muted">Risk Level</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-dashboard-muted">Safety Margin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCharts;