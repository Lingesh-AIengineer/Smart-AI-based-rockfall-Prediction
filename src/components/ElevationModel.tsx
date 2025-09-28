import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, LineChart, Line } from "recharts";
import { Mountain, TrendingUp, Activity, RotateCcw } from "lucide-react";
import { useState } from "react";

interface ElevationData {
  distance: number;
  elevation: number;
  slope: number;
  stability: number;
  riskLevel: "Low" | "Medium" | "High";
}

interface ElevationModelProps {
  mineName: string;
  onAnalyze: () => void;
}

const ElevationModel = ({ mineName, onAnalyze }: ElevationModelProps) => {
  const [viewMode, setViewMode] = useState<"elevation" | "slope" | "stability">("elevation");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Generate synthetic elevation data
  const elevationData: ElevationData[] = Array.from({ length: 50 }, (_, i) => {
    const distance = i * 20;
    const baseElevation = 300 + Math.sin(i * 0.1) * 50 + Math.cos(i * 0.05) * 30;
    const elevation = Math.max(0, baseElevation + (Math.random() - 0.5) * 40);
    const slope = i > 0 ? Math.abs(elevation - (300 + Math.sin((i-1) * 0.1) * 50)) : 0;
    const stability = Math.max(0, 100 - (slope * 2) - Math.random() * 20);
    
    let riskLevel: "Low" | "Medium" | "High" = "Low";
    if (slope > 25 || stability < 40) riskLevel = "High";
    else if (slope > 15 || stability < 60) riskLevel = "Medium";

    return {
      distance,
      elevation: Math.round(elevation),
      slope: Math.round(slope),
      stability: Math.round(stability),
      riskLevel
    };
  });

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
    onAnalyze();
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "#ef4444";
      case "Medium": return "#f59e0b"; 
      case "Low": return "#10b981";
      default: return "#6b7280";
    }
  };

  const getChartData = () => {
    switch (viewMode) {
      case "slope":
        return elevationData.map(d => ({ ...d, value: d.slope, fill: getRiskColor(d.riskLevel) }));
      case "stability":
        return elevationData.map(d => ({ ...d, value: d.stability, fill: getRiskColor(d.riskLevel) }));
      default:
        return elevationData.map(d => ({ ...d, value: d.elevation, fill: getRiskColor(d.riskLevel) }));
    }
  };

  const chartData = getChartData();

  return (
    <Card className="bg-dashboard-card border-dashboard-border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Mountain className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-dashboard-text">Digital Elevation Model</h2>
          </div>
          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-primary hover:bg-primary/90"
          >
            {isAnalyzing ? (
              <>
                <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Analyze Terrain
              </>
            )}
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-dashboard-muted mb-3">
            Location: {mineName} | Profile Length: 1,000m | Resolution: 20m intervals
          </p>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "elevation" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("elevation")}
              className="text-xs"
            >
              Elevation Profile
            </Button>
            <Button
              variant={viewMode === "slope" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("slope")}
              className="text-xs"
            >
              Slope Analysis
            </Button>
            <Button
              variant={viewMode === "stability" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("stability")}
              className="text-xs"
            >
              Stability Index
            </Button>
          </div>
        </div>

        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === "elevation" ? (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--dashboard-border))" />
                <XAxis 
                  dataKey="distance" 
                  stroke="hsl(var(--dashboard-muted))"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Distance (m)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  stroke="hsl(var(--dashboard-muted))"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Elevation (m)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--dashboard-card))', 
                    border: '1px solid hsl(var(--dashboard-border))',
                    color: 'hsl(var(--dashboard-text))'
                  }}
                  formatter={(value: number, name: string) => [
                    `${value}${viewMode === 'elevation' ? 'm' : viewMode === 'slope' ? '°' : '%'}`,
                    name === 'value' ? (viewMode === 'elevation' ? 'Elevation' : viewMode === 'slope' ? 'Slope' : 'Stability') : name
                  ]}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.3)" />
              </AreaChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--dashboard-border))" />
                <XAxis 
                  dataKey="distance" 
                  stroke="hsl(var(--dashboard-muted))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(var(--dashboard-muted))"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--dashboard-card))', 
                    border: '1px solid hsl(var(--dashboard-border))',
                    color: 'hsl(var(--dashboard-text))'
                  }}
                />
                <Bar dataKey="value" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-dashboard-bg p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-chart-2" />
              <span className="text-sm font-medium text-dashboard-text">Max Elevation</span>
            </div>
            <div className="text-2xl font-bold text-dashboard-text">
              {Math.max(...elevationData.map(d => d.elevation))}m
            </div>
          </div>
          <div className="bg-dashboard-bg p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Mountain className="h-4 w-4 text-chart-3" />
              <span className="text-sm font-medium text-dashboard-text">Max Slope</span>
            </div>
            <div className="text-2xl font-bold text-dashboard-text">
              {Math.max(...elevationData.map(d => d.slope))}°
            </div>
          </div>
          <div className="bg-dashboard-bg p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-chart-4" />
              <span className="text-sm font-medium text-dashboard-text">Risk Zones</span>
            </div>
            <div className="text-2xl font-bold text-dashboard-text">
              {elevationData.filter(d => d.riskLevel === "High").length}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ElevationModel;