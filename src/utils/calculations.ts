
import { Currency, Goal, GoalResult, IncomeDetails, SavingsBreakdown } from "@/types";

export const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹"
};

export const calculateSavings = (income: IncomeDetails): SavingsBreakdown => {
  // Calculate monthly savings
  const monthlySavings = income.monthlyIncome * (income.savingsPercentage / 100);

  // Calculate annual savings
  const annualSavings = monthlySavings * 12;

  // Calculate weekly savings
  const weeklySavings = annualSavings / 52;

  // Calculate daily savings
  const dailySavings = weeklySavings / income.daysPerWeek;

  // Calculate hourly savings
  const hourlySavings = dailySavings / income.hoursPerDay;

  return {
    annual: annualSavings,
    monthly: monthlySavings,
    weekly: weeklySavings,
    daily: dailySavings,
    hourly: hourlySavings
  };
};

export const calculateGoalResult = (
  goal: Goal,
  income: IncomeDetails
): GoalResult => {
  const savings = calculateSavings(income);

  // Calculate time needed to save for this goal
  const savingsTime = {
    hours: goal.cost / savings.hourly,
    days: goal.cost / savings.daily,
    weeks: goal.cost / savings.weekly,
    months: goal.cost / savings.monthly,
    years: goal.cost / savings.annual
  };

  // =SQRT(((O2*365*24*2)/L2) * O2 * POW(P2, 2.2)) * 0.75
  // O2 = goal.years
  // L2 = savingsTime.days
  // P2 = goal.impact

  // Calculate goal score
  let goalScore = Math.sqrt(((goal.years * 365 * 24 * 2) / savingsTime.hours) * goal.years * Math.pow(goal.impact, 2.2)) * 0.75;

  // Limit the score to 100
  goalScore = Math.min(100, goalScore);

  // Determine verdict
  let verdict: "worthless" | "whatever" | "worth" | "justdoit";
  if (goalScore < 50) {
    verdict = "worthless";
  } else if (goalScore < 75) {
    verdict = "whatever";
  } else if (goalScore < 95) {
    verdict = "worth";
  } else {
    verdict = "justdoit";
  }

  return {
    ...goal,
    savingsTime,
    goalScore,
    verdict
  };
};

export const formatCurrency = (value: number, currency: Currency): string => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatTime = (value: number, unit: string): string => {
  // Round to 1 decimal place
  const roundedValue = Math.round(value * 10) / 10;
  return `${roundedValue} ${unit}${roundedValue === 1 ? "" : "s"}`;
};

export const getVerdictDetails = (verdict: "worthless" | "whatever" | "worth" | "justdoit") => {
  const details = {
    worthless: {
      emoji: "😞",
      title: "Worthless",
      description: "This doesn't seem like a good use of your money.",
      color: verdict
    },
    whatever: {
      emoji: "😶",
      title: "Whatever",
      description: "It's not terrible, but you could find better ways to spend your money.",
      color: verdict
    },
    worth: {
      emoji: "😁",
      title: "Worth it",
      description: "This is a good investment of your money!",
      color: verdict
    },
    justdoit: {
      emoji: "😱",
      title: "Just do it!",
      description: "This is an amazing value. Don't hesitate!",
      color: verdict
    }
  };

  return details[verdict];
};
