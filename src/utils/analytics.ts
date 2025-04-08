
import posthog from 'posthog-js';
import { Currency, Goal, IncomeDetails } from '@/types';

// Initialize PostHog
export const initPostHog = () => {
  // Replace with your actual PostHog API key
  const POSTHOG_API_KEY = 'phc_your_api_key'; // You should replace this with your actual API key
  const POSTHOG_HOST = 'https://app.posthog.com'; // or your self-hosted instance URL
  
  posthog.init(POSTHOG_API_KEY, {
    api_host: POSTHOG_HOST,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        // In development, let's make debugging easier
        posthog.opt_in_capturing();
        posthog.debug();
      }
    },
  });
};

// Track income details saved
export const trackIncomeSaved = (incomeDetails: IncomeDetails) => {
  posthog.capture('income_details_saved', {
    monthly_income: incomeDetails.monthlyIncome,
    currency: incomeDetails.currency,
    savings_percentage: incomeDetails.savingsPercentage,
    hours_per_day: incomeDetails.hoursPerDay,
    days_per_week: incomeDetails.daysPerWeek,
  });
};

// Track goal saved
export const trackGoalSaved = (goal: Goal, currency: Currency) => {
  posthog.capture('goal_saved', {
    goal_id: goal.id,
    goal_name: goal.name,
    goal_cost: goal.cost,
    goal_type: goal.type,
    goal_years: goal.years,
    goal_impact: goal.impact,
    currency: currency,
  });
};
