import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

export function AttendanceCharts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Attendance Distribution</CardTitle>
      </CardHeader>
      <CardContent className="pl-0">
        <ChartContainer className="h-[400px] w-full" config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyAttendanceData}
              margin={{ top: 20, right: 20, left: -20, bottom: 5 }}
            >
              <XAxis 
                dataKey="month"
                tick={{ fill: 'currentColor' }}
                axisLine={{ stroke: 'currentColor' }}
              />
              <YAxis
                tick={{ fill: 'currentColor' }}
                axisLine={{ stroke: 'currentColor' }}
              />
              <Tooltip 
                content={<ChartTooltipContent />}
                cursor={false}
              />
              <Legend />
              <Bar
                dataKey="men"
                name="Men"
                fill="#FFB800"
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
              <Bar
                dataKey="women"
                name="Women"
                fill="#CC9900"
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}