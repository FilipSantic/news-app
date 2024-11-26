import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import "colors";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Testing!");
});

mongoose
  .connect(process.env.MONGO_URI || "", {})
  .then(() => {
    console.log("Connected to MongoDB".magenta);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`.cyan);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:".red, error);
  });
