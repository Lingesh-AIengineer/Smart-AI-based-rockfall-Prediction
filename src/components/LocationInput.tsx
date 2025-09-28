import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { LocationData, RiskData } from "@/pages/Dashboard";
import { useToast } from "@/hooks/use-toast";

interface LocationInputProps {
  onLocationAnalysis: (locationData: LocationData, riskData: RiskData) => void;
}

const LocationInput = ({ onLocationAnalysis }: LocationInputProps) => {
  const [location, setLocation] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  // Mock AI prediction logic
  const analyzeLocation = async (locationName: string) => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock data based on location name
    const mockLocationData: LocationData = {
      name: locationName,
      elevation: Math.floor(Math.random() * 1000) + 500, // 500-1500m
      slope: Math.floor(Math.random() * 40) + 15, // 15-55 degrees
      rainfall: Math.floor(Math.random() * 50) + 10, // 10-60mm
      temperature: Math.floor(Math.random() * 20) + 15, // 15-35°C
      vibration: Math.floor(Math.random() * 100) + 20, // 20-120 units
    };

    // AI Risk Assessment Logic
    const calculateRiskLevel = (data: LocationData): RiskData => {
      let riskScore = 0;
      
      // Slope instability factor (higher slope = higher risk)
      const slopeRisk = Math.min((data.slope / 60) * 100, 100);
      riskScore += slopeRisk * 0.4;

      // Vibration patterns factor
      const vibrationRisk = Math.min((data.vibration / 100) * 100, 100);
      riskScore += vibrationRisk * 0.3;

      // Weather conditions factor (high rainfall + temperature variations)
      const weatherRisk = Math.min(((data.rainfall + Math.abs(data.temperature - 25)) / 60) * 100, 100);
      riskScore += weatherRisk * 0.3;

      const probability = Math.min(riskScore, 100);
      
      let level: "High" | "Medium" | "Low" | "Safe";
      if (probability >= 75) level = "High";
      else if (probability >= 50) level = "Medium";
      else if (probability >= 25) level = "Low";
      else level = "Safe";

      return {
        level,
        probability: Math.round(probability),
        factors: {
          slopeInstability: Math.round(slopeRisk),
          vibrationPatterns: Math.round(vibrationRisk),
          weatherConditions: Math.round(weatherRisk),
        },
      };
    };

    const riskData = calculateRiskLevel(mockLocationData);
    
    setIsAnalyzing(false);
    onLocationAnalysis(mockLocationData, riskData);

    toast({
      title: "Analysis Complete",
      description: `Risk assessment for ${locationName} has been completed.`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      analyzeLocation(location.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter location (e.g., Karunya Open Pit Mine)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 bg-dashboard-bg border-dashboard-border text-dashboard-text placeholder:text-dashboard-muted"
          disabled={isAnalyzing}
        />
        <Button
          type="submit"
          disabled={!location.trim() || isAnalyzing}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Analyze
            </>
          )}
        </Button>
      </div>
      
      {isAnalyzing && (
        <div className="space-y-2">
          <div className="text-sm text-dashboard-muted">
            🔍 Fetching terrain and elevation data...
          </div>
          <div className="text-sm text-dashboard-muted">
            🌦️ Analyzing weather patterns...
          </div>
          <div className="text-sm text-dashboard-muted">
            🤖 Running AI risk assessment...
          </div>
        </div>
      )}
    </form>
  );
};

export default LocationInput;