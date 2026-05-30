import React from 'react';
import { ShoppingCart, TrendingUp, DollarSign, Wallet, ArrowUpRight, ArrowDownRight, BarChart2, PieChart } from 'lucide-react';

interface QuickActionsProps {
  onBuy?: () => void;
  onSell?: () => void;
  onWatchlist?: () => void;
  onPortfolio?: () => void;
}

export function QuickActions({ onBuy, onSell, onWatchlist, onPortfolio }: QuickActionsProps) {
  const actions = [
    {
      label: 'Buy Stocks',
      description: 'Add to portfolio',
      icon: ShoppingCart,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      onClick: onBuy,
    },
    {
      label: 'Sell Stocks',
      description: 'Exit positions',
      icon: DollarSign,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      onClick: onSell,
    },
    {
      label: 'Watchlist',
      description: 'Track favorites',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      onClick: onWatchlist,
    },
    {
      label: 'Analytics',
      description: 'View insights',
      icon: PieChart,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      onClick: onPortfolio,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          <p className="text-sm text-gray-500">Manage your trades</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className="group relative overflow-hidden rounded-xl p-5 border-2 border-gray-100 hover:border-gray-200 bg-gradient-to-b from-gray-50 to-white transition-all duration-300 hover:shadow-lg"
          >
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${action.color} rounded-full opacity-0 group-hover:opacity-20 -translate-y-10 translate-x-10 transition-all duration-300`}></div>

            <div className={`relative z-10 w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <action.icon className={`w-6 h-6 ${action.textColor}`} />
            </div>

            <div className="relative z-10">
              <h3 className="font-bold text-gray-900 text-sm mb-0.5">{action.label}</h3>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>

            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {idx % 2 === 0 ? (
                <ArrowUpRight className={`w-4 h-4 ${action.textColor}`} />
              ) : (
                <ArrowDownRight className={`w-4 h-4 ${action.textColor}`} />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-5 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Available Balance</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ₹{new Intl.NumberFormat('en-IN').format(125000)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Margin Used</p>
            <p className="text-sm font-semibold text-gray-700 mt-1">
              ₹{new Intl.NumberFormat('en-IN').format(45000)}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-2/5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>36% margin utilized</span>
            <span>64% available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
