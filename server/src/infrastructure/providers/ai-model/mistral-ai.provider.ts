import { AiDietPlanEntity, IDietDay } from "@/domain/entities/ai-workout&diet/ai-diet-plan.entity";
import { AiWorkoutPlanEntity, IWorkoutDay } from "@/domain/entities/ai-workout&diet/ai-workout-plan.entity";
import { IAiService, IUserDietMetrics, IUserFitnessMetrics } from "@/domain/interfaces/services/ai-generate.service.interface";
import { logger } from "../loggers/logger";

interface MistralWorkoutResponse {
  weeklyPlan: IWorkoutDay[];
}

interface MistralDietResponse {
  weeklyPlan: IDietDay[];
}

export class MistralAiService implements IAiService {
  private readonly _apiKey: string;
  private readonly _apiUrl = "https://api.mistral.ai/v1/chat/completions";

  constructor(apiKey: string) {
    this._apiKey = apiKey;
  }

 async generateWorkoutPlan(userId: string, metrics: IUserFitnessMetrics): Promise<AiWorkoutPlanEntity> {
  // STRENGTHENED PROMPT: Explicitly demanding 7 days
  const prompt = `You are an elite fitness coach. Generate a STOIC 7-day workout plan for a ${metrics.level} athlete.
  GOAL: ${metrics.goal}. SPECIALIZATION: ${metrics.specializations}.
  
  TASK: You MUST return a JSON object with a "weeklyPlan" key containing exactly 7 objects (one for each day of the week).
  
  JSON STRUCTURE:
  {
    "weeklyPlan": [
      {
        "day": "Monday",
        "focus": "Strength",
        "warmup": "5 mins",
        "cooldown": "5 mins",
        "exercises": [
          {"name": "Bench Press", "sets": 3, "reps": "12", "restTime": "60s", "notes": "Form first"}
        ]
      }
    ]
  }`;

  try {
    const content = await this._executeRequest(prompt);
    const parsed = JSON.parse(content) as MistralWorkoutResponse;

    if (!parsed.weeklyPlan || parsed.weeklyPlan.length === 0) {
      throw new Error("Mistral returned an empty plan");
    }

    const cleanedPlan: IWorkoutDay[] = parsed.weeklyPlan.map((day) => ({
      day: day.day || "Active Day",
      focus: day.focus || metrics.specializations,
      warmup: day.warmup || "Standard Warmup",
      cooldown: day.cooldown || "Standard Cooldown",
      exercises: (day.exercises || []).map((ex) => ({
        name: ex.name || "Exercise",
        sets: Number(ex.sets) || 3,
        reps: String(ex.reps || "12"),
        restTime: ex.restTime || "60s",
        notes: ex.notes || ""
      }))
    }));

    return AiWorkoutPlanEntity.create({
      userId,
      title: `${metrics.level} ${metrics.specializations} Plan`,
      description: `Targeting ${metrics.goal}`,
      weeklyPlan: cleanedPlan
    });
  } catch (error) {
    logger.error(`MISTRAL_GENERATE_ERROR: ${error}`);
    return this._createDefaultWorkoutPlan(userId, metrics);
  }
}


async generateDietPlan(userId: string, metrics: IUserDietMetrics): Promise<AiDietPlanEntity> {
  const prompt = `You are a world-class nutrition expert. Generate a detailed 7-day meal plan for a user with these goals: ${metrics.goal}.
  Preference: ${metrics.preference}. Limitations: ${metrics.limitations.join(", ")}.
  
  TASK: You MUST return a JSON object with a "weeklyPlan" key containing exactly 7 objects.
  
  JSON STRUCTURE:
  {
    "weeklyPlan": [
      {
        "day": "Monday",
        "totalCalories": 2200,
        "totalProtein": 160,
        "totalCarbs": 200,
        "totalFats": 70,
        "waterIntake": 3000,
        "meals": [
          {
            "name": "Breakfast",
            "time": "08:00 AM",
            "foods": ["Scrambled eggs", "Whole grain toast"],
            "calories": 500,
            "protein": 30,
            "carbs": 40,
            "fats": 20
          }
        ]
      }
    ]
  }`;

  try {
    const content = await this._executeRequest(prompt);
    const parsed = JSON.parse(content) as MistralDietResponse;

    if (!parsed.weeklyPlan || parsed.weeklyPlan.length === 0) {
      throw new Error("Mistral returned empty diet array");
    }

    const cleanedDiet: IDietDay[] = parsed.weeklyPlan.map((day) => ({
      day: day.day || "Day",
      totalCalories: Number(day.totalCalories) || 2000,
      totalProtein: Number(day.totalProtein) || 150,
      totalCarbs: Number(day.totalCarbs) || 200,
      totalFats: Number(day.totalFats) || 60,
      waterIntake: Number(day.waterIntake) || 2000,
      meals: (day.meals || []).map((meal) => ({
        name: meal.name || "Healthy Meal",
        time: meal.time || "Scheduled",
        foods: Array.isArray(meal.foods) ? meal.foods : ["Healthy choice"],
        calories: Number(meal.calories) || 400,
        protein: Number(meal.protein) || 25,
        carbs: Number(meal.carbs) || 40,
        fats: Number(meal.fats) || 10
      }))
    }));

    return AiDietPlanEntity.create({
      userId,
      title: `${metrics.preference} Diet Plan`,
      description: `Targeting ${metrics.goal}`,
      weeklyPlan: cleanedDiet
    });
  } catch (error) {
    logger.error(`DIET_AI_FAIL: ${error}`);
    // This will now properly return the 7-day default plan if Mistral fails
    return this._createDefaultDietPlan(userId, metrics);
  }
}

  // --- DEFAULT PLAN GENERATORS (Safety Net) ---

  private _createDefaultWorkoutPlan(userId: string, metrics: IUserFitnessMetrics): AiWorkoutPlanEntity {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const defaultWeekly: IWorkoutDay[] = days.map(d => ({
      day: d,
      focus: metrics.specializations,
      exercises: [{ name: "Standard Pushups", sets: 3, reps: "12", restTime: "60s", notes: "Focus on form" }],
      warmup: "5 min light cardio",
      cooldown: "5 min stretching"
    }));

    return AiWorkoutPlanEntity.create({
      userId,
      title: `${metrics.level} Plan (Standard)`,
      description: "A pre-built effective workout plan.",
      weeklyPlan: defaultWeekly
    });
  }

  private _createDefaultDietPlan(userId: string, metrics: IUserDietMetrics): AiDietPlanEntity {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const defaultWeekly: IDietDay[] = days.map(d => ({
      day: d,
      meals: [{ name: "Balanced Breakfast", time: "08:00", foods: ["Oats", "Fruit"], calories: 400, protein: 20, carbs: 50, fats: 10 }],
      totalCalories: 2000, totalProtein: 150, totalCarbs: 200, totalFats: 60, waterIntake: 2000
    }));

    return AiDietPlanEntity.create({
      userId,
      title: `${metrics.preference} Plan (Standard)`,
      description: "A balanced nutritional guide.",
      weeklyPlan: defaultWeekly
    });
  }

  private async _executeRequest(prompt: string): Promise<string> {
    const response = await fetch(this._apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this._apiKey}`
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7
      })
    });

    if (!response.ok) throw new Error("Mistral API Unavailable");
    const data = await response.json();
    return data.choices[0].message.content;
  }
}