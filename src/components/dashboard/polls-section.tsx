import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPolls } from "@/components/user-polls";

export function PollsSection() {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-gold-50/50 to-gold-100/30 border-gold-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-gold-900">Active Polls</CardTitle>
      </CardHeader>
      <CardContent>
        <UserPolls />
      </CardContent>
    </Card>
  );
}