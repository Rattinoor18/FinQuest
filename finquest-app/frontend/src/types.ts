export type PageRoute = 'home' | 'courses' | 'labs' | 'voice-ai' | 'trading' | 'certifications';

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  content: string;
  key_takeaways: string[];
  lab_id?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface NISMModule {
  id: string;
  number: number;
  title: string;
  tagline: string;
  icon: string;
  color: string;
  estimated_mins: number;
  lessons: Lesson[];
  quiz: QuizQuestion[];
}

export interface VoiceResponse {
  coach: string;
  speech_text: string;
  markdown_reply: string;
  ui_action: string;
  lab_id?: string;
  suggested_prompts: string[];
}

export type LabType = 'budgeting' | 'real_return' | 'sip_compounding' | 'debt_trap' | 'scam_radar' | 'insurance_matrix';

export interface Position {
  symbol: string;
  name: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  invested_value: number;
  current_value: number;
  unrealized_pnl: number;
  unrealized_pnl_pct: number;
}

export interface PortfolioSummary {
  initial_capital: number;
  cash_balance: number;
  invested_amount: number;
  total_portfolio_value: number;
  total_unrealized_pnl: number;
  total_unrealized_pnl_pct: number;
  total_realized_pnl: number;
  positions: Position[];
  trades_count: number;
  financial_health_score: number;
  asset_allocation: Record<string, number>;
}

export interface StockQuote {
  symbol: string;
  name: string;
  category: string;
  price: number;
  change: number;
  change_pct: number;
  open: number;
  high: number;
  low: number;
  prev_close: number;
  volume: number;
  pe_ratio?: number;
  market_cap_cr?: number;
  history?: Array<{ time: string; price: number }>;
}
