import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { testBuilderPrompt } from "../prompts/prompts";

interface ConversationMessage {
  role: "user" | "system" | "assistant";
  content: string;
}
type Conversation = ConversationMessage[];

export const testBuilder = async (
  conversation: Conversation,
  testType: string
) => {
  const apiKey = process.env.JOEL_HERE_OPENAI_API_KEY;
  const openai = new OpenAI({ apiKey });

  const Response = z.object({
    explanation: z.string(),
    output: z.string(),
  });
  console.log(conversation);
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: testBuilderPrompt(testType),
      },
      ...conversation,
    ],
    response_format: zodResponseFormat(Response, "response"),
  });
  const testOutput = completion.choices[0].message.parsed;
  return { status: 200, data: testOutput };
};
