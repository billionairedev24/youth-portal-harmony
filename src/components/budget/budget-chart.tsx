
import { useEffect, useMemo, useState } from "react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon, 
  ChartPie, 
  ZoomIn 
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface BarChartData {
  name: string;
  income: number;
  expense: number;
}

export function BudgetChart() {
  const { entries, getTotalByCategory } = useBudgetStore();
  const [activeTab, setActiveTab] = useState<"expense" | "income" | "comparison">("expense");
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [timeFilter, setTimeFilter] = useState<"all" | "month" | "quarter" | "year">("all");
  
  // Filter entries by time if needed
  const filteredEntries = useMemo(() => {
    if (timeFilter === "all") return entries;
    
    const now = new Date();
    const filterDate = new Date();
    
    if (timeFilter === "month") {
      filterDate.setMonth(now.getMonth() - 1);
    } else if (timeFilter === "quarter") {
      filterDate.setMonth(now.getMonth() - 3);
    } else if (timeFilter === "year") {
      filterDate.setFullYear(now.getFullYear() - 1);
    }
    
    return entries.filter(entry => new Date(entry.date) >= filterDate);
  }, [entries, timeFilter]);

  // Calculate category data for the chart
  const chartData = useMemo(() => {
    const relevantCategories = Object.entries(categoryDisplayNames)
      .filter(([key]) => {
        if (activeTab === "expense") {
          return key.includes("expense") || 
            ["ministry", "utilities", "maintenance", "supplies", "events", "staff", "missions"].includes(key);
        } else if (activeTab === "income") {
          return key.includes("income") || 
            ["salary", "donation", "investment"].includes(key);
        }
        return true; // For comparison view, include all
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
  }, [filteredEntries, getTotalByCategory, activeTab]);

  // Create bar chart data for comparison view
  const barChartData = useMemo(() => {
    if (activeTab !== "comparison") return [];
    
    const incomeCategories = ["salary", "donation", "investment", "other_income"];
    const expenseCategories = ["ministry", "utilities", "maintenance", "supplies", "events", "staff", "missions", "other_expense"];
    
    // Get top 5 income categories by value
    const topIncomeCategories = incomeCategories
      .map(cat => ({
        category: cat as BudgetCategory,
        value: getTotalByCategory(cat as BudgetCategory)
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map(item => item.category);
    
    // Get top 5 expense categories by value
    const topExpenseCategories = expenseCategories
      .map(cat => ({
        category: cat as BudgetCategory,
        value: getTotalByCategory(cat as BudgetCategory)
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map(item => item.category);
    
    // Combine unique categories
    const uniqueCategories = [...new Set([...topIncomeCategories, ...topExpenseCategories])];
    
    // Create bar chart data
    return uniqueCategories.map(category => ({
      name: categoryDisplayNames[category],
      income: incomeCategories.includes(category) ? getTotalByCategory(category) : 0,
      expense: expenseCategories.includes(category) ? getTotalByCategory(category) : 0,
    }));
  }, [filteredEntries, getTotalByCategory, activeTab]);

  // Config for regular chart
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

  // Config for bar chart
  const barChartConfig = useMemo(() => {
    return {
      income: { label: "Income", color: "#4CAF50" },
      expense: { label: "Expense", color: "#F44336" }
    };
  }, []);

  // If there's no data, show an empty state
  if ((activeTab !== "comparison" && chartData.length === 0) || 
      (activeTab === "comparison" && barChartData.length === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-muted-foreground" />
            Budget Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-60 text-muted-foreground">
          No {activeTab === "expense" ? "expense" : activeTab === "income" ? "income" : "comparison"} data available to display
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            {chartType === "pie" ? 
              <PieChartIcon className="h-5 w-5 text-muted-foreground" /> : 
              <BarChartIcon className="h-5 w-5 text-muted-foreground" />
            }
            Budget Visualization
          </CardTitle>
          <CardDescription>
            Financial breakdown by category
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value as any)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="quarter">Past Quarter</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <ZoomIn className="mr-2 h-4 w-4" />
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full">
              <DialogHeader>
                <DialogTitle>Detailed Budget Analysis</DialogTitle>
              </DialogHeader>
              <div className="h-[500px]">
                {activeTab === "comparison" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80} 
                        interval={0}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`$${parseFloat(value.toString()).toFixed(2)}`, null]} 
                      />
                      <Legend />
                      <Bar dataKey="income" name="Income" fill="#4CAF50" />
                      <Bar dataKey="expense" name="Expense" fill="#F44336" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={180}
                        label={({ name, value, percent }) => 
                          `${name}: $${value.toFixed(2)} (${(percent * 100).toFixed(0)}%)`
                        }
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toFixed(2)}`, null]} 
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-end">
          <div className="flex items-center space-x-2">
            <Button 
              variant={chartType === "pie" ? "default" : "outline"} 
              size="sm"
              onClick={() => setChartType("pie")}
            >
              <ChartPie className="h-4 w-4 mr-2" />
              Pie
            </Button>
            <Button 
              variant={chartType === "bar" ? "default" : "outline"} 
              size="sm"
              onClick={() => setChartType("bar")}
            >
              <BarChartIcon className="h-4 w-4 mr-2" />
              Bar
            </Button>
          </div>
        </div>

        <Tabs 
          defaultValue="expense" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "expense" | "income" | "comparison")}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="expense">Expenses</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="expense" className="space-y-4">
            {chartType === "pie" ? (
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
                  <ChartLegend 
                    content={<ChartLegendContent />}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <ChartContainer 
                config={chartConfig} 
                className="aspect-square sm:aspect-video h-80 mx-auto"
              >
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                  />
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
                  <Bar dataKey="value" fill="#8884d8">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </TabsContent>
          
          <TabsContent value="income" className="space-y-4">
            {chartType === "pie" ? (
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
                  <ChartLegend 
                    content={<ChartLegendContent />}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <ChartContainer 
                config={chartConfig} 
                className="aspect-square sm:aspect-video h-80 mx-auto"
              >
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                  />
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
                  <Bar dataKey="value" fill="#4CAF50">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-4">
            <ChartContainer 
              config={barChartConfig} 
              className="aspect-square sm:aspect-video h-80 mx-auto"
            >
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                />
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
                <Bar dataKey="income" name="Income" fill="#4CAF50" />
                <Bar dataKey="expense" name="Expense" fill="#F44336" />
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
