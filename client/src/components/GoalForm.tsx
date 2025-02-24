import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { insertGoalSchema, type InsertGoal, type MuscleGroup } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function GoalForm() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();

  const { data: muscleGroups } = useQuery<MuscleGroup[]>({ 
    queryKey: ["/api/muscle-groups"]
  });

  const form = useForm<InsertGoal>({
    resolver: zodResolver(insertGoalSchema),
    defaultValues: {
      muscleGroupId: 0,
      type: "reps",
      description: "",
      targetValue: 0,
      deadline: null,
    },
  });

  const createGoal = useMutation({
    mutationFn: async (data: InsertGoal) => {
      const res = await apiRequest("POST", "/api/goals", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      toast({
        title: "Goal created successfully!",
        description: "Your new fitness goal has been set.",
      });
      form.reset();
      setDate(undefined);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit((data) => {
          createGoal.mutate({
            ...data,
            deadline: date || null,
          });
        })}
        className="space-y-4"
      >
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

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="reps">Total Reps</SelectItem>
                  <SelectItem value="weight">Weight Progress</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Reach 100 push-ups per session" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Value</FormLabel>
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

        <FormItem className="flex flex-col">
          <FormLabel>Target Date (Optional)</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </FormItem>

        <Button 
          type="submit" 
          className="w-full button-hover"
          disabled={createGoal.isPending}
        >
          {createGoal.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Goal'
          )}
        </Button>
      </form>
    </Form>
  );
}