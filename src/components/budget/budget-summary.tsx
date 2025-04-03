
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowDownIcon, ArrowUpIcon, DollarSign } from "lucide-react";

interface BudgetSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  categoryBreakdown?: Array<{
    category: string;
    amount: number;
    type: "income" | "expense";
  }>;
}

// Format number function to convert large numbers to K, M, B format
const formatCurrency = (value: number): string => {
  if (Math.abs(value) >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  } else if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  } else if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  } else {
    return `$${value.toFixed(2)}`;
  }
};

export function BudgetSummary({ 
  totalIncome, 
  totalExpenses,
  categoryBreakdown = []
}: BudgetSummaryProps) {
  const balance = totalIncome - totalExpenses;
  const hasDeficit = balance < 0;
  
  // Calculate percentage for progress bars
  const total = totalIncome + totalExpenses;
  const incomePercentage = total > 0 ? (totalIncome / total) * 100 : 0;
  const expensePercentage = total > 0 ? (totalExpenses / total) * 100 : 0;
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border-green-200 dark:border-green-800/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 truncate">
              {formatCurrency(totalIncome)}
            </div>
            <Progress
              value={incomePercentage}
              className="h-2 mt-2 bg-green-100 dark:bg-green-900/20"
            />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10 border-red-200 dark:border-red-800/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 truncate">
              {formatCurrency(totalExpenses)}
            </div>
            <Progress
              value={expensePercentage}
              className="h-2 mt-2 bg-red-100 dark:bg-red-900/20"
            />
          </CardContent>
        </Card>
        <Card className={`bg-gradient-to-br ${
          hasDeficit 
            ? "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10 border-red-200 dark:border-red-800/30" 
            : "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border-green-200 dark:border-green-800/30"
        }`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {hasDeficit ? "Deficit" : "Surplus"}
            </CardTitle>
            <DollarSign className={`h-4 w-4 ${balance >= 0 ? "text-green-600" : "text-red-600"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold truncate ${
              balance >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {formatCurrency(Math.abs(balance))}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {hasDeficit 
                ? "Expenses exceed income" 
                : "Income exceeds expenses"}
            </div>
          </CardContent>
        </Card>
      </div>

      {categoryBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryBreakdown.map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className={`text-sm font-medium ${
                      item.type === "income" ? "text-green-600" : "text-red-600"
                    }`}>
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                  <Progress 
                    value={total > 0 ? (item.amount / total) * 100 : 0}
                    className={`h-2 ${
                      item.type === "income" 
                        ? "bg-green-100 dark:bg-green-900/20" 
                        : "bg-red-100 dark:bg-red-900/20"
                    }`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
