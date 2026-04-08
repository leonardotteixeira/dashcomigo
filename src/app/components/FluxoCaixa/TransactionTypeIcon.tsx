import { PFPJType } from '../../types/pfpj';

interface TransactionTypeIconProps {
  type: PFPJType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function TransactionTypeIcon({
  type,
  size = 'md',
  showLabel = false,
}: TransactionTypeIconProps) {
  const sizeMap = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-sm',
    lg: 'w-6 h-6 text-base',
  };

  const labelMap = {
    pf: { icon: '👤', label: 'Pessoal', color: 'text-[#5B5FFF]', bg: 'bg-[#5B5FFF]/10' },
    pj: { icon: '🏢', label: 'Empresa', color: 'text-[#28A263]', bg: 'bg-[#28A263]/10' },
    misto: { icon: '⚡', label: 'Misto', color: 'text-[#F4B23C]', bg: 'bg-[#F4B23C]/10' },
  };

  const config = labelMap[type];

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded ${config.bg}`}>
      <span className={`${sizeMap[size]} ${config.color}`}>{config.icon}</span>
      {showLabel && <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>}
    </div>
  );
}
