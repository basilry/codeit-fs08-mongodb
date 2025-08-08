import express from "express";
import dotenv from 'dotenv';
import Task from './models/Task.js';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();

const app = express();
const corsOptions = {
  origin: ["http://localhost:3000", "https://my-todo.com"]
}

app.use(cors(corsOptions));
app.use(express.json());

function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (e) {
      switch(e.name) {
        case "ValidationError":
          return res.status(400).json({ error: e.message });
        case "CastError":
          return res.status(400).json({ error: "Invalid ID" });
        default:
          return res.status(500).json({ error: e.message });
      }
    }
  }
} 

const dbUrl = process.env.DATABASE_URL;
mongoose.connect(dbUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.get("/tasks", asyncHandler(async (req, res) => {
  const sort = req.query.sort;
  const count = Number(req.query.count) || 0;

  const sortOption = {createdAt: sort === "oldest" ? 'asc' : 'desc'};
  const tasks = await Task.find().sort(sortOption).limit(count);

  res.send(tasks);
}));

app.get("/tasks/:id", asyncHandler(async (req, res) => {
  const id = String(req.params.id);
  const task = await Task.findById(id);
  
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json(task);
}));

app.post("/tasks", asyncHandler(async (req, res) => {
  const newTask = await Task.create(req.body);
  res.status(201).json(newTask);
})) ;

app.patch("/tasks/:id", asyncHandler(async (req, res) => {
  const id = String(req.params.id);
  const task = await Task.findById(id);
  
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  Object.keys(req.body).forEach((key) => {
    task[key] = req.body[key];
  });

  await task.save();

  res.json(task);
}));

app.delete("/tasks/:id", asyncHandler(async (req, res) => {
  const id = String(req.params.id);
  const task = await Task.findByIdAndDelete(id);
  
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(204).send();
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});