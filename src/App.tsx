import React, { useState, useEffect } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { supabase } from './lib/supabase';
import { PortfolioSummary } from './components/PortfolioSummary';
import { HoldingsTable } from './components/HoldingsTable';
import { MarketOverview } from './components/MarketOverview';
import { QuickActions } from './components/QuickActions';
import { Watchlist } from './components/Watchlist';
import { AuthModal } from './components/AuthModal';
import {
  LayoutDashboard,
  LogOut,
  TrendingUp,
  Bell,
  Settings,
  Search,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

interface PortfolioHolding {
  id: string;
  user_id: string;
  symbol: string;
  company_name: string;
  quantity: number;
  avg_buy_price: number;
  current_price: number;
  sector: string;
}

interface WatchlistStock {
  id: string;
  user_id: string;
  symbol: string;
  company_name: string;
  current_price: number;
  change_percent: number;
}

interface MarketIndex {
  id: string;
  name: string;
  symbol: string;
  current_value: number;
  change_value: number;
  change_percent: number;
}

function Dashboard() {
  const { user, signOut, loading: authLoading } = useUser();
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistStock[]>([]);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuth(true);
    }
  }, [user, authLoading]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        const [holdingsRes, watchlistRes, indicesRes] = await Promise.all([
          supabase.from('portfolio_holdings').select('*'),
          supabase.from('watchlist').select('*'),
          supabase.from('market_indices').select('*')
        ]);

        if (holdingsRes.data) setHoldings(holdingsRes.data as PortfolioHolding[]);
        if (watchlistRes.data) setWatchlist(watchlistRes.data as WatchlistStock[]);
        if (indicesRes.data) setIndices(indicesRes.data as MarketIndex[]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setHoldings([]);
    setWatchlist([]);
  };

  const handleRemoveFromWatchlist = async (id: string) => {
    const { error } = await supabase.from('watchlist').delete().eq('id', id);
    if (!error) {
      setWatchlist(prev => prev.filter(w => w.id !== id));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center animate-pulse">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">TradeX</span>
                <span className="hidden sm:inline-block ml-1 text-sm font-medium text-blue-600">Pro</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors">
                <Sparkles className="w-4 h-4" />
                Markets
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors">
                Portfolio
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors">
                Orders
              </button>
            </nav>

            {/* Right Side Items */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stocks..."
                  className="pl-10 pr-4 py-2 w-48 lg:w-64 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                />
              </div>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

              <div className="hidden sm:flex items-center gap-3 pl-2">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              <button className="w-full flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm">
                <Sparkles className="w-4 h-4" />
                Markets
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm">
                Portfolio
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm">
                Orders
              </button>
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="space-y-6 lg:space-y-8">
          {/* Page Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Trading Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, {user.name}! Here's your portfolio overview.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-emerald-700 font-medium">Market Open</span>
              </div>
              <span className="text-gray-400">Updated just now</span>
            </div>
          </div>

          {/* Market Overview */}
          <MarketOverview indices={indices} loading={loading} />

          {/* Portfolio Summary & Quick Actions */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <PortfolioSummary holdings={holdings} loading={loading} />
            </div>
            <div className="xl:col-span-1">
              <QuickActions />
            </div>
          </div>

          {/* Holdings Table */}
          <HoldingsTable holdings={holdings} loading={loading} />

          {/* Watchlist */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 xl:col-start-1">
              <Watchlist
                stocks={watchlist}
                loading={loading}
                onRemove={handleRemoveFromWatchlist}
              />
            </div>
            <div className="xl:col-start-3">
              {/* Recent Activity or News placeholder */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-4">Market Hours</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Pre-Open</span>
                    <span className="text-sm font-semibold">9:00 AM - 9:15 AM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Regular Session</span>
                    <span className="text-sm font-semibold text-emerald-400">9:15 AM - 3:30 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Post-Close</span>
                    <span className="text-sm font-semibold">3:30 PM - 4:00 PM</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-400">
                   NSE BSE trading hours (IST)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">TradeX</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>Terms</span>
              <span>Privacy</span>
              <span>Support</span>
            </div>
            <p className="text-sm text-gray-400">
              Trading involves risk. Past performance is not indicative of future results.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Dashboard />
    </UserProvider>
  );
}

export default App;
