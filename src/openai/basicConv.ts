import OpenAI from "openai";

interface ConversationMessage {
  role: "user" | "system" | "assistant";
  content: string;
}
type Conversation = ConversationMessage[];

export const basicConv = async (conversation: Conversation) => {
  const apiKey = process.env.JOEL_HERE_OPENAI_API_KEY;
  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      ...conversation,
    ],
    model: "gpt-4o-mini",
  });
  return { status: 200, data: completion.choices[0] };
};
