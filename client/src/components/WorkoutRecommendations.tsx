import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Brain, ChevronRight, Target } from "lucide-react";
import type { Recommendation, MuscleGroup } from "@shared/schema";

interface WorkoutRecommendationsProps {
  muscleGroups: MuscleGroup[];
}

export default function WorkoutRecommendations({ muscleGroups }: WorkoutRecommendationsProps) {
  const { data: recommendations = [] } = useQuery<Recommendation[]>({ 
    queryKey: ["/api/recommendations"]
  });

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 5: return "text-red-500";
      case 4: return "text-orange-500";
      case 3: return "text-yellow-500";
      case 2: return "text-green-500";
      default: return "text-blue-500";
    }
  };

  const getMuscleGroupName = (id: number) => {
    return muscleGroups.find(g => g.id === id)?.name || "Unknown";
  };

  return (
    <Card className="card-hover overflow-hidden stat-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-[hsl(var(--azure))]">
          <Brain className="h-5 w-5 text-[hsl(var(--tiffany))]" />
          AI Workout Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-white/40 backdrop-blur-sm"
            >
              <div className="flex-shrink-0">
                <Target className={`h-5 w-5 ${getPriorityColor(rec.priority)}`} />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium text-[hsl(var(--azure))]">
                  {getMuscleGroupName(rec.muscleGroupId)}
                </h4>
                <p className="text-sm text-muted-foreground">{rec.reason}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          ))}
          
          {recommendations.length === 0 && (
            <div className="text-center text-muted-foreground">
              No recommendations available yet. Start logging your workouts!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
