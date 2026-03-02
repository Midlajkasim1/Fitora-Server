import { model } from "mongoose";
import { WorkoutSchema } from "../schemas/workout.schema";


export  const WorkoutModel = model("Workout",WorkoutSchema);