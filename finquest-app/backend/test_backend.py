import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from simulation import market_engine
from portfolio import portfolio_engine
from ai_coach import ai_coach
from models import OrderRequest

quotes = market_engine.get_all_quotes()
print('Initial Quotes Loaded:', len(quotes))
order = OrderRequest(symbol='RELIANCE', side='BUY', order_type='MARKET', quantity=5)
result = portfolio_engine.execute_order(order)
print('Order Execution Result:', result['status'], result['message'])
summary = portfolio_engine.get_summary()
print('Portfolio Summary: Cash:', summary.cash_balance, 'Invested:', summary.invested_amount, 'FHS:', summary.financial_health_score)
coach_assessment = ai_coach.assess_behavior(summary)
print('AI Coach Assessment Score:', coach_assessment.score, 'Risk Level:', coach_assessment.risk_level)
print('Coach Feedback:', coach_assessment.coach_feedback)
