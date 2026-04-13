// import { AiDietPlanEntity } from "@/domain/entities/ai-workout&diet/ai-diet-plan.entity";
// import { AiWorkoutPlanEntity } from "@/domain/entities/ai-workout&diet/ai-workout-plan.entity";
// import { IAiService, IUserDietMetrics, IUserFitnessMetrics } from "@/domain/interfaces/services/ai-generate.service.interface";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { logger } from "../loggers/logger";

// export class GeminiAiService implements IAiService {
//   private readonly _genAI: GoogleGenerativeAI;
  
//   /**
//    * REFINED MODEL STACK
//    * We use only the two most stable strings to avoid 404/429 loops.
//    */
//  private readonly _modelStack = [
//   "gemini-1.5-flash",
//   "gemini-1.0-pro"
// ];

//   constructor(apiKey: string) {
//     this._genAI = new GoogleGenerativeAI(apiKey);
//   }

//   async generateWorkoutPlan(userId: string, metrics: IUserFitnessMetrics): Promise<AiWorkoutPlanEntity> {
//     const prompt = `You are a fitness coach. Generate a 7-day workout plan for a ${metrics.level} user. 
//     Goal: ${metrics.goal}. Specialization: ${metrics.specializations}. 
//     Return ONLY JSON: {"weeklyPlan": [{"day": "string", "focus": "string", "exercises": [{"name": "string", "sets": 3, "reps": "12", "restTime": "60s", "notes": "string"}], "warmup": "string", "cooldown": "string"}]}`;

//     const rawResponse = await this._executeWithFailover(prompt);
//     const cleanedJson = await this._cleanAndRepair(rawResponse);
//     const parsed = JSON.parse(cleanedJson);

//     return AiWorkoutPlanEntity.create({
//       userId,
//       title: `${metrics.level} ${metrics.specializations} Plan`,
//       description: `Targeting ${metrics.goal}`,
//       weeklyPlan: parsed.weeklyPlan
//     });
//   }

//   async generateDietPlan(userId: string, metrics: IUserDietMetrics): Promise<AiDietPlanEntity> {
//     const prompt = `You are a nutritionist. Generate a 7-day diet plan for a ${metrics.weight}kg user. 
//     Goal: ${metrics.goal}. Preference: ${metrics.preference}.
//     Return ONLY JSON: {"weeklyPlan": [{"day": "string", "meals": [{"name": "string", "time": "string", "foods": ["string"], "calories": 400, "protein": 20, "carbs": 40, "fats": 10}], "totalCalories": 2000, "totalProtein": 150, "totalCarbs": 200, "totalFats": 60, "waterIntake": 2000}]}`;

//     const rawResponse = await this._executeWithFailover(prompt);
//     const cleanedJson = await this._cleanAndRepair(rawResponse);
//     const parsed = JSON.parse(cleanedJson);

//     return AiDietPlanEntity.create({
//       userId,
//       title: `${metrics.preference} Diet Plan`,
//       description: `Custom nutrition for ${metrics.goal}`,
//       weeklyPlan: parsed.weeklyPlan
//     });
//   }
// private async _executeWithFailover(prompt: string, stackIndex = 0, retryAttempt = 0): Promise<string> {
//   if (stackIndex >= this._modelStack.length) {
//     throw new Error("AI Service currently unavailable. Please check API Key permissions.");
//   }

//   const currentModel = this._modelStack[stackIndex];

//   try {
//     // We do NOT pass a version here, let the SDK use the default stable v1
//     const model = this._genAI.getGenerativeModel({ model: currentModel });

//     // Remove responseMimeType temporarily to see if it bypasses the 404
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     if (!text) throw new Error("Empty Response");
//     return text;

//   } catch (error: any) {
//     console.error(`--- STABLE API ERROR ---`);
//     console.error(`Model: ${currentModel} | Status: ${error.status}`);
//     console.error(`Message: ${error.message}`);

//     if (error.status === 404 || error.status === 400) {
//       // If 1.5-flash fails, try the next one
//       return this._executeWithFailover(prompt, stackIndex + 1, 0);
//     }

//     if (error.status === 429 && retryAttempt < 1) {
//       await new Promise(r => setTimeout(r, 15000));
//       return this._executeWithFailover(prompt, stackIndex, retryAttempt + 1);
//     }

//     throw error;
//   }
// }

//   private async _cleanAndRepair(raw: string): Promise<string> {
//     const { jsonrepair } = await import("jsonrepair");
//     let cleaned = raw.replace(/```json|```/g, "").trim();
//     const start = cleaned.indexOf('{');
//     const end = cleaned.lastIndexOf('}');
//     if (start !== -1 && end !== -1) cleaned = cleaned.substring(start, end + 1);
    
//     try {
//       return jsonrepair(cleaned);
//     } catch {
//       return cleaned; // Fallback to raw if repair fails
//     }
//   }
// }