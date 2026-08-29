from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Literal, Any

class StockQuote(BaseModel):
    symbol: str
    name: str
    category: str
    price: float
    change: float
    change_pct: float
    open: float
    high: float
    low: float
    prev_close: float
    volume: int
    pe_ratio: Optional[float] = None
    market_cap_cr: Optional[float] = None
    history: List[Dict[str, Any]] = []

class OrderRequest(BaseModel):
    symbol: str
    side: Literal['BUY', 'SELL']
    order_type: Literal['MARKET', 'LIMIT', 'SL']
    quantity: int
    limit_price: Optional[float] = None
    trigger_price: Optional[float] = None

class Position(BaseModel):
    symbol: str
    name: str
    quantity: int
    avg_price: float
    current_price: float
    invested_value: float
    current_value: float
    unrealized_pnl: float
    unrealized_pnl_pct: float

class PortfolioSummary(BaseModel):
    initial_capital: float = 1000000.0
    cash_balance: float
    invested_amount: float
    total_portfolio_value: float
    total_unrealized_pnl: float
    total_unrealized_pnl_pct: float
    total_realized_pnl: float
    positions: List[Position]
    trades_count: int
    financial_health_score: int
    asset_allocation: Dict[str, float]

class TradeRecord(BaseModel):
    id: str
    timestamp: str
    symbol: str
    side: str
    order_type: str
    quantity: int
    price: float
    total_amount: float
    pnl: Optional[float] = None

class BehavioralRiskAssessment(BaseModel):
    score: int
    risk_level: Literal['Low', 'Moderate', 'High', 'Critical']
    flags: List[Dict[str, str]]
    coach_feedback: str
    recommended_module: str

class ChatMessage(BaseModel):
    message: str
    context: Optional[Dict] = None
