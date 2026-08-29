import numpy as np
from typing import Dict, List
from models import BehavioralRiskAssessment, PortfolioSummary
from simulation import market_engine

class AICoachEngine:
    def __init__(self):
        self.coach_name = "Coach Aurelius"

    def assess_behavior(self, portfolio: PortfolioSummary) -> BehavioralRiskAssessment:
        flags = []
        score = 85
        total_val = portfolio.total_portfolio_value

        # 1. Concentration Risk Check
        for pos in portfolio.positions:
            concentration = pos.current_value / total_val if total_val > 0 else 0
            if concentration > 0.40:
                flags.append({
                    "type": "OVER_CONCENTRATION",
                    "severity": "HIGH",
                    "title": f"Excessive Concentration in {pos.symbol}",
                    "detail": f"{pos.symbol} represents {concentration*100:.1f}% of your total portfolio. A single stock drop could severely impact your net worth."
                })
                score -= 20

        # 2. Emergency Fund / Liquidity Buffer Check
        cash_ratio = portfolio.cash_balance / total_val if total_val > 0 else 1.0
        if cash_ratio < 0.10 and len(portfolio.positions) > 0:
            flags.append({
                "type": "NO_EMERGENCY_BUFFER",
                "severity": "CRITICAL",
                "title": "Low Liquidity Buffer",
                "detail": f"You have only {cash_ratio*100:.1f}% in liquid cash. If an unexpected life expense arrives, you might be forced to liquidate stocks at a loss."
            })
            score -= 25

        # 3. Panic Selling / Frequent Trading Check
        if portfolio.trades_count > 15 and portfolio.total_realized_pnl < -10000:
            flags.append({
                "type": "OVERTRADING_CHURN",
                "severity": "MEDIUM",
                "title": "Over-trading and Churn Detected",
                "detail": "Frequent buying and selling without giving investments time to compound often incurs slippage and locks in emotional losses."
            })
            score -= 15

        # 4. Zero Equity Exposure in Growth Phase
        if len(portfolio.positions) == 0 and portfolio.cash_balance >= 950000:
            flags.append({
                "type": "IDLE_CASH_DRAG",
                "severity": "LOW",
                "title": "Idle Cash Drag",
                "detail": "100% of your funds are in cash. Inflation at 6% per year is actively eroding purchasing power. Consider starting a diversified SIP or Index ETF."
            })
            score -= 10

        risk_level = "Low"
        if score < 50:
            risk_level = "Critical"
        elif score < 70:
            risk_level = "High"
        elif score < 85:
            risk_level = "Moderate"

        feedback = "Your portfolio is well balanced and disciplined! Keep adhering to asset allocation principles."
        recommended = "Advanced Equity Valuation & Sector Allocation"

        if flags:
            top_flag = flags[0]
            if top_flag["type"] == "OVER_CONCENTRATION":
                feedback = "Coach Aurelius Warning: Diversification is the only free lunch in finance. Cap any single equity holding to maximum 15-20%."
                recommended = "Asset Allocation & Modern Portfolio Theory"
            elif top_flag["type"] == "NO_EMERGENCY_BUFFER":
                feedback = "Coach Aurelius Alert: Prioritize 6 months of living expenses in High-Interest Savings / Liquid FD before deploying into equities."
                recommended = "Emergency Fund Mastery & Debt Shield"
            elif top_flag["type"] == "OVERTRADING_CHURN":
                feedback = "Coach Aurelius Advice: Time in the market beats timing the market. Shift focus from day trading to disciplined SIPs."
                recommended = "Index Fund Compounding & Behavioral Psychology"
            elif top_flag["type"] == "IDLE_CASH_DRAG":
                feedback = "Coach Aurelius Nudge: Don't let inflation eat your money. Deploy systematically into broad market index ETFs like NIFTYBEES."
                recommended = "Understanding Inflation & SIP Foundations"

        return BehavioralRiskAssessment(
            score=max(20, min(100, score)),
            risk_level=risk_level,
            flags=flags,
            coach_feedback=feedback,
            recommended_module=recommended
        )

    def answer_query(self, user_msg: str, portfolio_context: dict) -> str:
        q = user_msg.lower()
        if "fd" in q or "fixed deposit" in q:
            return "A Fixed Deposit (FD) is a guaranteed-return debt instrument ideal for your 6-month emergency buffer or short-term goals (<3 years). It gives 6.5-7.5% returns, protecting principal without market volatility."
        elif "sip" in q or "mutual fund" in q or "index" in q:
            return "A Systematic Investment Plan (SIP) in a NIFTY 50 Index Fund is the gold standard for long-term wealth creation. By investing a fixed amount every month, you automatically buy more units when markets are low (Rupee Cost Averaging) and harness compounding!"
        elif "scam" in q or "ponzi" in q or "whatsapp" in q or "telegram" in q:
            return "Golden Rule of Fraud Awareness: Any scheme promising 'guaranteed 20-30% monthly return' or asking for UPI transfers for 'task commissions' is a 100% scam. SEBI-registered advisors never guarantee stock market returns."
        elif "credit card" in q or "minimum due" in q or "loan" in q:
            return "Never pay just the 'Minimum Amount Due' on credit cards! Credit card debt compounds at 42-48% APR (Annual Percentage Rate). Always pay the total statement balance in full before the due date to avoid the interest debt spiral."
        elif "emergency" in q or "buffer" in q:
            return "An Emergency Fund should cover 6 months of mandatory living expenses (rent + food + EMIs + insurance). Keep this in a combination of Savings Account + Sweep-in FD so you never have to sell stocks during a market dip!"
        elif "paper trade" in q or "trade" in q or "stock" in q:
            return f"In your FinQuest virtual portfolio, you currently have ₹{portfolio_context.get('cash_balance', 1000000):,.2f} in cash and {len(portfolio_context.get('positions', []))} active positions. Practice disciplined position sizing and always set a mental or physical stop-loss!"
        else:
            return "I am Coach Aurelius, your AI Financial Mentor! I can help you analyze your portfolio risks, explain financial instruments (FD, SIP, Index Funds, Insurance), guide your life stages, or help you spot financial scams. What would you like to explore?"

ai_coach = AICoachEngine()
