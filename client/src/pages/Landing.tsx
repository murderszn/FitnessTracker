import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Dumbbell, Brain, Target, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Dumbbell,
    title: "Track Your Progress",
    description: "Log your exercises with sets and reps for each muscle group"
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Get intelligent recommendations based on your workout history"
  },
  {
    icon: Target,
    title: "Set & Achieve Goals",
    description: "Define fitness goals and track your journey towards them"
  },
  {
    icon: Activity,
    title: "Visual Analytics",
    description: "View detailed breakdowns of your exercise patterns"
  }
];

const featureColors = {
  Dumbbell: "text-blue-500",
  Brain: "text-sky-500",
  Target: "text-indigo-500",
  Activity: "text-purple-500"
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-sky-500/5 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 py-16 md:py-24 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold gradient-heading mb-6">
            Welcome to FitTrack
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            Your AI-powered fitness companion for smarter workouts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="glass-card h-full">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="mb-4 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/20 rounded-full blur-xl" />
                      <Icon className={`h-10 w-10 relative ${featureColors[feature.icon.name]}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/dashboard">
            <Button 
              className="glass-button text-lg px-8 py-6 group"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
