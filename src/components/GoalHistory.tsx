import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Currency, GoalResult } from "@/types";
import { formatCurrency, getVerdictDetails } from "@/utils/calculations";
import { Trash, Edit } from "lucide-react";
import {useTheme} from "next-themes";

interface GoalHistoryProps {
  goals: GoalResult[];
  currency: Currency;
  onClearHistory: () => void;
  onEditGoal: (goal: GoalResult) => void;
}

export function GoalHistory({ goals, currency, onClearHistory, onEditGoal }: GoalHistoryProps) {
  const { theme } = useTheme();

  if (goals.length === 0) {
    return null;
  }
  
  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Goal History</CardTitle>
        <Button variant="outline" size="sm" onClick={onClearHistory}>
          <Trash className="h-4 w-4 mr-2" /> Clear History
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="text-right">Verdict</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals.map((goal) => {
              const verdictDetails = getVerdictDetails(goal.verdict);
              
              return (
                <TableRow key={goal.id}>
                  <TableCell className="font-medium">{goal.name}</TableCell>
                  <TableCell>{goal.type === "product" ? "Product" : "Experience"}</TableCell>
                  <TableCell>{formatCurrency(goal.cost, currency)}</TableCell>
                  <TableCell>{Math.round(goal.goalScore)}/100</TableCell>
                  <TableCell className="text-right">
                    <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `rgba(var(--${verdictDetails.color}-${theme === 'dark' ? 'dark' : 'light'}-rgb), 0.2)`,
                          color: `rgb(var(--${verdictDetails.color}-${theme === 'dark' ? 'dark' : 'light'}-rgb))`
                        }}
                    >
                      {verdictDetails.emoji} {verdictDetails.title}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => onEditGoal(goal)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
