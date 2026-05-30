import React from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';

interface MarketIndex {
  id: string;
  name: string;
  symbol: string;
  current_value: number;
  change_value: number;
  change_percent: number;
}

interface MarketOverviewProps {
  indices: MarketIndex[];
  loading?: boolean;
}

export function MarketOverview({ indices, loading }: MarketOverviewProps) {
  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const getGradient = (name: string, isPositive: boolean) => {
    const gradients: Record<string, { pos: string; neg: string }> = {
      'NIFTY 50': { pos: 'from-blue-500 to-blue-600', neg: 'from-red-500 to-red-600' },
      'SENSEX': { pos: 'from-orange-500 to-amber-600', neg: 'from-red-500 to-orange-600' },
      'BANK NIFTY': { pos: 'from-teal-500 to-cyan-600', neg: 'from-red-500 to-rose-600' },
      'NIFTY IT': { pos: 'from-emerald-500 to-green-600', neg: 'from-red-500 to-emerald-600' },
      'NIFTY MIDCAP': { pos: 'from-purple-500 to-pink-600', neg: 'from-red-500 to-purple-600' },
    };
    const defaultGradient = { pos: 'from-blue-500 to-blue-600', neg: 'from-red-500 to-red-600' };
    const gradient = gradients[name] || defaultGradient;
    return isPositive ? gradient.pos : gradient.neg;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Market Overview</h2>
            <p className="text-sm text-gray-500">Indian stock market indices</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>Market Open</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {indices.map((index) => {
          const isPositive = index.change_percent >= 0;
          return (
            <div
              key={index.id}
              className={`relative overflow-hidden rounded-xl p-5 bg-gradient-to-br ${getGradient(index.name, isPositive)} text-white cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-90">{index.symbol}</span>
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 opacity-80" />
                  ) : (
                    <TrendingDown className="w-4 h-4 opacity-80" />
                  )}
                </div>

                <div className="mb-3">
                  <h3 className="text-xs font-medium opacity-80 truncate">{index.name}</h3>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{formatNumber(index.current_value)}</span>
                </div>

                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/20">
                  <span className={`text-sm font-semibold ${isPositive ? 'text-white' : 'text-red-100'}`}>
                    {isPositive ? '+' : ''}{formatNumber(index.change_value)}
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                    {isPositive ? '+' : ''}{index.change_percent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-5 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-gray-600 uppercase">Advancing</span>
            </div>
            <span className="text-2xl font-bold text-emerald-700">1,245</span>
            <p className="text-xs text-gray-500 mt-1">Stocks</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-xs font-semibold text-gray-600 uppercase">Declining</span>
            </div>
            <span className="text-2xl font-bold text-red-700">876</span>
            <p className="text-xs text-gray-500 mt-1">Stocks</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-gray-600 uppercase">Unchanged</span>
            </div>
            <span className="text-2xl font-bold text-blue-700">234</span>
            <p className="text-xs text-gray-500 mt-1">Stocks</p>
          </div>
        </div>
      </div>
    </div>
  );
}
