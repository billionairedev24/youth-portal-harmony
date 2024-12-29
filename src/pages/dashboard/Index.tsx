import { UserLayout } from "@/components/user-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockEvents, mockPolls } from "@/lib/utils";

const UserDashboard = () => {
  return (
    <UserLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEvents.map((event) => (
                  <div key={event.id} className="space-y-2">
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                    <p className="text-sm">{event.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Polls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPolls.map((poll) => (
                  <div key={poll.id} className="space-y-2">
                    <h3 className="font-semibold">{poll.question}</h3>
                    <div className="space-y-2">
                      {poll.options.map((option, index) => (
                        <div
                          key={option}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">{option}</span>
                          <span className="text-sm text-muted-foreground">
                            {poll.votes[index]} votes
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
}

export default UserDashboard;