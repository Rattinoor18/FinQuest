"""
Coach Aurelius - Aurelius Intelligence Financial Voice & Literacy Mentor Engine
"""
import os
import re
from typing import Dict, List, Any, Optional
from models import BehavioralRiskAssessment, PortfolioSummary
from curriculum import NISM_MODULES
from calculators import lab_engine

class AureliusAIEngine:
    def __init__(self):
        self.coach_name = "Coach Aurelius"
        self.brand_name = "Aurelius Intelligence"
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.client = None
        if self.api_key:
            self.set_api_key(self.api_key)

    def set_api_key(self, api_key: str) -> bool:
        """Sets or updates the Gemini API key at runtime."""
        self.api_key = api_key.strip()
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                for model_name in ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-flash-latest", "gemini-pro-latest", "gemini-2.5-pro"]:
                    try:
                        self.client = genai.GenerativeModel(model_name)
                        return True
                    except Exception:
                        continue
                self.client = None
                return False
            except Exception as e:
                print("Error initializing Gemini API:", e)
                self.client = None
                return False
        self.client = None
        return False

    def is_financial_query(self, query: str) -> bool:
        """
        Allows Aurelius Intelligence to operate as a full general-purpose AI model like Gemini/ChatGPT.
        """
        return True

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
        Processes query under Coach Aurelius branding with financial domain scoping and context awareness.
        """
        msg_lower = message.lower().strip()

        ui_action = "NONE"
        lab_id = None

        # Try real Gemini LLM API if key is set
        if self.client:
            try:
                system_prompt = f"""You are Coach Aurelius (powered by Aurelius Intelligence), an expert AI Co-Pilot and Master Educator.
You provide clear, highly structured, in-depth, and comprehensive markdown answers to ANY question asked by the user.
Guidelines:
1. Provide rich, thorough explanations with examples, key takeaways, and bullet points.
2. Incorporate user context if available: {context}
3. Maintain a warm, encouraging, authoritative persona.
4. Format output in beautifully structured Markdown with headers and emojis."""
                prompt = f"{system_prompt}\n\nUser Question: {message}"
                response = self.client.generate_content(prompt)
                if response and response.text:
                    # Clean markdown string for speech synthesis
                    clean_speech = re.sub(r'[*#_`~\[\]]', '', response.text).strip()
                    speech_snippet = clean_speech[:200] + "..." if len(clean_speech) > 200 else clean_speech
                    return {
                        "coach": self.coach_name,
                        "speech_text": speech_snippet,
                        "markdown_reply": response.text,
                        "ui_action": "NONE",
                        "lab_id": None,
                        "suggested_prompts": ["Tell me more", "Give a practical example", "How do I implement this?"]
                    }
            except Exception as e:
                print("Gemini API execution error:", e)

        # Fallback structured NISM mentor responses
        if any(k in msg_lower for k in ["budget", "50/30/20", "50 30 20", "salary", "expense"]):
            ui_action = "OPEN_LAB"
            lab_id = "budgeting"
            speech_text = "Opening the 50/30/20 Budgeting Lab. 50% for Needs, 30% for Wants, and invest 20% on the day your salary arrives."
            markdown_reply = """### Coach Aurelius on 50/30/20 Budgeting (NISM Module 2)
The gold standard framework for cashflow management:
- **50% Needs:** Rent, groceries, electricity, essential EMIs & health insurance.
- **30% Wants:** Dining out, entertainment, gadgets, weekend trips.
- **20% Wealth Building:** Emergency fund accumulation & automated Index SIPs.

*💡 Golden Rule: Automate your 20% investment on Salary Day before spending on lifestyle.*"""
            suggested_prompts = ["What if my rent is 40% of salary?", "How much emergency fund do I need?", "Explain Rule of 72"]

        elif any(k in msg_lower for k in ["fd", "fixed deposit", "inflation", "real return"]):
            ui_action = "OPEN_LAB"
            lab_id = "real_return"
            speech_text = "Opening the Real Return Lab. A 7% FD gives only 4.9% post-tax in 30% bracket. Against 6% inflation, real wealth shrinks by 1.1% per year."
            markdown_reply = """### Coach Aurelius on Real Returns & Inflation (NISM Module 2)
Fixed Deposits offer capital safety but lose purchasing power against inflation:
- **Nominal FD Interest:** `+7.0%`
- **Post-Tax Return (30% Slab):** `+4.9%`
- **Annual Inflation Rate:** `-6.0%`
- **Real Net Growth:** `🔴 -1.1% per year!`

*💡 Strategy: Use FDs for 0-3 year liquid safety; use Equities for >5 year compounding.*"""
            suggested_prompts = ["How does SIP beat inflation?", "What is Rule of 72?", "Is PPF tax free?"]

        elif any(k in msg_lower for k in ["sip", "compound", "rule of 72", "mutual fund"]):
            ui_action = "OPEN_LAB"
            lab_id = "sip_compounding"
            speech_text = "Opening the 30-Year Compounding Sandbox. Starting early in your twenties is the single biggest wealth multiplier."
            markdown_reply = """### Coach Aurelius on Compounding & Rule of 72 (NISM Module 3)
- **Rule of 72:** Divide 72 by expected return rate to find double-time:
  - At **12% CAGR (Nifty 50):** Capital doubles every **6 Years**.
- **The Cost of Delay:** Starting ₹5,000/mo at age 20 gives ₹5.94 Crores vs ₹1.76 Crores at age 30!

*💡 Strategy: Always select 'Direct Plan - Growth' options to avoid distributor commission drag.*"""
            suggested_prompts = ["Direct vs Regular funds?", "What is Nifty 50?", "Explain debt snowball"]

        elif any(k in msg_lower for k in ["debt", "credit card", "loan", "emi"]):
            ui_action = "OPEN_LAB"
            lab_id = "debt_trap"
            speech_text = "Opening the Debt Trap Lab. Credit cards charge up to 42% APR. Paying minimum due keeps you trapped for over 15 years."
            markdown_reply = """### Coach Aurelius on Debt Discipline (NISM Module 2)
- **Revolving Credit Card Rate:** 3.5% monthly = **42% to 48% APR**.
- **Minimum Due Trap:** Paying only 5% minimum due leaves 95% compounding against you.
- **Rule:** Always pay 100% of Total Amount Due before the statement due date."""
            suggested_prompts = ["How to improve CIBIL score?", "Explain 50/30/20 rule", "How to build emergency fund?"]

        elif any(k in msg_lower for k in ["scam", "fraud", "telegram", "whatsapp", "upi"]):
            ui_action = "OPEN_LAB"
            lab_id = "scam_radar"
            speech_text = "Opening the Scam Immunity Radar. Remember: You NEVER enter your UPI PIN to receive money, and SEBI registered advisors never guarantee returns."
            markdown_reply = """### Coach Aurelius on Scam Immunity (NISM Module 5)
1. **Never enter UPI PIN to receive money.**
2. **Beware of 'Guaranteed' return promises.**
3. **Avoid VIP Telegram option call channels.**
4. **Report cyber fraud immediately at 1930.**"""
            suggested_prompts = ["How to verify SEBI registration?", "What is RBI Ombudsman?", "Explain term insurance"]

        elif any(k in msg_lower for k in ["hello", "hi", "hey", "namaste", "greetings", "good morning", "good evening", "who are you"]):
            speech_text = "Hello! I am Coach Aurelius, your AI co-pilot powered by Aurelius Intelligence. How can I assist you today?"
            markdown_reply = """### 👋 Hello! I am Coach Aurelius
I am your **AI Co-Pilot** powered by **Aurelius Intelligence**. 

I can assist you with:
- **Interactive Financial Simulations & Sandboxes**
- **NISM Curriculum & Compounding Math**
- **Live Paper Trading & Portfolio Analysis**
- **Any General Knowledge, Science, Math, or Life Questions**

*Ask me anything or select a prompt below to get started!*"""
            suggested_prompts = ["Explain the 50/30/20 rule", "How does inflation affect my FD?", "How to start paper trading?"]

        else:
            speech_text = f"Coach Aurelius here. Regarding {message}: I can guide you through budgeting, real returns, paper trading, and NISM modules."
            markdown_reply = f"""### Coach Aurelius Financial Guidance
You asked: **"{message}"**

As your financial co-pilot on **Aurelius Intelligence**, here are 3 key pillars to explore:
1. **50/30/20 Budgeting:** Build a solid savings velocity.
2. **Real Returns:** Balance fixed deposits with inflation-beating equity index funds.
3. **Paper Trading Sandbox:** Test order execution with ₹10,00,000 virtual cash.

*Click any prompt below to trigger interactive simulations!*"""
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
