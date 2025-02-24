import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Calendar, Target, TrendingUp } from "lucide-react";
import { format, subDays } from "date-fns";
import { motion } from "framer-motion";
import type { Exercise, MuscleGroup, Recommendation } from "@shared/schema";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Analytics() {
  const { data: muscleGroups } = useQuery<MuscleGroup[]>({ 
    queryKey: ["/api/muscle-groups"] 
  });
  
  const { data: recommendations } = useQuery<Recommendation[]>({ 
    queryKey: ["/api/recommendations"] 
  });

  const { data: exercises } = useQuery<Exercise[]>({ 
    queryKey: ["/api/exercises"] 
  });

  // Calculate exercise frequency by muscle group
  const exercisesByMuscle = exercises?.reduce((acc, ex) => {
    acc[ex.muscleGroupId] = (acc[ex.muscleGroupId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const chartData = muscleGroups?.map(group => ({
    name: group.name,
    count: exercisesByMuscle?.[group.id] || 0
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Workout Analytics</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="stat-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-[hsl(var(--tiffany))]" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations?.map((rec) => {
                const group = muscleGroups?.find(g => g.id === rec.muscleGroupId);
                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-lg bg-white/40 backdrop-blur-sm"
                  >
                    <h3 className="font-medium text-[hsl(var(--azure))]">
                      {group?.name}
                    </h3>
                    <p className="text-sm mt-1">{rec.reason}</p>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[hsl(var(--tiffany))]" />
              Workout Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--azure))" 
                    opacity={0.8} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
