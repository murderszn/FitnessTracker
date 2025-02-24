import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Dumbbell, Clock } from "lucide-react";
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="card-hover overflow-hidden">
        <CardHeader className="bg-primary/5 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            {muscleGroup?.name || 'Unknown'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted">
                <p className="text-2xl font-bold text-primary">{totalSets}</p>
                <p className="text-sm text-muted-foreground">Total Sets</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted">
                <p className="text-2xl font-bold text-primary">{totalReps}</p>
                <p className="text-sm text-muted-foreground">Total Reps</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Recent Exercises
              </h4>
              <ul className="space-y-2">
                {exercises?.slice(-3).map((ex) => (
                  <li 
                    key={ex.id} 
                    className="text-sm p-2 rounded-md bg-muted/50 flex justify-between items-center"
                  >
                    <span className="font-medium">{ex.name}</span>
                    <span className="text-muted-foreground">
                      {ex.sets}×{ex.reps} • {format(new Date(ex.date), "MMM d")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}