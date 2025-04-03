import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AttendanceCharts } from "@/components/admin/attendance-charts";
import { useEventsStore } from "@/stores/events-store";
import { usePollsStore } from "@/stores/polls-store";
import { useMembersStore } from "@/stores/members-store";
import { useSuggestionsStore } from "@/stores/suggestions-store";
import { BudgetSummary } from "@/components/budget/budget-summary";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Calendar,
  DollarSign,
  Image,
  Megaphone,
  MessageSquare,
  PieChart,
  TrendingUp,
  Users,
  Vote
} from "lucide-react";
import { useBudgetStore } from "@/stores/budget-store";
import { BudgetEntryType } from "@/types/budget";
import { useAnnouncementsStore } from "@/stores/announcements-store";

const formatCurrency = (value: number): string => {
  if (Math.abs(value) >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  } else if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  } else if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  } else {
    return `$${value.toFixed(2)}`;
  }
};

const AdminDashboard = () => {
  const { events } = useEventsStore();
  const { polls } = usePollsStore();
  const { members } = useMembersStore();
  const { suggestions } = useSuggestionsStore();
  const { announcements } = useAnnouncementsStore();
  const { entries } = useBudgetStore();
  const navigate = useNavigate();

  const incomeEntries = entries.filter(entry => entry.type === "income");
  const expenseEntries = entries.filter(entry => entry.type === "expense");
  
  const totalIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenses = expenseEntries.reduce((sum, entry) => sum + entry.amount, 0);

  const categoryBreakdown = Object.entries(
    entries.reduce((acc, entry) => {
      const category = entry.category;
      if (!acc[category]) {
        acc[category] = {
          category,
          amount: 0,
          type: entry.type
        };
      }
      acc[category].amount += entry.amount;
      return acc;
    }, {} as Record<string, { category: string; amount: number; type: BudgetEntryType }>)
  ).map(([_, value]) => value);

  const upcomingEvents = events.filter(event => 
    new Date(event.date) > new Date()).length;
  
  const activePolls = polls.filter(poll => 
    poll.status === "active").length;

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome to your church management dashboard</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/members")}>
              <Users className="mr-2 h-4 w-4" />
              Manage Members
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/members")}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Communication Center
            </Button>
            <Button size="sm" onClick={() => navigate("/admin/events")}>
              <Calendar className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <Card className="bg-gradient-to-br from-gold-50 to-gold-100 dark:from-gold-900/40 dark:to-gold-800/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Members</CardTitle>
              <Users className="h-4 w-4 text-gold-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{members.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total registered members
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 w-full justify-start px-0 text-xs"
                onClick={() => navigate("/admin/members")}
              >
                View all members →
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-gold-50 to-gold-100 dark:from-gold-900/40 dark:to-gold-800/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-gold-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{events.length}</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-muted-foreground">
                  {upcomingEvents} upcoming
                </span>
                {upcomingEvents > 0 && (
                  <span className="ml-2 rounded-full bg-green-500 h-2 w-2" />
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 w-full justify-start px-0 text-xs"
                onClick={() => navigate("/admin/events")}
              >
                Manage events →
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-gold-50 to-gold-100 dark:from-gold-900/40 dark:to-gold-800/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Polls</CardTitle>
              <Vote className="h-4 w-4 text-gold-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{polls.length}</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-muted-foreground">
                  {activePolls} active now
                </span>
                {activePolls > 0 && (
                  <span className="ml-2 rounded-full bg-green-500 h-2 w-2" />
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 w-full justify-start px-0 text-xs"
                onClick={() => navigate("/admin/polls")}
              >
                View all polls →
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-gold-50 to-gold-100 dark:from-gold-900/40 dark:to-gold-800/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Announcements</CardTitle>
              <Megaphone className="h-4 w-4 text-gold-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{announcements.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total announcements
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 w-full justify-start px-0 text-xs"
                onClick={() => navigate("/admin/announcements")}
              >
                Manage announcements →
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>
                Overview of income, expenses, and budget balance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetSummary 
                totalIncome={totalIncome} 
                totalExpenses={totalExpenses}
                categoryBreakdown={categoryBreakdown.slice(0, 5)}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4 w-full"
                onClick={() => navigate("/admin/budget")}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Manage Budget
              </Button>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your church activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => navigate("/admin/events")}
                >
                  <Calendar className="h-6 w-6 text-gold-600" />
                  <span>Manage Events</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => navigate("/admin/members")}
                >
                  <MessageSquare className="h-6 w-6 text-gold-600" />
                  <span>Communication Center</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => navigate("/admin/budget")}
                >
                  <DollarSign className="h-6 w-6 text-gold-600" />
                  <span>Update Budget</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => navigate("/admin/photos")}
                >
                  <Image className="h-6 w-6 text-gold-600" />
                  <span>Upload Photos</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-2">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendance" className="p-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-gold-600" />
                  Attendance Trends
                </CardTitle>
                <CardDescription>Weekly attendance statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceCharts />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="suggestions" className="p-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-gold-600" />
                  Recent Suggestions
                </CardTitle>
                <CardDescription>Latest feedback from members</CardDescription>
              </CardHeader>
              <CardContent>
                {suggestions.length > 0 ? (
                  <div className="space-y-4">
                    {suggestions.slice(0, 3).map((suggestion) => (
                      <div key={suggestion.id} className="border rounded-md p-4 bg-muted/30">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{suggestion.title}</h4>
                          <span className="text-xs text-muted-foreground">
                            {new Date(suggestion.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm mt-1 text-muted-foreground line-clamp-2">
                          {suggestion.description}
                        </p>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate("/admin/suggestions")}
                    >
                      View All Suggestions
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground text-center">No suggestions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="p-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-gold-600" />
                  Church Activity Overview
                </CardTitle>
                <CardDescription>Summary of church activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                  <div className="border rounded-md p-4 text-center bg-muted/30">
                    <p className="text-sm font-medium mb-1">Total Events</p>
                    <p className="text-2xl font-bold text-gold-600">{events.length}</p>
                  </div>
                  <div className="border rounded-md p-4 text-center bg-muted/30">
                    <p className="text-sm font-medium mb-1">Members</p>
                    <p className="text-2xl font-bold text-gold-600">{members.length}</p>
                  </div>
                  <div className="border rounded-md p-4 text-center bg-muted/30">
                    <p className="text-sm font-medium mb-1">Announcements</p>
                    <p className="text-2xl font-bold text-gold-600">{announcements.length}</p>
                  </div>
                  <div className="border rounded-md p-4 text-center bg-muted/30">
                    <p className="text-sm font-medium mb-1">Suggestions</p>
                    <p className="text-2xl font-bold text-gold-600">{suggestions.length}</p>
                  </div>
                  <div className="border rounded-md p-4 text-center bg-muted/30">
                    <p className="text-sm font-medium mb-1">Budget</p>
                    <p className="text-2xl font-bold text-gold-600">{formatCurrency(totalIncome - totalExpenses)}</p>
                  </div>
                  <div className="border rounded-md p-4 text-center bg-muted/30">
                    <p className="text-sm font-medium mb-1">Photos</p>
                    <p className="text-2xl font-bold text-gold-600">--</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
