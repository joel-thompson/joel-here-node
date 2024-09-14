import OpenAI from "openai";
// import { constructo } from "../prompts/prompts";

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}
type Conversation = ConversationMessage[];

export const constructoAssistant = async (conversation: Conversation) => {
  const apiKey = process.env.JOEL_HERE_OPENAI_API_KEY;
  const openai = new OpenAI({ apiKey });

  const assistant = await openai.beta.assistants.retrieve(
    "asst_NPlXWMlIZ1e6GChKR0RwMwaY"
  );

  const thread = await openai.beta.threads.create();

  // iterate through conversation and send messages to the thread
  for (const message of conversation) {
    await openai.beta.threads.messages.create(thread.id, {
      role: message.role,
      content: message.content,
    });
  }

  let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistant.id,
    // instructions: constructo(),
  });

  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    const newestMessage = messages.data[0];

    if (newestMessage.content[0].type === "text") {
      return {
        status: 200,
        data: { message: newestMessage.content[0].text.value },
      };
    }
  }

  return { status: 200, data: { message: "Something went wrong" } };
};
