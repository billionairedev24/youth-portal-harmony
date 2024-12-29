import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BudgetSummaryProps {
  totalIncome: number;
  totalExpenses: number;
}

export function BudgetSummary({ totalIncome, totalExpenses }: BudgetSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Income</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">
            ${totalIncome.toFixed(2)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600">
            ${totalExpenses.toFixed(2)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold ${
              totalIncome - totalExpenses >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            ${(totalIncome - totalExpenses).toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}