"""
Interactive Financial Math & Simulation Engine for FinQuest Labs
"""
from typing import Dict, List, Any
import math

class FinancialLabEngine:
    @staticmethod
    def calculate_budget(monthly_salary: float, custom_needs: float = None, custom_wants: float = None, custom_invest: float = None) -> Dict[str, Any]:
        """Calculates 50/30/20 breakdown and health status."""
        ideal_needs = monthly_salary * 0.50
        ideal_wants = monthly_salary * 0.30
        ideal_invest = monthly_salary * 0.20
        
        actual_needs = custom_needs if custom_needs is not None else ideal_needs
        actual_wants = custom_wants if custom_wants is not None else ideal_wants
        actual_invest = custom_invest if custom_invest is not None else ideal_invest
        
        total_expense = actual_needs + actual_wants
        savings_rate = (actual_invest / monthly_salary * 100) if monthly_salary > 0 else 0
        
        # Financial health rating
        if savings_rate >= 30:
            status = "EXCELLENT"
            grade = "A+"
            feedback = "Superb wealth-building velocity! Over 30% savings rate accelerates your financial independence by years."
        elif savings_rate >= 20:
            status = "HEALTHY"
            grade = "A"
            feedback = "Right on track with the golden 50/30/20 rule. Solid financial discipline."
        elif savings_rate >= 10:
            status = "MODERATE"
            grade = "B"
            feedback = "Acceptable, but lifestyle wants or heavy fixed needs are slowing your wealth compounding."
        else:
            status = "VULNERABLE"
            grade = "C"
            feedback = "Caution: Under 10% investment rate leaves you vulnerable to emergency shocks and inflation drag."
            
        return {
            "monthly_salary": monthly_salary,
            "ideal": {"needs": ideal_needs, "wants": ideal_wants, "invest": ideal_invest},
            "actual": {"needs": actual_needs, "wants": actual_wants, "invest": actual_invest},
            "savings_rate_pct": round(savings_rate, 1),
            "status": status,
            "grade": grade,
            "feedback": feedback,
            "emergency_fund_target_6m": actual_needs * 6
        }

    @staticmethod
    def calculate_real_return(nominal_rate: float, tax_slab_pct: float, inflation_rate: float) -> Dict[str, Any]:
        """Calculates the true real return of fixed deposits after tax and inflation."""
        tax_drag = nominal_rate * (tax_slab_pct / 100.0)
        post_tax_nominal = nominal_rate - tax_drag
        real_return_pct = post_tax_nominal - inflation_rate
        
        # 10-year purchasing power impact on ₹1,00,000
        initial_corpus = 100000.0
        nominal_future_val = initial_corpus * ((1 + nominal_rate / 100.0) ** 10)
        post_tax_future_val = initial_corpus * ((1 + post_tax_nominal / 100.0) ** 10)
        real_purchasing_power_10y = initial_corpus * ((1 + real_return_pct / 100.0) ** 10)
        
        verdict = "WEALTH DESTROYER" if real_return_pct < 0 else "WEALTH PRESERVER" if real_return_pct < 4 else "WEALTH CREATOR"
        
        return {
            "nominal_rate_pct": nominal_rate,
            "tax_slab_pct": tax_slab_pct,
            "tax_drag_pct": round(tax_drag, 2),
            "post_tax_nominal_pct": round(post_tax_nominal, 2),
            "inflation_rate_pct": inflation_rate,
            "real_return_pct": round(real_return_pct, 2),
            "verdict": verdict,
            "10_year_projection": {
                "initial_corpus": initial_corpus,
                "nominal_future_val": round(nominal_future_val),
                "post_tax_future_val": round(post_tax_future_val),
                "real_purchasing_power": round(real_purchasing_power_10y),
                "net_loss_gain_real": round(real_purchasing_power_10y - initial_corpus)
            }
        }

    @staticmethod
    def calculate_sip_compounding(monthly_sip: float, expected_cagr_pct: float, tenure_years: int, delay_years: int = 5) -> Dict[str, Any]:
        """Simulates SIP growth over time and quantifies the cost of delaying."""
        monthly_rate = (expected_cagr_pct / 100.0) / 12.0
        total_months = tenure_years * 12
        
        # Normal SIP Future Value formula: P * [( (1+i)^n - 1 ) / i] * (1+i)
        if monthly_rate > 0:
            future_value = monthly_sip * (((1 + monthly_rate) ** total_months - 1) / monthly_rate) * (1 + monthly_rate)
        else:
            future_value = monthly_sip * total_months
            
        total_invested = monthly_sip * total_months
        wealth_gain = future_value - total_invested
        
        # Delayed Start comparison
        delayed_months = max(1, (tenure_years - delay_years) * 12)
        delayed_invested = monthly_sip * delayed_months
        if monthly_rate > 0:
            delayed_fv = monthly_sip * (((1 + monthly_rate) ** delayed_months - 1) / monthly_rate) * (1 + monthly_rate)
        else:
            delayed_fv = monthly_sip * delayed_months
            
        cost_of_delay = future_value - delayed_fv
        
        # Year-by-year curve for charts
        yearly_curve = []
        for yr in range(1, tenure_years + 1):
            m = yr * 12
            fv = monthly_sip * (((1 + monthly_rate) ** m - 1) / monthly_rate) * (1 + monthly_rate)
            inv = monthly_sip * m
            yearly_curve.append({
                "year": yr,
                "invested": round(inv),
                "future_value": round(fv),
                "returns": round(fv - inv)
            })
            
        return {
            "monthly_sip": monthly_sip,
            "cagr_pct": expected_cagr_pct,
            "tenure_years": tenure_years,
            "total_invested": round(total_invested),
            "future_value": round(future_value),
            "wealth_gain": round(wealth_gain),
            "cost_of_delay": round(cost_of_delay),
            "delay_years": delay_years,
            "delayed_future_value": round(delayed_fv),
            "yearly_curve": yearly_curve
        }

    @staticmethod
    def calculate_credit_card_trap(total_balance: float, interest_rate_apr: float = 42.0, min_payment_pct: float = 5.0, fixed_monthly_pay: float = 0) -> Dict[str, Any]:
        """Calculates time and interest to pay off debt paying minimum vs fixed amount."""
        monthly_rate = (interest_rate_apr / 100.0) / 12.0
        
        # Scenario A: Minimum due only
        balance_a = total_balance
        months_a = 0
        total_interest_a = 0
        while balance_a > 100 and months_a < 360: # cap at 30 years
            months_a += 1
            interest = balance_a * monthly_rate
            total_interest_a += interest
            min_pay = max(500.0, balance_a * (min_payment_pct / 100.0))
            if min_pay <= interest:
                min_pay = interest + 100.0
            balance_a = max(0.0, balance_a + interest - min_pay)
            
        # Scenario B: Fixed accelerated payment (e.g. ₹5,000 or 15%)
        fixed_pay = fixed_monthly_pay if fixed_monthly_pay > 0 else max(2000.0, total_balance * 0.15)
        balance_b = total_balance
        months_b = 0
        total_interest_b = 0
        while balance_b > 10 and months_b < 360:
            months_b += 1
            interest = balance_b * monthly_rate
            total_interest_b += interest
            balance_b = max(0.0, balance_b + interest - fixed_pay)
            
        return {
            "total_debt": total_balance,
            "apr_pct": interest_rate_apr,
            "minimum_due_route": {
                "years_to_clear": round(months_a / 12.0, 1),
                "total_months": months_a,
                "total_interest_paid": round(total_interest_a),
                "total_cash_outflow": round(total_balance + total_interest_a),
                "penalty_factor": round((total_interest_a / total_balance) * 100, 1)
            },
            "accelerated_route": {
                "monthly_payment": round(fixed_pay),
                "years_to_clear": round(months_b / 12.0, 1),
                "total_months": months_b,
                "total_interest_paid": round(total_interest_b),
                "total_cash_outflow": round(total_balance + total_interest_b),
                "interest_saved": round(total_interest_a - total_interest_b)
            }
        }

lab_engine = FinancialLabEngine()
