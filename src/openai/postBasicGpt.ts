interface ApiResponse {
  choices?: [{ message: { content: string } }];
}

export const postBasicGpt = async (sysPrompt: string, conversation: any) => {
  const apiKey = process.env.JOEL_HERE_OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content: sysPrompt,
        },
        ...conversation,
      ],
    }),
  });

  if (!response.ok) {
    // Try to extract the error message from the response body
    let errorMessage = "Failed to fetch"; // Default error message
    try {
      const errorBody = await response.json();
      if (
        typeof errorBody === "object" &&
        errorBody !== null &&
        "error" in errorBody
      ) {
        const error = errorBody.error as { [key: string]: unknown };
        if ("message" in error) {
          errorMessage = error.message as string;
        }
      }
    } catch (e) {
      errorMessage = "Error parsing error response:";
      console.error("Error parsing error response:", e);
    }

    return { status: 400, message: errorMessage };
  }

  const data = await response.json();
  let knownData: ApiResponse = {};

  if (typeof data === "object" && data !== null) {
    const potentialData = data as { [key: string]: unknown };
    if (typeof potentialData.choices === "object") {
      knownData = potentialData as ApiResponse;
    }
  }

  return { status: 200, message: knownData?.choices?.[0].message.content };
};
