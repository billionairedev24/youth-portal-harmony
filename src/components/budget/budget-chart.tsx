
import { useMemo, useState } from "react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon,
  DollarSign
} from "lucide-react";
import { BudgetCategory, BudgetEntryType } from "@/types/budget";
import { useBudgetStore } from "@/stores/budget-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Map category values to display names
const categoryDisplayNames: Record<BudgetCategory, string> = {
  donation: "Donation",
  grant: "Grant",
  indoor: "Indoor",
  outdoor: "Outdoor",
};

// Colors for the chart segments - updated with more vibrant colors
const COLORS = [
  "hsl(var(--gold-400))", 
  "hsl(var(--gold-600))", 
  "hsl(var(--primary))", 
  "hsl(var(--accent))",
  "hsl(var(--gold-500))", 
  "hsl(var(--gold-700))", 
  "hsl(var(--gold-800))",
  "hsl(var(--destructive))",
  "hsl(var(--muted-foreground))",
  "hsl(var(--accent-foreground))"
];

interface ChartData {
  name: string;
  value: number;
  category: string;
}

export function BudgetChart() {
  const { entries, getTotalByCategory } = useBudgetStore();
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  
  // Calculate category data for the chart
  const chartData = useMemo(() => {
    const categories = Object.entries(categoryDisplayNames)
      .filter(([category]) => {
        if (activeTab === "expense") {
          return category !== "donation" && category !== "grant";
        } else {
          return category === "donation" || category === "grant";
        }
      })
      .map(([key, value]): [BudgetCategory, string] => [key as BudgetCategory, value]);

    const data = categories
      .map(([category, displayName]): ChartData => ({
        name: displayName,
        value: getTotalByCategory(category),
        category,
      }))
      .filter(item => item.value > 0);
    
    return data;
  }, [entries, getTotalByCategory, activeTab]);

  // Calculate total for percentage
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  // If there's no data, show an empty state
  if (chartData.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-card/60">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <PieChartIcon className="h-5 w-5 text-muted-foreground" />
            Budget Visualization
          </CardTitle>
          <CardDescription>
            Financial breakdown by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="expense" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "expense" | "income")}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expense">Expenses</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
            </TabsList>
            
            <div className="flex justify-center items-center h-60 text-muted-foreground">
              No {activeTab} data available to display
            </div>
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-card/60">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <PieChartIcon className="h-5 w-5 text-muted-foreground" />
          Budget Visualization
        </CardTitle>
        <CardDescription>
          Financial breakdown by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="expense" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "expense" | "income")}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense">Expenses</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
          </TabsList>
          
          <div className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${parseFloat(value.toString()).toFixed(2)}`, null]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Category breakdown with progress bars */}
            <div className="space-y-4 mt-4">
              {chartData.map((item, index) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-muted-foreground">${item.value.toFixed(2)} ({((item.value / totalValue) * 100).toFixed(0)}%)</span>
                  </div>
                  <Progress value={(item.value / totalValue) * 100} className="h-2" 
                    style={{ backgroundColor: 'rgba(var(--foreground), 0.1)' }}>
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        backgroundColor: COLORS[index % COLORS.length],
                        width: `${(item.value / totalValue) * 100}%`,
                      }} 
                    />
                  </Progress>
                </div>
              ))}
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
