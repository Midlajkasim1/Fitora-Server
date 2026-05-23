import { AiDietPlanEntity, IDietDay } from "@/domain/entities/ai.workout&diet/ai.diet.plan.entity";
import { AiWorkoutPlanEntity, IWorkoutDay } from "@/domain/entities/ai.workout&diet/ai.workout.plan.entity";
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
    const systemPrompt = `You are an elite, world-class personal trainer. Your primary core directive is VARIETY.
    You must generate a strict 7-day training schedule. 
    CRITICAL REQUIREMENT: Every single day MUST focus on a different routine or variation (e.g., Push, Pull, Legs, Core, Cardio, Active Recovery). 
    Do NOT duplicate exercises or structures across days. Make every day unique and realistic.`;

    const userPrompt = `Generate a progressive 7-day workout plan for a ${metrics.level} athlete.
    GOAL: ${metrics.goal}. SPECIALIZATION: ${metrics.specializations}.
    
    TASK: Return a JSON object with a "weeklyPlan" key containing exactly 7 objects (one for each day from Monday to Sunday).
    
    JSON STRUCTURE EXPECTED:
    {
      "weeklyPlan": [
        {
          "day": "Monday",
          "focus": "Strength / Push",
          "warmup": "5 mins light cardio",
          "cooldown": "5 mins stretching",
          "exercises": [
            {"name": "Bench Press", "sets": 3, "reps": "12", "restTime": "60s", "notes": "Focus on explosive execution"}
          ]
        }
      ]
    }`;

    try {
      const content = await this._executeRequest(systemPrompt, userPrompt);
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
    const systemPrompt = `You are an elite clinical nutritionist. Your primary operational directive is DIETARY VARIETY.
    You must generate a comprehensive 7-day meal plan.
    CRITICAL REQUIREMENT: Do NOT repeat the exact same meals on consecutive days. Alternate proteins, carbs, and meal setups daily so the client has a highly varied and enjoyable healthy routine.`;

    const userPrompt = `Generate a detailed 7-day meal plan for a user with these goals: ${metrics.goal}.
    Preference: ${metrics.preference}. Limitations: ${metrics.limitations.join(", ")}.
    
    TASK: You MUST return a JSON object with a "weeklyPlan" key containing exactly 7 unique day objects. Each day MUST feature at least 3 distinct meals.
    
    JSON STRUCTURE EXPECTED:
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
      const content = await this._executeRequest(systemPrompt, userPrompt);
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
      return this._createDefaultDietPlan(userId, metrics);
    }
  }


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

  private async _executeRequest(systemPrompt: string, userPrompt: string): Promise<string> {
    const response = await fetch(this._apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this._apiKey}`
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.85,           
        repetition_penalty: 1.25    
      })
    });

    if (!response.ok) throw new Error(`Mistral API Unavailable: ${response.statusText}`);
    const data = await response.json();
    return data.choices[0].message.content;
  }
}