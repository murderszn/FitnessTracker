import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { insertExerciseSchema, type InsertExercise, type MuscleGroup } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function WorkoutEntry() {
  const { toast } = useToast();
  const { data: muscleGroups } = useQuery<MuscleGroup[]>({ 
    queryKey: ["/api/muscle-groups"]
  });

  const form = useForm<InsertExercise>({
    resolver: zodResolver(insertExerciseSchema),
    defaultValues: {
      name: "",
      muscleGroupId: 0,
      sets: 3,
      reps: 10,
    },
  });

  const createExercise = useMutation({
    mutationFn: async (data: InsertExercise) => {
      const res = await apiRequest("POST", "/api/exercises", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exercises"] });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/exercises/muscle-group"]
      });
      toast({
        title: "Exercise logged successfully!",
        description: "Your progress has been recorded.",
      });
      form.reset();
    },
  });

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit((data) => createExercise.mutate(data))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exercise Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Squats" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="muscleGroupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Muscle Group</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))} 
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select muscle group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {muscleGroups?.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sets</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reps per Set</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={createExercise.isPending}
        >
          Log Exercise
        </Button>
      </form>
    </Form>
  );
}