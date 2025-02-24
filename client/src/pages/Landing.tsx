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

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[hsl(var(--azure))] to-[hsl(var(--tiffany))] bg-clip-text text-transparent">
            Welcome to FitTrack
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Your AI-powered fitness companion for smarter workouts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full card-hover stat-card">
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <Icon className="h-8 w-8 text-[hsl(var(--tiffany))]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[hsl(var(--azure))]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
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
              size="lg" 
              className="button-hover text-lg px-8 py-6"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
