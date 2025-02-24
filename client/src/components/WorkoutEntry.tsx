import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { insertWorkoutSchema, type InsertWorkout } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

const exerciseTypes = [
  "Running",
  "Cycling",
  "Swimming",
  "Weight Training",
  "Yoga",
  "HIIT",
];

export default function WorkoutEntry() {
  const { toast } = useToast();
  
  const form = useForm<InsertWorkout>({
    resolver: zodResolver(insertWorkoutSchema),
    defaultValues: {
      exerciseType: "",
      duration: 30,
      intensity: 3,
    },
  });

  const createWorkout = useMutation({
    mutationFn: async (data: InsertWorkout) => {
      const res = await apiRequest("POST", "/api/workouts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({
        title: "Workout logged successfully!",
        description: "Your progress has been recorded.",
      });
      form.reset();
    },
  });

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit((data) => createWorkout.mutate(data))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="exerciseType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exercise Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exercise type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {exerciseTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="intensity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intensity (1-5)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  max="5" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={createWorkout.isPending}
        >
          Log Workout
        </Button>
      </form>
    </Form>
  );
}
