// src/components/StatCard.tsx
interface StatCardProps {
  title: string;
  value: number;
  change: number;
  type: 'currency' | 'percentage' | 'number';
}

export function StatCard({ title, value, change, type }: StatCardProps) {
  const formatValue = (val: number) => {
    if (type === 'currency') return `R$ ${val.toFixed(2)}`;
    if (type === 'percentage') return `${val}%`;
    return val.toString();
  };

  // Determine color based on change (Green for positive, Red/Rose for negative)
  // Neon colors: Green-400 for profit, Rose-400 for loss
  const isPositive = change >= 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-rose-400';
  const borderColor = isPositive ? 'border-green-500/20' : 'border-rose-500/20';

  return (
    <div className={`glass rounded-xl p-6 shadow-xl border ${borderColor} backdrop-blur-md`}>
      <h3 className="text-gray-400 text-xs uppercase tracking-wider font-medium">{title}</h3>
      <div className="mt-3 flex items-baseline justify-between">
        <p className="text-3xl font-bold text-white tracking-tight">
          {formatValue(value)}
        </p>
        <div className={`flex items-center px-2 py-1 rounded-full bg-white/5 ${changeColor} text-xs font-bold`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      </div>
    </div>
  );
}