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

const DEFAULT_QUOTES: StockQuote[] = [
  { symbol: 'NIFTY 50', name: 'NIFTY 50 Benchmark Index', price: 24850.00, change: 154.20, change_pct: 0.62, open: 24700.0, high: 24910.0, low: 24680.0, prev_close: 24695.8, volume: 19500000, category: 'INDEX' },
  { symbol: 'SENSEX', name: 'BSE SENSEX Index', price: 81500.00, change: 480.50, change_pct: 0.59, open: 81020.0, high: 81650.0, low: 80950.0, prev_close: 81019.5, volume: 18200000, category: 'INDEX' },
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 2980.50, change: 42.50, change_pct: 1.45, open: 2945.0, high: 3010.0, low: 2940.0, prev_close: 2938.0, volume: 5400200, category: 'LargeCap' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4210.00, change: -27.50, change_pct: -0.65, open: 4240.0, high: 4250.0, low: 4180.0, prev_close: 4237.5, volume: 2100400, category: 'LargeCap' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1660.25, change: 13.80, change_pct: 0.84, open: 1648.0, high: 1675.0, low: 1645.0, prev_close: 1646.45, volume: 8900100, category: 'LargeCap' },
  { symbol: 'INFY', name: 'Infosys Ltd.', price: 1880.75, change: 38.90, change_pct: 2.11, open: 1845.0, high: 1900.0, low: 1840.0, prev_close: 1841.85, volume: 4300900, category: 'LargeCap' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Passenger & EV Ltd.', price: 1080.00, change: 24.50, change_pct: 2.32, open: 1058.0, high: 1095.0, low: 1052.0, prev_close: 1055.50, volume: 6800100, category: 'LargeCap' },
  { symbol: 'ZOMATO', name: 'Zomato Ltd. / Blinkit', price: 260.40, change: -4.80, change_pct: -1.81, open: 265.0, high: 268.5, low: 258.0, prev_close: 265.20, volume: 12400000, category: 'MidCap' },
  { symbol: 'ITC', name: 'ITC Ltd.', price: 505.20, change: 3.40, change_pct: 0.68, open: 502.0, high: 508.0, low: 501.0, prev_close: 501.80, volume: 3900500, category: 'LargeCap' },
  { symbol: 'GOLD ETF', name: 'Nippon India ETF Gold BeES', price: 65.50, change: 0.45, change_pct: 0.69, open: 65.10, high: 65.80, low: 65.00, prev_close: 65.05, volume: 1500400, category: 'Commodity' },
  { symbol: 'NIFTYBEES', name: 'Nippon India Nifty 50 ETF', price: 268.00, change: 1.60, change_pct: 0.60, open: 266.5, high: 269.0, low: 266.0, prev_close: 266.40, volume: 4500000, category: 'ETF' }
];

const DEFAULT_PORTFOLIO: PortfolioSummary = {
  initial_capital: 1000000.0,
  cash_balance: 950000.0,
  invested_amount: 61000.0,
  total_portfolio_value: 1012610.0,
  total_unrealized_pnl: 1610.0,
  total_unrealized_pnl_pct: 0.16,
  total_realized_pnl: 0,
  trades_count: 2,
  financial_health_score: 88,
  asset_allocation: { EQUITY: 60, INDEX: 40 },
  positions: [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', quantity: 10, avg_price: 2900.0, current_price: 2980.50, invested_value: 29000.0, current_value: 29805.0, unrealized_pnl: 805.0, unrealized_pnl_pct: 2.78 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', quantity: 20, avg_price: 1600.0, current_price: 1640.25, invested_value: 32000.0, current_value: 32805.0, unrealized_pnl: 805.0, unrealized_pnl_pct: 2.53 }
  ]
};

export const TradingSandbox: React.FC = () => {
  const [quotes, setQuotes] = useState<StockQuote[]>(DEFAULT_QUOTES);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(DEFAULT_PORTFOLIO);
  const [selectedStock, setSelectedStock] = useState<StockQuote | null>(DEFAULT_QUOTES[0]);
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
      console.warn('Market fetch error (using static NISM fallback quotes):', e);
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
      // Local fallback simulation when backend is offline
      const tradeTotal = selectedStock.price * quantity;
      setPortfolio(prev => {
        if (!prev) return DEFAULT_PORTFOLIO;
        let newCash = prev.cash_balance;
        let newPositions = [...prev.positions];
        const existingIdx = newPositions.findIndex(p => p.symbol === selectedStock.symbol);

        if (side === 'BUY') {
          if (newCash < tradeTotal) {
            setOrderMessage(`❌ Order failed: Insufficient cash balance`);
            return prev;
          }
          newCash -= tradeTotal;
          if (existingIdx >= 0) {
            const p = newPositions[existingIdx];
            const newQty = p.quantity + quantity;
            const newInvested = p.invested_value + tradeTotal;
            const newAvg = newInvested / newQty;
            const currentVal = newQty * selectedStock.price;
            newPositions[existingIdx] = {
              ...p,
              quantity: newQty,
              avg_price: newAvg,
              invested_value: newInvested,
              current_price: selectedStock.price,
              current_value: currentVal,
              unrealized_pnl: currentVal - newInvested,
              unrealized_pnl_pct: ((currentVal - newInvested) / newInvested) * 100
            };
          } else {
            newPositions.push({
              symbol: selectedStock.symbol,
              name: selectedStock.name,
              quantity: quantity,
              avg_price: selectedStock.price,
              current_price: selectedStock.price,
              invested_value: tradeTotal,
              current_value: tradeTotal,
              unrealized_pnl: 0,
              unrealized_pnl_pct: 0
            });
          }
        } else {
          if (existingIdx < 0 || newPositions[existingIdx].quantity < quantity) {
            setOrderMessage(`❌ Order failed: Insufficient holdings quantity`);
            return prev;
          }
          newCash += tradeTotal;
          const p = newPositions[existingIdx];
          const newQty = p.quantity - quantity;
          if (newQty === 0) {
            newPositions.splice(existingIdx, 1);
          } else {
            const newInvested = p.avg_price * newQty;
            const currentVal = newQty * selectedStock.price;
            newPositions[existingIdx] = {
              ...p,
              quantity: newQty,
              invested_value: newInvested,
              current_value: currentVal,
              unrealized_pnl: currentVal - newInvested,
              unrealized_pnl_pct: ((currentVal - newInvested) / newInvested) * 100
            };
          }
        }

        const totalInvested = newPositions.reduce((sum, item) => sum + item.invested_value, 0);
        const totalCurrentVal = newPositions.reduce((sum, item) => sum + item.current_value, 0);
        const netWorth = newCash + totalCurrentVal;
        const totalPnl = totalCurrentVal - totalInvested;
        setOrderMessage(`✅ ${side} order executed for ${quantity} shares of ${selectedStock.symbol} (Sandbox)`);

        return {
          ...prev,
          cash_balance: newCash,
          invested_amount: totalInvested,
          total_portfolio_value: netWorth,
          total_unrealized_pnl: totalPnl,
          total_unrealized_pnl_pct: totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0,
          trades_count: prev.trades_count + 1,
          positions: newPositions
        };
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await fetch('/api/portfolio/reset', { method: 'POST' });
      fetchPortfolio();
    } catch {
      setPortfolio(DEFAULT_PORTFOLIO);
      setOrderMessage('Portfolio reset to ₹10,00,000 virtual cash (Sandbox)');
    }
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
