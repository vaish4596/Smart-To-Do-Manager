const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const DB_FILE = "./db.json";

// Helper function to read DB
const readData = () => {
  const data = fs.readFileSync(DB_FILE);
  return JSON.parse(data);
};

// Helper function to write DB
const writeData = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// GET all tasks
app.get("/tasks", (req, res) => {
  const data = readData();
  res.json(data.tasks);
});

// POST new task
app.post("/tasks", (req, res) => {
  const data = readData();
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    category: req.body.category,
    dueDate: req.body.dueDate,
    completed: false
  };

  data.tasks.push(newTask);
  writeData(data);
  res.status(201).json(newTask);
});

// PUT toggle status
app.put("/tasks/:id", (req, res) => {
  const data = readData();
  const task = data.tasks.find(t => t.id == req.params.id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  task.completed = !task.completed;
  writeData(data);
  res.json(task);
});

// DELETE task
app.delete("/tasks/:id", (req, res) => {
  const data = readData();
  data.tasks = data.tasks.filter(t => t.id != req.params.id);
  writeData(data);
  res.json({ message: "Deleted successfully" });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});