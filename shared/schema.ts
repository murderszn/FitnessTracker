import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  exerciseType: text("exercise_type").notNull(),
  duration: integer("duration").notNull(), // in minutes
  intensity: integer("intensity").notNull(), // 1-5 scale
  date: timestamp("date").notNull().defaultNow(),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  targetValue: integer("target_value").notNull(),
  currentValue: integer("current_value").notNull(),
  type: text("type").notNull(), // "duration" or "intensity"
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({ 
  id: true,
  date: true 
});

export const insertGoalSchema = createInsertSchema(goals).omit({ 
  id: true 
});

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Workout = typeof workouts.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;
