import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShieldAlert, 
  RefreshCw, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieChartIcon
} from 'lucide-react';
import { StockQuote, PortfolioSummary } from '../types';

export const TradingSandbox: React.FC = () => {
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [selectedStock, setSelectedStock] = useState<StockQuote | null>(null);
  const [quantity, setQuantity] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderMessage, setOrderMessage] = useState<string | null>(null);

  const fetchMarket = async () => {
    try {
      const res = await fetch('/api/market/quotes');
      if (res.ok) {
        const data = await res.json();
        setQuotes(data);
        if (!selectedStock && data.length > 0) {
          setSelectedStock(data[0]);
        }
      }
    } catch (e) {
      console.warn('Market fetch error:', e);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data);
      }
    } catch (e) {
      console.warn('Portfolio fetch error:', e);
    }
  };

  useEffect(() => {
    fetchMarket();
    fetchPortfolio();
    const interval = setInterval(fetchMarket, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTrade = async (side: 'BUY' | 'SELL') => {
    if (!selectedStock || quantity <= 0) return;
    setLoading(true);
    setOrderMessage(null);
    try {
      const res = await fetch('/api/trade/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedStock.symbol,
          side: side,
          order_type: 'MARKET',
          quantity: quantity
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setOrderMessage(`✅ ${side} order executed for ${quantity} shares of ${selectedStock.symbol}`);
        fetchPortfolio();
      } else {
        setOrderMessage(`❌ Error: ${data.detail || data.message || 'Order failed'}`);
      }
    } catch (err: any) {
      setOrderMessage(`❌ Trade error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    await fetch('/api/portfolio/reset', { method: 'POST' });
    fetchPortfolio();
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-1">
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-white/10">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Net Worth</span>
          <span className="text-lg font-mono font-bold text-white">
            ₹{portfolio ? Math.round(portfolio.total_portfolio_value).toLocaleString('en-IN') : '10,00,000'}
          </span>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-white/10">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Available Virtual Cash</span>
          <span className="text-lg font-mono font-bold text-cyan-400">
            ₹{portfolio ? Math.round(portfolio.cash_balance).toLocaleString('en-IN') : '10,00,000'}
          </span>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-white/10">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Invested Value</span>
          <span className="text-lg font-mono font-bold text-purple-400">
            ₹{portfolio ? Math.round(portfolio.invested_amount).toLocaleString('en-IN') : '0'}
          </span>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-white/10">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Unrealized P&L</span>
          <span className={`text-lg font-mono font-bold ${
            (portfolio?.total_unrealized_pnl || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {(portfolio?.total_unrealized_pnl || 0) >= 0 ? '+' : ''}₹{portfolio ? Math.round(portfolio.total_unrealized_pnl).toLocaleString('en-IN') : '0'}
          </span>
        </div>
      </div>

      {/* Main Stock Table + Order Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Market Watch */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Live Simulated Exchange
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              LIVE TICK
            </span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {quotes.map((stock) => {
              const isSelected = selectedStock?.symbol === stock.symbol;
              const isPositive = stock.change >= 0;
              return (
                <button
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-sm'
                      : 'bg-slate-900/40 border-white/5 text-slate-300 hover:border-white/15'
                  }`}
                >
                  <div className="text-left">
                    <span className="font-bold font-mono text-xs">{stock.symbol}</span>
                    <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">{stock.name}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-xs">₹{stock.price.toFixed(2)}</span>
                    <span className={`text-[10px] flex items-center justify-end gap-0.5 ${
                      isPositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {isPositive ? '+' : ''}{stock.change_pct.toFixed(2)}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Order Terminal */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white">Order Terminal</h3>
              <span className="text-xs font-mono text-cyan-400 font-bold">{selectedStock?.symbol}</span>
            </div>

            {selectedStock && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Current Market Price:</span>
                  <span className="text-white font-bold text-sm">₹{selectedStock.price.toFixed(2)}</span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                    Order Quantity (Shares)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#090D16] border border-white/10 rounded-xl px-3.5 py-2 text-sm font-mono text-white"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Total Order Value:</span>
                  <span className="text-cyan-300 font-bold">
                    ₹{Math.round(selectedStock.price * quantity).toLocaleString('en-IN')}
                  </span>
                </div>

                {orderMessage && (
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-center font-mono">
                    {orderMessage}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleTrade('BUY')}
                disabled={loading}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
              >
                BUY (Long)
              </button>
              <button
                onClick={() => handleTrade('SELL')}
                disabled={loading}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50"
              >
                SELL (Short/Exit)
              </button>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
            >
              Reset to ₹10 Lakhs Capital
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
