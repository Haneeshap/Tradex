import React from 'react';
import { Star, TrendingUp, TrendingDown, Plus, X } from 'lucide-react';

interface WatchlistStock {
  id: string;
  symbol: string;
  company_name: string;
  current_price: number;
  change_percent: number;
}

interface WatchlistProps {
  stocks: WatchlistStock[];
  loading?: boolean;
  onRemove?: (id: string) => void;
  onAdd?: () => void;
}

export function Watchlist({ stocks, loading, onRemove, onAdd }: WatchlistProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Watchlist</h2>
              <p className="text-sm text-gray-500">{stocks.length} stocks tracked</p>
            </div>
          </div>
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {stocks.map((stock) => {
          const isPositive = stock.change_percent >= 0;
          return (
            <div
              key={stock.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPositive ? 'bg-emerald-50' : 'bg-red-50'
                  }`}>
                  {isPositive ? (
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{stock.symbol}</span>
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                      {isPositive ? '+' : ''}{stock.change_percent.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{stock.company_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(stock.current_price)}</p>
                </div>
                {onRemove && (
                  <button
                    onClick={() => onRemove(stock.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {stocks.length === 0 && (
          <div className="p-12 text-center">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Your watchlist is empty</p>
            <p className="text-gray-400 text-xs mt-1">Add stocks to track them</p>
          </div>
        )}
      </div>
    </div>
  );
}
