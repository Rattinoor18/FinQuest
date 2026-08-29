import random
import time
from datetime import datetime, timedelta
from typing import Dict, List
from models import StockQuote

INITIAL_STOCKS = {
    "NIFTY 50": {
        "name": "NIFTY 50 Benchmark Index",
        "category": "Index",
        "base_price": 24850.0,
        "pe_ratio": 22.4,
        "market_cap_cr": 19500000.0,
        "volatility": 0.007
    },
    "SENSEX": {
        "name": "BSE SENSEX Index",
        "category": "Index",
        "base_price": 81500.0,
        "pe_ratio": 23.8,
        "market_cap_cr": 18200000.0,
        "volatility": 0.007
    },
    "RELIANCE": {
        "name": "Reliance Industries Ltd.",
        "category": "LargeCap",
        "base_price": 2980.0,
        "pe_ratio": 27.2,
        "market_cap_cr": 2016000.0,
        "volatility": 0.012
    },
    "TCS": {
        "name": "Tata Consultancy Services",
        "category": "LargeCap",
        "base_price": 4210.0,
        "pe_ratio": 31.5,
        "market_cap_cr": 1520000.0,
        "volatility": 0.010
    },
    "HDFCBANK": {
        "name": "HDFC Bank Ltd.",
        "category": "LargeCap",
        "base_price": 1660.0,
        "pe_ratio": 19.4,
        "market_cap_cr": 1260000.0,
        "volatility": 0.011
    },
    "INFY": {
        "name": "Infosys Ltd.",
        "category": "LargeCap",
        "base_price": 1880.0,
        "pe_ratio": 26.8,
        "market_cap_cr": 780000.0,
        "volatility": 0.013
    },
    "TATAMOTORS": {
        "name": "Tata Motors Passenger and EV Ltd.",
        "category": "LargeCap",
        "base_price": 1080.0,
        "pe_ratio": 15.6,
        "market_cap_cr": 395000.0,
        "volatility": 0.018
    },
    "ZOMATO": {
        "name": "Zomato Ltd. (Blinkit and Food)",
        "category": "MidCap",
        "base_price": 260.0,
        "pe_ratio": 85.0,
        "market_cap_cr": 228000.0,
        "volatility": 0.025
    },
    "ITC": {
        "name": "ITC Ltd.",
        "category": "LargeCap",
        "base_price": 505.0,
        "pe_ratio": 28.1,
        "market_cap_cr": 630000.0,
        "volatility": 0.008
    },
    "GOLD ETF": {
        "name": "Nippon India ETF Gold BeES",
        "category": "Commodity",
        "base_price": 65.5,
        "pe_ratio": None,
        "market_cap_cr": 12000.0,
        "volatility": 0.005
    },
    "NIFTYBEES": {
        "name": "Nippon India Nifty 50 ETF",
        "category": "ETF",
        "base_price": 268.0,
        "pe_ratio": 22.4,
        "market_cap_cr": 25000.0,
        "volatility": 0.007
    }
}

class MarketSimulationEngine:
    def __init__(self):
        self.stocks: Dict[str, dict] = {}
        self.market_regime: str = "NORMAL"
        self.initialize_market()

    def generate_initial_history(self, base_price: float, volatility: float, points: int = 50) -> List[dict]:
        history = []
        now = datetime.now()
        current = base_price * 0.96
        for i in range(points):
            t = (now - timedelta(minutes=(points - i) * 5)).strftime("%H:%M:%S")
            shock = random.gauss(0.0005, volatility)
            current = max(1.0, current * (1 + shock))
            history.append({
                "time": t,
                "price": round(current, 2),
                "open": round(current * (1 - random.uniform(0, 0.003)), 2),
                "high": round(current * (1 + random.uniform(0.001, 0.005)), 2),
                "low": round(current * (1 - random.uniform(0.001, 0.005)), 2),
                "close": round(current, 2),
                "volume": random.randint(10000, 150000)
            })
        return history

    def initialize_market(self):
        for sym, data in INITIAL_STOCKS.items():
            hist = self.generate_initial_history(data["base_price"], data["volatility"])
            latest_price = hist[-1]["price"]
            open_price = hist[0]["price"]
            high_price = max(h["high"] for h in hist)
            low_price = min(h["low"] for h in hist)
            prev_close = round(open_price * random.uniform(0.99, 1.01), 2)
            change = round(latest_price - prev_close, 2)
            change_pct = round((change / prev_close) * 100, 2)

            self.stocks[sym] = {
                "symbol": sym,
                "name": data["name"],
                "category": data["category"],
                "price": latest_price,
                "change": change,
                "change_pct": change_pct,
                "open": open_price,
                "high": high_price,
                "low": low_price,
                "prev_close": prev_close,
                "volume": sum(h["volume"] for h in hist),
                "pe_ratio": data["pe_ratio"],
                "market_cap_cr": data["market_cap_cr"],
                "volatility": data["volatility"],
                "history": hist
            }

    def tick(self):
        now_str = datetime.now().strftime("%H:%M:%S")
        for sym, stock in self.stocks.items():
            vol = stock["volatility"]
            drift = 0.0001
            if self.market_regime == "BULL":
                drift = 0.002
            elif self.market_regime == "BEAR":
                drift = -0.0025
            elif self.market_regime == "HIGH_VOLATILITY":
                vol *= 2.5

            pct_change = random.gauss(drift, vol)
            new_price = round(max(0.5, stock["price"] * (1 + pct_change)), 2)
            stock["price"] = new_price
            stock["high"] = max(stock["high"], new_price)
            stock["low"] = min(stock["low"], new_price)
            stock["change"] = round(new_price - stock["prev_close"], 2)
            stock["change_pct"] = round((stock["change"] / stock["prev_close"]) * 100, 2)
            tick_vol = random.randint(1000, 25000)
            stock["volume"] += tick_vol

            stock["history"].append({
                "time": now_str,
                "price": new_price,
                "open": stock["price"],
                "high": max(stock["price"], new_price),
                "low": min(stock["price"], new_price),
                "close": new_price,
                "volume": tick_vol
            })
            if len(stock["history"]) > 80:
                stock["history"].pop(0)

    def set_regime(self, regime: str):
        self.market_regime = regime

    def get_quote(self, symbol: str) -> StockQuote:
        if symbol in self.stocks:
            return StockQuote(**self.stocks[symbol])
        raise ValueError(f"Symbol {symbol} not found")

    def get_all_quotes(self) -> List[StockQuote]:
        return [StockQuote(**s) for s in self.stocks.values()]

    def get_order_book(self, symbol: str) -> dict:
        if symbol not in self.stocks:
            return {"bids": [], "asks": []}
        price = self.stocks[symbol]["price"]
        bids = []
        asks = []
        for i in range(1, 6):
            bid_p = round(price * (1 - (i * 0.0008)), 2)
            bid_q = random.randint(20, 500) * (6 - i)
            bids.append({"price": bid_p, "quantity": bid_q, "orders": random.randint(1, 8)})

            ask_p = round(price * (1 + (i * 0.0008)), 2)
            ask_q = random.randint(20, 500) * (6 - i)
            asks.append({"price": ask_p, "quantity": ask_q, "orders": random.randint(1, 8)})

        return {
            "symbol": symbol,
            "current_price": price,
            "total_buy_qty": sum(b["quantity"] for b in bids),
            "total_sell_qty": sum(a["quantity"] for a in asks),
            "bids": bids,
            "asks": asks
        }

market_engine = MarketSimulationEngine()
