
export type Currency = "USD" | "EUR" | "GBP" | "INR";

export interface IncomeDetails {
  monthlyIncome: number;
  currency: Currency;
  savingsPercentage: number;
  hoursPerDay: number;
  daysPerWeek: number;
}

export interface SavingsBreakdown {
  annual: number;
  monthly: number;
  weekly: number;
  daily: number;
  hourly: number;
}

export interface Goal {
  id: string;
  name: string;
  cost: number;
  type: "product" | "experience";
  years: number; // years of use (product) or years of memory (experience)
  impact: 1 | 2 | 3 | 4; // impact level
  timestamp: number; // when created
}

export interface GoalResult extends Goal {
  savingsTime: {
    hours: number;
    days: number;
    weeks: number;
    months: number;
    years: number;
  };
  expToCostRatio: number;
  goalScore: number;
  verdict: "worthless" | "whatever" | "worth" | "justdoit";
}
