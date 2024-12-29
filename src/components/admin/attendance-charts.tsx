import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
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
              margin={{ top: 20, right: 20, left: -20, bottom: 20 }}
            >
              <XAxis 
                dataKey="month"
                angle={-90}
                textAnchor="end"
                height={40}
                interval={0}
                tick={{
                  fill: 'currentColor',
                  dy: 10,
                }}
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
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{
                  paddingTop: '10px',
                  marginTop: '10px'
                }}
              />
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