import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";
import { Users } from "lucide-react";
import { useEventsStore } from "@/stores/events-store";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 p-4 border rounded-lg shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b">
          <Users className="h-4 w-4 text-muted-foreground" />
          <p className="font-semibold">{label}</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Men</span>
            <span className="text-sm font-medium">{payload[0].value}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Women</span>
            <span className="text-sm font-medium">{payload[1].value}</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Total</span>
            <span className="text-sm font-bold">{payload[0].value + payload[1].value}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function AttendanceCharts() {
  const { events } = useEventsStore();

  const attendanceData = events
    .filter(event => event.attendance)
    .map(event => ({
      date: parseISO(event.date),
      month: format(parseISO(event.date), 'MMM yyyy'),
      men: event.attendance?.men || 0,
      women: event.attendance?.women || 0,
      total: (event.attendance?.men || 0) + (event.attendance?.women || 0),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Attendance Distribution</CardTitle>
      </CardHeader>
      <CardContent className="pl-4">
        <ChartContainer className="h-[400px] w-full" config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={attendanceData}
              margin={{ top: 40, right: 20, left: 20, bottom: 60 }}
            >
              <XAxis 
                dataKey="month"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{
                  fill: 'currentColor',
                  dy: 10,
                  dx: -8
                }}
                axisLine={{ stroke: 'currentColor' }}
              />
              <YAxis
                tick={{ fill: 'currentColor' }}
                axisLine={{ stroke: 'currentColor' }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={false}
              />
              <Legend 
                verticalAlign="top"
                align="right"
                height={36}
                wrapperStyle={{
                  paddingBottom: '20px'
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