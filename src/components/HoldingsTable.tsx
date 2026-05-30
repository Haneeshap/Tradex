import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Search, MoreVertical } from 'lucide-react';

interface Holding {
  id: string;
  symbol: string;
  company_name: string;
  quantity: number;
  avg_buy_price: number;
  current_price: number;
  sector: string;
}

interface HoldingsTableProps {
  holdings: Holding[];
  loading?: boolean;
}

type SortField = 'symbol' | 'pnl' | 'pnlPercent' | 'currentValue' | 'quantity';
type SortDirection = 'asc' | 'desc';

export function HoldingsTable({ holdings, loading }: HoldingsTableProps) {
  const [sortField, setSortField] = useState<SortField>('pnl');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const processedHoldings = holdings.map(h => ({
    ...h,
    investment: h.avg_buy_price * h.quantity,
    currentValue: h.current_price * h.quantity,
    pnl: (h.current_price - h.avg_buy_price) * h.quantity,
    pnlPercent: ((h.current_price - h.avg_buy_price) / h.avg_buy_price) * 100,
  }));

  const filteredHoldings = processedHoldings.filter(h =>
    h.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedHoldings = [...filteredHoldings].sort((a, b) => {
    let aVal: number, bVal: number;
    switch (sortField) {
      case 'pnl':
        aVal = a.pnl;
        bVal = b.pnl;
        break;
      case 'pnlPercent':
        aVal = a.pnlPercent;
        bVal = b.pnlPercent;
        break;
      case 'currentValue':
        aVal = a.currentValue;
        bVal = b.currentValue;
        break;
      case 'quantity':
        aVal = a.quantity;
        bVal = b.quantity;
        break;
      default:
        aVal = a.pnl;
        bVal = b.pnl;
    }
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ?
      <ChevronUp className="w-4 h-4" /> :
      <ChevronDown className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Holdings</h2>
              <p className="text-sm text-gray-500">{holdings.length} stocks in portfolio</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search holdings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-sm"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
              <th
                className="text-right p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center justify-end gap-1">
                  Qty <SortIcon field="quantity" />
                </div>
              </th>
              <th className="text-right p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg Price</th>
              <th className="text-right p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">LTP</th>
              <th
                className="text-right p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900"
                onClick={() => handleSort('currentValue')}
              >
                <div className="flex items-center justify-end gap-1">
                  Cur. Val <SortIcon field="currentValue" />
                </div>
              </th>
              <th
                className="text-right p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900"
                onClick={() => handleSort('pnl')}
              >
                <div className="flex items-center justify-end gap-1">
                  P&L <SortIcon field="pnl" />
                </div>
              </th>
              <th
                className="text-right p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900"
                onClick={() => handleSort('pnlPercent')}
              >
                <div className="flex items-center justify-end gap-1">
                  % <SortIcon field="pnlPercent" />
                </div>
              </th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedHoldings.map((holding) => (
              <tr key={holding.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{holding.symbol}</span>
                    <span className="text-xs text-gray-500">{holding.company_name}</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <span className="font-medium text-gray-900">{holding.quantity}</span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-gray-700">{formatCurrency(holding.avg_buy_price)}</span>
                </td>
                <td className="p-4 text-right">
                  <span className="font-semibold text-gray-900">{formatCurrency(holding.current_price)}</span>
                </td>
                <td className="p-4 text-right">
                  <span className="font-semibold text-gray-900">{formatCurrency(holding.currentValue)}</span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <div className={`flex items-center gap-1 ${holding.pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {holding.pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span className="font-semibold">{formatCurrency(Math.abs(holding.pnl))}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${holding.pnlPercent >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {holding.pnlPercent >= 0 ? '+' : ''}{holding.pnlPercent.toFixed(2)}%
                  </span>
                </td>
                <td className="p-4">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedHoldings.length === 0 && (
          <div className="p-12 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No holdings found</p>
          </div>
        )}
      </div>
    </div>
  );
}
