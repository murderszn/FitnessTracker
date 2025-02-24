import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Calendar, Target, TrendingUp, Clock, Activity, History } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import type { Exercise, MuscleGroup, Recommendation, Goal, WorkoutSession } from "@shared/schema";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

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

  const { data: goals } = useQuery<Goal[]>({
    queryKey: ["/api/goals"]
  });

  const { data: workoutSessions } = useQuery<WorkoutSession[]>({
    queryKey: ["/api/workout-sessions"]
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

  // Weekly activity data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const sessionsOnDay = workoutSessions?.filter(
      session => format(new Date(session.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ).length || 0;
    return {
      date: format(date, 'EEE'),
      sessions: sessionsOnDay
    };
  }).reverse();

  // Calculate average workout duration
  const avgDuration = workoutSessions?.length 
    ? workoutSessions.reduce((acc, session) => acc + session.duration, 0) / workoutSessions.length
    : 0;

  // Goal progress calculation
  const goalProgress = goals?.map(goal => {
    const progress = Math.min((goal.current / goal.target) * 100, 100);
    return { ...goal, progress };
  });

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.h1 
        className="text-4xl font-bold gradient-heading"
        variants={itemVariants}
      >
        Workout Analytics
      </motion.h1>

      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-medium text-slate-800">
                <Activity className="h-5 w-5 text-blue-500" />
                Weekly Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">
                {workoutSessions?.length || 0}
              </div>
              <p className="text-sm text-slate-500">
                Last 7 days
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-medium text-slate-800">
                <Clock className="h-5 w-5 text-sky-500" />
                Avg. Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">
                {Math.round(avgDuration)} min
              </div>
              <p className="text-sm text-slate-500">
                Per workout
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-medium text-slate-800">
                <Target className="h-5 w-5 text-indigo-500" />
                Active Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">
                {goals?.length || 0}
              </div>
              <p className="text-sm text-slate-500">
                In progress
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-medium text-slate-800">
                <History className="h-5 w-5 text-purple-500" />
                Total Exercises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">
                {exercises?.length || 0}
              </div>
              <p className="text-sm text-slate-500">
                Tracked
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div 
        className="grid gap-6 md:grid-cols-2"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-medium text-slate-800">
                <Brain className="h-6 w-6 text-blue-500" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {recommendations?.map((rec) => {
                    const group = muscleGroups?.find(g => g.id === rec.muscleGroupId);
                    return (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-sky-500/10 border border-blue-100"
                      >
                        <h3 className="font-medium text-blue-600">
                          {group?.name}
                        </h3>
                        <p className="text-sm mt-1 text-slate-600">{rec.reason}</p>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-medium text-slate-800">
                <TrendingUp className="h-6 w-6 text-sky-500" />
                Workout Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#475569" />
                    <YAxis stroke="#475569" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="url(#barGradient)" 
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#0EA5E9" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-medium text-slate-800">
                <Calendar className="h-6 w-6 text-indigo-500" />
                Weekly Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={last7Days}>
                    <XAxis dataKey="date" stroke="#475569" />
                    <YAxis stroke="#475569" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#6366F1" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="sessions" 
                      fill="url(#areaGradient)"
                      stroke="#6366F1"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-medium text-slate-800">
                <Target className="h-6 w-6 text-purple-500" />
                Goal Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {goalProgress?.map((goal) => (
                  <motion.div 
                    key={goal.id} 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-700">{goal.name}</span>
                      <span className="text-slate-500">
                        {goal.current}/{goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="relative h-2 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
