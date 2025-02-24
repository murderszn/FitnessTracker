import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Goal } from "@shared/schema";

export default function Goals() {
  const { toast } = useToast();
  const { data: goals, isLoading } = useQuery<Goal[]>({ queryKey: ["/api/goals"] });

  const updateGoal = useMutation({
    mutationFn: async (goal: Goal) => {
      const res = await apiRequest("PATCH", `/api/goals/${goal.id}`, goal);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
    },
  });

  const handleIncrement = (goal: Goal) => {
    updateGoal.mutate({
      ...goal,
      currentValue: goal.currentValue + 1,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Fitness Goals</h1>

      <div className="grid gap-4 md:grid-cols-2">
        {goals?.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <CardTitle>{goal.description}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress 
                  value={(goal.currentValue / goal.targetValue) * 100} 
                />
                <div className="flex items-center justify-between">
                  <span>
                    {goal.currentValue} / {goal.targetValue}
                  </span>
                  <Button 
                    onClick={() => handleIncrement(goal)}
                    disabled={updateGoal.isPending}
                  >
                    Increment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}