import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { useObligations } from "../contexts/ObligationsContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, Lock } from "lucide-react";

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

  // Função para destacar datas com obrigações
  const getDayClassname = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    if (obligationsByDate.has(dateKey)) {
      return "bg-[#28A263]/20 font-bold text-[#2DDB81]";
    }
    return "";
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Calendário */}
        <div className="md:col-span-1 bg-[#1B1B1B] rounded-2xl border border-white/5 p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            locale={ptBR}
            disabled={(date) => date.getFullYear() < new Date().getFullYear()}
            className="w-full"
            modifiersClassNames={{
              selected: "bg-[#28A263] text-white",
            }}
          />
          <div className="mt-4 text-xs text-[#686F6F] space-y-1">
            <p>🟢 Data com obrigações</p>
          </div>
        </div>

        {/* Obrigações do dia selecionado */}
        <div className="md:col-span-2 bg-[#1B1B1B] rounded-2xl border border-white/5 p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </h3>

          {dayObligations.length === 0 ? (
            <p className="text-[#686F6F]">Nenhuma obrigação neste dia</p>
          ) : (
            <div className="space-y-3">
              {dayObligations.map((ob) => (
                <div
                  key={ob.id}
                  className={`p-4 rounded-xl border ${
                    ob.isFixture
                      ? "bg-[#1B1B1B] border-[#686F6F]/20"
                      : ob.status === "completa"
                      ? "bg-[#28A263]/10 border-[#28A263]/30"
                      : "bg-white/5 border-white/10"
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
                      <p className="font-bold text-white">{ob.titulo}</p>
                      {ob.categoria && (
                        <p className="text-xs text-[#A1A1A1]">{ob.categoria}</p>
                      )}
                      {ob.valor && (
                        <p className="text-sm text-[#2DDB81] font-medium">R$ {ob.valor.toFixed(2)}</p>
                      )}
                      {ob.anotacoes && (
                        <p className="text-xs text-[#C8C9D0] mt-2 bg-black/30 p-2 rounded mt-2">
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
    </div>
  );
}
