/**
 * Builds the prompt pair used when the first intent-parsing attempt produces
 * invalid or unparseable output. Feeds the original prompt, the bad output,
 * and the validation error back to the LLM so it can self-correct.
 */

export interface PromptPair {
  system: string;
  user: string;
}

// ─── System prompt ───────────────────────────────────────────────────────────

const RETRY_SYSTEM_PROMPT = `
You are a strict JSON repair agent. You will receive:
1. The original user description of an application.
2. A previous (invalid) JSON output that failed validation.
3. One or more validation error messages explaining exactly what is wrong.

Your task is to produce a corrected, fully valid JSON object that fixes every
listed error while preserving the intent of the original description.

## Rules — follow without exception

1. Output ONLY raw JSON. No markdown fences, no explanations, no extra text.
2. Fix every error listed. Do not introduce new errors.
3. The JSON root must be an object with exactly three keys: "app_name", "entities", "features".
4. "app_name": PascalCase string.
5. Each entity must have "name" (PascalCase) and a non-empty "fields" array.
6. Each field must have "name" (camelCase) and "type". Valid types: "string", "number", "boolean", "date".
7. Optional field properties: "required" (boolean), "unique" (boolean).
8. "features" must only contain values from: "auth", "dashboard", "crud", "api", "deploy".
9. Do not truncate or omit entities/fields that were correct in the previous output.
10. Never output null, undefined, or placeholder strings.
`.trim();

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Builds the system + user prompt pair for retrying a failed parse attempt.
 *
 * @param originalPrompt  - The original natural-language description from the user
 * @param previousOutput  - The raw string the LLM previously returned (invalid JSON or bad schema)
 * @param error           - The validation error message(s) explaining what is wrong
 * @returns A { system, user } pair ready to be sent to the Anthropic Messages API
 */
export function buildRetryPrompt(
  originalPrompt: string,
  previousOutput: string,
  error: string,
): PromptPair {
  const userMessage = `
## Original user description

${originalPrompt.trim()}

## Your previous (invalid) output

${previousOutput.trim()}

## Validation errors you must fix

${error.trim()}

Now produce a corrected JSON object that resolves all of the above errors.
`.trim();

  return {
    system: RETRY_SYSTEM_PROMPT,
    user: userMessage,
  };
}
