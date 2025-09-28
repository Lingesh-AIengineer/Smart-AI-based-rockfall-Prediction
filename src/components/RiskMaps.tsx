import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Map, 
  Layers, 
  AlertTriangle, 
  MapPin, 
  Maximize2,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";
import { useState, useEffect } from "react";

interface RiskZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  risk: "High" | "Medium" | "Low" | "Safe";
  probability: number;
  factors: string[];
}

interface RiskMapsProps {
  mineName: string;
  onZoneClick: (zone: RiskZone) => void;
}

const RiskMaps = ({ mineName, onZoneClick }: RiskMapsProps) => {
  const [viewMode, setViewMode] = useState<"risk" | "probability" | "factors">("risk");
  const [showGrid, setShowGrid] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);

  useEffect(() => {
    // Generate synthetic risk zones
    const zones: RiskZone[] = Array.from({ length: 25 }, (_, i) => {
      const row = Math.floor(i / 5);
      const col = i % 5;
      const x = col * 80 + 10;
      const y = row * 60 + 10;
      const probability = Math.random() * 100;
      
      let risk: "High" | "Medium" | "Low" | "Safe" = "Safe";
      if (probability > 75) risk = "High";
      else if (probability > 50) risk = "Medium"; 
      else if (probability > 25) risk = "Low";

      const factors = [];
      if (probability > 60) factors.push("Slope Instability");
      if (probability > 40) factors.push("Vibration");
      if (probability > 30) factors.push("Weather");

      return {
        id: `zone-${i}`,
        x,
        y,
        width: 70,
        height: 50,
        risk,
        probability: Math.round(probability),
        factors
      };
    });

    setRiskZones(zones);
  }, []);

  const getRiskColor = (risk: string, opacity = 0.7) => {
    switch (risk) {
      case "High": return `rgba(239, 68, 68, ${opacity})`;
      case "Medium": return `rgba(245, 158, 11, ${opacity})`;
      case "Low": return `rgba(251, 191, 36, ${opacity})`;
      case "Safe": return `rgba(16, 185, 129, ${opacity})`;
      default: return `rgba(107, 114, 128, ${opacity})`;
    }
  };

  const getProbabilityColor = (probability: number, opacity = 0.7) => {
    if (probability > 75) return `rgba(239, 68, 68, ${opacity})`;
    if (probability > 50) return `rgba(245, 158, 11, ${opacity})`;
    if (probability > 25) return `rgba(251, 191, 36, ${opacity})`;
    return `rgba(16, 185, 129, ${opacity})`;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update risk zones with new data
    setRiskZones(prev => prev.map(zone => ({
      ...zone,
      probability: Math.max(0, Math.min(100, zone.probability + (Math.random() - 0.5) * 20))
    })));
    
    setIsRefreshing(false);
  };

  const riskCounts = {
    High: riskZones.filter(z => z.risk === "High").length,
    Medium: riskZones.filter(z => z.risk === "Medium").length,
    Low: riskZones.filter(z => z.risk === "Low").length,
    Safe: riskZones.filter(z => z.risk === "Safe").length
  };

  return (
    <Card className="bg-dashboard-card border-dashboard-border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-dashboard-text">Real-Time Risk Maps</h2>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowGrid(!showGrid)}
            >
              {showGrid ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button size="sm" variant="outline">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-dashboard-muted mb-3">
            Mine Site: {mineName} | Grid Resolution: 50m × 50m | Last Updated: 30 seconds ago
          </p>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "risk" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("risk")}
            >
              Risk Levels
            </Button>
            <Button
              variant={viewMode === "probability" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("probability")}
            >
              Probability
            </Button>
            <Button
              variant={viewMode === "factors" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("factors")}
            >
              Risk Factors
            </Button>
          </div>
        </div>

        <div className="relative bg-dashboard-bg rounded-lg p-4 mb-6" style={{ height: '400px' }}>
          <svg width="100%" height="100%" viewBox="0 0 420 320">
            {/* Grid lines */}
            {showGrid && (
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--dashboard-border))" strokeWidth="0.5"/>
                </pattern>
              </defs>
            )}
            {showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}

            {/* Risk zones */}
            {riskZones.map((zone) => (
              <g key={zone.id} onClick={() => onZoneClick(zone)} style={{ cursor: 'pointer' }}>
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  fill={viewMode === "probability" ? 
                    getProbabilityColor(zone.probability) : 
                    getRiskColor(zone.risk)
                  }
                  stroke="hsl(var(--dashboard-border))"
                  strokeWidth="1"
                  className="hover:opacity-80 transition-opacity"
                />
                
                {/* Zone labels */}
                <text
                  x={zone.x + zone.width / 2}
                  y={zone.y + zone.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-medium"
                  fill="white"
                >
                  {viewMode === "probability" ? `${zone.probability}%` : zone.risk}
                </text>

                {/* Risk indicators */}
                {zone.risk === "High" && (
                  <AlertTriangle
                    x={zone.x + 5}
                    y={zone.y + 5}
                    width="12"
                    height="12"
                    fill="white"
                  />
                )}
              </g>
            ))}

            {/* Legend */}
            <g transform="translate(320, 20)">
              <rect x="0" y="0" width="90" height="120" fill="hsl(var(--dashboard-card))" stroke="hsl(var(--dashboard-border))" />
              <text x="45" y="15" textAnchor="middle" className="text-xs font-medium" fill="hsl(var(--dashboard-text))">
                Risk Levels
              </text>
              
              <rect x="10" y="25" width="15" height="15" fill={getRiskColor("High")} />
              <text x="30" y="35" className="text-xs" fill="hsl(var(--dashboard-text))">High</text>
              
              <rect x="10" y="45" width="15" height="15" fill={getRiskColor("Medium")} />
              <text x="30" y="55" className="text-xs" fill="hsl(var(--dashboard-text))">Medium</text>
              
              <rect x="10" y="65" width="15" height="15" fill={getRiskColor("Low")} />
              <text x="30" y="75" className="text-xs" fill="hsl(var(--dashboard-text))">Low</text>
              
              <rect x="10" y="85" width="15" height="15" fill={getRiskColor("Safe")} />
              <text x="30" y="95" className="text-xs" fill="hsl(var(--dashboard-text))">Safe</text>
            </g>
          </svg>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-dashboard-bg p-3 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getRiskColor("High") }}></div>
              <span className="text-sm font-medium text-dashboard-text">High Risk</span>
            </div>
            <div className="text-xl font-bold text-dashboard-text">{riskCounts.High}</div>
          </div>
          <div className="bg-dashboard-bg p-3 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getRiskColor("Medium") }}></div>
              <span className="text-sm font-medium text-dashboard-text">Medium Risk</span>
            </div>
            <div className="text-xl font-bold text-dashboard-text">{riskCounts.Medium}</div>
          </div>
          <div className="bg-dashboard-bg p-3 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getRiskColor("Low") }}></div>
              <span className="text-sm font-medium text-dashboard-text">Low Risk</span>
            </div>
            <div className="text-xl font-bold text-dashboard-text">{riskCounts.Low}</div>
          </div>
          <div className="bg-dashboard-bg p-3 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getRiskColor("Safe") }}></div>
              <span className="text-sm font-medium text-dashboard-text">Safe</span>
            </div>
            <div className="text-xl font-bold text-dashboard-text">{riskCounts.Safe}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RiskMaps;