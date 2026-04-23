import { User, Building2, Zap } from 'lucide-react';
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
  const iconSizeMap = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const labelMap = {
    pf:    { Icon: User,      label: 'Pessoal', color: 'text-[#5B5FFF]', bg: 'bg-[#5B5FFF]/10' },
    pj:    { Icon: Building2, label: 'Empresa', color: 'text-[#28A263]', bg: 'bg-[#28A263]/10' },
    misto: { Icon: Zap,       label: 'Misto',   color: 'text-[#F4B23C]', bg: 'bg-[#F4B23C]/10' },
  };

  const { Icon, label, color, bg } = labelMap[type];

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded ${bg}`}>
      <Icon className={`${iconSizeMap[size]} ${color} flex-shrink-0`} />
      {showLabel && <span className={`text-xs font-medium ${color}`}>{label}</span>}
    </div>
  );
}
