import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { postBasicGpt } from "./openai/postBasicGpt";

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
  const sysPrompt = req.body.systemPrompt;
  const conversation = req.body.conversation;

  const resp = await postBasicGpt(sysPrompt, conversation);
  res.status(resp.status).json({ message: resp.message });
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
