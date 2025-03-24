
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function BudgetSummary({ 
  totalIncome, 
  totalExpenses,
  categoryBreakdown = []
}: BudgetSummaryProps) {
  const balance = totalIncome - totalExpenses;
  const hasDeficit = balance < 0;
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {hasDeficit ? "Deficit" : "Surplus"}
            </CardTitle>
            <DollarSign className={`h-4 w-4 ${balance >= 0 ? "text-green-600" : "text-red-600"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              balance >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              ${Math.abs(balance).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {categoryBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categoryBreakdown.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <span className="text-sm">{item.category}</span>
                  <span className={`text-sm font-medium ${
                    item.type === "income" ? "text-green-600" : "text-red-600"
                  }`}>
                    ${item.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
