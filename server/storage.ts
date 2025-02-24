import { 
  type Workout, type InsertWorkout,
  type Goal, type InsertGoal 
} from "@shared/schema";

export interface IStorage {
  // Workout methods
  getWorkouts(): Promise<Workout[]>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  
  // Goal methods
  getGoals(): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, goal: Partial<Goal>): Promise<Goal>;
}

export class MemStorage implements IStorage {
  private workouts: Map<number, Workout>;
  private goals: Map<number, Goal>;
  private workoutId: number;
  private goalId: number;

  constructor() {
    this.workouts = new Map();
    this.goals = new Map();
    this.workoutId = 1;
    this.goalId = 1;
  }

  async getWorkouts(): Promise<Workout[]> {
    return Array.from(this.workouts.values());
  }

  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const id = this.workoutId++;
    const newWorkout: Workout = {
      ...workout,
      id,
      date: new Date(),
    };
    this.workouts.set(id, newWorkout);
    return newWorkout;
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
