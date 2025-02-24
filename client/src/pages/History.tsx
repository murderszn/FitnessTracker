import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Workout } from "@shared/schema";

export default function History() {
  const { data: workouts, isLoading } = useQuery<Workout[]>({ 
    queryKey: ["/api/workouts"]
  });

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Exercise</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Intensity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workouts?.map((workout) => (
              <TableRow key={workout.id}>
                <TableCell>
                  {format(new Date(workout.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{workout.exerciseType}</TableCell>
                <TableCell>{workout.duration} min</TableCell>
                <TableCell>{workout.intensity}/5</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
