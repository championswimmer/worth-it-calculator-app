import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { Currency, IncomeDetails, SavingsBreakdown } from "@/types";
import { calculateSavings, currencySymbols, formatCurrency } from "@/utils/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Calculator } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface IncomeFormProps {
  defaultValues?: IncomeDetails | null;
  onSubmit: (data: IncomeDetails, savings: SavingsBreakdown) => void;
}

const incomeFormSchema = z.object({
  monthlyIncome: z.coerce.number().min(1, "Income must be greater than 0"),
  currency: z.enum(["USD", "EUR", "GBP", "INR"] as const),
  savingsPercentage: z.coerce.number().min(1, "Savings must be at least 1%").max(100, "Savings cannot exceed 100%"),
  hoursPerDay: z.coerce.number().min(1, "Must work at least 1 hour").max(24, "Cannot exceed 24 hours"),
  daysPerWeek: z.coerce.number().min(1, "Must work at least 1 day").max(7, "Cannot exceed 7 days"),
});

export function IncomeForm({ defaultValues, onSubmit }: IncomeFormProps) {
  const { toast } = useToast();
  
  const form = useForm<IncomeDetails>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: defaultValues || {
      monthlyIncome: 0,
      currency: "USD",
      savingsPercentage: 20,
      hoursPerDay: 8,
      daysPerWeek: 5,
    },
  });
  
  const watchedValues = form.watch();
  
  // Calculate savings based on current form values
  const savings = calculateSavings(watchedValues);
  
  // Format functions for the savings display
  const formatSavings = (amount: number) => formatCurrency(amount, watchedValues.currency);
  
  const handleSubmit = (data: IncomeDetails) => {
    const calculatedSavings = calculateSavings(data);
    onSubmit(data, calculatedSavings);
    
    toast({
      title: "Income details saved",
      description: "Your income details have been saved successfully.",
    });
  };
  
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);
  
  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" /> 
          Income Details
        </CardTitle>
        <CardDescription>
          Enter your income details to calculate how much you save over time.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormLabel>Currency</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(Object.keys(currencySymbols) as Currency[]).map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency} {currencySymbols[currency]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="monthlyIncome"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Monthly Income</FormLabel>
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
            </div>
            
            <FormField
              control={form.control}
              name="savingsPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Savings Percentage: {field.value}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={100}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hoursPerDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours/Day: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={24}
                        step={0.5}
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
                name="daysPerWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days/Week: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={7}
                        step={0.5}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {watchedValues.monthlyIncome > 0 && (
              <div className="bg-muted p-3 rounded-lg">
                <h3 className="font-medium text-sm mb-2">Your Savings</h3>
                <div className="text-sm grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-muted-foreground">Yearly:</div>
                    <div className="font-medium">{formatSavings(savings.annual)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Monthly:</div>
                    <div className="font-medium">{formatSavings(savings.monthly)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Weekly:</div>
                    <div className="font-medium">{formatSavings(savings.weekly)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Daily:</div>
                    <div className="font-medium">{formatSavings(savings.daily)}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-muted-foreground">Hourly:</div>
                    <div className="font-medium">{formatSavings(savings.hourly)}</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button type="submit">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
