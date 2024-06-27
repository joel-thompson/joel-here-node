// import fetch from "node-fetch";

interface ApiResponse {
  choices?: [{ message: { content: string } }];
}

export const getTechPlanFeedback = async (
  inputText: string,
  requirements: string
) => {
  const apiKey = process.env.JOEL_HERE_OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content:
            "Here is a technical plan written in markdown:\n\n" +
            inputText +
            "\n\nRequirements:\n" +
            requirements +
            "\n\nPlease provide feedback on what could be missing from the document.",
        },
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

    return { status: 400, feedback: errorMessage };
  }

  const data = await response.json();
  let knownData: ApiResponse = {};

  if (typeof data === "object" && data !== null) {
    const potentialData = data as { [key: string]: unknown };
    if (typeof potentialData.choices === "object") {
      knownData = potentialData as ApiResponse;
    }
  }

  return { status: 200, feedback: knownData?.choices?.[0].message.content };
};
