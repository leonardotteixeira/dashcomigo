import { SimulatorSection, SimulationResult } from "../components/SimulatorSection";
import { SmartAlert } from "../components/SmartAlert";
import { ComparisonChart } from "../components/ComparisonChart";
import { useState } from "react";
import { ArrowLeft, Calculator } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";

export function SimuladorMEI() {
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[rgba(0,0,0,0.1)] px-4 sm:px-6 py-6 sm:py-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/app")}
            className="text-[rgba(0,21,41,0.6)] hover:text-[#001529] hover:bg-[rgba(0,0,0,0.05)] rounded-xl mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#28A263]/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Calculator className="w-6 h-6 text-[#28A263]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#001529]">Simulador MEI → ME</h1>
              <p className="text-[rgba(0,21,41,0.6)] mt-2">
                Compare seus impostos como MEI e ME no Simples Nacional. Descubra se vale a pena migrar e quanto você pode economizar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 space-y-8">
        <SimulatorSection onSimulate={setSimulationResult} />
        <SmartAlert result={simulationResult} />
        <ComparisonChart result={simulationResult} />
      </div>
    </div>
  );
}
