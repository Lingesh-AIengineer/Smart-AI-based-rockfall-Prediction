import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, X, Phone, Mail, MessageSquare } from "lucide-react";

interface AlertSystemProps {
  riskLevel: "High" | "Medium" | "Low" | "Safe";
  location: string;
  onClose: () => void;
}

const AlertSystem = ({ riskLevel, location, onClose }: AlertSystemProps) => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAlertMessage = () => {
    switch (riskLevel) {
      case "High":
        return {
          title: "🚨 CRITICAL ALERT: HIGH ROCKFALL RISK DETECTED",
          message: "Immediate evacuation required. All personnel must leave the area immediately.",
          actions: [
            "Evacuate all personnel from the danger zone",
            "Stop all mining operations immediately",
            "Contact emergency services",
            "Activate emergency response protocol"
          ]
        };
      case "Medium":
        return {
          title: "⚠️ WARNING: ELEVATED ROCKFALL RISK",
          message: "Increased monitoring and caution required in the specified area.",
          actions: [
            "Increase monitoring frequency",
            "Restrict access to high-risk zones",
            "Review safety protocols",
            "Prepare contingency measures"
          ]
        };
      default:
        return {
          title: "ℹ️ ADVISORY: ROCKFALL RISK DETECTED",
          message: "Continue operations with enhanced monitoring.",
          actions: [
            "Maintain standard safety protocols",
            "Monitor conditions closely",
            "Brief personnel on current conditions"
          ]
        };
    }
  };

  const alert = getAlertMessage();
  const isHighRisk = riskLevel === "High";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className={`max-w-2xl w-full ${isHighRisk ? 'border-risk-high bg-risk-high/10' : 'border-risk-medium bg-risk-medium/10'} animate-pulse`}>
        <div className="p-6">
          {/* Alert Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`h-8 w-8 ${isHighRisk ? 'text-risk-high' : 'text-risk-medium'}`} />
              <div>
                <h2 className={`text-xl font-bold ${isHighRisk ? 'text-risk-high' : 'text-risk-medium'}`}>
                  {alert.title}
                </h2>
                <p className="text-dashboard-muted">Location: {location}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-dashboard-muted hover:text-dashboard-text"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Alert Details */}
          <div className="space-y-4">
            <div className="bg-dashboard-card p-4 rounded-lg border border-dashboard-border">
              <p className="text-dashboard-text font-medium">{alert.message}</p>
              <div className="mt-2 text-sm text-dashboard-muted">
                Alert triggered: {formatTime(timeElapsed)} ago
              </div>
            </div>

            {/* Recommended Actions */}
            <div>
              <h3 className="font-semibold text-dashboard-text mb-3">Immediate Actions Required:</h3>
              <ul className="space-y-2">
                {alert.actions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-2 ${isHighRisk ? 'bg-risk-high' : 'bg-risk-medium'}`} />
                    <span className="text-dashboard-text">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Emergency Contacts */}
            {isHighRisk && (
              <div className="bg-risk-high/20 border border-risk-high p-4 rounded-lg">
                <h3 className="font-semibold text-risk-high mb-3">Emergency Contacts</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button className="bg-risk-high hover:bg-risk-high/90 text-risk-high-foreground">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Emergency
                  </Button>
                  <Button className="bg-risk-high hover:bg-risk-high/90 text-risk-high-foreground">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Alert Email
                  </Button>
                  <Button className="bg-risk-high hover:bg-risk-high/90 text-risk-high-foreground">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    SMS Broadcast
                  </Button>
                </div>
              </div>
            )}

            {/* Acknowledgment */}
            <div className="flex justify-end gap-3 pt-4 border-t border-dashboard-border">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-dashboard-border text-dashboard-text hover:bg-dashboard-card"
              >
                Acknowledge Alert
              </Button>
              {isHighRisk && (
                <Button className="bg-risk-high hover:bg-risk-high/90 text-risk-high-foreground">
                  Activate Emergency Protocol
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AlertSystem;