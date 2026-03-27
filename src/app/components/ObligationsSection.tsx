import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { ObligationCalendar } from "./ObligationCalendar";
import { ObligationsList } from "./ObligationsList";
import { ObligationForm } from "./ObligationForm";

export function ObligationsSection() {
  const [activeTab, setActiveTab] = useState<"calendar" | "list">("list");
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header com botão */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-white">Próximas Obrigações</h2>
        <Button
          onClick={() => setFormOpen(true)}
          className="bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl px-4 h-10 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Adicionar</span>
        </Button>
      </div>

      {/* Abas */}
      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "list"
              ? "text-[#2DDB81] border-b-2 border-[#2DDB81]"
              : "text-[#A1A1A1] hover:text-white"
          }`}
        >
          Lista
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "calendar"
              ? "text-[#2DDB81] border-b-2 border-[#2DDB81]"
              : "text-[#A1A1A1] hover:text-white"
          }`}
        >
          Calendário
        </button>
      </div>

      {/* Conteúdo das abas */}
      <div className="bg-[#1B1B1B] rounded-2xl border border-white/5 p-6">
        {activeTab === "list" ? <ObligationsList /> : <ObligationCalendar />}
      </div>

      <ObligationForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}
