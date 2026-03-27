import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { useObligations } from "../contexts/ObligationsContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, Lock, ChevronLeft, ChevronRight } from "lucide-react";

export function ObligationCalendar() {
  const { obligations } = useObligations();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Montar mapa de datas com obrigações
  const obligationsByDate = new Map<string, typeof obligations>();
  obligations.forEach((ob) => {
    const key = ob.data;
    if (!obligationsByDate.has(key)) {
      obligationsByDate.set(key, []);
    }
    obligationsByDate.get(key)!.push(ob);
  });

  // Obrigações para a data selecionada
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const dayObligations = obligationsByDate.get(dateStr) || [];

  // Navegação de data manual
  const goToPreviousDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const goToNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  return (
    <div className="space-y-4">
      {/* Calendário - apenas desktop */}
      <div className="hidden lg:block bg-[#1B1B1B] rounded-2xl border border-white/10 p-6">
        <style>{`
          .calendar-container .rdp {
            --rdp-cell-size: 42px;
            --rdp-accent-color: transparent;
            --rdp-background-color: transparent;
            margin: 0;
          }
          .calendar-container .rdp_caption {
            color: #C8C9D0;
            font-weight: 600;
            font-size: 1rem;
          }
          .calendar-container .rdp_head_cell {
            color: #A1A1A1;
            font-weight: 600;
            font-size: 0.85rem;
            text-transform: uppercase;
          }
          .calendar-container .rdp_cell {
            padding: 3px;
          }
          .calendar-container .rdp_button {
            color: #C8C9D0;
            border-radius: 6px;
            font-weight: 500;
            font-size: 0.9rem;
            background-color: transparent;
            border: 1px solid transparent;
          }
          .calendar-container .rdp_button:hover:not([disabled]) {
            background-color: rgba(200, 201, 208, 0.05);
            color: #FFFFFF;
            border-color: transparent;
          }
          .calendar-container .rdp_button[aria-selected="true"] {
            background-color: rgba(200, 201, 208, 0.15);
            color: #FFFFFF;
            font-weight: 600;
            border-color: rgba(200, 201, 208, 0.3);
          }
          .calendar-container .rdp_button[aria-disabled="true"] {
            color: #686F6F;
            opacity: 0.4;
          }
        `}</style>
        <div className="calendar-container">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            locale={ptBR}
            disabled={(date) => date.getFullYear() < new Date().getFullYear()}
            classNames={{
              day_selected: "text-white",
              day_today: "text-white",
            }}
          />
        </div>
        <div className="mt-4 text-xs text-[#686F6F] font-medium">
          ● = Data com obrigações
        </div>
      </div>

      {/* Data selecionada + navegação (mobile) */}
      <div className="lg:hidden flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
        <button onClick={goToPreviousDay} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-[#A1A1A1] hover:text-white" />
        </button>
        <div className="text-center">
          <p className="text-white font-medium text-sm md:text-base">
            {format(selectedDate, "dd MMM yyyy", { locale: ptBR })}
          </p>
        </div>
        <button onClick={goToNextDay} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5 text-[#A1A1A1] hover:text-white" />
        </button>
      </div>

      {/* Obrigações do dia selecionado */}
      <div className="bg-[#1B1B1B] rounded-2xl border border-white/10 p-6">
        <h3 className="text-lg md:text-xl font-bold text-white mb-4">
          {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
        </h3>

        {dayObligations.length === 0 ? (
          <p className="text-[#686F6F]">Nenhuma obrigação neste dia</p>
        ) : (
          <div className="space-y-3">
            {dayObligations.map((ob) => (
              <div
                key={ob.id}
                className={`p-4 rounded-xl border transition-colors ${
                  ob.isFixture
                    ? "bg-[#141414] border-[#686F6F]/30 hover:border-[#686F6F]/50"
                    : ob.status === "completa"
                    ? "bg-[#28A263]/15 border-[#28A263]/50"
                    : "bg-[#1A2F1F] border-[#28A263]/40 hover:border-[#28A263]/60"
                }`}
              >
                <div className="flex items-start gap-3">
                  {ob.isFixture ? (
                    <Lock className="w-5 h-5 text-[#686F6F] flex-shrink-0 mt-0.5" />
                  ) : ob.status === "completa" ? (
                    <Check className="w-5 h-5 text-[#2DDB81] flex-shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0 mt-2.5" />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm md:text-base">{ob.titulo}</p>
                    {ob.categoria && (
                      <p className="text-xs text-[#A1A1A1]">{ob.categoria}</p>
                    )}
                    {ob.valor && (
                      <p className="text-sm text-[#2DDB81] font-medium">R$ {ob.valor.toFixed(2)}</p>
                    )}
                    {ob.anotacoes && (
                      <p className="text-xs text-[#C8C9D0] mt-2 bg-black/30 p-2 rounded">
                        {ob.anotacoes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
