
import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, PieChart as PieChartIcon, BarChart } from "lucide-react";
import { BudgetCategory, BudgetEntryType } from "@/types/budget";
import { useBudgetStore } from "@/stores/budget-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Map category values to display names
const categoryDisplayNames: Record<BudgetCategory, string> = {
  salary: "Salary",
  donation: "Donation",
  investment: "Investment",
  other_income: "Other Income",
  ministry: "Ministry",
  utilities: "Utilities",
  maintenance: "Maintenance",
  supplies: "Supplies",
  events: "Events",
  staff: "Staff",
  missions: "Missions",
  other_expense: "Other Expense",
};

// Colors for the chart segments
const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9966FF", 
  "#FF66B2", "#66CCFF", "#FF6666", "#66FF66", "#FFD700", 
  "#FF1493", "#32CD32"
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
    const relevantCategories = Object.entries(categoryDisplayNames)
      .filter(([key]) => {
        if (activeTab === "expense") {
          return key.includes("expense") || 
            ["ministry", "utilities", "maintenance", "supplies", "events", "staff", "missions"].includes(key);
        } else {
          return key.includes("income") || 
            ["salary", "donation", "investment"].includes(key);
        }
      })
      .map(([key, value]): [BudgetCategory, string] => [key as BudgetCategory, value]);

    return relevantCategories
      .map(([category, displayName]): ChartData => ({
        name: displayName,
        value: getTotalByCategory(category),
        category: category,
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [entries, getTotalByCategory, activeTab]);

  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string, color: string }> = {};
    chartData.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: COLORS[index % COLORS.length]
      };
    });
    return config;
  }, [chartData]);

  // If there's no data, show an empty state
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-muted-foreground" />
            Budget Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-60 text-muted-foreground">
          No {activeTab === "expense" ? "expense" : "income"} data available to display
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-muted-foreground" />
          Budget Visualization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="expense" 
          onValueChange={(value) => setActiveTab(value as "expense" | "income")}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense">Expenses</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
          </TabsList>
          
          <TabsContent value="expense" className="space-y-4">
            <ChartContainer 
              config={chartConfig} 
              className="aspect-square sm:aspect-video h-80 mx-auto"
            >
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
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      formatter={(value: number, name: string) => [
                        `$${value.toFixed(2)}`,
                        name
                      ]}
                    />
                  } 
                />
                <Legend 
                  content={<ChartLegendContent />}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ChartContainer>
          </TabsContent>
          
          <TabsContent value="income" className="space-y-4">
            <ChartContainer 
              config={chartConfig} 
              className="aspect-square sm:aspect-video h-80 mx-auto"
            >
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
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      formatter={(value: number, name: string) => [
                        `$${value.toFixed(2)}`,
                        name
                      ]}
                    />
                  } 
                />
                <Legend 
                  content={<ChartLegendContent />}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
