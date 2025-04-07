
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEventsStore } from "@/stores/events-store";
import { AttendanceTooltip } from "./attendance-tooltip";
import { processAttendanceData } from "@/utils/attendance-utils";

export function AttendanceCharts() {
  const { events } = useEventsStore();
  const attendanceData = processAttendanceData(events);
  
  if (attendanceData.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-card/60">
        <CardTitle className="text-lg font-medium">Monthly Attendance Distribution</CardTitle>
      </CardHeader>
      <CardContent className="pl-2 pt-6">
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
                  dx: -8,
                  fontSize: 12
                }}
                axisLine={{ stroke: 'currentColor', strokeOpacity: 0.3 }}
              />
              <YAxis
                tick={{ fill: 'currentColor', fontSize: 12 }}
                axisLine={{ stroke: 'currentColor', strokeOpacity: 0.3 }}
                tickLine={{ stroke: 'currentColor', strokeOpacity: 0.3 }}
              />
              <Tooltip 
                content={<AttendanceTooltip />}
                cursor={{ fill: 'currentColor', fillOpacity: 0.1 }}
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
                fill="hsl(var(--gold-500))"
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
              <Bar
                dataKey="women"
                name="Women"
                fill="hsl(var(--gold-700))"
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
