import { Card, CardContent } from "@repo/ui/card";
import type { Stat } from "../utils";

export function StatCard({ stat }: { stat: Stat }) {
  return (
    <Card className="border-0 bg-card">
      <CardContent className="p-4 text-center">
        <strong className="block text-2xl text-primary">{stat.value}</strong>
        <small className="text-[9px] text-muted-foreground">{stat.label}</small>
      </CardContent>
    </Card>
  );
}
