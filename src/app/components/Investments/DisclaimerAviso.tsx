import { INVESTMENT_DISCLAIMER } from '../../types/investments';

export function DisclaimerAviso() {
  return (
    <div className="p-6 rounded-xl border border-orange-500/30 bg-orange-500/10">
      <div className="flex gap-4">
        <div className="text-3xl flex-shrink-0">⚠️</div>
        <div className="flex-1">
          <h3 className="font-bold text-orange-300 mb-2">Aviso Importante</h3>
          <div className="text-sm text-orange-200 whitespace-pre-wrap leading-relaxed font-mono">
            {INVESTMENT_DISCLAIMER.trim()}
          </div>

          <div className="mt-4 pt-4 border-t border-orange-500/20">
            <h4 className="font-bold text-orange-300 text-sm mb-2">Recomendações que NÃO fazemos:</h4>
            <ul className="text-xs text-orange-200 space-y-1 ml-4">
              <li>❌ Derivativos e operações alavancadas</li>
              <li>❌ Forex (câmbio especulativo)</li>
              <li>❌ Criptomoedas especulativas</li>
              <li>❌ Penny stocks ou ações de risco extremo</li>
              <li>❌ Day trading ou operações de curta duração</li>
            </ul>
          </div>

          <div className="mt-4 pt-4 border-t border-orange-500/20">
            <p className="text-xs text-orange-200">
              🎯 <strong>Recomendação:</strong> Para decisões financeiras significativas, consulte um assessor financeiro profissional registrado na CVM (Comissão de Valores Mobiliários).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
