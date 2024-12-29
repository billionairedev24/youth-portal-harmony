import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

const monthlyAttendanceData = [
  { month: "Jan", total: 45, men: 20, women: 25 },
  { month: "Feb", total: 52, men: 24, women: 28 },
  { month: "Mar", total: 48, men: 22, women: 26 },
  { month: "Apr", total: 55, men: 25, women: 30 },
  { month: "May", total: 50, men: 23, women: 27 },
  { month: "Jun", total: 58, men: 28, women: 30 },
  { month: "Jul", total: 53, men: 25, women: 28 },
  { month: "Aug", total: 60, men: 28, women: 32 },
  { month: "Sep", total: 56, men: 26, women: 30 },
  { month: "Oct", total: 54, men: 25, women: 29 },
  { month: "Nov", total: 52, men: 24, women: 28 },
  { month: "Dec", total: 50, men: 23, women: 27 },
];

const genderDistributionData = [
  { name: "Men", value: 293, color: "#9b87f5" },
  { name: "Women", value: 340, color: "#7E69AB" },
];

export function AttendanceCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[300px]" config={{}}>
            <BarChart data={monthlyAttendanceData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="men" name="Men" fill="#9b87f5" />
              <Bar dataKey="women" name="Women" fill="#7E69AB" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[300px]" config={{}}>
            <PieChart>
              <Pie
                data={genderDistributionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                label
              >
                {genderDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}