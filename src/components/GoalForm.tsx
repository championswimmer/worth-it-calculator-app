import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Currency, Goal, IncomeDetails } from "@/types";
import { currencySymbols } from "@/utils/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Target } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface GoalFormProps {
  income: IncomeDetails;
  onSubmit: (goal: Goal) => void;
  editingGoal?: Goal | null;
}

const goalFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  cost: z.coerce.number().min(1, "Cost must be greater than 0"),
  type: z.enum(["product", "experience"]),
  years: z.coerce.number().min(1, "Must be at least 1 year"),
  impact: z.coerce.number().min(1).max(5, "Impact must be between 1 and 5"),
});

export function GoalForm({ income, onSubmit, editingGoal }: GoalFormProps) {
  const [selectedType, setSelectedType] = useState<"product" | "experience">(
    editingGoal?.type || "product"
  );

  const form = useForm<z.infer<typeof goalFormSchema>>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: editingGoal?.name || "",
      cost: editingGoal?.cost || 0,
      type: editingGoal?.type || "product",
      years: editingGoal?.years || 5,
      impact: editingGoal?.impact || 2,
    },
  });

  const handleSubmit = (data: z.infer<typeof goalFormSchema>) => {
    const goal: Goal = {
      id: editingGoal?.id || crypto.randomUUID(),
      name: data.name,
      cost: data.cost,
      type: data.type,
      years: data.years,
      impact: data.impact as 1 | 2 | 3 | 4 | 5,
      timestamp: editingGoal?.timestamp || Date.now(),
    };

    onSubmit(goal);
  };

  const handleTypeChange = (value: "product" | "experience") => {
    setSelectedType(value);
    form.setValue("years", value === "product" ? 5 : 20);
    form.setValue("impact", 2);
  };

  const impactOptions =
    selectedType === "product"
      ? [
          { value: 1, label: "Don't need it" },
          { value: 2, label: "Nice to have" },
          { value: 3, label: "Really want it" },
          { value: 4, label: "Dying for it" },
          { value: 5, label: "Life changing" },
        ]
      : [
          { value: 1, label: "Like any other day" },
          { value: 2, label: "Think of it fondly" },
          { value: 3, label: "Enjoy it a lot" },
          { value: 4, label: "Cherished memory" },
          { value: 5, label: "Once in a lifetime" },
        ];

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {editingGoal ? "Update" : "Set"} Your Goal
        </CardTitle>
        <CardDescription>
          Define what you want to save for and how much it means to you.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., New iPhone, Bali Vacation"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost ({currencySymbols[income.currency]})</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Type of Goal</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleTypeChange(value as "product" | "experience");
                      }}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 [&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="product" className="sr-only" />
                          </FormControl>
                          <div className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer w-full">
                            <span className="text-center font-medium">Product</span>
                          </div>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 [&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="experience" className="sr-only" />
                          </FormControl>
                          <div className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer w-full">
                            <span className="text-center font-medium">Experience</span>
                          </div>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="years"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {selectedType === "product"
                      ? `How many years will this last: ${field.value}`
                      : `How long will you remember this: ${field.value} years`}
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={50}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="impact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {selectedType === "product"
                      ? "How much do you want it"
                      : "How much will you love the experience"}
                  </FormLabel>
                  <div className="grid grid-cols-5 gap-2">
                    {impactOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`p-2 rounded-md border ${field.value === option.value ? 'border-primary bg-primary/10' : 'border-muted'}`}
                        onClick={() => field.onChange(option.value)}
                      >
                        <div className="font-bold text-center">{option.value}</div>
                        <div className="text-xs text-center">{option.label}</div>
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">
                {editingGoal ? "Update" : "Calculate"} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
