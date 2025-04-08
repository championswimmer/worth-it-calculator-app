
import { Goal, GoalResult, IncomeDetails } from "@/types";

const INCOME_STORAGE_KEY = "worth-it-income";
const GOALS_STORAGE_KEY = "worth-it-goals";

export const saveIncomeToStorage = (income: IncomeDetails): void => {
  localStorage.setItem(INCOME_STORAGE_KEY, JSON.stringify(income));
};

export const getIncomeFromStorage = (): IncomeDetails | null => {
  const stored = localStorage.getItem(INCOME_STORAGE_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored) as IncomeDetails;
  } catch (error) {
    console.error("Failed to parse stored income data:", error);
    return null;
  }
};

export const saveGoalToStorage = (goal: GoalResult): void => {
  const goals = getGoalsFromStorage();
  goals.push(goal);
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
};

export const getGoalsFromStorage = (): GoalResult[] => {
  const stored = localStorage.getItem(GOALS_STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored) as GoalResult[];
  } catch (error) {
    console.error("Failed to parse stored goals data:", error);
    return [];
  }
};

export const clearAllData = (): void => {
  localStorage.removeItem(INCOME_STORAGE_KEY);
  localStorage.removeItem(GOALS_STORAGE_KEY);
};
