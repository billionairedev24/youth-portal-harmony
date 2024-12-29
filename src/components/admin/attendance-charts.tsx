import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";
import { format, subMonths } from "date-fns";

const generateLastTwelveMonthsData = () => {
  const data = [];
  const currentDate = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = subMonths(currentDate, i);
    // Generate some random data for demonstration
    const men = Math.floor(Math.random() * 30) + 15;
    const women = Math.floor(Math.random() * 30) + 15;
    
    data.push({
      date,
      month: format(date, 'MMM yyyy'),
      total: men + women,
      men,
      women,
    });
  }

  return data;
};

export function AttendanceCharts() {
  const monthlyAttendanceData = generateLastTwelveMonthsData();

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
              margin={{ top: 20, right: 20, left: -20, bottom: 100 }}
            >
              <XAxis 
                dataKey="month"
                tick={{ fill: 'currentColor', transform: 'rotate(-90)' }}
                height={80}
                axisLine={{ stroke: 'currentColor' }}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fill: 'currentColor' }}
                axisLine={{ stroke: 'currentColor' }}
              />
              <Tooltip 
                content={<ChartTooltipContent />}
                cursor={false}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{
                  paddingTop: '20px',
                  marginTop: '20px'
                }}
              />
              <Bar
                dataKey="men"
                name="Men"
                fill="#FFB800"
                radius={[4, 4, 0, 0]}
                stackId="a"
              >
                <LabelList dataKey="men" position="center" fill="white" />
              </Bar>
              <Bar
                dataKey="women"
                name="Women"
                fill="#CC9900"
                radius={[4, 4, 0, 0]}
                stackId="a"
              >
                <LabelList dataKey="women" position="center" fill="white" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}