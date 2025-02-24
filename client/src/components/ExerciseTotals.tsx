import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import type { Exercise, MuscleGroup } from "@shared/schema";

interface ExerciseTotalsProps {
  muscleGroupId: number;
  muscleGroups: MuscleGroup[];
}

export default function ExerciseTotals({ muscleGroupId, muscleGroups }: ExerciseTotalsProps) {
  const { data: exercises } = useQuery<Exercise[]>({ 
    queryKey: [`/api/exercises/muscle-group/${muscleGroupId}`]
  });

  const muscleGroup = muscleGroups.find(g => g.id === muscleGroupId);
  
  const totalSets = exercises?.reduce((sum, ex) => sum + ex.sets, 0) || 0;
  const totalReps = exercises?.reduce((sum, ex) => sum + (ex.sets * ex.reps), 0) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{muscleGroup?.name || 'Unknown'} Totals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Total Sets: {totalSets}</p>
          <p>Total Reps: {totalReps}</p>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Recent Exercises:</h4>
            <ul className="space-y-1">
              {exercises?.slice(-3).map((ex) => (
                <li key={ex.id} className="text-sm">
                  {ex.name}: {ex.sets}x{ex.reps} on {format(new Date(ex.date), "MMM d")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
