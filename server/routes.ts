import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertWorkoutSchema, insertGoalSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  // Workout routes
  app.get("/api/workouts", async (req, res) => {
    const workouts = await storage.getWorkouts();
    res.json(workouts);
  });

  app.post("/api/workouts", async (req, res) => {
    const parsed = insertWorkoutSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const workout = await storage.createWorkout(parsed.data);
    res.json(workout);
  });

  // Goal routes
  app.get("/api/goals", async (req, res) => {
    const goals = await storage.getGoals();
    res.json(goals);
  });

  app.post("/api/goals", async (req, res) => {
    const parsed = insertGoalSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const goal = await storage.createGoal(parsed.data);
    res.json(goal);
  });

  app.patch("/api/goals/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    try {
      const goal = await storage.updateGoal(id, req.body);
      res.json(goal);
    } catch (error) {
      res.status(404).json({ error: "Goal not found" });
    }
  });

  return createServer(app);
}
