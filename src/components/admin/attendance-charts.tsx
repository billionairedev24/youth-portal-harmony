import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

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
  { name: "Men", value: 293, color: "#FFB800" },
  { name: "Women", value: 340, color: "#CC9900" },
];

export function AttendanceCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Monthly Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[400px]" config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyAttendanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
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
                  cursor={{ fill: 'rgba(255, 184, 0, 0.1)' }}
                />
                <Legend />
                <Bar
                  dataKey="men"
                  name="Men"
                  fill="#FFB800"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="women"
                  name="Women"
                  fill="#CC9900"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[400px]" config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderDistributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {genderDistributionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}