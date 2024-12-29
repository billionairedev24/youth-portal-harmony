import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceCharts } from "@/components/admin/attendance-charts";
import { useEventsStore } from "@/stores/events-store";
import { usePollsStore } from "@/stores/polls-store";
import { useMembersStore } from "@/stores/members-store";
import { useSuggestionsStore } from "@/stores/suggestions-store";

const AdminDashboard = () => {
  const { events } = useEventsStore();
  const { polls } = usePollsStore();
  const { members } = useMembersStore();
  const { suggestions } = useSuggestionsStore();

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{events.length}</p>
              <p className="text-sm text-muted-foreground">Total events</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Polls</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{polls.length}</p>
              <p className="text-sm text-muted-foreground">Total polls</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{members.length}</p>
              <p className="text-sm text-muted-foreground">Total members</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{suggestions.length}</p>
              <p className="text-sm text-muted-foreground">Total suggestions</p>
            </CardContent>
          </Card>
        </div>

        <AttendanceCharts />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;