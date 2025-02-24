import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WorkoutEntry from "@/components/WorkoutEntry";
import ProgressChart from "@/components/ProgressChart";
import { Skeleton } from "@/components/ui/skeleton";
import type { Workout } from "@shared/schema";

export default function Dashboard() {
  const { data: workouts, isLoading } = useQuery<Workout[]>({ 
    queryKey: ["/api/workouts"]
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Fitness Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Workout Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkoutEntry />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ProgressChart workouts={workouts || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
