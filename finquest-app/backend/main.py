"""
FinQuest - NISM Financial Literacy & AI Voice Co-Pilot API (Team Aurelius)
"""
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
import uvicorn
from pydantic import BaseModel

from models import StockQuote, OrderRequest, PortfolioSummary, TradeRecord, BehavioralRiskAssessment, ChatMessage
from simulation import market_engine
from portfolio import portfolio_engine
from ai_coach import ai_coach
from curriculum import NISM_MODULES
from calculators import lab_engine

app = FastAPI(
    title="FinQuest - NISM Financial Literacy & AI Voice Engine",
    description="Team Aurelius EdTech Engine: Learn Money by Managing Money",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- ROOT & HEALTH -----------------
@app.get("/")
def root():
    return {
        "app": "FinQuest by Team Aurelius",
        "tagline": "Learn Money by Managing Money",
        "curriculum": "NISM Financial Literacy Course for Bharat (5 Modules)",
        "ai_copilot": "Aurelius Voice Engine",
        "status": "online"
    }

# ----------------- NISM CURRICULUM ROUTES -----------------
@app.get("/api/curriculum")
def get_full_curriculum():
    """Returns all 5 NISM Financial Literacy Course for Bharat modules."""
    return NISM_MODULES

@app.get("/api/curriculum/module/{module_id}")
def get_module(module_id: str):
    for mod in NISM_MODULES:
        if mod["id"] == module_id:
            return mod
    raise HTTPException(status_code=404, detail="Module not found")

class QuizSubmission(BaseModel):
    module_id: str
    answers: Dict[int, int] # question_index: selected_option_index

@app.post("/api/curriculum/quiz/submit")
def submit_quiz(sub: QuizSubmission):
    target_mod = next((m for m in NISM_MODULES if m["id"] == sub.module_id), None)
    if not target_mod:
        raise HTTPException(status_code=404, detail="Module not found")
        
    quiz_questions = target_mod.get("quiz", [])
    total = len(quiz_questions)
    correct_count = 0
    results = []
    
    for idx, q in enumerate(quiz_questions):
        selected = sub.answers.get(idx, -1)
        is_correct = (selected == q["correct_index"])
        if is_correct:
            correct_count += 1
        results.append({
            "question_index": idx,
            "question": q["question"],
            "selected_index": selected,
            "correct_index": q["correct_index"],
            "is_correct": is_correct,
            "explanation": q["explanation"]
        })
        
    score_pct = (correct_count / total * 100) if total > 0 else 0
    passed = score_pct >= 50 # NISM passing mark is 50%
    xp_earned = correct_count * 50
    
    return {
        "module_id": sub.module_id,
        "total_questions": total,
        "correct_count": correct_count,
        "score_pct": round(score_pct, 1),
        "passed": passed,
        "xp_earned": xp_earned,
        "feedback": "Outstanding mastery! NISM certification credit added." if passed else "Keep practicing! Review the lesson notes and retry.",
        "details": results
    }

# ----------------- FINANCIAL LAB CALCULATORS -----------------
class BudgetRequest(BaseModel):
    salary: float = 50000.0
    needs: Optional[float] = None
    wants: Optional[float] = None
    invest: Optional[float] = None

@app.post("/api/labs/budget")
def calculate_budget_lab(req: BudgetRequest):
    return lab_engine.calculate_budget(req.salary, req.needs, req.wants, req.invest)

class RealReturnRequest(BaseModel):
    nominal_rate: float = 7.0
    tax_slab: float = 30.0
    inflation_rate: float = 6.0

@app.post("/api/labs/real-return")
def calculate_real_return_lab(req: RealReturnRequest):
    return lab_engine.calculate_real_return(req.nominal_rate, req.tax_slab, req.inflation_rate)

class SIPRequest(BaseModel):
    monthly_sip: float = 5000.0
    cagr_pct: float = 12.0
    tenure_years: int = 25
    delay_years: int = 5

@app.post("/api/labs/sip")
def calculate_sip_lab(req: SIPRequest):
    return lab_engine.calculate_sip_compounding(req.monthly_sip, req.cagr_pct, req.tenure_years, req.delay_years)

class DebtRequest(BaseModel):
    balance: float = 75000.0
    apr_pct: float = 42.0
    min_payment_pct: float = 5.0
    fixed_payment: float = 0.0

@app.post("/api/labs/debt")
def calculate_debt_lab(req: DebtRequest):
    return lab_engine.calculate_credit_card_trap(req.balance, req.apr_pct, req.min_payment_pct, req.fixed_payment)

# ----------------- AURELIUS VOICE & AI ROUTES -----------------
class VoicePrompt(BaseModel):
    message: str
    current_lab: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

@app.post("/api/voice/ask")
def voice_ask(req: VoicePrompt):
    """Voice inquiry endpoint that returns speech synthesis text + synced UI actions."""
    return ai_coach.process_voice_query(req.message, req.context)

@app.post("/api/coach/chat")
def chat_with_coach(chat: ChatMessage):
    summary = portfolio_engine.get_summary()
    res = ai_coach.process_voice_query(chat.message, context={"summary": summary.dict()})
    return {
        "coach": "Aurelius",
        "reply": res["markdown_reply"],
        "speech_text": res["speech_text"],
        "ui_action": res["ui_action"],
        "lab_id": res["lab_id"],
        "suggested_prompts": res["suggested_prompts"],
        "assessment": ai_coach.assess_behavior(summary).dict()
    }

@app.get("/api/coach/assessment", response_model=BehavioralRiskAssessment)
def get_coach_assessment():
    summary = portfolio_engine.get_summary()
    return ai_coach.assess_behavior(summary)

# ----------------- TRADING & PORTFOLIO ENGINE ROUTES -----------------
@app.get("/api/market/quotes", response_model=List[StockQuote])
def get_all_quotes():
    market_engine.tick()
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

@app.get("/api/portfolio", response_model=PortfolioSummary)
def get_portfolio():
    return portfolio_engine.get_summary()

@app.post("/api/trade/order")
def execute_order(order: OrderRequest):
    return portfolio_engine.execute_order(order)

@app.get("/api/trade/history", response_model=List[TradeRecord])
def get_trade_history():
    return portfolio_engine.trades

@app.post("/api/portfolio/reset")
def reset_portfolio():
    portfolio_engine.reset()
    return {"status": "success", "message": "Portfolio reset to ₹10,00,000 virtual cash"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
