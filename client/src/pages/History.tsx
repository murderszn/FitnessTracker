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
import type { Exercise } from "@shared/schema";

export default function History() {
  const { data: exercises, isLoading } = useQuery<Exercise[]>({ 
    queryKey: ["/api/exercises"]
  });

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercise History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Exercise</TableHead>
              <TableHead>Sets</TableHead>
              <TableHead>Reps</TableHead>
              <TableHead>Total Reps</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercises?.map((exercise) => (
              <TableRow key={exercise.id}>
                <TableCell>
                  {format(new Date(exercise.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{exercise.name}</TableCell>
                <TableCell>{exercise.sets}</TableCell>
                <TableCell>{exercise.reps}</TableCell>
                <TableCell>{exercise.sets * exercise.reps}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}