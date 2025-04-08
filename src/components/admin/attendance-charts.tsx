
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEventsStore } from "@/stores/events-store";
import { AttendanceTooltip } from "./attendance-tooltip";
import { processAttendanceData } from "@/utils/attendance-utils";
import { useEffect, useState } from "react";

export function AttendanceCharts() {
  const { events, fetchEvents } = useEventsStore();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log("AttendanceCharts: Fetching events");
    fetchEvents().finally(() => {
      setIsLoading(false);
      console.log("AttendanceCharts: Events fetched");
    });
  }, [fetchEvents]);
  
  const attendanceData = processAttendanceData(events);
  
  console.log("AttendanceCharts: Data length", attendanceData.length);
  console.log("AttendanceCharts: Events length", events.length);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Data</CardTitle>
          <CardDescription>Loading attendance data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (attendanceData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Data</CardTitle>
          <CardDescription>No attendance data is available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden card-hover">
      <CardHeader>
        <CardTitle>Monthly Attendance Distribution</CardTitle>
        <CardDescription>Male and female attendance over the past year</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={attendanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <XAxis 
                dataKey="month"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{
                  fill: 'currentColor',
                  opacity: 0.8,
                  dy: 10,
                  dx: -8,
                  fontSize: 12
                }}
                axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'currentColor', opacity: 0.8, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                content={<AttendanceTooltip />}
                cursor={{ fill: 'currentColor', fillOpacity: 0.05 }}
              />
              <Legend 
                verticalAlign="top"
                align="right"
                wrapperStyle={{
                  paddingBottom: '20px'
                }}
              />
              <Bar
                dataKey="men"
                name="Men"
                fill="hsl(210, 90%, 65%)"
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
              <Bar
                dataKey="women"
                name="Women"
                fill="hsl(340, 82%, 66%)"
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
