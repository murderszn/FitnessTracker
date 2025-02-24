import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Target, Plus, ChevronUp, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import GoalForm from "@/components/GoalForm";
import type { Goal, MuscleGroup } from "@shared/schema";

export default function Goals() {
  const { toast } = useToast();
  const { data: goals } = useQuery<Goal[]>({ queryKey: ["/api/goals"] });
  const { data: muscleGroups } = useQuery<MuscleGroup[]>({ 
    queryKey: ["/api/muscle-groups"]
  });

  const updateGoal = useMutation({
    mutationFn: async (goal: Goal) => {
      const res = await apiRequest("PATCH", `/api/goals/${goal.id}`, goal);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      toast({
        title: "Progress updated!",
        description: "Keep pushing towards your goals!",
      });
    },
  });

  const handleIncrement = (goal: Goal) => {
    updateGoal.mutate({
      ...goal,
      currentValue: goal.currentValue + 1,
    });
  };

  const getMuscleGroupName = (id: number) => {
    return muscleGroups?.find(g => g.id === id)?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Fitness Goals</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="button-hover">
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <GoalForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals?.map((goal) => (
          <Card key={goal.id} className="card-hover stat-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="mb-2">
                  {getMuscleGroupName(goal.muscleGroupId)}
                </Badge>
                <Badge variant="secondary">
                  {goal.type === "reps" ? "Reps Goal" : "Weight Goal"}
                </Badge>
              </div>
              <CardTitle className="text-lg">{goal.description}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>
                      {goal.currentValue} / {goal.targetValue}
                      {goal.type === "weight" ? " lbs" : ""}
                    </span>
                  </div>
                  <Progress 
                    value={(goal.currentValue / goal.targetValue) * 100} 
                    className="h-2"
                  />
                </div>

                {goal.deadline && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Target: {format(new Date(goal.deadline), "MMM d, yyyy")}
                  </div>
                )}

                <Button 
                  onClick={() => handleIncrement(goal)}
                  disabled={updateGoal.isPending}
                  className="w-full"
                >
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Update Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!goals || goals.length === 0) && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Goals Set Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by setting your first fitness goal to track your progress
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="button-hover">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Goal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Goal</DialogTitle>
                  </DialogHeader>
                  <GoalForm />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}