import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertExerciseSchema, insertGoalSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  // Exercise routes
  app.get("/api/exercises", async (req, res) => {
    const exercises = await storage.getExercises();
    res.json(exercises);
  });

  app.get("/api/exercises/muscle-group/:id", async (req, res) => {
    const muscleGroupId = parseInt(req.params.id);
    if (isNaN(muscleGroupId)) {
      return res.status(400).json({ error: "Invalid muscle group ID" });
    }
    const exercises = await storage.getExercisesByMuscleGroup(muscleGroupId);
    res.json(exercises);
  });

  app.post("/api/exercises", async (req, res) => {
    const parsed = insertExerciseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const exercise = await storage.createExercise(parsed.data);
    res.json(exercise);
  });

  // Muscle Groups route
  app.get("/api/muscle-groups", async (req, res) => {
    const muscleGroups = await storage.getMuscleGroups();
    res.json(muscleGroups);
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

  // Recommendation routes
  app.get("/api/recommendations", async (req, res) => {
    const recommendations = await storage.getRecommendations();
    res.json(recommendations);
  });

  app.post("/api/recommendations/generate", async (req, res) => {
    const recommendations = await storage.generateRecommendations();
    res.json(recommendations);
  });

  return createServer(app);
}