import { IncomeForm } from "@/components/IncomeForm";
import { GoalForm } from "@/components/GoalForm";
import { ResultCard } from "@/components/ResultCard";
import { GoalHistory } from "@/components/GoalHistory";
import { Goal, GoalResult, IncomeDetails, SavingsBreakdown } from "@/types";
import { calculateGoalResult } from "@/utils/calculations";
import { getGoalsFromStorage, getIncomeFromStorage, saveGoalToStorage, saveIncomeToStorage } from "@/utils/localStorage";
import { trackGoalSaved, trackIncomeSaved } from "@/utils/analytics";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const Index = () => {
  const { toast } = useToast();
  const [stage, setStage] = useState<'income' | 'goal' | 'result'>('income');
  const [incomeDetails, setIncomeDetails] = useState<IncomeDetails | null>(null);
  const [savingsBreakdown, setSavingsBreakdown] = useState<SavingsBreakdown | null>(null);
  const [currentResult, setCurrentResult] = useState<GoalResult | null>(null);
  const [goalHistory, setGoalHistory] = useState<GoalResult[]>([]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Load saved data on component mount
  useEffect(() => {
    const savedIncome = getIncomeFromStorage();
    if (savedIncome) {
      setIncomeDetails(savedIncome);
    }
    
    const savedGoals = getGoalsFromStorage();
    setGoalHistory(savedGoals);
  }, []);
  
  const handleIncomeSubmit = (data: IncomeDetails, savings: SavingsBreakdown) => {
    setIncomeDetails(data);
    setSavingsBreakdown(savings);
    saveIncomeToStorage(data);
    
    // Track event: income details saved
    trackIncomeSaved(data);
    
    setStage('goal');
  };
  
  const handleGoalSubmit = (goal: Goal) => {
    if (!incomeDetails) {
      toast({
        title: "Error",
        description: "Income details are missing. Please go back and enter your income details.",
        variant: "destructive",
      });
      return;
    }
    
    const result = calculateGoalResult(goal, incomeDetails);
    setCurrentResult(result);
    
    // Add to history and save
    const updatedHistory = [result, ...goalHistory];
    setGoalHistory(updatedHistory);
    saveGoalToStorage(result);
    
    // Track event: goal saved
    trackGoalSaved(goal, incomeDetails.currency);
    
    setStage('result');
    setEditingGoal(null);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setStage('goal');
  };
  
  const handleReset = () => {
    setStage('goal');
    setEditingGoal(null);
  };
  
  const handleClearHistory = () => {
    setGoalHistory([]);
    localStorage.removeItem('worth-it-goals');
    
    toast({
      title: "History cleared",
      description: "Your goal history has been cleared.",
    });
  };
  
  return (
    <div className="min-h-screen py-10 px-4">
      <header className="text-center mb-10">
        <div className="absolute right-0 top-0 p-2">
          <ThemeToggle />
        </div>
        <h1 className="text-4xl font-bold text-primary">Worth It?</h1>
        <p className="text-muted-foreground mt-2">Determine if that purchase is really worth your hard-earned money</p>
      </header>
      
      <main className="max-w-4xl mx-auto">
        {stage === 'income' && (
          <IncomeForm 
            defaultValues={incomeDetails} 
            onSubmit={handleIncomeSubmit} 
          />
        )}
        
        {stage === 'goal' && incomeDetails && (
          <GoalForm 
            income={incomeDetails} 
            onSubmit={handleGoalSubmit} 
            editingGoal={editingGoal}
          />
        )}
        
        {stage === 'result' && currentResult && incomeDetails && (
          <>
            <ResultCard 
              result={currentResult} 
              currency={incomeDetails.currency}
              onReset={handleReset} 
            />
            
            <GoalHistory 
              goals={goalHistory}
              currency={incomeDetails.currency}
              onClearHistory={handleClearHistory}
              onEditGoal={handleEditGoal}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
