import { IWorkoutDay, IWorkoutExercise } from "@/domain/entities/ai-workout&diet/ai-workout-plan.entity";
import { Schema } from "mongoose";
import { IWorkoutPlanDocument } from "../interfaces/ai-workout-plan.document";



const WorkoutExerciseSchema = new Schema<IWorkoutExercise>({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Schema.Types.Mixed, required: true }, 
  duration: String,
  restTime: { type: String, required: true },
  notes: String,
});

const WorkoutDaySchema = new Schema<IWorkoutDay>({
  day: { type: String, required: true },
  focus: { type: String, required: true },
  exercises: [WorkoutExerciseSchema],
  warmup: String,
  cooldown: String,
  duration: String,
  intensity: String,
});

export const WorkoutPlanSchema = new Schema<IWorkoutPlanDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  weeklyPlan: [WorkoutDaySchema],
  createdAt: { type: Date, default: Date.now },
});

