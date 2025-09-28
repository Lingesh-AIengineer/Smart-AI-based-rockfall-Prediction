import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LocationData, RiskData } from "@/pages/Dashboard";
import { AlertTriangle, CheckCircle2, AlertCircle, Info } from "lucide-react";

interface RiskAssessmentProps {
  locationData: LocationData;
  riskData: RiskData;
}

const RiskAssessment = ({ locationData, riskData }: RiskAssessmentProps) => {
  const getRiskIcon = (level: string) => {
    switch (level) {
      case "High":
        return <AlertTriangle className="h-5 w-5" />;
      case "Medium":
        return <AlertCircle className="h-5 w-5" />;  
      case "Low":
        return <Info className="h-5 w-5" />;
      case "Safe":
        return <CheckCircle2 className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-risk-high text-risk-high-foreground";
      case "Medium":
        return "bg-risk-medium text-risk-medium-foreground";
      case "Low":
        return "bg-risk-low text-risk-low-foreground";
      case "Safe":
        return "bg-risk-safe text-risk-safe-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRecommendation = (level: string) => {
    switch (level) {
      case "High":
        return "Immediate evacuation recommended. Halt all mining operations in the area.";
      case "Medium":
        return "Increased monitoring required. Consider restricting access to high-risk zones.";
      case "Low":
        return "Continue normal operations with regular monitoring.";
      case "Safe":
        return "Current conditions are stable. Maintain routine safety protocols.";
      default:
        return "Insufficient data for recommendation.";
    }
  };

  return (
    <div className="space-y-6">
      {/* Location Information */}
      <div className="space-y-2">
        <h3 className="font-semibold text-dashboard-text">Location: {locationData.name}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-dashboard-muted">Elevation:</span>
            <span className="ml-2 font-medium">{locationData.elevation}m</span>
          </div>
          <div>
            <span className="text-dashboard-muted">Slope:</span>
            <span className="ml-2 font-medium">{locationData.slope}°</span>
          </div>
          <div>
            <span className="text-dashboard-muted">Temperature:</span>
            <span className="ml-2 font-medium">{locationData.temperature}°C</span>
          </div>
          <div>
            <span className="text-dashboard-muted">Rainfall:</span>
            <span className="ml-2 font-medium">{locationData.rainfall}mm</span>
          </div>
        </div>
      </div>

      {/* Risk Level Display */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          {getRiskIcon(riskData.level)}
          <Badge className={`text-lg px-4 py-2 ${getRiskColor(riskData.level)}`}>
            {riskData.level} Risk
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="text-2xl font-bold">{riskData.probability}%</div>
          <Progress 
            value={riskData.probability} 
            className="w-full h-3"
          />
          <p className="text-sm text-dashboard-muted">Probability of rockfall event</p>
        </div>
      </div>

      {/* Risk Factors Breakdown */}
      <div className="space-y-3">
        <h4 className="font-medium text-dashboard-text">Risk Factors Analysis</h4>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-dashboard-muted">Slope Instability</span>
            <span className="text-sm font-medium">{riskData.factors.slopeInstability}%</span>
          </div>
          <Progress value={riskData.factors.slopeInstability} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-dashboard-muted">Vibration Patterns</span>
            <span className="text-sm font-medium">{riskData.factors.vibrationPatterns}%</span>
          </div>
          <Progress value={riskData.factors.vibrationPatterns} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-dashboard-muted">Weather Conditions</span>
            <span className="text-sm font-medium">{riskData.factors.weatherConditions}%</span>
          </div>
          <Progress value={riskData.factors.weatherConditions} className="h-2" />
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-dashboard-bg p-4 rounded-lg border border-dashboard-border">
        <h4 className="font-medium text-dashboard-text mb-2">Recommendations</h4>
        <p className="text-sm text-dashboard-muted">{getRecommendation(riskData.level)}</p>
      </div>
    </div>
  );
};

export default RiskAssessment;