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
  
    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">
            {formatValue(value)}
          </p>
          <span className={`ml-2 text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        </div>
      </div>
    );
  }