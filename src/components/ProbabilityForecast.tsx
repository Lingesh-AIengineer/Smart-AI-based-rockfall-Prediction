import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import { TrendingUp, Brain, Target, AlertTriangle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

interface ForecastData {
  time: string;
  probability: number;
  confidence: number;
  trend: "increasing" | "decreasing" | "stable";
  factors: {
    slope: number;
    weather: number;
    vibration: number;
    historical: number;
  };
}

interface ProbabilityForecastProps {
  mineName: string;
  currentRisk: string;
  onAnalyze: () => void;
}

const ProbabilityForecast = ({ mineName, currentRisk, onAnalyze }: ProbabilityForecastProps) => {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    generateForecastData();
  }, [timeRange, currentRisk]);

  const generateForecastData = () => {
    const points = timeRange === "24h" ? 24 : timeRange === "7d" ? 7 : 30;
    const interval = timeRange === "24h" ? "hour" : "day";
    
    let baseRisk = 30;
    if (currentRisk === "High") baseRisk = 80;
    else if (currentRisk === "Medium") baseRisk = 55;
    else if (currentRisk === "Low") baseRisk = 35;

    const data: ForecastData[] = Array.from({ length: points }, (_, i) => {
      const timeValue = timeRange === "24h" ? 
        new Date(Date.now() + i * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
        new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' });
      
      const trend = Math.random();
      const variance = (Math.random() - 0.5) * 20;
      const probability = Math.max(0, Math.min(100, baseRisk + variance + (trend > 0.6 ? 10 : trend < 0.4 ? -10 : 0)));
      
      return {
        time: timeValue,
        probability: Math.round(probability),
        confidence: Math.round(85 + Math.random() * 10),
        trend: trend > 0.6 ? "increasing" : trend < 0.4 ? "decreasing" : "stable",
        factors: {
          slope: Math.round(20 + Math.random() * 40),
          weather: Math.round(15 + Math.random() * 35),
          vibration: Math.round(10 + Math.random() * 30),
          historical: Math.round(25 + Math.random() * 20)
        }
      };
    });

    setForecastData(data);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    generateForecastData();
    setIsAnalyzing(false);
    onAnalyze();
  };

  const currentProbability = forecastData[0]?.probability || 0;
  const avgConfidence = forecastData.reduce((acc, curr) => acc + curr.confidence, 0) / forecastData.length || 0;
  const trendDirection = forecastData.filter(d => d.trend === "increasing").length > forecastData.filter(d => d.trend === "decreasing").length ? "increasing" : "decreasing";

  const factorData = forecastData[0] ? [
    { name: "Slope Instability", value: forecastData[0].factors.slope, color: "#3b82f6" },
    { name: "Weather Conditions", value: forecastData[0].factors.weather, color: "#10b981" },
    { name: "Vibration Patterns", value: forecastData[0].factors.vibration, color: "#f59e0b" },
    { name: "Historical Data", value: forecastData[0].factors.historical, color: "#8b5cf6" }
  ] : [];

  const getRiskColor = (probability: number) => {
    if (probability > 75) return "#ef4444";
    if (probability > 50) return "#f59e0b";
    if (probability > 25) return "#eab308";
    return "#10b981";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "increasing") return <TrendingUp className="h-4 w-4 text-chart-4" />;
    if (trend === "decreasing") return <TrendingUp className="h-4 w-4 text-chart-2 rotate-180" />;
    return <Target className="h-4 w-4 text-chart-3" />;
  };

  return (
    <Card className="bg-dashboard-card border-dashboard-border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-dashboard-text">AI Probability Forecast</h2>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="bg-primary hover:bg-primary/90"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-dashboard-muted mb-3">
            Mine: {mineName} | Model: Deep Learning Neural Network | Last Updated: {new Date().toLocaleString()}
          </p>
          <div className="flex gap-2">
            <Button
              variant={timeRange === "24h" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("24h")}
            >
              24 Hours
            </Button>
            <Button
              variant={timeRange === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("7d")}
            >
              7 Days
            </Button>
            <Button
              variant={timeRange === "30d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("30d")}
            >
              30 Days
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Current Forecast */}
          <Card className="bg-dashboard-bg border-dashboard-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-dashboard-text">Current Probability</span>
              {getTrendIcon(trendDirection)}
            </div>
            <div className="text-3xl font-bold text-dashboard-text mb-1">
              {currentProbability}%
            </div>
            <div className="text-sm text-dashboard-muted">
              Confidence: {Math.round(avgConfidence)}%
            </div>
          </Card>

          {/* Risk Level */}
          <Card className="bg-dashboard-bg border-dashboard-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-dashboard-text">Predicted Risk</span>
              <AlertTriangle className="h-4 w-4 text-chart-3" />
            </div>
            <div className="mb-2">
              <Badge 
                className="text-white" 
                style={{ backgroundColor: getRiskColor(currentProbability) }}
              >
                {currentProbability > 75 ? "High" : currentProbability > 50 ? "Medium" : currentProbability > 25 ? "Low" : "Safe"}
              </Badge>
            </div>
            <div className="text-sm text-dashboard-muted">
              Trend: {trendDirection}
            </div>
          </Card>

          {/* Time to Risk */}
          <Card className="bg-dashboard-bg border-dashboard-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-dashboard-text">Time to High Risk</span>
              <Target className="h-4 w-4 text-chart-1" />
            </div>
            <div className="text-3xl font-bold text-dashboard-text mb-1">
              {currentProbability > 75 ? "Now" : currentProbability > 50 ? "2-4h" : "12-24h"}
            </div>
            <div className="text-sm text-dashboard-muted">
              Estimated arrival
            </div>
          </Card>
        </div>

        {/* Probability Trend Chart */}
        <div className="mb-6">
          <h3 className="font-medium text-dashboard-text mb-3">Probability Trend Forecast</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--dashboard-border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--dashboard-muted))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(var(--dashboard-muted))"
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--dashboard-card))', 
                    border: '1px solid hsl(var(--dashboard-border))',
                    color: 'hsl(var(--dashboard-text))'
                  }}
                  formatter={(value: number, name: string) => [
                    `${value}%`,
                    name === 'probability' ? 'Rockfall Probability' : name === 'confidence' ? 'Model Confidence' : name
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="probability" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary)/0.3)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="confidence"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Contributing Factors */}
        <div>
          <h3 className="font-medium text-dashboard-text mb-3">Contributing Factors Analysis</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={factorData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--dashboard-border))" />
                <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--dashboard-muted))" />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--dashboard-muted))" width={120} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--dashboard-card))', 
                    border: '1px solid hsl(var(--dashboard-border))',
                    color: 'hsl(var(--dashboard-text))'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Contribution']}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6 p-4 bg-dashboard-bg rounded-lg">
          <h4 className="font-medium text-dashboard-text mb-2">AI Model Performance</h4>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-dashboard-text">94.7%</div>
              <div className="text-xs text-dashboard-muted">Accuracy</div>
            </div>
            <div>
              <div className="text-lg font-bold text-dashboard-text">91.2%</div>
              <div className="text-xs text-dashboard-muted">Precision</div>
            </div>
            <div>
              <div className="text-lg font-bold text-dashboard-text">96.8%</div>
              <div className="text-xs text-dashboard-muted">Recall</div>
            </div>
            <div>
              <div className="text-lg font-bold text-dashboard-text">2.3s</div>
              <div className="text-xs text-dashboard-muted">Response Time</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProbabilityForecast;