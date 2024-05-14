import dotenv from "dotenv";
import express, { Request, Response } from "express";
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
  res.json([{ id: 1, name: "John Doe" }]);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
