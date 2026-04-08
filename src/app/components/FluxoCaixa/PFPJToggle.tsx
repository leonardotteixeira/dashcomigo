interface PFPJToggleProps {
  view: 'integrado' | 'separado';
  onChange: (view: 'integrado' | 'separado') => void;
}

export function PFPJToggle({ view, onChange }: PFPJToggleProps) {
  return (
    <div className="flex items-center gap-3 bg-[#0F0F0F] p-1 rounded-lg border border-white/10 w-fit">
      <button
        onClick={() => onChange('integrado')}
        className={`px-4 py-2 rounded text-sm font-medium transition-all ${
          view === 'integrado'
            ? 'bg-[#28A263] text-white'
            : 'text-[#A1A1A1] hover:text-white'
        }`}
      >
        Visão Integrada
      </button>

      <button
        onClick={() => onChange('separado')}
        className={`px-4 py-2 rounded text-sm font-medium transition-all ${
          view === 'separado'
            ? 'bg-[#28A263] text-white'
            : 'text-[#A1A1A1] hover:text-white'
        }`}
      >
        Separado PF/PJ
      </button>
    </div>
  );
}
