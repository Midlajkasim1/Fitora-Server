// import { AiDietPlanEntity } from "@/domain/entities/ai-workout&diet/ai-diet-plan.entity";
// import { AiWorkoutPlanEntity } from "@/domain/entities/ai-workout&diet/ai-workout-plan.entity";
// import { IAiService, IUserDietMetrics, IUserFitnessMetrics } from "@/domain/interfaces/services/ai-generate.service.interface";
// import { logger } from "../loggers/logger";

// export class GrokAiService implements IAiService {
//   private readonly _apiKey: string;
//   private readonly _apiUrl = "https://api.x.ai/v1/chat/completions";

//   constructor(apiKey: string) {
//     this._apiKey = apiKey;
//   }

//   async generateWorkoutPlan(userId: string, metrics: IUserFitnessMetrics): Promise<AiWorkoutPlanEntity> {
//     const prompt = `You are a fitness coach. Generate a 7-day workout plan for a ${metrics.level} user. 
//     Goal: ${metrics.goal}. Specialization: ${metrics.specializations}. 
//     Return ONLY valid JSON: {"weeklyPlan": [{"day": "string", "focus": "string", "exercises": [{"name": "string", "sets": 3, "reps": "12", "restTime": "60s", "notes": "string"}], "warmup": "string", "cooldown": "string"}]}`;

//     const rawResponse = await this._executeRequest(prompt);
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
//     Return ONLY valid JSON: {"weeklyPlan": [{"day": "string", "meals": [{"name": "string", "time": "string", "foods": ["string"], "calories": 400, "protein": 20, "carbs": 40, "fats": 10}], "totalCalories": 2000, "totalProtein": 150, "totalCarbs": 200, "totalFats": 60, "waterIntake": 2000}]}`;

//     const rawResponse = await this._executeRequest(prompt);
//     const cleanedJson = await this._cleanAndRepair(rawResponse);
//     const parsed = JSON.parse(cleanedJson);

//     return AiDietPlanEntity.create({
//       userId,
//       title: `${metrics.preference} Diet Plan`,
//       description: `Custom nutrition for ${metrics.goal}`,
//       weeklyPlan: parsed.weeklyPlan
//     });
//   }

// private async _executeRequest(prompt: string): Promise<string> {
//     // Try these models in order
//     const models = ["grok-2", "grok-latest", "grok-beta"]; 
//     let lastError = "";

//     for (const modelName of models) {
//       try {
//         const response = await fetch(this._apiUrl, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${this._apiKey}`
//           },
//           body: JSON.stringify({
//             model: modelName, 
//             messages: [
//               { role: "system", content: "You are a fitness expert. Respond ONLY in valid JSON." },
//               { role: "user", content: prompt }
//             ],
//             temperature: 0
//           })
//         });

//         if (response.status === 400 || response.status === 404) {
//           // If the model name is wrong, skip to the next model in our list
//           continue; 
//         }

//         if (!response.ok) {
//           const errorBody = await response.json().catch(() => ({}));
//           throw new Error(errorBody.error?.message || `Status: ${response.status}`);
//         }

//         const data = await response.json();
//         return data.choices[0].message.content;

//       } catch (error: any) {
//         lastError = error.message;
//         logger.warn(`Grok Attempt with ${modelName} failed: ${lastError}`);
//       }
//     }

//     throw new Error(`GROK_SERVICE_FAIL: All models failed. Last error: ${lastError}`);
//   }
//   private async _cleanAndRepair(raw: string): Promise<string> {
//     const { jsonrepair } = await import("jsonrepair");
//     let cleaned = raw.replace(/```json|```/g, "").trim();
//     const start = cleaned.indexOf('{');
//     const end = cleaned.lastIndexOf('}');
//     if (start !== -1 && end !== -1) cleaned = cleaned.substring(start, end + 1);
    
//     try {
//       return jsonrepair(cleaned);
//     } catch {
//       return cleaned;
//     }
//   }
// }