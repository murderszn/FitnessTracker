import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WorkoutEntry from "@/components/WorkoutEntry";
import ExerciseTotals from "@/components/ExerciseTotals";
import WorkoutRecommendations from "@/components/WorkoutRecommendations";
import { Skeleton } from "@/components/ui/skeleton";
import type { MuscleGroup } from "@shared/schema";

export default function Dashboard() {
  const { data: muscleGroups, isLoading } = useQuery<MuscleGroup[]>({ 
    queryKey: ["/api/muscle-groups"]
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Fitness Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Log Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkoutEntry />
          </CardContent>
        </Card>

        {muscleGroups && <WorkoutRecommendations muscleGroups={muscleGroups} />}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))
        ) : (
          muscleGroups?.map((group) => (
            <ExerciseTotals 
              key={group.id} 
              muscleGroupId={group.id}
              muscleGroups={muscleGroups}
            />
          ))
        )}
      </div>
    </div>
  );
}