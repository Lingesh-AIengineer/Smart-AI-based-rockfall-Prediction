import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MineSearch from "@/components/MineSearch";
import RiskAssessment from "@/components/RiskAssessment";
import DataCharts from "@/components/DataCharts";
import AlertSystem from "@/components/AlertSystem";
import ElevationModel from "@/components/ElevationModel";
import DataSourcesPanel from "@/components/DataSourcesPanel";
import RiskMaps from "@/components/RiskMaps";
import AlertPanel from "@/components/AlertPanel";
import ProbabilityForecast from "@/components/ProbabilityForecast";
import { 
  Shield, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  Brain,
  Bell,
  Database,
  Mountain,
  Zap
} from "lucide-react";

interface Mine {
  id: string;
  name: string;
  location: string;
  type: string;
  status: "Active" | "Inactive" | "Under Construction";
  coordinates: { lat: number; lng: number };
  elevation: number;
  area: number;
}

export interface LocationData {
  name: string;
  elevation: number;
  slope: number;
  rainfall: number;
  temperature: number;
  vibration: number;
}

export interface RiskData {
  level: "High" | "Medium" | "Low" | "Safe";
  probability: number;
  factors: {
    slopeInstability: number;
    vibrationPatterns: number;
    weatherConditions: number;
  };
}

const Dashboard = () => {
  const [selectedMine, setSelectedMine] = useState<Mine | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleMineSelect = (mine: Mine) => {
    setSelectedMine(mine);
    
    // Generate mock location data based on selected mine
    const mockLocationData: LocationData = {
      name: mine.name,
      elevation: mine.elevation,
      slope: Math.random() * 45 + 5, // 5-50 degrees
      rainfall: Math.random() * 20 + 5, // 5-25 mm/h
      temperature: Math.random() * 15 + 20, // 20-35°C
      vibration: Math.random() * 10 + 2 // 2-12 Hz
    };

    const mockRiskData: RiskData = {
      level: mine.status === "Under Construction" ? "Medium" : 
             mockLocationData.slope > 35 ? "High" :
             mockLocationData.slope > 25 ? "Medium" : "Low",
      probability: Math.round((mockLocationData.slope * 2) + (mockLocationData.rainfall * 1.5) + (mockLocationData.vibration * 3)),
      factors: {
        slopeInstability: Math.round(mockLocationData.slope * 2),
        vibrationPatterns: Math.round(mockLocationData.vibration * 8),
        weatherConditions: Math.round(mockLocationData.rainfall * 3)
      }
    };

    setLocationData(mockLocationData);
    setRiskData(mockRiskData);
    setShowAlert(mockRiskData.level === "High");
  };

  const handleAnalyze = () => {
    console.log("Running comprehensive analysis...");
  };

  const handleSendAlert = (type: string) => {
    console.log(`Sending ${type} alert...`);
  };

  const handleZoneClick = (zone: any) => {
    console.log("Risk zone clicked:", zone);
  };

  return (
    <div className="min-h-screen bg-dashboard-bg text-dashboard-text">
      {/* Header */}
      <header className="border-b border-dashboard-border bg-dashboard-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">RockFall AI Prediction System</h1>
              <p className="text-dashboard-muted">Advanced Mining Safety Monitoring</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-dashboard-card">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Mine Search
            </TabsTrigger>
            <TabsTrigger value="elevation" className="flex items-center gap-2">
              <Mountain className="h-4 w-4" />
              Elevation
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Sources
            </TabsTrigger>
            <TabsTrigger value="forecast" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Forecast
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {!selectedMine ? (
              <Card className="bg-dashboard-card border-dashboard-border p-8 text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
                <h2 className="text-2xl font-semibold text-dashboard-text mb-2">Select a Mine to Begin</h2>
                <p className="text-dashboard-muted mb-6">
                  Choose a mining site from the Mine Search tab to start analyzing rockfall risks and monitoring data.
                </p>
                <Button onClick={() => setActiveTab("search")} className="bg-primary hover:bg-primary/90">
                  <MapPin className="h-4 w-4 mr-2" />
                  Search Mines
                </Button>
              </Card>
            ) : (
              <>
                {/* Mine Info Header */}
                <Card className="bg-dashboard-card border-dashboard-border p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Mountain className="h-8 w-8 text-primary mt-1" />
                      <div>
                        <h2 className="text-2xl font-semibold text-dashboard-text">{selectedMine.name}</h2>
                        <p className="text-dashboard-muted">{selectedMine.location} • {selectedMine.type}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="bg-dashboard-bg text-dashboard-text px-3 py-1 rounded-full text-sm">
                            Elevation: {selectedMine.elevation}m
                          </span>
                          <span className="bg-dashboard-bg text-dashboard-text px-3 py-1 rounded-full text-sm">
                            Area: {selectedMine.area} ha
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={handleAnalyze} className="bg-primary hover:bg-primary/90">
                      <Activity className="h-4 w-4 mr-2" />
                      Run Full Analysis
                    </Button>
                  </div>
                </Card>

                {/* Risk Assessment & Risk Maps Grid */}
                {locationData && riskData && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Risk Assessment */}
                    <Card className="bg-dashboard-card border-dashboard-border">
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertTriangle className="h-5 w-5 text-primary" />
                          <h2 className="text-xl font-semibold">Risk Assessment</h2>
                        </div>
                        <RiskAssessment locationData={locationData} riskData={riskData} />
                      </div>
                    </Card>

                    {/* Risk Maps */}
                    <RiskMaps mineName={selectedMine.name} onZoneClick={handleZoneClick} />
                  </div>
                )}

                {/* Real-time Monitoring Grid */}
                {locationData && riskData && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-dashboard-card border-dashboard-border p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-chart-1" />
                        <h3 className="font-semibold text-dashboard-muted">Slope Stability</h3>
                      </div>
                      <div className="text-2xl font-bold text-dashboard-text">
                        {riskData.factors.slopeInstability}%
                      </div>
                      <p className="text-sm text-dashboard-muted">Critical threshold: 75%</p>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-chart-2" />
                        <h3 className="font-semibold text-dashboard-muted">Vibration Level</h3>
                      </div>
                      <div className="text-2xl font-bold text-dashboard-text">
                        {riskData.factors.vibrationPatterns}%
                      </div>
                      <p className="text-sm text-dashboard-muted">Baseline exceeded</p>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-chart-3" />
                        <h3 className="font-semibold text-dashboard-muted">Weather Impact</h3>
                      </div>
                      <div className="text-2xl font-bold text-dashboard-text">
                        {riskData.factors.weatherConditions}%
                      </div>
                      <p className="text-sm text-dashboard-muted">Rainfall: {locationData.rainfall}mm</p>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-chart-4" />
                        <h3 className="font-semibold text-dashboard-muted">AI Prediction</h3>
                      </div>
                      <div className="text-2xl font-bold text-dashboard-text">
                        {riskData.probability}%
                      </div>
                      <p className="text-sm text-dashboard-muted">Rockfall probability</p>
                    </Card>
                  </div>
                )}

                {/* Data Charts */}
                {locationData && riskData && (
                  <Card className="bg-dashboard-card border-dashboard-border">
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold">Contributing Factors Analysis</h2>
                      </div>
                      <DataCharts locationData={locationData} riskData={riskData} />
                    </div>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Card className="bg-dashboard-card border-dashboard-border">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Mine Search & Selection</h2>
                </div>
                <MineSearch onMineSelect={handleMineSelect} />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="elevation" className="space-y-6">
            {selectedMine ? (
              <ElevationModel mineName={selectedMine.name} onAnalyze={handleAnalyze} />
            ) : (
              <Card className="bg-dashboard-card border-dashboard-border p-8 text-center">
                <Mountain className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
                <h2 className="text-xl font-semibold text-dashboard-text mb-2">No Mine Selected</h2>
                <p className="text-dashboard-muted">Please select a mine first to view elevation models.</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <DataSourcesPanel onAnalyze={handleAnalyze} />
          </TabsContent>

          <TabsContent value="forecast" className="space-y-6">
            {selectedMine && riskData ? (
              <ProbabilityForecast 
                mineName={selectedMine.name} 
                currentRisk={riskData.level}
                onAnalyze={handleAnalyze}
              />
            ) : (
              <Card className="bg-dashboard-card border-dashboard-border p-8 text-center">
                <Brain className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
                <h2 className="text-xl font-semibold text-dashboard-text mb-2">AI Forecast Unavailable</h2>
                <p className="text-dashboard-muted">Please select a mine and run initial analysis to view AI forecasts.</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            {selectedMine && riskData ? (
              <AlertPanel 
                riskLevel={riskData.level}
                mineName={selectedMine.name}
                onSendAlert={handleSendAlert}
              />
            ) : (
              <Card className="bg-dashboard-card border-dashboard-border p-8 text-center">
                <Bell className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
                <h2 className="text-xl font-semibold text-dashboard-text mb-2">Alert System Inactive</h2>
                <p className="text-dashboard-muted">Please select a mine to activate the alert management system.</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Alert System */}
      {showAlert && (
        <AlertSystem
          riskLevel={riskData!.level}
          location={locationData!.name}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;