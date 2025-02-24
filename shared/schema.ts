import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const muscleGroups = pgTable("muscle_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  restDays: integer("rest_days").notNull().default(1), // Recommended rest days between workouts
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  muscleGroupId: integer("muscle_group_id").notNull(),
  sets: integer("sets").notNull(),
  reps: integer("reps").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  targetValue: integer("target_value").notNull(),
  currentValue: integer("current_value").notNull(),
  muscleGroupId: integer("muscle_group_id").notNull(),
});

export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  muscleGroupId: integer("muscle_group_id").notNull(),
  priority: integer("priority").notNull(), // 1-5 scale, 5 being highest priority
  reason: text("reason").notNull(),
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({ 
  id: true,
  date: true 
});

export const insertGoalSchema = createInsertSchema(goals).omit({ 
  id: true 
});

export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;
export type MuscleGroup = typeof muscleGroups.$inferSelect;
export type Recommendation = typeof recommendations.$inferSelect;