import { useState } from "react";
import { Search, MapPin, Mountain, Factory } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

interface MineSearchProps {
  onMineSelect: (mine: Mine) => void;
}

const mines: Mine[] = [
  {
    id: "1",
    name: "Karunya Open Pit Mine",
    location: "Tamil Nadu, India",
    type: "Iron Ore",
    status: "Active",
    coordinates: { lat: 10.9347, lng: 76.9358 },
    elevation: 320,
    area: 145.2
  },
  {
    id: "2", 
    name: "Salem Steel Plant Mine",
    location: "Salem, Tamil Nadu",
    type: "Iron Ore",
    status: "Active",
    coordinates: { lat: 11.6643, lng: 78.1460 },
    elevation: 278,
    area: 89.7
  },
  {
    id: "3",
    name: "Kudankulam Limestone Mine",
    location: "Tirunelveli, Tamil Nadu", 
    type: "Limestone",
    status: "Active",
    coordinates: { lat: 8.1644, lng: 77.7066 },
    elevation: 45,
    area: 203.4
  },
  {
    id: "4",
    name: "Hosur Granite Quarry",
    location: "Krishnagiri, Tamil Nadu",
    type: "Granite", 
    status: "Under Construction",
    coordinates: { lat: 12.7368, lng: 77.8285 },
    elevation: 915,
    area: 67.8
  }
];

const MineSearch = ({ onMineSelect }: MineSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMine, setSelectedMine] = useState<Mine | null>(null);

  const filteredMines = mines.filter(mine =>
    mine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mine.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mine.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMineSelect = (mine: Mine) => {
    setSelectedMine(mine);
    onMineSelect(mine);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-chart-2 text-white";
      case "Inactive": return "bg-muted text-muted-foreground";
      case "Under Construction": return "bg-chart-3 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getMineTypeIcon = (type: string) => {
    if (type.includes("Iron")) return Mountain;
    if (type.includes("Limestone")) return Factory;
    return Mountain;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search mines by name, location, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-dashboard-card border-dashboard-border text-dashboard-text placeholder:text-dashboard-muted"
        />
      </div>

      <div className="grid gap-3 max-h-96 overflow-y-auto">
        {filteredMines.map((mine) => {
          const IconComponent = getMineTypeIcon(mine.type);
          return (
            <Card
              key={mine.id}
              className={`p-4 cursor-pointer transition-colors hover:bg-dashboard-border ${
                selectedMine?.id === mine.id ? "ring-2 ring-primary" : ""
              } bg-dashboard-card border-dashboard-border`}
              onClick={() => handleMineSelect(mine)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <IconComponent className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-dashboard-text">{mine.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-dashboard-muted">
                      <MapPin className="h-3 w-3" />
                      {mine.location}
                    </div>
                    <div className="mt-2 flex gap-2 text-xs">
                      <span className="bg-dashboard-border text-dashboard-text px-2 py-1 rounded">
                        {mine.type}
                      </span>
                      <span className={`px-2 py-1 rounded ${getStatusColor(mine.status)}`}>
                        {mine.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-dashboard-muted">
                  <div>Elevation: {mine.elevation}m</div>
                  <div>Area: {mine.area} ha</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredMines.length === 0 && (
        <div className="text-center py-8 text-dashboard-muted">
          <Mountain className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No mines found matching your search</p>
        </div>
      )}
    </div>
  );
};

export default MineSearch;