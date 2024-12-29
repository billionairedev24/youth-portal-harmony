import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockEvents, mockMembers, mockPolls } from "@/lib/utils";
import { AttendanceCharts } from "@/components/admin/attendance-charts";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{mockEvents.length}</p>
              <p className="text-sm text-muted-foreground">Total events</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Polls</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{mockPolls.length}</p>
              <p className="text-sm text-muted-foreground">Total polls</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{mockMembers.length}</p>
              <p className="text-sm text-muted-foreground">Total members</p>
            </CardContent>
          </Card>
        </div>

        <AttendanceCharts />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;