import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Activity, 
  Gauge, 
  Droplets, 
  Thermometer, 
  Zap,
  Wifi,
  WifiOff,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { useState, useEffect } from "react";

interface DataSource {
  id: string;
  name: string;
  type: "sensor" | "imagery" | "environmental";
  icon: any;
  status: "online" | "offline" | "error";
  lastUpdate: string;
  value: number;
  unit: string;
  threshold: number;
  isRecording: boolean;
}

interface DataSourcesPanelProps {
  onAnalyze: (sourceId: string) => void;
}

const DataSourcesPanel = ({ onAnalyze }: DataSourcesPanelProps) => {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: "dem",
      name: "Digital Elevation Model",
      type: "imagery",
      icon: Camera,
      status: "online",
      lastUpdate: "2 min ago",
      value: 98,
      unit: "%",
      threshold: 95,
      isRecording: true
    },
    {
      id: "drone",
      name: "Drone Imagery",
      type: "imagery", 
      icon: Camera,
      status: "online",
      lastUpdate: "5 min ago",
      value: 1024,
      unit: "images",
      threshold: 1000,
      isRecording: true
    },
    {
      id: "displacement",
      name: "Displacement Sensors",
      type: "sensor",
      icon: Activity,
      status: "online",
      lastUpdate: "1 min ago",
      value: 2.3,
      unit: "mm",
      threshold: 5.0,
      isRecording: true
    },
    {
      id: "strain",
      name: "Strain Gauges",
      type: "sensor",
      icon: Gauge,
      status: "online",
      lastUpdate: "1 min ago", 
      value: 67,
      unit: "με",
      threshold: 100,
      isRecording: true
    },
    {
      id: "pore_pressure",
      name: "Pore Pressure",
      type: "sensor",
      icon: Droplets,
      status: "error",
      lastUpdate: "15 min ago",
      value: 45.2,
      unit: "kPa",
      threshold: 50.0,
      isRecording: false
    },
    {
      id: "rainfall",
      name: "Rainfall Monitor",
      type: "environmental",
      icon: Droplets,
      status: "online",
      lastUpdate: "30 sec ago",
      value: 12.5,
      unit: "mm/h",
      threshold: 20.0,
      isRecording: true
    },
    {
      id: "temperature",
      name: "Temperature",
      type: "environmental",
      icon: Thermometer,
      status: "online",
      lastUpdate: "30 sec ago",
      value: 28.7,
      unit: "°C",
      threshold: 35.0,
      isRecording: true
    },
    {
      id: "vibration",
      name: "Vibration Sensors",
      type: "environmental",
      icon: Zap,
      status: "online",
      lastUpdate: "10 sec ago",
      value: 8.2,
      unit: "Hz",
      threshold: 15.0,
      isRecording: true
    }
  ]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setDataSources(prev => prev.map(source => ({
        ...source,
        value: source.status === "online" ? 
          source.value + (Math.random() - 0.5) * (source.value * 0.1) :
          source.value,
        lastUpdate: source.status === "online" ? "Just now" : source.lastUpdate
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return <Wifi className="h-3 w-3 text-chart-2" />;
      case "offline": return <WifiOff className="h-3 w-3 text-muted-foreground" />;
      case "error": return <WifiOff className="h-3 w-3 text-chart-4" />;
      default: return <WifiOff className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-chart-2";
      case "offline": return "text-muted-foreground";
      case "error": return "text-chart-4";
      default: return "text-muted-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "sensor": return "bg-chart-1";
      case "imagery": return "bg-chart-2";  
      case "environmental": return "bg-chart-3";
      default: return "bg-muted";
    }
  };

  const toggleRecording = (id: string) => {
    setDataSources(prev => prev.map(source => 
      source.id === id ? { ...source, isRecording: !source.isRecording } : source
    ));
  };

  const handleAnalyze = (sourceId: string) => {
    onAnalyze(sourceId);
  };

  return (
    <Card className="bg-dashboard-card border-dashboard-border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-dashboard-text">Multi-Source Data Monitoring</h2>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-chart-2 border-chart-2">
              {dataSources.filter(s => s.status === "online").length} Online
            </Badge>
            <Badge variant="outline" className="text-chart-4 border-chart-4">
              {dataSources.filter(s => s.status === "error").length} Error
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dataSources.map((source) => {
            const IconComponent = source.icon;
            const progressValue = (source.value / source.threshold) * 100;
            
            return (
              <Card key={source.id} className="bg-dashboard-bg border-dashboard-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-primary" />
                    <span className="font-medium text-dashboard-text">{source.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(source.status)}
                    <Badge className={`text-xs ${getTypeColor(source.type)}`}>
                      {source.type}
                    </Badge>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl font-bold text-dashboard-text">
                      {typeof source.value === 'number' ? source.value.toFixed(1) : source.value}
                      <span className="text-sm text-dashboard-muted ml-1">{source.unit}</span>
                    </span>
                    <span className={`text-xs ${getStatusColor(source.status)}`}>
                      {source.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <Progress 
                    value={Math.min(progressValue, 100)} 
                    className="h-2"
                  />
                  <div className="text-xs text-dashboard-muted mt-1">
                    Threshold: {source.threshold} {source.unit}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-dashboard-muted">
                    Updated: {source.lastUpdate}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleRecording(source.id)}
                      className="h-6 px-2"
                    >
                      {source.isRecording ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAnalyze(source.id)}
                      className="h-6 px-2"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-dashboard-bg rounded-lg">
          <h3 className="font-medium text-dashboard-text mb-2">Data Integration Status</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-dashboard-text">
                {dataSources.filter(s => s.isRecording).length}
              </div>
              <div className="text-xs text-dashboard-muted">Recording</div>
            </div>
            <div>
              <div className="text-lg font-bold text-dashboard-text">
                {Math.round(dataSources.reduce((acc, s) => acc + s.value, 0))}
              </div>
              <div className="text-xs text-dashboard-muted">Data Points</div>
            </div>
            <div>
              <div className="text-lg font-bold text-dashboard-text">
                {dataSources.filter(s => s.value > s.threshold * 0.8).length}
              </div>
              <div className="text-xs text-dashboard-muted">Near Threshold</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DataSourcesPanel;