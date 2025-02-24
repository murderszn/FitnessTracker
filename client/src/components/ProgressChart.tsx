import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import type { Workout } from "@shared/schema";

interface ProgressChartProps {
  workouts: Workout[];
}

export default function ProgressChart({ workouts }: ProgressChartProps) {
  const data = workouts
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((workout) => ({
      date: format(new Date(workout.date), "MMM d"),
      duration: workout.duration,
      intensity: workout.intensity,
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="duration" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="duration"
          stroke="hsl(var(--primary))"
          fillOpacity={1}
          fill="url(#duration)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
