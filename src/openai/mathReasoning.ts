import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

export const mathReasoning = async (inputText: string) => {
  const apiKey = process.env.JOEL_HERE_OPENAI_API_KEY;
  const openai = new OpenAI({ apiKey });
  const Step = z.object({
    explanation: z.string(),
    output: z.string(),
  });

  const MathReasoning = z.object({
    steps: z.array(Step),
    final_answer: z.string(),
  });
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful math tutor. Guide the user through the solution step by step.",
      },
      { role: "user", content: inputText },
    ],
    response_format: zodResponseFormat(MathReasoning, "math_reasoning"),
  });
  const math_reasoning = completion.choices[0].message.parsed;
  return { status: 200, data: math_reasoning };
};
