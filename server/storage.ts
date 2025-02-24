import { 
  type Exercise, type InsertExercise,
  type Goal, type InsertGoal,
  type MuscleGroup 
} from "@shared/schema";

export interface IStorage {
  // Exercise methods
  getExercises(): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  getExercisesByMuscleGroup(muscleGroupId: number): Promise<Exercise[]>;

  // Muscle Group methods
  getMuscleGroups(): Promise<MuscleGroup[]>;

  // Goal methods
  getGoals(): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, goal: Partial<Goal>): Promise<Goal>;
}

export class MemStorage implements IStorage {
  private exercises: Map<number, Exercise>;
  private goals: Map<number, Goal>;
  private muscleGroups: Map<number, MuscleGroup>;
  private exerciseId: number;
  private goalId: number;

  constructor() {
    this.exercises = new Map();
    this.goals = new Map();
    this.muscleGroups = new Map([
      [1, { id: 1, name: "Legs" }],
      [2, { id: 2, name: "Chest" }],
      [3, { id: 3, name: "Back" }],
      [4, { id: 4, name: "Shoulders" }],
      [5, { id: 5, name: "Arms" }],
      [6, { id: 6, name: "Core" }],
    ]);
    this.exerciseId = 1;
    this.goalId = 1;
  }

  async getExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values());
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const id = this.exerciseId++;
    const newExercise: Exercise = {
      ...exercise,
      id,
      date: new Date(),
    };
    this.exercises.set(id, newExercise);
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
}

export const storage = new MemStorage();