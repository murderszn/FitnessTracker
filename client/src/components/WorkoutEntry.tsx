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
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

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
        className="space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Exercise Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., Squats" 
                    className="form-input-transition"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <FormField
            control={form.control}
            name="muscleGroupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Muscle Group</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="form-input-transition">
                      <SelectValue placeholder="Select muscle group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {muscleGroups?.map((group) => (
                      <SelectItem 
                        key={group.id} 
                        value={group.id.toString()}
                        className="cursor-pointer hover:bg-muted transition-colors"
                      >
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <FormField
            control={form.control}
            name="sets"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Sets</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="form-input-transition"
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
                <FormLabel className="text-sm font-medium">Reps per Set</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="form-input-transition"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Button 
            type="submit" 
            className="w-full button-hover"
            disabled={createExercise.isPending}
          >
            {createExercise.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging...
              </>
            ) : (
              'Log Exercise'
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}