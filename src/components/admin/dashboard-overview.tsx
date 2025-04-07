
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { useEventsStore } from "@/stores/events-store";
import { Calendar, Users, Megaphone, Vote } from "lucide-react";
import { format, parseISO, isFuture, isToday, subDays } from "date-fns";

export function DashboardOverview() {
  const { events } = useEventsStore();
  
  const stats = useMemo(() => {
    const today = new Date();
    const upcomingEvents = events.filter(e => isFuture(parseISO(e.date)) || isToday(parseISO(e.date)));
    const recentEvents = events.filter(e => {
      const eventDate = parseISO(e.date);
      return !isFuture(eventDate) && !isToday(eventDate) && eventDate > subDays(today, 30);
    });
    
    const eventTypes = events.reduce((acc, event) => {
      const type = event.eventType || "REGULAR";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate total attendance
    const totalAttendance = events.reduce((sum, event) => {
      if (event.attendance) {
        return sum + event.attendance.men + event.attendance.women;
      }
      return sum;
    }, 0);
    
    return {
      upcomingEvents: upcomingEvents.length,
      recentEvents: recentEvents.length,
      totalEvents: events.length,
      eventTypes,
      totalAttendance
    };
  }, [events]);
  
  // Create data for the event trend chart
  const trendData = useMemo(() => {
    const last6Months: {name: string, events: number}[] = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = format(month, 'MMM');
      const monthEvents = events.filter(e => {
        const eventDate = parseISO(e.date);
        return eventDate.getMonth() === month.getMonth() && 
               eventDate.getFullYear() === month.getFullYear();
      }).length;
      
      last6Months.push({
        name: monthName,
        events: monthEvents
      });
    }
    
    return last6Months;
  }, [events]);
  
  // Create data for the event types pie chart
  const pieData = useMemo(() => {
    return Object.entries(stats.eventTypes).map(([name, value]) => ({
      name,
      value
    }));
  }, [stats.eventTypes]);
  
  const COLORS = ["#3E85F3", "#30B1D9", "#8884d8", "#82ca9d"];
  
  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Overview</CardTitle>
          <CardDescription>Loading event data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Cards */}
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
              <h3 className="text-2xl font-bold mt-1">{stats.upcomingEvents}</h3>
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recent Events</p>
              <h3 className="text-2xl font-bold mt-1">{stats.recentEvents}</h3>
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <Megaphone className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Attendance</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalAttendance}</h3>
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Event Types</p>
              <h3 className="text-2xl font-bold mt-1">{Object.keys(stats.eventTypes).length}</h3>
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <Vote className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Trend Chart */}
        <Card className="lg:col-span-2 card-hover">
          <CardHeader>
            <CardTitle>Event Activity</CardTitle>
            <CardDescription>Number of events per month</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="currentColor"
                  strokeOpacity={0.5}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="currentColor" 
                  strokeOpacity={0.5}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"
                  }}
                  itemStyle={{
                    color: "hsl(var(--card-foreground))"
                  }}
                  labelStyle={{
                    color: "hsl(var(--card-foreground))",
                    fontWeight: "bold"
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="events" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorEvents)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Event Types Pie Chart */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Event Breakdown</CardTitle>
            <CardDescription>Distribution by type</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} events`, 'Count']}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  itemStyle={{
                    color: "hsl(var(--card-foreground))"
                  }}
                />
                <Legend 
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{
                    paddingTop: "10px",
                    color: "hsl(var(--card-foreground))"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
