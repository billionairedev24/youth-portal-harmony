
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEventsStore } from "@/stores/events-store";
import { useMembersStore } from "@/stores/members-store";
import { usePollsStore } from "@/stores/polls-store";
import { useBudgetStore } from "@/stores/budget-store";
import { RecordAttendanceDialog } from "@/components/admin/record-attendance-dialog";
import { AttendanceCharts } from "@/components/admin/attendance-charts";
import { useState, useEffect } from "react";
import { Calendar, Clock, DollarSign, MessageSquare, Users } from "lucide-react";
import { parseISO, format, subMonths } from "date-fns";
import { MonthlyBirthdays } from "@/components/birthdays/monthly-birthdays";

const AdminDashboard = () => {
  const { events, recordAttendance } = useEventsStore();
  const { members } = useMembersStore();
  const { polls } = usePollsStore();
  const { entries } = useBudgetStore();
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Activity data
  const generateActivityData = () => {
    const now = new Date();
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      const month = subMonths(now, i);
      const monthStr = format(month, "MMM");
      
      // Filter events in this month
      const monthEvents = events.filter(event => {
        const eventDate = parseISO(event.date);
        return format(eventDate, "MMM") === monthStr;
      }).length;
      
      // Filter polls created in this month (simulated)
      const monthPolls = Math.floor(Math.random() * 5);
      
      // Engagement rate (simulated)
      const engagementRate = Math.floor(55 + Math.random() * 30);
      
      data.push({
        month: monthStr,
        events: monthEvents,
        polls: monthPolls,
        engagement: engagementRate,
      });
    }
    
    return data;
  };
  
  const activityData = generateActivityData();
  
  const incomingEvents = events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
  
  const handleRecordAttendance = (eventId) => {
    setSelectedEventId(eventId);
    setSelectedEvent(events.find(event => event.id === eventId));
    setShowAttendanceDialog(true);
  };

  const handleSaveAttendance = async (eventId, menCount, womenCount) => {
    try {
      await recordAttendance(eventId, menCount, womenCount);
      setShowAttendanceDialog(false);
    } catch (error) {
      console.error("Failed to record attendance:", error);
    }
  };
  
  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        </div>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Members
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{members.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +{Math.floor(Math.random() * 10)} from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Upcoming Events
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{incomingEvents.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Next: {incomingEvents[0]?.title || "None scheduled"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Polls
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {polls.filter(poll => poll.status === "active").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {polls.filter(poll => poll.status === "closed").length} closed polls
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Budget</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${entries.reduce((sum, entry) => sum + (entry.type === "income" ? entry.amount : -entry.amount), 0).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {entries.filter(entry => entry.type === "income").reduce((sum, entry) => sum + entry.amount, 0).toFixed(2)} income
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Activity Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="events" fill="#f59e0b" name="Events" />
                      <Bar yAxisId="left" dataKey="polls" fill="#3b82f6" name="Polls" />
                      <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#10b981" name="Engagement %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Monthly Birthdays</CardTitle>
                  <CardDescription>Members celebrating this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthlyBirthdays />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    Click on an event to record attendance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {incomingEvents.length > 0 ? (
                    <div className="space-y-2">
                      {incomingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                          onClick={() => handleRecordAttendance(event.id)}
                        >
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(parseISO(event.date), "MMMM d, yyyy")}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{event.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No upcoming events scheduled
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Attendance Summary</CardTitle>
                  <CardDescription>
                    Past event attendance overview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AttendanceCharts />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Advanced Analytics Coming Soon</CardTitle>
                <CardDescription>
                  We're working on more detailed analytics for your community.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  This feature is under development.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Reports Module Coming Soon</CardTitle>
                <CardDescription>
                  Generate custom reports about your community activities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  This feature is under development.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {selectedEvent && (
        <RecordAttendanceDialog
          open={showAttendanceDialog}
          onOpenChange={setShowAttendanceDialog}
          event={selectedEvent}
          onSave={handleSaveAttendance}
          isLoading={false}
        />
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
