import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const muscleGroups = pgTable("muscle_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  restDays: integer("rest_days").notNull().default(1),
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
  muscleGroupId: integer("muscle_group_id").notNull(),
  type: text("type").notNull(), // "reps" or "weight"
  description: text("description").notNull(),
  targetValue: integer("target_value").notNull(),
  currentValue: integer("current_value").notNull().default(0),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  muscleGroupId: integer("muscle_group_id").notNull(),
  priority: integer("priority").notNull(),
  reason: text("reason").notNull(),
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({ 
  id: true,
  date: true 
});

export const insertGoalSchema = createInsertSchema(goals).omit({ 
  id: true,
  currentValue: true,
  createdAt: true
});

export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;
export type MuscleGroup = typeof muscleGroups.$inferSelect;
export type Recommendation = typeof recommendations.$inferSelect;