"""
Aurelius AI Financial Voice & Literacy Mentor Engine
"""
import os
import re
from typing import Dict, List, Any, Optional
from models import BehavioralRiskAssessment, PortfolioSummary
from curriculum import NISM_MODULES
from calculators import lab_engine

class AureliusAIEngine:
    def __init__(self):
        self.coach_name = "Aurelius"
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.client = None
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self.client = genai.GenerativeModel("gemini-1.5-flash")
            except Exception:
                self.client = None

    def assess_behavior(self, portfolio: PortfolioSummary) -> BehavioralRiskAssessment:
        flags = []
        score = 90
        total_val = portfolio.total_portfolio_value if portfolio.total_portfolio_value > 0 else 1000000.0

        # 1. Over Concentration Risk
        for pos in portfolio.positions:
            concentration = pos.current_value / total_val if total_val > 0 else 0
            if concentration > 0.40:
                flags.append({
                    "type": "OVER_CONCENTRATION",
                    "severity": "HIGH",
                    "title": f"Excessive Concentration in {pos.symbol}",
                    "detail": f"{pos.symbol} represents {concentration*100:.1f}% of your portfolio. The NISM golden rule recommends keeping single-stock exposure under 15-20%."
                })
                score -= 18

        # 2. Cash Drag or No Emergency Fund
        cash_ratio = portfolio.cash_balance / total_val
        if cash_ratio < 0.05 and len(portfolio.positions) > 0:
            flags.append({
                "type": "LIQUIDITY_RISK",
                "severity": "MEDIUM",
                "title": "Low Cash Reserves (No Safety Buffer)",
                "detail": "You have less than 5% liquid cash left. If market drops or an emergency hits, you risk liquidating assets at a loss."
            })
            score -= 12
        elif cash_ratio > 0.85 and portfolio.trades_count > 0:
            flags.append({
                "type": "CASH_DRAG",
                "severity": "LOW",
                "title": "Inflation Cash Drag",
                "detail": "Over 85% of your capital is sitting uninvested. Idle cash loses ~6% purchasing power every year to inflation."
            })
            score -= 8

        # 3. High Volatility Exposure
        high_vol_count = sum(1 for p in portfolio.positions if p.symbol in ["TATAMOTORS", "ZOMATO", "PAYTM"])
        if high_vol_count >= 2:
            flags.append({
                "type": "VOLATILITY_EXPOSURE",
                "severity": "MEDIUM",
                "title": "High Beta / Volatility Tilt",
                "detail": "You are heavily allocated to high-volatility growth stocks. Ensure you balance with broad NIFTY 50 Index funds."
            })
            score -= 10

        score = max(20, min(100, score))
        risk_level = "Low" if score >= 80 else "Moderate" if score >= 60 else "High" if score >= 40 else "Critical"

        if score >= 80:
            feedback = "Well balanced! Your asset allocation aligns with prudent risk-reward principles. Continue compound investing via regular SIPs."
            rec_mod = "Module 3: Financial Planning & Compounding"
        elif score >= 60:
            feedback = "Moderate risk detected. Diversify single-stock positions and maintain an emergency liquid cash buffer."
            rec_mod = "Module 4: Risk, Reward & Building Your Safety Net"
        else:
            feedback = "High behavioral risk! Avoid chasing concentrated bets. Follow the 50/30/20 rule and protect downside."
            rec_mod = "Module 2: Managing Your Finances & Debt Traps"

        return BehavioralRiskAssessment(
            score=score,
            risk_level=risk_level,
            flags=flags,
            coach_feedback=feedback,
            recommended_module=rec_mod
        )

    def process_voice_query(self, message: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Processes spoken voice query, provides natural spoken response, and triggers synced UI labs.
        """
        msg_lower = message.lower().strip()
        
        # Intent Detection for Live UI Sync
        ui_action = "NONE"
        lab_id = None
        speech_text = ""
        markdown_reply = ""
        suggested_prompts = []

        # 1. Budgeting / 50-30-20
        if any(k in msg_lower for k in ["budget", "50/30/20", "50 30 20", "salary", "expense", "spend"]):
            ui_action = "OPEN_LAB"
            lab_id = "budgeting"
            speech_text = "Opening the 50/30/20 Budgeting Lab on your screen. The golden rule is 50% for Needs, 30% for Wants, and always invest 20% on the day your salary arrives."
            markdown_reply = """### The 50/30/20 Budgeting Rule (NISM Module 2)
The smartest way to build wealth without depriving yourself:
- **50% Needs:** Rent, groceries, electricity, essential EMIs & health insurance.
- **30% Wants:** Dining out, movies, gadgets, weekend trips.
- **20% Wealth Building:** Emergency fund accumulation & Index Fund SIPs.

*💡 Pro-Tip from Aurelius: Automate your 20% investment on Salary Day before spending on lifestyle.*"""
            suggested_prompts = ["What if my rent is 40% of salary?", "How much emergency fund do I need?", "Explain rule of 72"]

        # 2. Fixed Deposit / Inflation / Real Return
        elif any(k in msg_lower for k in ["fd", "fixed deposit", "inflation", "real return", "savings account", "rd"]):
            ui_action = "OPEN_LAB"
            lab_id = "real_return"
            speech_text = "I've launched the Real Return and Inflation Lab. A 7% Fixed Deposit sounds safe, but after 30% tax and 6% inflation, your real wealth shrinks by about 1% every year."
            markdown_reply = """### The Real Return Math (NISM Module 2 & 3)
A nominal 7.0% FD is great for emergency safety, but cannot beat long-term inflation:
- **Nominal FD Interest:** `+7.0%`
- **Tax Drag (30% Slab):** `-2.1%` (Post-tax: `4.9%`)
- **Annual Inflation:** `-6.0%`
- **Net Real Purchasing Power:** `🔴 -1.1% per year!`

*💡 Aurelius Rule: Use FDs for 0-3 year safety; use Equities/PPF for >5 year compounding.*"""
            suggested_prompts = ["How does SIP beat inflation?", "What is Rule of 72?", "Is PPF tax free?"]

        # 3. SIP / Compounding / Rule of 72 / Mutual Funds
        elif any(k in msg_lower for k in ["sip", "compound", "rule of 72", "mutual fund", "index fund", "invest", "delay"]):
            ui_action = "OPEN_LAB"
            lab_id = "sip_compounding"
            speech_text = "Displaying the 30-Year Compounding Sandbox. Starting a ₹5,000 monthly SIP in your 20s can build over 5.9 Crores, while a 10-year delay costs you over 4 Crores in lost compounding."
            markdown_reply = """### The Power of Compounding & Rule of 72 (NISM Module 3)
- **The Rule of 72:** Divide 72 by your annual return to see how fast money doubles!
  - At **12% (Nifty 50):** Capital doubles every **6 Years**.
  - At **6% (FD):** Capital doubles every **12 Years**.
- **The 10-Year Delay Cost:**
  - Starting ₹5,000/mo at **Age 20** (12% CAGR till 60): **₹5.94 Crores**
  - Starting ₹5,000/mo at **Age 30**: **₹1.76 Crores**
  - *Delay Penalty:* **₹4.18 Crores lost!**

*💡 Aurelius Rule: Always choose 'Direct Plan - Growth' mutual funds to save 1% distributor commission.*"""
            suggested_prompts = ["Direct vs Regular funds?", "What is Nifty 50?", "Explain debt snowball"]

        # 4. Debt / Credit Card / Loan / EMI
        elif any(k in msg_lower for k in ["debt", "credit card", "loan", "emi", "cibil", "minimum due"]):
            ui_action = "OPEN_LAB"
            lab_id = "debt_trap"
            speech_text = "Opening the Debt Trap and Credit Card Payoff Lab. Credit cards charge up to 42% annual interest. Paying only the minimum due can take 15 years to pay off a single gadget."
            markdown_reply = """### The Revolving Credit Card Trap (NISM Module 2)
Credit card interest is an extreme wealth destroyer:
- **APR:** `3.5% to 3.8% monthly` = `42% to 48% per year`.
- **The Minimum Due Trap:** Paying only 5% minimum due keeps 95% balance compounding at 42% APR.
- **Good Debt vs Bad Debt:** Good debt builds earning assets (Education/Home); bad debt finances depreciating lifestyle toys.

*💡 Aurelius Rule: Always pay 100% of Total Amount Due before the statement due date.*"""
            suggested_prompts = ["How to improve CIBIL score?", "Explain 50/30/20 rule", "How to build emergency fund?"]

        # 5. Scams / Telegram / WhatsApp / Fraud / Ponzi / UPI
        elif any(k in msg_lower for k in ["scam", "fraud", "telegram", "whatsapp", "ponzi", "guaranteed", "tipster", "upi"]):
            ui_action = "OPEN_LAB"
            lab_id = "scam_radar"
            speech_text = "I've pulled up the Scam Immunity Radar. The number one rule in Indian finance: legitimate SEBI registered advisors never guarantee returns, and you never enter your UPI PIN to receive money."
            markdown_reply = """### The Scam Immunity Playbook (NISM Module 5)
#### 5 Red Flags of Every Financial Scam:
1. **The Word 'Guaranteed' on High Returns:** No legitimate market asset guarantees 10% monthly or 2% daily.
2. **UPI PIN for Receiving Money:** You **NEVER** enter your PIN to get cashbacks or refunds.
3. **VIP Telegram / WhatsApp Channels:** Unregulated pump-and-dump operators.
4. **Task-Based Part-Time Jobs:** "Like YouTube videos for ₹2,000" leading to crypto deposit traps.
5. **Emergency Action:** In case of cyber fraud, immediately call **1930** within the golden hour to freeze funds!"""
            suggested_prompts = ["How to verify SEBI registration?", "What is RBI Ombudsman?", "Explain term insurance"]

        # 6. Insurance / Safety Net / Emergency
        elif any(k in msg_lower for k in ["insurance", "term life", "ulip", "health insurance", "emergency fund", "endowment"]):
            ui_action = "OPEN_LAB"
            lab_id = "insurance_matrix"
            speech_text = "Opening the Insurance Protection Matrix. Never mix investment with insurance. Buy pure term life for 15 times your income, and invest the remaining difference into index funds."
            markdown_reply = """### Insurance Protection Blueprint (NISM Module 4)
- **The Golden Rule:** Never buy ULIPs or Endowment plans with low cover and 4% returns.
- **Pure Term Insurance:** ₹1.5 Crore cover costs only ~₹1,000/month for a 25-year-old.
- **Health Insurance:** Crucial individual cover of ₹10L - ₹25L with Super Top-Up to prevent hospital bills from wiping out savings.
- **Emergency Fund:** 3 to 6 months of essential living expenses parked in liquid savings / Sweep-in FD."""
            suggested_prompts = ["Why are ULIPs bad?", "How much term cover do I need?", "Explain 50/30/20 rule"]

        # 7. Default Conversational / Socratic Mentor response
        else:
            speech_text = f"I am Aurelius, your NISM financial literacy mentor. You asked: {message}. I can guide you through budgeting, compounding, debt traps, inflation, and fraud protection."
            markdown_reply = f"""### Aurelius Financial Guidance
You asked: **"{message}"**

As your NISM-certified financial co-pilot, here are 3 foundational pillars to explore:
1. **Budgeting & Cashflow (50/30/20):** Secure your savings rate first.
2. **Real Returns vs Inflation:** Understand why safe FDs need growth equity balance.
3. **Compound Wealth via SIP:** Start early to let the Rule of 72 work for you.

*Speak into the mic or click any quick prompt below to launch an interactive simulation!*"""
            suggested_prompts = ["Explain the 50/30/20 rule", "How does inflation eat my FD?", "Show me 30-year compounding", "How to spot Telegram scams?"]

        return {
            "coach": self.coach_name,
            "speech_text": speech_text,
            "markdown_reply": markdown_reply,
            "ui_action": ui_action,
            "lab_id": lab_id,
            "suggested_prompts": suggested_prompts
        }

ai_coach = AureliusAIEngine()
