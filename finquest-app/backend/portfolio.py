import uuid
from datetime import datetime
from typing import Dict, List, Optional
from models import OrderRequest, Position, PortfolioSummary, TradeRecord
from simulation import market_engine

class PortfolioEngine:
    def __init__(self, initial_capital: float = 1000000.0):
        self.initial_capital = initial_capital
        self.cash_balance = initial_capital
        self.holdings: Dict[str, dict] = {}  # symbol -> {qty, avg_price, name}
        self.trades: List[TradeRecord] = []
        self.realized_pnl = 0.0

    def execute_order(self, order: OrderRequest) -> dict:
        quote = market_engine.get_quote(order.symbol)
        exec_price = quote.price

        if order.order_type == "LIMIT" and order.limit_price:
            if order.side == "BUY" and exec_price > order.limit_price:
                return {"status": "REJECTED", "message": f"Market price ₹{exec_price} is higher than Limit Price ₹{order.limit_price}"}
            elif order.side == "SELL" and exec_price < order.limit_price:
                return {"status": "REJECTED", "message": f"Market price ₹{exec_price} is lower than Limit Price ₹{order.limit_price}"}
            exec_price = order.limit_price

        total_cost = round(exec_price * order.quantity, 2)

        if order.side == "BUY":
            if self.cash_balance < total_cost:
                return {"status": "REJECTED", "message": f"Insufficient virtual funds! Required: ₹{total_cost:,.2f}, Available: ₹{self.cash_balance:,.2f}"}

            self.cash_balance -= total_cost
            if order.symbol in self.holdings:
                curr = self.holdings[order.symbol]
                total_qty = curr["quantity"] + order.quantity
                new_avg = ((curr["avg_price"] * curr["quantity"]) + total_cost) / total_qty
                curr["quantity"] = total_qty
                curr["avg_price"] = round(new_avg, 2)
            else:
                self.holdings[order.symbol] = {
                    "symbol": order.symbol,
                    "name": quote.name,
                    "quantity": order.quantity,
                    "avg_price": exec_price
                }

            trade = TradeRecord(
                id=str(uuid.uuid4())[:8],
                timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                symbol=order.symbol,
                side="BUY",
                order_type=order.order_type,
                quantity=order.quantity,
                price=exec_price,
                total_amount=total_cost,
                pnl=None
            )
            self.trades.insert(0, trade)
            return {"status": "EXECUTED", "trade": trade.dict(), "message": f"Bought {order.quantity} shares of {order.symbol} at ₹{exec_price:,.2f}"}

        elif order.side == "SELL":
            if order.symbol not in self.holdings or self.holdings[order.symbol]["quantity"] < order.quantity:
                available = self.holdings.get(order.symbol, {}).get("quantity", 0)
                return {"status": "REJECTED", "message": f"Insufficient shares to sell! You hold {available} shares of {order.symbol}."}

            holding = self.holdings[order.symbol]
            cost_basis = holding["avg_price"] * order.quantity
            sale_proceeds = total_cost
            trade_pnl = round(sale_proceeds - cost_basis, 2)

            self.cash_balance += sale_proceeds
            self.realized_pnl += trade_pnl
            holding["quantity"] -= order.quantity

            if holding["quantity"] == 0:
                del self.holdings[order.symbol]

            trade = TradeRecord(
                id=str(uuid.uuid4())[:8],
                timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                symbol=order.symbol,
                side="SELL",
                order_type=order.order_type,
                quantity=order.quantity,
                price=exec_price,
                total_amount=sale_proceeds,
                pnl=trade_pnl
            )
            self.trades.insert(0, trade)
            return {"status": "EXECUTED", "trade": trade.dict(), "message": f"Sold {order.quantity} shares of {order.symbol} at ₹{exec_price:,.2f} (Realized P&L: ₹{trade_pnl:+,.2f})"}

    def get_summary(self) -> PortfolioSummary:
        positions: List[Position] = []
        invested_amount = 0.0
        current_holdings_value = 0.0

        for sym, h in self.holdings.items():
            if h["quantity"] <= 0:
                continue
            quote = market_engine.get_quote(sym)
            cur_price = quote.price
            invested = round(h["avg_price"] * h["quantity"], 2)
            cur_val = round(cur_price * h["quantity"], 2)
            pnl = round(cur_val - invested, 2)
            pnl_pct = round((pnl / invested) * 100, 2) if invested > 0 else 0.0

            invested_amount += invested
            current_holdings_value += cur_val

            positions.append(Position(
                symbol=sym,
                name=h["name"],
                quantity=h["quantity"],
                avg_price=h["avg_price"],
                current_price=cur_price,
                invested_value=invested,
                current_value=cur_val,
                unrealized_pnl=pnl,
                unrealized_pnl_pct=pnl_pct
            ))

        total_portfolio_value = round(self.cash_balance + current_holdings_value, 2)
        total_unrealized_pnl = round(current_holdings_value - invested_amount, 2)
        total_unrealized_pnl_pct = round((total_unrealized_pnl / invested_amount) * 100, 2) if invested_amount > 0 else 0.0

        # Calculate Financial Health Score (0-1000)
        # Factors: Diversification, Liquidity cushion, Risk management
        health_score = 700
        cash_ratio = self.cash_balance / total_portfolio_value if total_portfolio_value > 0 else 1.0

        # Healthy cash ratio is between 15% and 50%
        if 0.15 <= cash_ratio <= 0.50:
            health_score += 120
        elif cash_ratio < 0.05:
            health_score -= 100  # dangerously low emergency buffer
        elif cash_ratio > 0.85:
            health_score -= 40  # idle cash losing to inflation

        # Check diversification
        if len(positions) >= 4:
            health_score += 100
        elif len(positions) == 1:
            health_score -= 80  # high concentration risk

        # Realized gains discipline
        if self.realized_pnl > 0:
            health_score += 50
        elif self.realized_pnl < -50000:
            health_score -= 60

        health_score = max(300, min(990, health_score))

        # Asset allocation
        allocation = {
            "Cash & Equivalents": round(self.cash_balance, 2),
            "Equities & LargeCap": round(sum(p.current_value for p in positions if "Index" not in p.symbol and "GOLD" not in p.symbol and "BEES" not in p.symbol), 2),
            "Index & ETFs": round(sum(p.current_value for p in positions if "Index" in p.symbol or "BEES" in p.symbol or "NIFTY" in p.symbol or "SENSEX" in p.symbol), 2),
            "Gold / Commodities": round(sum(p.current_value for p in positions if "GOLD" in p.symbol), 2),
        }

        return PortfolioSummary(
            initial_capital=self.initial_capital,
            cash_balance=round(self.cash_balance, 2),
            invested_amount=round(invested_amount, 2),
            total_portfolio_value=total_portfolio_value,
            total_unrealized_pnl=total_unrealized_pnl,
            total_unrealized_pnl_pct=total_unrealized_pnl_pct,
            total_realized_pnl=round(self.realized_pnl, 2),
            positions=positions,
            trades_count=len(self.trades),
            financial_health_score=health_score,
            asset_allocation=allocation
        )

    def reset(self):
        self.cash_balance = self.initial_capital
        self.holdings.clear()
        self.trades.clear()
        self.realized_pnl = 0.0

portfolio_engine = PortfolioEngine()
