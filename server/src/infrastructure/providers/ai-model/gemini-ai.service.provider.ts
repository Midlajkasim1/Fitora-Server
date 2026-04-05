import { AiDietPlanEntity } from "@/domain/entities/ai-workout&diet/ai-diet-plan";
import { AiWorkoutPlanEntity } from "@/domain/entities/ai-workout&diet/ai-workout-plan.entity";
import { IAiService, IUserDietMetrics, IUserFitnessMetrics } from "@/domain/interfaces/services/ai-generate.service.interface";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { logger } from "../loggers/logger";

export class GeminiAiService implements IAiService {
  private _genAI: GoogleGenerativeAI;
  private _model: GenerativeModel;

  constructor(apiKey: string) {
    this._genAI = new GoogleGenerativeAI(apiKey);
    this._model = this._genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: { responseMimeType: "application/json" },
      systemInstruction: `You are a professional Fitness & Nutrition AI coach. 
      You MUST ONLY generate valid JSON.
      
      WORKOUT RULES:
      Every exercise MUST include: "name" (string), "sets" (number), "reps" (string/number), "restTime" (string).

      DIET RULES:
      1. "waterIntake" MUST be a NUMBER representing milliliters (e.g., 2000, not "2L").
      2. Every meal in "meals" MUST include:
         - "name": (string, e.g., "Breakfast")
         - "time": (string, e.g., "08:00 AM")
         - "foods": (array of strings)
         - "calories", "protein", "carbs", "fats": (ALL must be numbers)
      3. Daily totals (totalCalories, totalProtein, etc.) MUST be numbers.`
    });
        logger.info(`AI Service initialized with model: ${this._model.model}`);

  }

  async generateWorkoutPlan(userId: string, metrics: IUserFitnessMetrics): Promise<AiWorkoutPlanEntity> {
    const prompt = `Generate a 7-day workout plan for a ${metrics.level} level user. 
    Goal: ${metrics.goal}. Equipment: ${metrics.equipment.join(", ")}. 
    Return JSON with a 'weeklyPlan' array.`;

    const rawJson = await this._retryRequest(prompt);
    const cleanedJson = await this._repairJson(rawJson); 
    const parsed = JSON.parse(cleanedJson);

    return AiWorkoutPlanEntity.create({
      userId,
      title: `${metrics.level} ${metrics.goal} Plan`,
      description: `Tailored workout for ${metrics.goal}`,
      weeklyPlan: parsed.weeklyPlan
    });
  }

  async generateDietPlan(userId: string, metrics: IUserDietMetrics): Promise<AiDietPlanEntity> {
    const prompt = `Generate a 7-day diet plan. Target: ${metrics.targetCalories} calories. 
    Preference: ${metrics.preference}. Limitations: ${metrics.limitations.join(", ")}. 
    Return JSON with a 'weeklyPlan' array.`;

    const rawJson = await this._retryRequest(prompt);
    const cleanedJson = await this._repairJson(rawJson); 
    const parsed = JSON.parse(cleanedJson);

    return AiDietPlanEntity.create({
      userId,
      title: `${metrics.preference} Diet Plan`,
      description: `Daily target: ${metrics.targetCalories} kcal`,
      weeklyPlan: parsed.weeklyPlan
    });
  }


  private async _repairJson(raw: string): Promise<string> {
    try {
      const { jsonrepair } = await import("jsonrepair");
      
      const cleaned = raw.replace(/```json|```/g, "").trim();
      
      return jsonrepair(cleaned);
    } catch (error) {
      logger.error("JSON Repair Error:", error);
      throw new Error("Failed to process AI response. Please try again.");
    }
  }

  private async _retryRequest(prompt: string, retries = 3): Promise<string> {
    try {
      const result = await this._model.generateContent(prompt);
      const text = result.response.text();
      if (!text) throw new Error("Empty AI response");
      return text;
    } catch (error) {
      if (retries > 0) {
        return this._retryRequest(prompt, retries - 1);
      }
      throw error;
    }
  }
}