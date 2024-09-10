import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { postBasicGpt } from "./openai/postBasicGpt";
import { getTechPlanFeedback } from "./openai/getTechPlanFeedback";
import { mathReasoning } from "./openai/mathReasoning";
import { basicConv } from "./openai/basicConv";
import { testBuilder } from "./openai/testBuilder";

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

app.post("/api/basicgpt", async (req: Request, res: Response) => {
  const conversation = req.body.conversation;

  const resp = await postBasicGpt(conversation);
  res.status(resp.status).json({ message: resp.message });
});

app.post("/api/get-techplan-feedback", async (req: Request, res: Response) => {
  const { inputText, requirements } = req.body;
  const resp = await getTechPlanFeedback(inputText, requirements);
  res.status(resp.status).json({ feedback: resp.feedback });
});

app.post("/api/math-reasoning", async (req: Request, res: Response) => {
  const { inputText } = req.body;
  const resp = await mathReasoning(inputText);
  res.status(resp.status).json(resp.data);
});

app.post("/api/test-builder", async (req: Request, res: Response) => {
  const { conversation, testType } = req.body;
  console.log(conversation);
  const resp = await testBuilder(conversation, testType);
  // console.log(resp);
  res.status(resp.status).json(resp.data);
});

app.post("/api/basic-conv", async (req: Request, res: Response) => {
  const { conversation } = req.body;
  const resp = await basicConv(conversation);
  res.status(resp.status).json(resp.data);
});

// Catch-all middleware for 404 Not Found
app.use((req: Request, res: Response, _next: NextFunction) => {
  console.log(`Route '${req.url}' not found - 404`);
  res.status(404).json({ message: `Route '${req.url}' not found - 404` });
});

// Error-handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
