import { logger } from "@/infrastructure/providers/loggers/logger";

let jsonrepairFn: any = null;

async function getJsonRepair(): Promise<any> {
  if (!jsonrepairFn) {
    const mod = await import("jsonrepair");
    jsonrepairFn = mod.jsonrepair;
  }
  return jsonrepairFn;
}


export async function safeParseJson<T>(rawContent: string): Promise<T> {
  let content = rawContent.trim();

  const markdownRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/i;
  const match = content.match(markdownRegex);
  if (match) {
    content = match[1].trim();
  }

  try {
    return JSON.parse(content) as T;
  } catch (error) {
    logger.warn(`Initial JSON.parse failed, attempting extraction/repair. Error: ${(error as Error).message}`);
  }

  const firstBrace = content.indexOf("{");
  const lastBrace = content.lastIndexOf("}");
  const firstBracket = content.indexOf("[");
  const lastBracket = content.lastIndexOf("]");

  let extracted = content;
  let hasExtracted = false;

  const hasBraces = firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace;
  const hasBrackets = firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket;

  if (hasBraces && (!hasBrackets || firstBrace < firstBracket)) {
    extracted = content.substring(firstBrace, lastBrace + 1);
    hasExtracted = true;
  } else if (hasBrackets) {
    extracted = content.substring(firstBracket, lastBracket + 1);
    hasExtracted = true;
  }

  if (hasExtracted) {
    try {
      return JSON.parse(extracted) as T;
    } catch (error) {
      logger.warn(`JSON.parse on extracted substring failed, attempting repair. Error: ${(error as Error).message}`);
    }
  }

  const repair = await getJsonRepair();

  try {
    const repaired = repair(extracted);
    return JSON.parse(repaired) as T;
  } catch (repairError) {
    logger.warn(`jsonrepair on extracted content failed. Trying jsonrepair on original cleaned content. Error: ${(repairError as Error).message}`);
  }

  try {
    const repairedOriginal = repair(content);
    return JSON.parse(repairedOriginal) as T;
  } catch (finalError) {
    logger.error(`Failed to parse and repair JSON response. Raw length: ${rawContent.length}`);
    throw new Error(`Failed to parse AI response: ${(finalError as Error).message}. Raw content snippet: ${rawContent.substring(0, 300)}`);
  }
}
