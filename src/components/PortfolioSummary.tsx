import React from 'react';
import { TrendingUp, TrendingDown, PieChart, DollarSign, Percent } from 'lucide-react';

interface Holding {
  symbol: string;
  company_name: string;
  quantity: number;
  avg_buy_price: number;
  current_price: number;
  sector: string;
}

interface PortfolioSummaryProps {
  holdings: Holding[];
  loading?: boolean;
}

export function PortfolioSummary({ holdings, loading }: PortfolioSummaryProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const totalInvestment = holdings.reduce((sum, h) => sum + (h.avg_buy_price * h.quantity), 0);
  const totalCurrentValue = holdings.reduce((sum, h) => sum + (h.current_price * h.quantity), 0);
  const totalPnL = totalCurrentValue - totalInvestment;
  const totalPnLPercent = totalInvestment > 0 ? ((totalPnL / totalInvestment) * 100) : 0;

  const dayGain = holdings.reduce((sum, h) => {
    const dayChange = (h.current_price * 0.012 * h.quantity);
    return sum + dayChange;
  }, 0);

  const sectorDistribution = holdings.reduce((acc, h) => {
    const value = h.current_price * h.quantity;
    acc[h.sector] = (acc[h.sector] || 0) + value;
    return acc;
  }, {} as Record<string, number>);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cards = [
    {
      label: 'Total Investment',
      value: formatCurrency(totalInvestment),
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Current Value',
      value: formatCurrency(totalCurrentValue),
      icon: TrendingUp,
      color: totalPnL >= 0 ? 'text-emerald-600' : 'text-red-600',
      bgColor: totalPnL >= 0 ? 'bg-emerald-50' : 'bg-red-50',
    },
    {
      label: 'Total P&L',
      value: formatCurrency(Math.abs(totalPnL)),
      subValue: `${totalPnL >= 0 ? '+' : '-'}${totalPnLPercent.toFixed(2)}%`,
      icon: totalPnL >= 0 ? TrendingUp : TrendingDown,
      color: totalPnL >= 0 ? 'text-emerald-600' : 'text-red-600',
      bgColor: totalPnL >= 0 ? 'bg-emerald-50' : 'bg-red-50',
      isPositive: totalPnL >= 0,
    },
    {
      label: 'Day Gain/Loss',
      value: formatCurrency(Math.abs(dayGain)),
      subValue: `${dayGain >= 0 ? '+' : '-'}${((dayGain / totalCurrentValue) * 100).toFixed(2)}%`,
      icon: Percent,
      color: dayGain >= 0 ? 'text-emerald-600' : 'text-red-600',
      bgColor: dayGain >= 0 ? 'bg-emerald-50' : 'bg-red-50',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <PieChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Portfolio Summary</h2>
            <p className="text-sm text-gray-500">Your investment overview</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-300 group"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${card.bgColor} rounded-full -translate-y-8 translate-x-8 opacity-50 group-hover:opacity-70 transition-opacity`}></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.label}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-xl font-bold text-gray-900`}>{card.value}</span>
              </div>
              {card.subValue && (
                <div className={`flex items-center gap-1 mt-1 text-sm font-semibold ${card.color}`}>
                  <span>{card.subValue}</span>
                  {card.isPositive !== undefined && (
                    card.isPositive ?
                      <TrendingUp className="w-3 h-3" /> :
                      <TrendingDown className="w-3 h-3" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Sector Distribution</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(sectorDistribution).map(([sector, value]) => {
            const percentage = ((value / totalCurrentValue) * 100).toFixed(1);
            return (
              <div
                key={sector}
                className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <span className="text-xs font-medium text-gray-700">{sector}</span>
                <span className="text-xs font-bold text-gray-900 ml-1">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
