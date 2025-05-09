
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Currency, GoalResult } from "@/types";
import { formatCurrency, formatTime, getVerdictDetails } from "@/utils/calculations";
import { ArrowLeft, Twitter } from "lucide-react";
import { useRef } from "react";
import { useTheme } from "next-themes";

interface ResultCardProps {
  result: GoalResult;
  currency: Currency;
  onReset: () => void;
}

export function ResultCard({ result, currency, onReset }: ResultCardProps) {
  const verdictDetails = getVerdictDetails(result.verdict);
  const cardRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  // Mapping verdict colors to appropriate text colors
  const textColorMap = {
    'worth/justdoit': 'text-indigo-900',
    'worth/worth': 'text-green-900',
    'worth/whatever': 'text-yellow-900',
    'worth/worthless': 'text-red-900'
  };

  const headerTextColor = textColorMap[`worth/${result.verdict}`] || 'text-gray-900';
  
  const handleShareToTwitter = async () => {
    const shareText = `I just checked if spending ${formatCurrency(result.cost, currency)} of my savings for ${result.name} is worth it, and got a verdict of ${verdictDetails.emoji} ${verdictDetails.title} with score ${Math.round(result.goalScore)}/100! Check your score at https://worthit.arnav.tech/ - @championswimmer`;
    
    // Open Twitter share URL in a new window
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };
  
  return (
    <Card ref={cardRef} className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader className="rounded-t-lg" style={{
        backgroundColor: `rgba(var(--${verdictDetails.color}-${theme === 'dark' ? 'dark' : 'light'}-rgb), 0.2)`
      }}>
        <CardTitle className="text-center text-2xl flex flex-col items-center" style={{
          color: `rgb(var(--${verdictDetails.color}-${theme === 'dark' ? 'dark' : 'light'}-rgb))`
        }}>
          <span className="text-5xl mb-2">{verdictDetails.emoji}</span>
          <span>{verdictDetails.title}</span>
        </CardTitle>
        <CardDescription className="text-center" style={{
          color: `rgba(var(--${verdictDetails.color}-${theme === 'dark' ? 'dark' : 'light'}-rgb), 0.8)`
        }}>
          {verdictDetails.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">{result.name}</h3>
          <p className="text-muted-foreground">
            {result.type === "product" ? "Product" : "Experience"} • {formatCurrency(result.cost, currency)}
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Goal Score</span>
            <span className="font-medium">{Math.round(result.goalScore)}/100</span>
          </div>
          <Progress value={result.goalScore} className="h-2" />
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Time to save for this goal</h4>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
            <div>
              <span className="text-muted-foreground">Hours:</span>{" "}
              <span className="font-medium">{formatTime(result.savingsTime.hours, "hour")}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Days:</span>{" "}
              <span className="font-medium">{formatTime(result.savingsTime.days, "day")}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Weeks:</span>{" "}
              <span className="font-medium">{formatTime(result.savingsTime.weeks, "week")}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Months:</span>{" "}
              <span className="font-medium">{formatTime(result.savingsTime.months, "month")}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Years:</span>{" "}
              <span className="font-medium">{formatTime(result.savingsTime.years, "year")}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">
              {result.type === "product" ? "Years of use" : "Years of memory"}
            </div>
            <div className="font-medium">{formatTime(result.years, "year")}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Impact Level</div>
            <div className="font-medium">{result.impact}/5</div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          onClick={handleShareToTwitter} 
          variant="default" 
          className="w-full bg-[#1DA1F2] hover:bg-[#1a94df]"
        >
          <Twitter className="mr-2 h-4 w-4" /> Share on Twitter
        </Button>
        <Button onClick={onReset} variant="outline" className="w-full">
          <ArrowLeft className="mr-2 h-4 w-4" /> Calculate Another Goal
        </Button>
      </CardFooter>
    </Card>
  );
}
