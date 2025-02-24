import { 
  type Exercise, type InsertExercise,
  type Goal, type InsertGoal,
  type MuscleGroup,
  type Recommendation
} from "@shared/schema";
import { subDays } from "date-fns";

export interface IStorage {
  // Exercise methods
  getExercises(): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  getExercisesByMuscleGroup(muscleGroupId: number): Promise<Exercise[]>;
  getRecentExercises(days: number): Promise<Exercise[]>;

  // Muscle Group methods
  getMuscleGroups(): Promise<MuscleGroup[]>;

  // Goal methods
  getGoals(): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, goal: Partial<Goal>): Promise<Goal>;

  // Recommendation methods
  getRecommendations(): Promise<Recommendation[]>;
  generateRecommendations(): Promise<Recommendation[]>;
}

export class MemStorage implements IStorage {
  private exercises: Map<number, Exercise>;
  private goals: Map<number, Goal>;
  private muscleGroups: Map<number, MuscleGroup>;
  private recommendations: Map<number, Recommendation>;
  private exerciseId: number;
  private goalId: number;
  private recommendationId: number;

  constructor() {
    this.exercises = new Map();
    this.goals = new Map();
    this.muscleGroups = new Map([
      [1, { id: 1, name: "Legs", restDays: 2 }],
      [2, { id: 2, name: "Chest", restDays: 2 }],
      [3, { id: 3, name: "Back", restDays: 2 }],
      [4, { id: 4, name: "Shoulders", restDays: 2 }],
      [5, { id: 5, name: "Arms", restDays: 1 }],
      [6, { id: 6, name: "Core", restDays: 1 }],
    ]);
    this.recommendations = new Map();
    this.exerciseId = 1;
    this.goalId = 1;
    this.recommendationId = 1;
  }

  async getExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values());
  }

  async getRecentExercises(days: number): Promise<Exercise[]> {
    const cutoff = subDays(new Date(), days);
    return Array.from(this.exercises.values())
      .filter(ex => new Date(ex.date) >= cutoff)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const id = this.exerciseId++;
    const newExercise: Exercise = {
      ...exercise,
      id,
      date: new Date(),
    };
    this.exercises.set(id, newExercise);
    await this.generateRecommendations(); // Update recommendations after new exercise
    return newExercise;
  }

  async getExercisesByMuscleGroup(muscleGroupId: number): Promise<Exercise[]> {
    return Array.from(this.exercises.values())
      .filter(exercise => exercise.muscleGroupId === muscleGroupId);
  }

  async getMuscleGroups(): Promise<MuscleGroup[]> {
    return Array.from(this.muscleGroups.values());
  }

  async getGoals(): Promise<Goal[]> {
    return Array.from(this.goals.values());
  }

  async createGoal(goal: InsertGoal): Promise<Goal> {
    const id = this.goalId++;
    const newGoal: Goal = { ...goal, id };
    this.goals.set(id, newGoal);
    return newGoal;
  }

  async updateGoal(id: number, update: Partial<Goal>): Promise<Goal> {
    const goal = this.goals.get(id);
    if (!goal) throw new Error("Goal not found");

    const updatedGoal = { ...goal, ...update };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }

  async getRecommendations(): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values());
  }

  async generateRecommendations(): Promise<Recommendation[]> {
    // Clear existing recommendations
    this.recommendations.clear();
    this.recommendationId = 1;

    const recentExercises = await this.getRecentExercises(7);
    const muscleGroups = await this.getMuscleGroups();
    const today = new Date();

    // Count exercises per muscle group in the last week
    const exerciseCount = new Map<number, number>();
    const lastWorkout = new Map<number, Date>();

    for (const exercise of recentExercises) {
      exerciseCount.set(
        exercise.muscleGroupId, 
        (exerciseCount.get(exercise.muscleGroupId) || 0) + 1
      );

      const currentLastWorkout = lastWorkout.get(exercise.muscleGroupId);
      if (!currentLastWorkout || new Date(exercise.date) > currentLastWorkout) {
        lastWorkout.set(exercise.muscleGroupId, new Date(exercise.date));
      }
    }

    // Generate recommendations based on workout frequency and rest periods
    const recommendations: Recommendation[] = [];

    for (const group of muscleGroups) {
      const count = exerciseCount.get(group.id) || 0;
      const lastWorkoutDate = lastWorkout.get(group.id);

      let priority = 3; // Default priority
      let reason = "";

      if (!lastWorkoutDate) {
        priority = 5;
        reason = "No recent workouts for this muscle group";
      } else {
        const daysSinceLastWorkout = Math.floor(
          (today.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastWorkout < group.restDays) {
          priority = 1;
          reason = `Needs ${group.restDays - daysSinceLastWorkout} more rest day(s)`;
        } else if (count === 0) {
          priority = 5;
          reason = "Not worked out in the past week";
        } else if (count === 1) {
          priority = 4;
          reason = "Only worked out once in the past week";
        } else if (daysSinceLastWorkout >= group.restDays * 2) {
          priority = 4;
          reason = "Extended period since last workout";
        } else {
          priority = 2;
          reason = "Regular workout pattern maintained";
        }
      }

      const recommendation: Recommendation = {
        id: this.recommendationId++,
        muscleGroupId: group.id,
        priority,
        reason,
      };

      recommendations.push(recommendation);
      this.recommendations.set(recommendation.id, recommendation);
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
  }
}

export const storage = new MemStorage();