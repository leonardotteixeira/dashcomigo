import { SimulatorSection, SimulationResult } from "../components/SimulatorSection";
import { SmartAlert } from "../components/SmartAlert";
import { ComparisonChart } from "../components/ComparisonChart";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";

export function SimuladorMEI() {
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/app")}
          className="text-[#A1A1A1] hover:text-white hover:bg-white/5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>
      </div>

      <SimulatorSection onSimulate={setSimulationResult} />
      <SmartAlert result={simulationResult} />
      <ComparisonChart result={simulationResult} />
    </div>
  );
}
