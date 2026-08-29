from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import uvicorn

from models import StockQuote, OrderRequest, PortfolioSummary, TradeRecord, BehavioralRiskAssessment, ChatMessage
from simulation import market_engine
from portfolio import portfolio_engine
from ai_coach import ai_coach

app = FastAPI(
    title="FinQuest - Financial Life & Paper Trading API",
    description="Team Aurelius EdTech Engine: Learn Money by Managing Money",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "app": "FinQuest by Team Aurelius",
        "tagline": "Learn Money by Managing Money",
        "status": "online",
        "market_regime": market_engine.market_regime
    }

@app.get("/api/market/quotes", response_model=List[StockQuote])
def get_all_quotes():
    market_engine.tick()  # update tick
    return market_engine.get_all_quotes()

@app.get("/api/market/quote/{symbol}", response_model=StockQuote)
def get_quote(symbol: str):
    market_engine.tick()
    try:
        return market_engine.get_quote(symbol)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/api/market/orderbook/{symbol}")
def get_order_book(symbol: str):
    return market_engine.get_order_book(symbol)

@app.post("/api/market/regime/{regime}")
def set_market_regime(regime: str):
    if regime not in ["NORMAL", "BULL", "BEAR", "HIGH_VOLATILITY"]:
        raise HTTPException(status_code=400, detail="Invalid market regime")
    market_engine.set_regime(regime)
    return {"status": "success", "regime": regime}

@app.get("/api/portfolio", response_model=PortfolioSummary)
def get_portfolio():
    return portfolio_engine.get_summary()

@app.post("/api/trade/order")
def execute_order(order: OrderRequest):
    result = portfolio_engine.execute_order(order)
    return result

@app.get("/api/trade/history", response_model=List[TradeRecord])
def get_trade_history():
    return portfolio_engine.trades

@app.post("/api/portfolio/reset")
def reset_portfolio():
    portfolio_engine.reset()
    return {"status": "success", "message": "Portfolio reset to ₹10,00,000 virtual cash"}

@app.get("/api/coach/assessment", response_model=BehavioralRiskAssessment)
def get_coach_assessment():
    summary = portfolio_engine.get_summary()
    return ai_coach.assess_behavior(summary)

@app.post("/api/coach/chat")
def chat_with_coach(chat: ChatMessage):
    summary = portfolio_engine.get_summary()
    context = {
        "cash_balance": summary.cash_balance,
        "positions": [p.dict() for p in summary.positions],
        "health_score": summary.financial_health_score,
        "unrealized_pnl": summary.total_unrealized_pnl
    }
    reply = ai_coach.answer_query(chat.message, context)
    return {
        "coach": "Coach Aurelius",
        "reply": reply,
        "assessment": ai_coach.assess_behavior(summary).dict()
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
