import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;
// const apiKey = process.env.API_KEY; // dummy for now

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/api/users", (_req: Request, res: Response) => {
  res.json([{ id: 1, name: "John Doe" }]);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
