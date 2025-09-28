import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  Settings
} from "lucide-react";
import { useState, useEffect } from "react";

interface Alert {
  id: string;
  type: "email" | "sms" | "call" | "push";
  status: "sent" | "pending" | "failed";
  recipient: string;
  message: string;
  timestamp: string;
  riskLevel: "High" | "Medium" | "Low";
}

interface AlertPanelProps {
  riskLevel: "High" | "Medium" | "Low" | "Safe";
  mineName: string;
  onSendAlert: (type: string) => void;
}

const AlertPanel = ({ riskLevel, mineName, onSendAlert }: AlertPanelProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isAutoAlertEnabled, setIsAutoAlertEnabled] = useState(true);
  const [alertsSent, setAlertsSent] = useState(0);

  useEffect(() => {
    // Simulate alert generation for high risk
    if (riskLevel === "High" && isAutoAlertEnabled) {
      const newAlert: Alert = {
        id: `alert-${Date.now()}`,
        type: "email",
        status: "sent",
        recipient: "safety@miningcompany.com",
        message: `HIGH RISK ALERT: Rockfall risk detected at ${mineName}. Immediate evacuation recommended.`,
        timestamp: new Date().toLocaleTimeString(),
        riskLevel: "High"
      };
      
      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      setAlertsSent(prev => prev + 1);
    }
  }, [riskLevel, mineName, isAutoAlertEnabled]);

  const handleSendAlert = async (type: string) => {
    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      type: type as any,
      status: "pending",
      recipient: getRecipient(type),
      message: generateMessage(riskLevel, mineName),
      timestamp: new Date().toLocaleTimeString(),
      riskLevel: riskLevel === "Safe" ? "Low" : riskLevel
    };

    setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
    onSendAlert(type);

    // Simulate sending delay
    setTimeout(() => {
      setAlerts(prev => prev.map(alert => 
        alert.id === newAlert.id 
          ? { ...alert, status: Math.random() > 0.1 ? "sent" : "failed" }
          : alert
      ));
      setAlertsSent(prev => prev + 1);
    }, 2000);
  };

  const getRecipient = (type: string) => {
    switch (type) {
      case "email": return "safety@miningcompany.com";
      case "sms": return "+1-555-0123";
      case "call": return "+1-555-0456";
      case "push": return "Mobile App Users";
      default: return "Unknown";
    }
  };

  const generateMessage = (risk: string, mine: string) => {
    switch (risk) {
      case "High":
        return `CRITICAL ALERT: High rockfall risk detected at ${mine}. Immediate evacuation required.`;
      case "Medium":
        return `WARNING: Medium rockfall risk at ${mine}. Enhanced monitoring activated.`;
      case "Low":
        return `ADVISORY: Low rockfall risk detected at ${mine}. Continue monitoring.`;
      default:
        return `INFO: Risk status update for ${mine}.`;
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "email": return Mail;
      case "sms": return MessageSquare;
      case "call": return Phone;
      case "push": return Bell;
      default: return Bell;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "text-chart-2";
      case "pending": return "text-chart-3";
      case "failed": return "text-chart-4";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent": return CheckCircle;
      case "pending": return Clock;
      case "failed": return AlertTriangle;
      default: return Clock;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "bg-chart-4 text-white";
      case "Medium": return "bg-chart-3 text-white";
      case "Low": return "bg-chart-1 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="bg-dashboard-card border-dashboard-border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-dashboard-text">Alert Management System</h2>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-chart-2 border-chart-2">
              {alertsSent} Sent
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAutoAlertEnabled(!isAutoAlertEnabled)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Auto: {isAutoAlertEnabled ? "ON" : "OFF"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Send Alerts Section */}
          <div>
            <h3 className="font-medium text-dashboard-text mb-4">Send Emergency Alerts</h3>
            <div className="space-y-3">
              <Button
                onClick={() => handleSendAlert("email")}
                className="w-full justify-start bg-chart-1 hover:bg-chart-1/90"
                disabled={riskLevel === "Safe"}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email Alert
              </Button>
              <Button
                onClick={() => handleSendAlert("sms")}
                className="w-full justify-start bg-chart-2 hover:bg-chart-2/90"
                disabled={riskLevel === "Safe"}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send SMS Alert
              </Button>
              <Button
                onClick={() => handleSendAlert("call")}
                className="w-full justify-start bg-chart-3 hover:bg-chart-3/90"
                disabled={riskLevel === "Safe"}
              >
                <Phone className="h-4 w-4 mr-2" />
                Initiate Emergency Call
              </Button>
              <Button
                onClick={() => handleSendAlert("push")}
                className="w-full justify-start bg-chart-4 hover:bg-chart-4/90"
                disabled={riskLevel === "Safe"}
              >
                <Bell className="h-4 w-4 mr-2" />
                Push Notification
              </Button>
            </div>

            <div className="mt-6 p-4 bg-dashboard-bg rounded-lg">
              <h4 className="font-medium text-dashboard-text mb-2">Current Risk Status</h4>
              <Badge className={getRiskColor(riskLevel)}>
                {riskLevel} Risk Level
              </Badge>
              {riskLevel === "High" && (
                <p className="text-sm text-chart-4 mt-2">
                  ⚠️ Auto-alerts are being sent every 5 minutes
                </p>
              )}
            </div>
          </div>

          {/* Recent Alerts Section */}
          <div>
            <h3 className="font-medium text-dashboard-text mb-4">Recent Alerts</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-dashboard-muted">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No alerts sent yet</p>
                </div>
              ) : (
                alerts.map((alert) => {
                  const TypeIcon = getAlertTypeIcon(alert.type);
                  const StatusIcon = getStatusIcon(alert.status);
                  
                  return (
                    <Card key={alert.id} className="bg-dashboard-bg border-dashboard-border p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <TypeIcon className="h-4 w-4 text-primary mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-dashboard-text">
                                {alert.type.toUpperCase()}
                              </span>
                            <Badge className={getRiskColor(alert.riskLevel)}>
                              {alert.riskLevel}
                            </Badge>
                            </div>
                            <p className="text-xs text-dashboard-muted mb-1">
                              To: {alert.recipient}
                            </p>
                            <p className="text-xs text-dashboard-text">
                              {alert.message.substring(0, 60)}...
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1">
                            <StatusIcon className={`h-3 w-3 ${getStatusColor(alert.status)}`} />
                            <span className={`text-xs ${getStatusColor(alert.status)}`}>
                              {alert.status}
                            </span>
                          </div>
                          <span className="text-xs text-dashboard-muted">
                            {alert.timestamp}
                          </span>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-dashboard-bg rounded-lg">
          <h4 className="font-medium text-dashboard-text mb-3">Alert Statistics</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-dashboard-text">
                {alerts.filter(a => a.status === "sent").length}
              </div>
              <div className="text-xs text-dashboard-muted">Successfully Sent</div>
            </div>
            <div>
              <div className="text-lg font-bold text-dashboard-text">
                {alerts.filter(a => a.status === "pending").length}
              </div>
              <div className="text-xs text-dashboard-muted">Pending</div>
            </div>
            <div>
              <div className="text-lg font-bold text-dashboard-text">
                {alerts.filter(a => a.status === "failed").length}
              </div>
              <div className="text-xs text-dashboard-muted">Failed</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AlertPanel;