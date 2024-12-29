import { Users } from "lucide-react";

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function AttendanceTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

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