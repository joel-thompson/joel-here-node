import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all origins by default
app.use(cors());

// Enable CORS for specific origins (optional)
// const corsOptions = {
//   origin: ['http://localhost:3000', 'http://your-other-domain.com'],
//   optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/api/users", (_req: Request, res: Response) => {
  res.json([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ]);
});

interface StoryResponse {
  choices?: [{ message: { content: string } }];
}

app.post("/api/basicgpt", async (req: Request, res: Response) => {
  const sysPrompt = req.body.systemPrompt;
  const prompt = req.body.prompt;
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
          content: sysPrompt,
        },
        {
          role: "user",
          content: prompt,
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

    return res.status(400).json({ message: errorMessage });
  }

  const data = await response.json();
  let knownData: StoryResponse = {};

  if (typeof data === "object" && data !== null) {
    const potentialData = data as { [key: string]: unknown };
    if (typeof potentialData.choices === "object") {
      knownData = potentialData as StoryResponse;
    }
  }

  res.json({ message: knownData?.choices?.[0].message.content });
});

// Catch-all middleware for 404 Not Found
app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({ message: `Route '${req.url}' not found` });
});

// Error-handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
